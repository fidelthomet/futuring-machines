import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

const decoder = new TextDecoder()

export const useCommandStore = defineStore('command', () => {
  let followUp = ref(null)
  const commands = ref([
    {
      name: 'log selection',
      type: 'selection',
      handler: ({ view, state }) => {
        // const { view, state } = editor
        const { from, to } = view.state.selection
        const text = state.doc.textBetween(from, to, '\n')
        console.log(text)
      }
    },
    {
      name: 'condense',
      type: 'selection',
      handler: async (editor) => {
        const { view, state } = editor
        const { from, to } = view.state.selection
        const selection = state.doc.textBetween(from, to, '\n')

        const template = 'summarise the following text: ::selection::'

        const command = template.replace(/::selection::/, selection)

        editor.commands.deleteSelection()
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          body: JSON.stringify({
            model: 'mistral',
            prompt: command
          })
        })
        const reader = response.body.getReader()
        let done, value

        while (!done) {
          ;({ done, value } = await reader.read())

          const text = decoder.decode(value)

          if (text) {
            editor.commands.setMarkAI()
            editor.commands.insertContent(JSON.parse(text).response)
          }
        }

        editor.commands.unsetMarkAI()
      }
    },
    {
      name: 'expand',
      type: 'selection',
      handler: ({ view, state }) => {
        // const { view, state } = editor
        const { from, to } = view.state.selection
        const text = state.doc.textBetween(from, to, '\n')
        console.log(text)
      }
    },
    {
      name: 'continue',
      type: 'resume',
      handler: async (editor) => {
        const { view, state } = editor

        const length = view.state.doc.nodeSize
        const full = state.doc.textBetween(0, length - 2, '\n')
        console.log(full)

        // const selection = state.doc.textBetween(from, to, '\n')

        const template = 'continue writing this story for one paragraph: ::full::'

        const command = template.replace(/::full::/, full)

        // editor.commands.deleteSelection()
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          body: JSON.stringify({
            model: 'mistral',
            prompt: command
          })
        })
        const reader = response.body.getReader()
        let done, value

        while (!done) {
          ;({ done, value } = await reader.read())

          const text = decoder.decode(value)

          if (text) {
            editor.commands.setMarkAI()
            editor.commands.insertContent(JSON.parse(text).response)
          }
        }

        editor.commands.unsetMarkAI()
      }
    },
    {
      name: 'diverge',
      type: 'resume',
      handler: async (editor) => {
        const { view, state } = editor

        const length = view.state.doc.nodeSize
        const full = state.doc.textBetween(0, length - 2, '\n')
        console.log(full)

        // const selection = state.doc.textBetween(from, to, '\n')

        const template =
          'suggest three topic ideas of five words or fewer in which one could delvelop the following story further: ::full::'

        const command = template.replace(/::full::/, full)

        // editor.commands.deleteSelection()
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          body: JSON.stringify({
            model: 'mistral',
            prompt: command
          })
        })
        const reader = response.body.getReader()
        let done, value

        let fullResponse = ''
        followUp.value = {
          command: 'diverge',
          options: ['']
        }

        while (!done) {
          ;({ done, value } = await reader.read())

          const text = decoder.decode(value)

          if (text) {
            // editor.commands.setMarkAI()
            const parts = JSON.parse(text).response.split('\n')
            followUp.value.options[followUp.value.options.length - 1] += parts[0]
            if (parts[1] != null) {
              followUp.value.options.push(parts[1])
            }
            // editor.commands.insertContent(JSON.parse(text).response.replace('\n', '<br>'))
            fullResponse += JSON.parse(text).response
          }
        }

        console.log(fullResponse)

        editor.commands.unsetMarkAI()
      },
      followUpHandler: async (editor, option) => {
        const { view, state } = editor

        const length = view.state.doc.nodeSize
        const full = state.doc.textBetween(0, length - 2, '\n')
        console.log(full)

        // const selection = state.doc.textBetween(from, to, '\n')

        const template =
          'continue this story with one paragraph that focusses on ::option::: ::full::'

        const command = template.replace(/::full::/, full).replace(/::option::/, option)

        // editor.commands.deleteSelection()
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          body: JSON.stringify({
            model: 'mistral',
            prompt: command
          })
        })
        const reader = response.body.getReader()
        let done, value

        while (!done) {
          ;({ done, value } = await reader.read())

          const text = decoder.decode(value)

          if (text) {
            editor.commands.setMarkAI()
            editor.commands.insertContent(JSON.parse(text).response)
          }
        }

        followUp.value = null
        editor.commands.unsetMarkAI()
      }
    }
  ])
  return { commands, followUp }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommandStore, import.meta.hot))
}
