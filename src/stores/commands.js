import { computed, ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import prompts from '@/assets/prompts'
import templates from '@/assets/templates'

const MODEL = import.meta.env.VITE_MODEL
const API_URL = import.meta.env.VITE_API_URL

const decoder = new TextDecoder()

export const useCommandStore = defineStore('command', () => {
  const promptsAvailable = ref(prompts)
  const promptsEnabled = ref(promptsAvailable.value)

  const templatesAvailable = ref(templates)
  const templatesEnabled = ref(templatesAvailable.value)

  const templateName = ref(null)

  const template = computed(() => templatesEnabled.value.find((t) => t.name === templateName.value))

  const env = ref({})

  async function run(editor, prompt, index = 0) {
    // const prompt = promptsEnabled.value.find((prompt) => prompt.name === name)

    const { view, state } = editor

    env.value.full = state.doc.textBetween(0, view.state.doc.nodeSize - 2, '\n')

    env.value = { ...env.value, ...prompt.env }

    if (prompt.trigger === 'selection') {
      const { from, to } = view.state.selection
      env.value.selection = state.doc.textBetween(from, to, '\n')
    }

    console.log(env.value)

    // const command = prompt.template.replace(/::selection::/, selection)

    const action = prompt.actions[index]
    index++
    const finalize = index == prompt.actions.length

    switch (action.type) {
      case 'generate':
        if (prompt.mode === 'replace') editor.commands.deleteSelection()
        await runGenerate(action, editor, finalize)
        break
      case 'generate options':
        await runGenerateOptions(action, prompt, index)
        break
      case 'options':
        promptsEnabled.value = action.options.map((option) => ({
          ...prompt,
          name: option.label ?? option,
          startIndex: index,
          env: {
            ...prompt.env,
            [action.bind]: option.value ?? option
          }
        }))
        break
      case 'text':
        editor.commands.insertContent(
          action.template.replace(/::([^:]+)::/g, (pattern, match) => env.value[match] ?? pattern)
        )
        break

      default:
        break
    }

    if (!finalize && action.type === 'generate') run(editor, prompt, index)

    if (finalize) {
      promptsEnabled.value = promptsAvailable.value
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

  async function runGenerate(action, editor, finalize) {
    const prompt = action.template.replace(
      /::([^:]+)::/g,
      (pattern, match) => env.value[match] ?? pattern
    )

    console.log(prompt)
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: finalize
      })
    })
    if (finalize) {
      const reader = response.body.getReader()

      let done, value
      while (!done) {
        ;({ done, value } = await reader.read())

        const text = decoder.decode(value)

        if (text) {
          editor.commands.setMarkAI()
          editor.commands.insertContent(JSON.parse(text).response.replace(/\n/g, '<br>'))
        }
      }

      editor.commands.unsetMarkAI()
    } else if (action.bind != null) {
      env.value[action.bind] = await response.json().then((d) => d.response)
    }
  }

  async function runGenerateOptions(action, sourcePrompt, index) {
    const prompt = action.template.replace(
      /::([^:]+)::/g,
      (pattern, match) => env.value[match] ?? pattern
    )

    console.log(prompt)
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        format: 'json'
      })
    })
    const res = await response.json().then((d) => d.response)
    console.log(res)
    const obj = JSON.parse(res)

    const options = []
    for (const key in obj) {
      const option = obj[key]

      if (action.keys.every((k) => Object.prototype.hasOwnProperty.call(option, k))) {
        options.push({
          ...sourcePrompt,
          name: option[action.name],
          startIndex: index,
          env: {
            ...prompt.env,
            ...option
          }
        })
      } else {
        for (const key in option) {
          const option2 = option[key]
          console.log(option2)
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
  }

  async function initTemplate(editor, index = 0) {
    const { view, state } = editor

    env.value.full = state.doc.textBetween(0, view.state.doc.nodeSize - 2, '\n')

    env.value = { ...template.value.env }

    const action = template.value.actions[index]
    index++
    const finalize = index == template.value.actions.length

    switch (action.type) {
      case 'generate':
        if (template.value.mode === 'replace') editor.commands.deleteSelection()
        await runGenerate(action, editor, finalize)
        break
      case 'text':
        editor.commands.insertContent(
          action.template.replace(/::([^:]+)::/g, (pattern, match) => env.value[match] ?? pattern)
        )
        break

      default:
        break
    }

    if (!finalize && action.type === 'generate') run(editor, prompt, index)
  }

  return { promptsEnabled, templatesEnabled, templateName, template, initTemplate, run }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommandStore, import.meta.hot))
}
