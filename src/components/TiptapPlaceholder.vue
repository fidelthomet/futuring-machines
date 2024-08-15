<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { ref } from 'vue'

const active = ref(false)
const props = defineProps(nodeViewProps)
function select(e) {
  props.editor.commands.unsetMarkAI()
  active.value = true
}

function blur() {
  active.value = false
}
</script>

<template>
  <NodeViewWrapper
    as="span"
    tabindex="0"
    class="placeholder"
    @click="select"
    @blur="blur"
    :class="{ active }"
    ><template v-if="node.attrs.length != null">
      <template v-for="i in +node.attrs.length" :key="i">&emsp;</template> </template
    ><template v-else>{{ node.attrs.label }}</template></NodeViewWrapper
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
  border-radius: calc(2 * var(--border-radius));
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
