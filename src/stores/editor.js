import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/vue-3'
import MarkAI from '@/tiptap/mark-ai'

export const useEditorStore = defineStore('editor', () => {
  const editor = ref(
    new Editor({
      extensions: [StarterKit, MarkAI],
      content: '',
      onSelectionUpdate({ editor }) {
        if (editor.view.state.selection.from === editor.view.state.selection.to)
          editor.chain().focus().unsetMarkAI().run()
      }
      // onUpdate({ editor }) {
      //   if (editor.isEmpty) {
      //     sessionStorage.removeItem(commandStore.templateName)
      //   } else {
      //     sessionStorage.setItem(commandStore.templateName, JSON.stringify(editor.getJSON()))
      //   }
      // }
    })
  )
  return {
    editor
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEditorStore, import.meta.hot))
}