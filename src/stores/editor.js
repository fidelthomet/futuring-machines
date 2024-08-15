import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/vue-3'
import MarkAI from '@/tiptap/mark-ai'
import Placeholder from '@/tiptap/placeholder'
import Start from '@/tiptap/start'
import { centerEditor } from '@/assets/js/utils'
import { deltaLogger } from '@/assets/js/logging'
import { useCommandStore } from '@/stores/commands'
import { logUserAction } from '@/assets/js/logging.js'

let controller = new AbortController()

export const useEditorStore = defineStore('editor', () => {
  const commandStore = useCommandStore()
  const selection = ref(null)
  const editor = ref(null)

  function createEditor() {
    let logDelta = null
    editor.value = new Editor({
      extensions: [StarterKit, MarkAI, Placeholder, Start],
      content: '',
      onCreate({ editor }) {
        logDelta = deltaLogger(editor, commandStore.storyId)
      },
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
      },
      onUpdate({ editor }) {
        if (logDelta !== null) { logDelta() }
        localStorage.setItem(
          `story-${commandStore.storyId}`,
          JSON.stringify({
            editor: editor.getJSON(),
            updated: new Date(),
            id: commandStore.storyId,
            lang: commandStore.lang,
            template: commandStore.templateName
          })
        )
      }
    })
  }

  function log() {
    logUserAction("save", {
      storyId: commandStore.storyId,
      lang: commandStore.lang,
      template: commandStore.templateName,
      editor: editor.value.getJSON()
    })
  }

  return {
    editor,
    selection,
    createEditor,
    log
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEditorStore, import.meta.hot))
}
