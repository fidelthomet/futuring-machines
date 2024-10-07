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
import IconDownload from '~icons/base/Download'
import IconUpDownload from '~icons/base/UpDownload'
import IconPrint from '~icons/base/Print'
import IconAI from '~icons/base/AI'
import LocalizeText from './LocalizeText.vue'
import { useStoryStore } from '@/stores/story'
import { useSettingStore } from '@/stores/setting'

const startIndex = ref(0)
const openPrompts = ref(false)
const lastPrompt = ref(null)

const commandStore = useCommandStore()
const editorStore = useEditorStore()
const storyStore = useStoryStore()
const settingStore = useSettingStore()

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

const repeatable = computed(() => {
  const index = startIndex.value ? startIndex.value - 1 : 0
  return (
    lastPrompt.value?.actions?.[index]?.type === 'generate options' &&
    !commandStore.isGenerating &&
    !commandStore.isError
  )
})

const showPrompts = computed(() => openPrompts.value || editorStore.selection != null)

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
  console.log('teryyr')
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

function share() {
  editorStore.log()
  console.log("Share Story option: " + settingStore.share)
  if (settingStore.share !== 'upload') storyStore.downloadStory(commandStore.storyId)
  if (settingStore.share !== 'download') storyStore.uploadStory(commandStore.storyId)
}

function printPage() {
  window.print()
}
</script>
<template>
  <div class="command-palette">
    <template v-if="showPrompts || commandStore.isGenerating || commandStore.isError">
      <hr />
      <BreadcrumbNavigation
        :crumbs="commandStore.crumbs"
        @reset="reset"
        :repeatable="repeatable"
        @try-again="tryAgain"
      />
      <ScreenGenerating class="screen" v-if="commandStore.isGenerating" />
      <ScreenError
        class="screen"
        v-else-if="commandStore.isError"
        @try-again="tryAgain"
        @cancel="cancel"
      />
      <template v-else>
        <div class="list" v-if="availablePrompts.length > 3">
          <ButtonList
            v-for="(prompt, i) in availablePrompts"
            :key="i"
            class="slide"
            width="auto"
            height="auto"
            @click="run(editorStore.editor, prompt)"
          >
            <template v-slot:title>
              <LocalizeText :text="prompt.name" :lang="commandStore.lang" />
              <LocalizeText :text="prompt.description" :lang="commandStore.lang" />
            </template>
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
            <template v-slot:title>
              <LocalizeText :text="prompt.name" :lang="commandStore.lang" />
            </template>
            <template v-slot:description>
              <LocalizeText :text="prompt.description" :lang="commandStore.lang" />
            </template>
          </ButtonTile>
        </div>
      </template>
    </template>
    <hr />
    <div class="controls">
      <span class="left">
        <ButtonDefault offset-padding @click="togglePromptSelection(true)" :active="showPrompts"
          ><IconAI
        /></ButtonDefault>
      </span>
      <span class="right">
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
        <ButtonDefault offset-padding @click="printPage"><IconPrint /></ButtonDefault>
        <ButtonDefault offset-padding @click="share">
          <IconUpload v-if="settingStore.share === 'upload'" />
          <IconDownload v-if="settingStore.share === 'download'" />
          <IconUpDownload v-if="settingStore.share === 'both'" />
        </ButtonDefault>
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

  background: var(--color-background);
  row-gap: calc(var(--spacing) / 2);

  hr {
    grid-column: outer-start / outer-end;
    border: none;
    height: 1px;
    --color-user-light: color-mix(in lab, var(--color-user), transparent 70%);
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

  @media print {
    display: none !important;
  }
}
</style>
