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
        const cursorCoords = editor.view.coordsAtPos(editor.view.state.selection.anchor)
        const cursorHeight = cursorCoords.bottom - cursorCoords.top
        const cursorCenter = cursorCoords.top + cursorHeight / 2
        const windowCenter = window.innerHeight / 2
        const offset = cursorCenter - windowCenter
        window.scrollBy({
          top: offset,
          left: 0,
          behavior: 'smooth'
        })
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
