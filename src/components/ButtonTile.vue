<script setup>
import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'button'
  },
  width: {
    type: [Number, String],
    default: 210
  },
  height: {
    type: [Number, String],
    default: 140
  },
  pattern: {
    type: String
  }
})

const dimensions = computed(() => {
  return {
    width: isNaN(props.width) ? props.width : `${props.width}px`,
    height: isNaN(props.height) ? props.height : `${props.height}px`
  }
})
</script>
<template>
  <component :is="tag" class="button-tile" :style="dimensions">
    <svg v-if="pattern" viewBox="0,0,3,2">
      <path :d="pattern" />
    </svg>
    <h2>
      <slot name="title"></slot>
    </h2>
    <p>
      <slot name="description"></slot>
    </p>
  </component>
</template>
<style scoped>
.button-tile {
  border: 1px solid currentColor;
  cursor: pointer;
  border-radius: var(--border-radius);
  background: none;
  padding: calc(var(--spacing) / 2);
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing) / 2);
  color: currentColor;
  font: var(--font-ui);
  text-align: left;
  text-rendering: geometricPrecision;
  position: relative;
  transition:
    background-color 0.2s,
    color 0.2s;

  h2 {
    font: var(--font-ui);
    font-weight: 600;
  }

  p {
    font: var(--font-ui-serif);
  }

  &:hover {
    background-color: color-mix(in lab, currentColor, transparent 95%);
  }

  svg {
    position: absolute;
    top: var(--spacing);
    left: var(--spacing);
    height: calc(100% - var(--spacing) * 2);
    width: calc(100% - var(--spacing) * 2);
    overflow: visible;
    z-index: -1;

    display: block;

    path {
      fill: none;
      stroke: color-mix(in lab, currentColor, transparent 95%);
      vector-effect: non-scaling-stroke;
      stroke-width: 20px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
}
</style>
