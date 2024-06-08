<script setup>
defineProps({
  tag: {
    type: String,
    default: 'button'
  }
})
</script>
<template>
  <component :is="tag" class="button-tile">
    <h2>
      <slot name="title"></slot>
    </h2>
  </component>
</template>
<style scoped>
.button-tile {
  width: 210px;
  height: 140px;
  border: 1px solid var(--color-ai);
  border-radius: var(--border-radius);
  background: none;
  padding: calc(var(--spacing) / 2);
  display: flex;
  color: var(--color-ai);
  font: var(--font-ui);
  text-align: left;
  transition:
    background-color 0.2s,
    color 0.2s;

  h2 {
    font: var(--font-ui);
    font-weight: 500;
  }

  &:hover {
    background-color: color-mix(in lab, var(--color-ai), transparent 95%);
  }
}
</style>
