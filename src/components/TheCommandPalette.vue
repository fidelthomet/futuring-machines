<script setup>
import ButtonTile from '@/components/ButtonTile.vue'
import ButtonList from '@/components/ButtonList.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.vue'
import ScreenGenerating from '@/components/ScreenGenerating.vue'
import ScreenError from '@/components/ScreenError.vue'

import { useCommandStore } from '@/stores/commands'
import { useEditorStore } from '@/stores/editor'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import IconUpload from '~icons/base/Upload'
import IconAI from '~icons/base/AI'

const startIndex = ref(0)
const openPrompts = ref(false)
const lastPrompt = ref(null)

const commandStore = useCommandStore()
const editorStore = useEditorStore()

async function run(editor, prompt) {
  lastPrompt.value = prompt
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

const showPrompts = computed(
  () => (openPrompts.value || editorStore.selection != null) && commandStore.aiEnabled
)

function closePromptSelection(force) {
  openPrompts.value = false
  editorStore.editor.off('update', closePromptSelection)
  editorStore.editor.off('selectionUpdate', closePromptSelection)
  if (force) {
    editorStore.editor.commands.setTextSelection(editorStore.editor.view.state.selection.to)
    editorStore.selection = null
  }
}

function openPromptSelection() {
  startIndex.value = 0
  commandStore.resetPrompts()
  openPrompts.value = true
  editorStore.editor.on('update', closePromptSelection)
  editorStore.editor.on('selectionUpdate', closePromptSelection)
}

function togglePromptSelection(force) {
  showPrompts.value ? closePromptSelection(force) : openPromptSelection()
}

function tryAgain() {
  commandStore.crumbs.pop()
  run(editorStore.editor, lastPrompt.value)
}

function cancel() {
  startIndex.value = 0
  commandStore.resetPrompts()
}

function reset(index) {
  console.log(index)
  startIndex.value = index
  commandStore.isError = false
  commandStore.crumbs = commandStore.crumbs.filter((_, i) => i < index)
  console.log(commandStore.lastPromptsEnabled.length)
  commandStore.lastPromptsEnabled = commandStore.lastPromptsEnabled.filter((_, i) => i < index)
  commandStore.promptsEnabled =
    commandStore.lastPromptsEnabled[commandStore.lastPromptsEnabled.length - 1]
  // commandStore.prom
  commandStore.controller.abort()
  if (index === 0) {
    console.log('reset')
    commandStore.resetPrompts()
  }
}

let onKeyDownListener = null
onMounted(() => {
  onKeyDownListener = window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !showPrompts.value) {
      e.preventDefault()
      openPromptSelection()
    } else if (e.key === 'Escape' && showPrompts.value) {
      e.preventDefault()
      closePromptSelection()
    }
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDownListener)
  editorStore.editor.off('update', closePromptSelection)
  editorStore.editor.off('selectionUpdate', closePromptSelection)
})
</script>
<template>
  <div class="command-palette">
    <template v-if="showPrompts">
      <hr />
      <BreadcrumbNavigation :crumbs="commandStore.crumbs" @reset="reset" />
      <ScreenGenerating class="screen" v-if="commandStore.isGenerating" />
      <ScreenError
        class="screen"
        v-else-if="commandStore.isError"
        @try-again="tryAgain"
        @cancel="cancel"
      />
      <template v-else>
        <!-- <div class="grid" v-if="availablePrompts.length > 3">
          <ButtonTile
            v-for="(prompt, i) in availablePrompts"
            :key="i"
            class="slide"
            width="auto"
            height="130"
            :pattern="prompt.pattern"
            @click="run(editorStore.editor, prompt)"
          >
            <template v-slot:title>{{ prompt.name }} {{ prompt.description }}</template>
          </ButtonTile>
        </div> -->
        <div class="list" v-if="availablePrompts.length > 3">
          <ButtonList
            v-for="(prompt, i) in availablePrompts"
            :key="i"
            class="slide"
            width="auto"
            height="auto"
            @click="run(editorStore.editor, prompt)"
          >
            <template v-slot:title>{{ prompt.name }} {{ prompt.description }}</template>
          </ButtonList>
        </div>
        <div v-else class="vertical">
          <ButtonTile
            v-for="(prompt, i) in availablePrompts"
            :key="i"
            class="slide"
            width="100%"
            height="auto"
            @click="run(editorStore.editor, prompt)"
          >
            <template v-slot:title>{{ prompt.name }} </template>
            <template v-slot:description>{{ prompt.description }}</template>
          </ButtonTile>
        </div>
      </template>
    </template>
    <hr />
    <div class="controls">
      <span class="left">
        <ButtonDefault
          offset-padding
          @click="togglePromptSelection(true)"
          :active="showPrompts"
          :disabled="!commandStore.aiEnabled"
          ><IconAI
        /></ButtonDefault>
      </span>
      <span class="right">
        <!-- <ButtonDefault
          offset-padding
          @click="commandStore.logFeedback('positive')"
          :disabled="!commandStore.hasGeneratedText"
          >👍</ButtonDefault
        >
        <ButtonDefault
          offset-padding
          @click="commandStore.logFeedback('negative')"
          :disabled="!commandStore.hasGeneratedText"
          >👎</ButtonDefault
        > -->
        <ButtonDefault
          offset-padding
          class="flip"
          @click="editorStore.editor.commands.undo()"
          :disabled="!editorStore.editor?.can().undo()"
          >↩</ButtonDefault
        >
        <ButtonDefault
          offset-padding
          class="flip"
          @click="editorStore.editor.commands.redo()"
          :disabled="!editorStore.editor?.can().redo()"
          >↪</ButtonDefault
        >
        <ButtonDefault offset-padding @click="editorStore.log()"><IconUpload /></ButtonDefault>
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

  /* grid-column: center-start / center-end;
  grid-row: center-start / center-end; */

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

      .flip {
        transform: scaleY(-1);
      }
    }
  }

  .screen {
    grid-column: center-start / center-end;
  }

  .horizontal-slider {
    grid-column: outer-start / outer-end;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    flex-direction: column;
    gap: calc(var(--spacing) / 2);
    grid-column: outer-small-start / outer-small-end;
  }

  .list {
    grid-column: outer-small-start / outer-small-end;
    grid-column: center-start / center-end;

    & > button {
      margin: 0 calc(var(--spacing) / 4) calc(var(--spacing) / 4) 0;
    }
  }

  .vertical {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) / 2);
    grid-column: outer-small-start / outer-small-end;
  }
  /* margin: var(--spacing); */

  /* .horizontal-slider {
    .slide {
      flex-basis: 300px;
    }
  } */

  @media print {
    display: none !important;
  }
}
</style>
