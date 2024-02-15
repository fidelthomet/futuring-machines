import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

const decoder = new TextDecoder()

export const useCommandStore = defineStore('command', () => {
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
    }
  ])
  return { commands }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommandStore, import.meta.hot))
}
