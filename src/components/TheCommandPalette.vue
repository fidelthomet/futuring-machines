<script setup>
import ButtonTile from '@/components/ButtonTile.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'
// import { Carousel, Slide } from 'vue-snap'
import HorizontalSlider from '@/components/HorizontalSlider.vue'
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.vue'

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

function closeEditor(force) {
  openPrompts.value = false
  editorStore.editor.off('update', closeEditor)
  editorStore.editor.off('selectionUpdate', closeEditor)
  if (force) {
    editorStore.editor.commands.setTextSelection(editorStore.editor.view.state.selection.to)
    editorStore.selection = null
  }
}

function openEditor() {
  openPrompts.value = true
  editorStore.editor.on('update', closeEditor)
  editorStore.editor.on('selectionUpdate', closeEditor)
}

function toggleEditor(force) {
  showPrompts.value ? closeEditor(force) : openEditor()
}

let onKeyDownListener = null
onMounted(() => {
  onKeyDownListener = window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !showPrompts.value) {
      e.preventDefault()
      openEditor()
    } else if (e.key === 'Escape' && showPrompts.value) {
      e.preventDefault()
      closeEditor()
    }
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDownListener)
  editorStore.editor.off('update', closeEditor)
  editorStore.editor.off('selectionUpdate', closeEditor)
})
</script>
<template>
  <div class="command-palette">
    <template v-if="showPrompts">
      <hr />
      <BreadcrumbNavigation />
      <HorizontalSlider class="horizontal-slider" hideArrowsOnBound>
        <ButtonTile
          v-for="(prompt, i) in availablePrompts"
          :key="i"
          class="slide"
          @click="run(editorStore.editor, prompt)"
        >
          <template v-slot:title>{{ prompt.name }} {{ prompt.description }}</template>
        </ButtonTile>
      </HorizontalSlider>
    </template>
    <hr />
    <div class="controls">
      <span class="left">
        <ButtonDefault @click="toggleEditor(true)" :active="showPrompts">AI</ButtonDefault>
      </span>
      <span class="right">
        <ButtonDefault
          @click="editorStore.editor.commands.undo()"
          :disabled="!editorStore.editor.can().undo()"
          >undo</ButtonDefault
        >
        <ButtonDefault
          @click="editorStore.editor.commands.redo()"
          :disabled="!editorStore.editor.can().redo()"
          >redo</ButtonDefault
        >
        <ButtonDefault disabled>print</ButtonDefault>
      </span>
    </div>
  </div>
</template>
<style scoped>
.command-palette {
  grid: inherit;
  display: grid;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding-bottom: calc(var(--spacing) / 2);

  grid-column: center-start / center-end;
  grid-row: center-start / center-end;

  /* backdrop-filter: blur(10px); */
  background: var(--color-background);
  row-gap: calc(var(--spacing) / 2);

  hr {
    grid-column: outer-start / outer-end;
    border: none;
    height: 1px;
    --color-user-light: color-mix(in lab, var(--color-user), transparent 70%);
    /* background: linear-gradient(
      to right,
      transparent 0%,
      var(--color-user-light) calc(var(--spacing) * 1.5) calc(100% - var(--spacing) * 1.5),
      transparent 100%
    ); */
    background: var(--color-user-light);
  }

  .breadcrumb-navigation {
    grid-column: center-start / center-end;
  }
  .controls {
    grid-column: center-start / center-end;
    display: flex;
    justify-content: space-between;
    gap: calc(var(--spacing));

    .left,
    .right {
      display: flex;
      gap: inherit;
    }
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
