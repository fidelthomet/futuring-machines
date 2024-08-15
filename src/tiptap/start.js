import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from '@/components/TiptapStart.vue'

export default Node.create({
  name: 'start',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      label: {
        default: '→',
        parseHTML: (element) => element.innerText || '→'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'start'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['placeholder', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  }
})
