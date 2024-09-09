import { computed, nextTick, ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import templates from '@/assets/templates'
import { centerEditor, generatePattern } from '@/assets/js/utils'
import { logUserAction } from '@/assets/js/logging.js'
import { localize } from '@/assets/js/utils'
import { useSettingStore } from './setting'

const MODEL = import.meta.env.VITE_MODEL
const API_URL = import.meta.env.VITE_API_URL

const decoder = new TextDecoder()

export const useCommandStore = defineStore('command', () => {
  const settingsStore = useSettingStore()
  const templatesAvailable = ref(templates)
  const templatesEnabled = ref(templatesAvailable.value)

  const templateId = ref(null)
  const storyId = ref(null)

  const storyName = ref(null)
  const storyAuthor = ref(null)

  const lang = ref('en')

  const template = computed(() =>
    templatesEnabled.value.find((t) => t.id === templateId.value || t.name === templateId.value)
  )

  const promptsAvailable = computed(() => template.value?.prompts ?? [])
  const promptsEnabled = ref(promptsAvailable.value)
  const isGenerating = ref(false)
  const isError = ref(false)

  const env = ref({})
  const crumbs = ref([])
  const lastPromptsEnabled = ref([])

  let controller = ref(new AbortController())

  const hasGeneratedText = ref(false)
  let lastGeneratedText = ''

  async function logFeedback(feedback) {
    await logUserAction('feedback', { storyId: storyId.value, feedback, lastGeneratedText })
    lastGeneratedText = ''
    hasGeneratedText.value = false
  }

  /************* 
    RUN
  **************/

  async function run(editor, prompt, index = 0) {
    // const prompt = promptsEnabled.value.find((prompt) => prompt.name === name)
    crumbs.value.push(prompt.name)
    const { view, state } = editor

    // This is the full story as it's being written in the editor. We add it to the story template.
    console.log(prompt)
    env.value.full = state.doc.textBetween(0, view.state.doc.nodeSize - 2, '\n')
    const { from, to } = view.state.selection
    env.value.before = state.doc.textBetween(0, from, '\n')
    env.value.after = state.doc.textBetween(to, view.state.doc.nodeSize - 2, '\n')

    // This is sort of a Context object – Combines: Story template + Story Text + Prompt
    env.value = { ...env.value, ...prompt.env }

    // When text selected
    if (prompt.trigger === 'selection') {
      // const { from, to } = view.state.selection
      env.value.selection = state.doc.textBetween(from, to, '\n')
      // env.value.before = state.doc.textBetween(0, from, '\n')
      // env.value.after = state.doc.textBetween(to, view.state.doc.nodeSize - 2, '\n')
      logUserAction('button', { storyId: storyId.value, prompt, selection: env.value.selection })
    } else {
      logUserAction('button', { storyId: storyId.value, prompt })
    }

    // const command = prompt.template.replace(/::selection::/, selection)

    const action = prompt.actions[index]
    index++
    const finalize = index == prompt.actions.length

    console.log('> prompt trigger: ' + prompt.trigger)
    console.log('> prompt mode: ' + prompt.mode)
    console.log('> action type: ' + action.type)
    console.log(prompt)

    let success = true
    let generatedText = ''
    // Different behaviours for different prompt types
    switch (action.type) {
      case 'generate':
        if (prompt.mode === 'replace') editor.commands.deleteSelection()
        generatedText = await runGenerate(action, prompt.trigger, prompt.mode, editor, finalize)
        success = generatedText !== false
        break
      case 'generate options':
        success = await runGenerateOptions(action, prompt, index)
        break
      case 'options':
        promptsEnabled.value = action.options.map((option) => ({
          ...prompt,
          name: option.label ?? option,
          startIndex: index,
          env: {
            ...prompt.env,
            [action.bind]: localize(option.value ?? option, lang.value)
          }
        }))
        lastPromptsEnabled.value.push(promptsEnabled.value)
        break
      case 'static':
        editor.commands.setMarkAI()
        generatedText = localize(action.template, lang.value).replace(
          /::([^:]+)::/g,
          (pattern, match) => env.value[match] ?? pattern
        )
        editor.commands.insertContent(generatedText)
        editor.commands.unsetMarkAI()
        break

      default:
        break
    }

    if (!success) {
      hasGeneratedText.value = false
      lastGeneratedText = ''
      return
    }

    if (!finalize && action.type === 'generate') {
      generatedText += await run(editor, prompt, index)
    }

    // Stream finalized
    if (finalize) {
      resetPrompts()
    }

    hasGeneratedText.value = generatedText.length > 0
    lastGeneratedText = generatedText
    return generatedText

    // const response = await fetch(API_URL, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     model: MODEL,
    //     prompt: command
    //   })
    // })
    // const reader = response.body.getReader()
    // let done, value

    // while (!done) {
    //   ;({ done, value } = await reader.read())

    //   const text = decoder.decode(value)

    //   if (text) {
    //     editor.commands.setMarkAI()
    //     editor.commands.insertContent(JSON.parse(text).response)
    //   }
    // }
  }

  function resetPrompts() {
    promptsEnabled.value = [...promptsAvailable.value]
    crumbs.value = []
    lastPromptsEnabled.value = []
  }

  /************* 
    GENERATE
  **************/

  async function runGenerate(action, promptTrigger, promptMode, editor, finalize) {
    const prompt = localize(action.template, lang.value).replace(
      /::([^:]+)::/g,
      (pattern, match) => env.value[match] ?? pattern
    )

    console.log('GENERATE')
    console.log('API_URL: ' + API_URL + ', Model: ' + MODEL)
    console.log('Prompt: \n\n' + prompt)

    isGenerating.value = true
    editor.commands.setMarkAI()

    controller.value = new AbortController()
    const response = await fetch(API_URL, {
      signal: controller.value.signal,
      method: 'POST',
      body: JSON.stringify({
        model: MODEL,
        prompt,
        ...(template.value.system != null && {
          system: localize(template.value.system, lang.value)
        }),
        stream: finalize
      })
    })

    if (!response?.ok) {
      isError.value = true
      isGenerating.value = false
      return false
    }

    isGenerating.value = false
    let generatedText = ''

    // Response
    if (finalize) {
      const reader = response.body.getReader()
      let done,
        value,
        start = true,
        responseStr

      console.log('> prompt trigger: ' + promptTrigger)
      console.log('> prompt mode: ' + promptMode)

      // For 'append' mode: set the cursor to the end of the editor position
      if (promptTrigger === 'selection' && promptMode === 'append') {
        editor.commands.focus(editor.view.state.selection.to)
      }

      while (!done) {
        ;({ done, value } = await reader.read())

        const text = decoder.decode(value)

        if (text) {
          editor.commands.setMarkAI()

          responseStr = text
            .trim()
            .split('\n')
            .map((json) => JSON.parse(json).response)
            .join('')

          // Removes leading whitespace at the beginning of the string (When start and new line)
          if (start && (promptTrigger === null || promptTrigger === 'new-line')) {
            responseStr = responseStr.replace(/^\s+/, '')
            start = false
          }

          // Add streamed response to the editor – adding linebreaks
          editor.commands.insertContent(responseStr)
          generatedText += responseStr
          // editor.commands.insertContent(JSON.parse(text).response.replace(/\n/g, '<br>'))
        }
      }

      // Set AI text style
      editor.commands.unsetMarkAI()
    } else if (action.bind != null) {
      env.value[action.bind] = await response.json().then((d) => d.response)
    }
    return generatedText
  }

  /************************ 
    GENERATE WITH OPTIONS
  *************************/

  async function runGenerateOptions(action, sourcePrompt, index) {
    const prompt = localize(action.template, lang.value).replace(
      /::([^:]+)::/g,
      (pattern, match) => env.value[match] ?? pattern
    )

    console.log('GENERATE WITH OPTIONS')
    console.log('API_URL: ' + API_URL + ', Model: ' + MODEL)
    console.log('Prompt: \n\n' + prompt)

    isGenerating.value = true

    controller.value = new AbortController()
    // API Call
    const response = await fetch(API_URL, {
      signal: controller.value.signal,
      method: 'POST',
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        ...(template.value.system != null && {
          system: localize(template.value.system, lang.value)
        }),
        format: 'json'
      })
    })

    if (!response?.ok) {
      isError.value = true
      isGenerating.value = false
      return false
    }

    // LLM Response
    const res = await response.json().then((d) => d.response)

    isGenerating.value = false

    console.log('>>>>>> Response: ')
    console.log(res)
    try {
      const obj = JSON.parse(res)

      const options = []
      for (const key in obj) {
        const option = obj[key]

        console.log('- Create option ' + key + ': ' + option[action.name])

        // Create "diverge" options
        if (action.keys.every((k) => Object.prototype.hasOwnProperty.call(option, k))) {
          // Option = the selected "diverge" option
          // Action = the related prompt to be performed after selecting that option

          console.log('------ OPTIONS 1')
          options.push({
            ...sourcePrompt,
            // name: option[action.name],
            name: option[action.name],
            description: option['description'],
            startIndex: index,
            env: {
              ...prompt.env,
              ...option
            }
          })
        } else {
          console.log('------ OPTIONS 2')

          for (const key in option) {
            const option2 = option[key]
            options.push({
              ...sourcePrompt,
              name: option2[action.name],
              startIndex: index,
              env: {
                ...prompt.env,
                ...option2
              }
            })
          }
        }
      }
      promptsEnabled.value = options
      lastPromptsEnabled.value.push(promptsEnabled.value)
    } catch {
      console.log('error')
      isError.value = true
    }
    return true
  }

  /* 
    INIT TEMPLATE
  */
  async function initTemplate(editor) {
    storyName.value = null
    storyAuthor.value = null
    resetPrompts()
    try {
      const story = JSON.parse(localStorage.getItem(`story-${storyId.value}`))
      editor.commands.setContent(story.editor)
      lang.value = story.lang
      storyName.value = story.name
      storyAuthor.value = story.author
      env.value = { ...story.env }
      nextTick(() => centerEditor(editor, true))
    } catch (e) {
      env.value = { ...template.value.env, full: getFullText(editor) }
      lang.value = settingsStore.lang

      if (template.value.template != null) {
        const content = localize(template.value.template)
        editor.commands.setContent(
          content.replace(/::([^:]+)::/g, (pattern, match) => env.value[match] ?? pattern)
        )
        editor.commands.selectAll()
        editor.commands.setMarkAI()
        editor.commands.selectTextblockEnd()
        editor.commands.unsetMarkAI()
        nextTick(() => {
          centerEditor(editor, true)
          editor.commands.blur()
        })
        return
      } else if (template.value.start) {
        run(editor, template.value.start)
      }
    }
  }

  function getFullText(editor) {
    const { view, state } = editor
    return state.doc.textBetween(0, view.state.doc.nodeSize - 2, '\n')
  }

  return {
    promptsEnabled,
    crumbs,
    lastPromptsEnabled,
    templatesEnabled,
    templateId,
    storyId,
    template,
    lang,
    initTemplate,
    run,
    isGenerating,
    isError,
    resetPrompts,
    hasGeneratedText,
    logFeedback,
    controller,
    storyName,
    storyAuthor
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommandStore, import.meta.hot))
}
