import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from '@/components/TiptapPlaceholder.vue'

export default Node.create({
  name: 'placeholder',
  group: 'inline',
  inline: true,
  selectable: true,
  // content: 'inline*',

  atom: true,

  addAttributes() {
    return {
      count: {
        default: 0
      },
      label: {
        default: null,
        parseHTML: (element) => element.innerText
      },
      length: {
        default: null,
        parseHTML: (element) => element.getAttribute('length')
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'placeholder'
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
