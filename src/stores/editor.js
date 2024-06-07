import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/vue-3'
import MarkAI from '@/tiptap/mark-ai'
import { centerEditor } from '@/assets/js/utils'

let controller = new AbortController()

export const useEditorStore = defineStore('editor', () => {
  const selection = ref(null)
  const editor = ref(
    new Editor({
      extensions: [StarterKit, MarkAI],
      content: '',
      onSelectionUpdate({ editor, transaction }) {
        if (!transaction.meta.pointer) {
          centerEditor(editor)
          const { from, to } = editor.view.state.selection
          selection.value = editor.state.doc.textBetween(from, to, '\n') || null
        } else {
          selection.value = null
          addEventListener(
            'mouseup',
            () => {
              const { from, to } = editor.view.state.selection
              selection.value = editor.state.doc.textBetween(from, to, '\n') || null
              controller.abort()
              controller = new AbortController()
              centerEditor(editor)
            },
            { once: true, signal: controller.signal }
          )
        }
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
    editor,
    selection
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEditorStore, import.meta.hot))
}
