<script setup>
defineProps({
  tag: {
    type: String,
    default: 'button'
  },
  active: {
    type: Boolean,
    default: false
  },
  primary: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  offsetPadding: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <component
    :is="tag"
    class="button"
    :class="{ active, primary, 'offset-padding': offsetPadding }"
    :disabled="disabled"
  >
    <slot />
  </component>
</template>
<style scoped>
.button {
  font: var(--font-ui);
  color: var(--color-ai);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2.5px 10px;
  &.offset-padding {
    margin: -2.5px -10px;
  }
  border-radius: calc(2 * var(--border-radius));
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;

  &.active {
    color: var(--color-user);
    background-color: color-mix(in lab, var(--color-user), transparent 90%);
  }

  &:focus {
    outline: none;
  }

  &.primary {
    border: 1px solid currentColor;
  }

  &:not(:disabled):hover {
    color: var(--color-user);
    background-color: color-mix(in lab, var(--color-user), transparent 90%);
  }

  &:disabled {
    color: color-mix(in lab, var(--color-ai), transparent 70%);
  }
}
</style>
