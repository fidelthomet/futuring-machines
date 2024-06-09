// import { mergeAttributes, Node } from '@tiptap/core'
// import { PluginKey } from '@tiptap/pm/state'
// // import Suggestion from '@tiptap/suggestion'

// /**
//  * The plugin key for the placeholder plugin.
//  * @default 'placeholder'
//  */
// export const PlaceholderPluginKey = new PluginKey('placeholder')

// export const Placeholder = Node.create({
//   name: 'placeholder',
//   onSelectionUpdate({ editor }) {
//     console.log('s update', this, editor.view.state.selection)
//   },
//   addOptions() {
//     return {
//       HTMLAttributes: {},
//       renderText({ node }) {
//         return `${node.attrs.label ?? node.attrs.id}`
//       },
//       deleteTriggerWithBackspace: false,
//       renderHTML({ options, node }) {
//         return [
//           'span',
//           mergeAttributes(this.HTMLAttributes, options.HTMLAttributes),
//           `${node.attrs.label ?? node.attrs.id}`
//         ]
//       }
//     }
//   },

//   group: 'inline',

//   inline: true,

//   selectable: false,

//   atom: true,

//   addAttributes() {
//     return {
//       id: {
//         default: null,
//         parseHTML: (element) => element.getAttribute('data-id'),
//         renderHTML: (attributes) => {
//           if (!attributes.id) {
//             return {}
//           }

//           return {
//             'data-id': attributes.id
//           }
//         }
//       },

//       label: {
//         default: null,
//         parseHTML: (element) => element.getAttribute('data-label'),
//         renderHTML: (attributes) => {
//           if (!attributes.label) {
//             return {}
//           }

//           return {
//             'data-label': attributes.label
//           }
//         }
//       }
//     }
//   },

//   parseHTML() {
//     return [
//       {
//         tag: `span[data-type="${this.name}"]`
//       }
//     ]
//   },

//   renderHTML({ node, HTMLAttributes }) {
//     if (this.options.renderLabel !== undefined) {
//       console.warn('renderLabel is deprecated use renderText and renderHTML instead')
//       return [
//         'span',
//         mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
//         this.options.renderLabel({
//           options: this.options,
//           node
//         })
//       ]
//     }
//     const mergedOptions = { ...this.options }

//     mergedOptions.HTMLAttributes = mergeAttributes(
//       { 'data-type': this.name },
//       this.options.HTMLAttributes,
//       HTMLAttributes
//     )
//     const html = this.options.renderHTML({
//       options: mergedOptions,
//       node
//     })

//     if (typeof html === 'string') {
//       return [
//         'span',
//         mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
//         html
//       ]
//     }
//     return html
//   },

//   renderText({ node }) {
//     return this.options.renderText({
//       options: this.options,
//       node
//     })
//   }

//   // addKeyboardShortcuts() {
//   //   return {
//   //     Backspace: () =>
//   //       this.editor.commands.command(({ tr, state }) => {
//   //         let isMention = false
//   //         const { selection } = state
//   //         const { empty, anchor } = selection

//   //         if (!empty) {
//   //           return false
//   //         }

//   //         state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
//   //           if (node.type.name === this.name) {
//   //             isMention = true
//   //             tr.insertText('', pos, pos + node.nodeSize)

//   //             return false
//   //           }
//   //         })

//   //         return isMention
//   //       })
//   //   }
//   // }

//   // addProseMirrorPlugins() {
//   //   return [
//   //     Suggestion({
//   //       editor: this.editor,
//   //       ...this.options.suggestion
//   //     })
//   //   ]
//   // }
// })

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
