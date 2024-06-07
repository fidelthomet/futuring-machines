<script setup>
import { onMounted, ref, onBeforeUnmount, computed, nextTick } from 'vue'
// import { approximatelyEqual, isClient } from '../../utils'

defineProps({})

const wrapper = ref(null)

const wrapperScrollWidth = ref(0)
const wrapperVisibleWidth = ref(0)

const scrollLeft = ref(0)
const bufferWidth = ref(null)
const scrollPaddingInlineStart = ref(null)

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.contentRect) {
      bufferWidth.value = `${(window.innerWidth - 800) / 2 - 30}px`
      scrollPaddingInlineStart.value = `${Math.max((window.innerWidth - 800) / 2 - 10, 30)}px`
      nextTick(() => {
        wrapperScrollWidth.value = wrapper.value.scrollWidth
        wrapperVisibleWidth.value = wrapper.value.offsetWidth
      })
    }
  }
})

const enableArrowLeft = computed(() => scrollLeft.value > 5)
const enableArrowRight = computed(() => {
  return scrollLeft.value < wrapperScrollWidth.value - wrapperVisibleWidth.value - 5
})

function onScroll() {
  scrollLeft.value = wrapper.value.scrollLeft ?? 0
}

const slide = (dir) => {
  const itemWidth = 210
  const offset = Math.min(800, window.innerWidth - 40) - itemWidth / 2
  wrapper.value.scrollBy({ left: offset * dir, behavior: 'smooth' })
}

onMounted(() => {
  resizeObserver.observe(wrapper.value)
})
onBeforeUnmount(() => {
  resizeObserver.unobserve(wrapper.value)
})
</script>

<template>
  <div class="horizontal-slider">
    <button :disabled="!enableArrowLeft" class="arrow left" @click="slide(-1)">←</button>
    <button :disabled="!enableArrowRight" class="arrow right" @click="slide(1)">→</button>
    <div
      ref="wrapper"
      class="wrapper"
      @scroll="onScroll"
      :style="{ scrollPaddingInlineStart: '30px' }"
    >
      <slot />
    </div>
  </div>
</template>
<style scoped>
.horizontal-slider {
  position: relative;

  .wrapper {
    display: grid;
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;

    gap: var(--spacing);
    /* margin: 0 0 var(--spacing); */
    padding: 0 calc(var(--spacing) * 1.5);

    &::-webkit-scrollbar {
      display: none;
    }

    &:deep(> *) {
      grid-row: 1;
      scroll-snap-align: start;
    }
  }

  .arrow {
    position: absolute;
    height: 100%;
    width: 30px;
    padding: 0;
    cursor: pointer;
    font: var(--font-ui);
    font-size: 0.8em;
    border: none;
    /* background: none; */
    color: var(--color-user);
    transition: color 0.2s;

    &:disabled {
      color: color-mix(in lab, var(--color-user), transparent 70%);
    }

    &.left {
      left: 0;
      background: linear-gradient(to right, var(--color-background), transparent);
    }

    &.right {
      right: 0;
      background: linear-gradient(to left, var(--color-background), transparent);
    }
  }
}
</style>
