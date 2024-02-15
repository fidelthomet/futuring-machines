import { Mark, mergeAttributes } from '@tiptap/core'

const MarkAI = Mark.create({
  name: 'mark-ai',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'mark-ai'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.mark-ai'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setMarkAI:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name)
        },
      toggleMarkAI:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
      unsetMarkAI:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        }
    }
  }
})

export default MarkAI
