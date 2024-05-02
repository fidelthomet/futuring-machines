<script setup>
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, FloatingMenu, Editor, EditorContent } from '@tiptap/vue-3'
import MarkAI from '@/tiptap/mark-ai'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCommandStore } from '@/stores/commands'

/*
    >>>> MENUS
    https://tiptap.dev/docs/editor/guide/menus

    > Bubble Menu
    – A bubble menu is one that appears when selecting text.
    – https://tiptap.dev/docs/editor/api/extensions/bubble-menu

    > Floating Menu
    – A floating menu appears in the editor when you place the cursor on an new line.
    - Docs: https://tiptap.dev/docs/editor/api/extensions/bubble-menu
*/

const editor = ref(null)
const commandStore = useCommandStore()

const customPrompt = ref('')
const startIndex = ref(0)

onMounted(async () => {
  editor.value = new Editor({
    extensions: [StarterKit, MarkAI],
    content: '',
    onSelectionUpdate({ editor }) {
      if (editor.view.state.selection.from === editor.view.state.selection.to)
        editor.chain().focus().unsetMarkAI().run()
    },
    onUpdate({ editor }) {
      if (editor.isEmpty) {
        sessionStorage.removeItem(commandStore.templateName)
      } else {
        sessionStorage.setItem(commandStore.templateName, JSON.stringify(editor.getJSON()))
      }
    }
  })
  if (sessionStorage.getItem(commandStore.templateName)) {
    editor.value.commands.insertContent(
      JSON.parse(sessionStorage.getItem(commandStore.templateName))
    )
  } else {
    commandStore.initTemplate(editor.value)
  }
})

onBeforeUnmount(() => {
  editor.value.destroy()
})

async function run(editor, prompt) {
  commandStore.run(editor, prompt, prompt.startIndex ?? 0)
  startIndex.value = prompt.startIndex + 1

  // Flat prompt after generate options
  if (prompt.actions[prompt.startIndex ?? 0].type === 'generate options') {
    prompt.generateOptionsFlag = true
  }
}

function onCustomPrompt(editor, trigger = 'new-line', mode = 'append') {
  let customPromptObj = {
    name: 'continue',
    trigger: trigger,
    mode: mode,
    actions: [
      {
        type: 'generate',
        template:
          'Considering the following story, which is delimited with triple backticks, perform the following task. \n\nTask: ' +
          customPrompt.value +
          '. \n\nGenerate one short sentence, using at most 10 words. Write in a narrative way, keeping the tone and style of the story. \n\nStory: ```::full::```'
      }
    ]
  }
  commandStore.run(editor, customPromptObj, 0)
}

function onShowModal() {
  customPrompt.value = ''
}
</script>

<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{ duration: 100, placement: 'top-start', maxWidth: 800 }"
    v-if="editor"
  >
    <div v-if="!commandStore.isGenerating">
      <button
        v-for="prompt in commandStore.promptsEnabled.filter((c) => c.trigger === 'selection')"
        :key="prompt.name"
        @click="run(editor, prompt)"
      >
        {{ prompt.name }}
      </button>
    </div>
  </bubble-menu>
  <floating-menu
    :editor="editor"
    :tippy-options="{
      duration: 100,
      placement: 'bottom-start',
      maxWidth: 800,
      onShow: onShowModal
    }"
    v-if="editor"
  >
    <div v-if="!commandStore.isGenerating">
      <button
        v-for="prompt in commandStore.promptsEnabled.filter((c) => c.trigger === 'new-line')"
        :key="prompt.name"
        @click="run(editor, prompt)"
        :disabled="customPrompt !== ''"
        :class="{
          diverge:
            prompt.generateOptionsFlag &&
            prompt.actions[prompt.startIndex ?? 0].type !== 'generate options'
        }"
      >
        {{ prompt.name }}{{ prompt.description }}
      </button>
      <input
        v-if="startIndex === 0"
        :editor="editor"
        v-model="customPrompt"
        placeholder="...or write here a custom prompt and press ENTER!"
        @keyup.enter="onCustomPrompt(editor, 'new-line', 'append')"
      />
    </div>
  </floating-menu>

  <editor-content :editor="editor" class="editor" />

  <div class="is-generating" v-if="editor">
    <span v-if="commandStore.isGenerating">Loading...</span>
  </div>
</template>

<style scoped>
h1 {
  grid-column: center-start;
}
.editor {
  grid-column: center-start / center-end;
  grid-row: center-start / center-end;
  color: var(--color-editor-user);

  caret-color: var(--color-ui-primary);
  &:deep(> div:focus) {
    outline: none;
  }

  &:deep(*::selection) {
    background-color: var(--color-selection);
  }

  &:deep(span.mark-ai) {
    color: var(--color-editor-ai);
  }
}

button {
  text-align: left;
}

div:has(> button.diverge) {
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 0.3em;
  grid-row-gap: 0.3em;
}
button.diverge {
  padding: 14px 18px;
  display: inline-flex;
}

input {
  width: 100%;
  display: block;
  margin-top: 10px;
}

.is-generating {
  grid-column: center-start;
  grid-row: center-end;
  color: #999999;
}
</style>
