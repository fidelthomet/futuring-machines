import { computed, nextTick, ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import prompts from '@/assets/prompts'
import templates from '@/assets/templates'
import { centerEditor, generatePattern } from '@/assets/js/utils'

const MODEL = import.meta.env.VITE_MODEL
const API_URL = import.meta.env.VITE_API_URL

const decoder = new TextDecoder()

export const useCommandStore = defineStore('command', () => {
  const promptsAvailable = ref(
    prompts.map((p) => {
      return {
        pattern: generatePattern(3, 2, 4, 0.25),
        ...p
      }
    })
  )
  const promptsEnabled = ref(promptsAvailable.value)

  const aiEnabled = ref(true)

  const templatesAvailable = ref(templates)
  const templatesEnabled = ref(templatesAvailable.value)

  const templateName = ref(null)
  const storyId = ref(null)

  const template = computed(() => templatesEnabled.value.find((t) => t.name === templateName.value))

  const isGenerating = ref(false)
  const isError = ref(false)

  const env = ref({})
  const crumbs = ref([])
  const lastPromptsEnabled = ref([])

  let controller = ref(new AbortController())

  /************* 
    RUN
  **************/

  async function run(editor, prompt, index = 0) {
    // const prompt = promptsEnabled.value.find((prompt) => prompt.name === name)
    crumbs.value.push(prompt.name)
    const { view, state } = editor

    // This is the full story as it's being written in the editor. We add it to the story template.
    env.value.full = state.doc.textBetween(0, view.state.doc.nodeSize - 2, '\n')

    // This is sort of a Context object – Combines: Story template + Story Text + Prompt
    env.value = { ...env.value, ...prompt.env }

    // When text selected
    if (prompt.trigger === 'selection') {
      const { from, to } = view.state.selection
      env.value.selection = state.doc.textBetween(from, to, '\n')
      console.log('Selection: ' + env.value.selection)
    }

    console.log('env.value: ')
    console.log(env.value)

    // const command = prompt.template.replace(/::selection::/, selection)

    const action = prompt.actions[index]
    index++
    const finalize = index == prompt.actions.length

    console.log('> prompt trigger: ' + prompt.trigger)
    console.log('> prompt mode: ' + prompt.mode)
    console.log('> action type: ' + action.type)
    console.log(prompt)

    let success = true
    // Different behaviours for different prompt types
    switch (action.type) {
      case 'generate':
        if (prompt.mode === 'replace') editor.commands.deleteSelection()
        success = await runGenerate(action, prompt.trigger, prompt.mode, editor, finalize)
        break
      case 'generate options':
        success = await runGenerateOptions(action, prompt, index)
        break
      case 'options':
        promptsEnabled.value = action.options.map((option) => ({
          ...prompt,
          name: option.label ?? option,
          startIndex: index,
          pattern: generatePattern(3, 2, 3, 0, true),
          env: {
            ...prompt.env,
            [action.bind]: option.value ?? option
          }
        }))
        lastPromptsEnabled.value.push(promptsEnabled.value)
        break
      case 'static':
        editor.commands.setMarkAI()
        editor.commands.insertContent(
          action.template.replace(/::([^:]+)::/g, (pattern, match) => env.value[match] ?? pattern)
        )
        editor.commands.unsetMarkAI()
        break

      default:
        break
    }

    if (!success) return

    if (!finalize && action.type === 'generate') {
      run(editor, prompt, index)
    }

    // Stream finalized
    if (finalize) {
      resetPrompts()
    }

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
    promptsEnabled.value = promptsAvailable.value
    crumbs.value = []
    lastPromptsEnabled.value = []
  }

  /************* 
    GENERATE
  **************/

  async function runGenerate(action, promptTrigger, promptMode, editor, finalize) {
    const prompt = action.template.replace(
      /::([^:]+)::/g,
      (pattern, match) => env.value[match] ?? pattern
    )

    console.log('GENERATE')
    console.log('API_URL: ' + API_URL + ', Model: ' + MODEL)
    console.log('Prompt: \n\n' + prompt)

    isGenerating.value = true

    controller.value = new AbortController()
    const response = await fetch(API_URL, {
      signal: controller.value.signal,
      method: 'POST',
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: finalize
      })
    }).catch(() => (isGenerating.value = false))

    if (!response) return

    isGenerating.value = false

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
        editor.commands.focus('end')
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
          editor.commands.insertContent(responseStr.replace(/\n/g, '<br>'))
          // editor.commands.insertContent(JSON.parse(text).response.replace(/\n/g, '<br>'))
        }
      }

      // Set AI text style
      editor.commands.unsetMarkAI()
    } else if (action.bind != null) {
      env.value[action.bind] = await response.json().then((d) => d.response)
    }
    return true
  }

  /************************ 
    GENERATE WITH OPTIONS
  *************************/

  async function runGenerateOptions(action, sourcePrompt, index) {
    const prompt = action.template.replace(
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
        format: 'json'
      })
    }).catch(() => (isGenerating.value = false))

    if (!response) return

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
  async function initTemplate(editor, index = 0) {
    const save = localStorage.getItem(`story-${storyId.value}`)
    if (save != null) {
      editor.commands.setContent(JSON.parse(save).editor)
      nextTick(() => centerEditor(editor, true))
      return
    }
    const { view, state } = editor

    env.value.full = state.doc.textBetween(0, view.state.doc.nodeSize - 2, '\n')
    env.value = { ...env.value, ...template.value.env }

    const action = template.value.actions[index]
    index++
    const finalize = index == template.value.actions.length

    switch (action.type) {
      case 'generate':
        if (template.value.mode === 'replace') editor.commands.deleteSelection()
        await runGenerate(action, null, null, editor, finalize)
        break
      case 'static':
        editor.commands.setContent(
          action.template.replace(/::([^:]+)::/g, (pattern, match) => env.value[match] ?? pattern)
        )
        editor.commands.selectAll()
        editor.commands.setMarkAI()
        editor.commands.selectTextblockEnd()
        editor.commands.unsetMarkAI()
        nextTick(() => {
          centerEditor(editor, true)
          editor.commands.blur()
        })
        break

      default:
        break
    }

    // Mixed templates
    if (!finalize && action.type === 'generate') initTemplate(editor, index)
  }

  return {
    promptsEnabled,
    crumbs,
    lastPromptsEnabled,
    templatesEnabled,
    templateName,
    storyId,
    template,
    initTemplate,
    run,
    isGenerating,
    isError,
    resetPrompts,
    aiEnabled,
    controller
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommandStore, import.meta.hot))
}
