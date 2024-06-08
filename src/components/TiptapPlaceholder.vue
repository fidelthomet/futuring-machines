<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { ref } from 'vue'

const active = ref(false)
const props = defineProps(nodeViewProps)
function select(e) {
  // props.editor.commands.setTextSelection({
  //   from: props.getPos(),
  //   to: props.getPos() + props.node.content.size + 1
  // })

  // active.value = true
  // props.editor.commands.setTextSelection({
  //   from: props.getPos(),
  //   to: props.getPos() + props.node.content.size + 1
  // })

  props.editor.commands.unsetMarkAI()
  active.value = true
  e.target.focus()

  // props.editor.commands.setTextSelection(props.getPos())

  // props.deleteNode()
  // console.log('select', props.getPos(), )
}
function focus(e) {
  // props.editor.commands.setTextSelection({
  //   from: props.getPos(),
  //   to: props.getPos() + props.node.content.size + 1
  // })
  // active.value = true
  // // e.target.focus()
  // // props.editor.commands.setTextSelection(props.getPos())
  // // props.editor.commands.unsetMarkAI()
  // // props.deleteNode()
  // // console.log('select', props.getPos(), )
}
function blur() {
  active.value = false
  // props.editor.commands.setTextSelection({ from: props.getPos(), to: props.getPos() + 1 })
  // props.editor.commands.setTextSelection(props.getPos())
  // props.editor.commands.setMarkAI()
  // props.deleteNode()
  // console.log('select', props.getPos(), )
}
function onKeyDown(e) {
  // console.log('hey')
  // const pos = props.getPos()
  // // props.deleteNode()
  // console.log(pos, e.keyCode)
  // props.editor.commands.focus(pos)
  // // props.editor.commands.setTextSelection(pos + 0)
  // props.editor.commands.unsetMarkAI()
  // if (e.inputType === 'insertText' || e.inputType === 'insertCompositionText') {
  //   console.log('Input Detected', e.data)
  // }
}
</script>

<template>
  <NodeViewWrapper
    as="span"
    tabindex="0"
    class="placeholder"
    @click="select"
    @input="onKeyDown"
    @blur="blur"
    @focus="focus"
    :class="{ active }"
    >{{ node.attrs.label }}</NodeViewWrapper
  >
</template>

<style scoped>
.placeholder {
  font: var(--font-heading);
  font-weight: 425;
  font-size: 22px;
  --color-user-light: color-mix(in lab, var(--color-user), white 85%);
  color: var(--color-user) !important;
  background: var(--color-user-light);
  border-radius: 5px;
  padding: 0 calc(var(--spacing) / 4);
  box-decoration-break: clone;
  cursor: pointer;

  input {
    appearance: none;
    outline: none;
  }

  &.active,
  &.ProseMirror-selectednode {
    color: var(--color-user-light) !important;
    background: var(--color-user);
  }
  &:focus {
    outline: none;
  }
}

/* .placeholder:has(span.mark-ai) {
  background-color: var(--color-user-light);
}

.placeholder:deep(span.mark-ai) {
  color: var(--color-user) !important;
} */

.placeholder:has(input:focus) {
  color: aqua;
}

.placeholder::selection {
  background-color: transparent !important;
}
</style>
