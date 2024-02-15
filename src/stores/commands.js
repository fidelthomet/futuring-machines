import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

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
        const { view, state, commands } = editor
        const { from, to } = view.state.selection
        const selection = state.doc.textBetween(from, to, '\n')

        const template = 'summarise the following text: ::selection::'

        const command = template.replace(/::selection::/, selection)

        const res = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          body: JSON.stringify({
            model: 'mistral',
            stream: false,
            prompt: command
          })
        }).then((d) => d.json())

        // editor.chain().focus().setMarkAI().run()
        editor.commands.setMarkAI()
        // editor.commands.setTextSelection({ from, to })
        // console.log(res)
        editor.commands.insertContentAt({ from, to }, res.response, {
          updateSelection: true,
          parseOptions: {
            preserveWhitespace: 'full'
          }
        })

        editor.commands.unsetMarkAI()

        console.log(command)
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
