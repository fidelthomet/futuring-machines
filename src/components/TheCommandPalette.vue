<script setup>
import ButtonTile from '@/components/ButtonTile.vue'
// import { Carousel, Slide } from 'vue-snap'
import HorizontalSlider from '@/components/HorizontalSlider.vue'

import { useCommandStore } from '@/stores/commands'
import { useEditorStore } from '@/stores/editor'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const startIndex = ref(0)

const openPrompts = ref(false)

const commandStore = useCommandStore()
const editorStore = useEditorStore()

async function run(editor, prompt) {
  commandStore.run(editor, prompt, prompt.startIndex ?? 0)
  startIndex.value = prompt.startIndex + 1

  // Flat prompt after generate options
  if (prompt.actions[prompt.startIndex ?? 0].type === 'generate options') {
    prompt.generateOptionsFlag = true
  }
}

const availablePrompts = computed(() =>
  editorStore.selection != null
    ? commandStore.promptsEnabled.filter((prompt) => prompt.trigger === 'selection')
    : commandStore.promptsEnabled.filter((prompt) => prompt.trigger !== 'selection')
)

const showPrompts = computed(() => openPrompts.value || editorStore.selection != null)

let onKeyDownListener = null
onMounted(() => {
  onKeyDownListener = window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      openPrompts.value = true
      window.addEventListener(
        'keydown',
        (e) => {
          if (e.key !== 'Tab') {
            openPrompts.value = false
          }
        },
        { once: true }
      )
    } else if (e.key === 'Escape' && showPrompts.value) {
      e.preventDefault()
      openPrompts.value = false
    }
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDownListener)
})
</script>
<template>
  <div class="command-palette">
    <hr />
    <HorizontalSlider v-if="showPrompts" class="horizontal-slider" hideArrowsOnBound>
      <ButtonTile
        v-for="(prompt, i) in availablePrompts"
        :key="i"
        class="slide"
        @click="run(editorStore.editor, prompt)"
      >
        <template v-slot:title>{{ prompt.name }} {{ prompt.description }}</template>
      </ButtonTile>
    </HorizontalSlider>
  </div>
</template>
<style scoped>
.command-palette {
  grid: inherit;
  display: grid;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding-bottom: var(--spacing);

  grid-column: center-start / center-end;
  grid-row: center-start / center-end;

  /* backdrop-filter: blur(10px); */
  background: var(--color-background);
  row-gap: var(--spacing);
  /* border-top: 1px solid color-mix(in lab, var(--color-user), transparent 70%); */

  hr {
    grid-column: outer-start / outer-end;
    border: none;
    height: 1px;
    --color-user-light: color-mix(in lab, var(--color-user), transparent 70%);
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--color-user-light) calc(var(--spacing) * 1.5) calc(100% - var(--spacing) * 1.5),
      transparent 100%
    );
  }

  .horizontal-slider {
    grid-column: outer-start / outer-end;
  }
  /* margin: var(--spacing); */

  /* .horizontal-slider {
    .slide {
      flex-basis: 300px;
    }
  } */
}
</style>
