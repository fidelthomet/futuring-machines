<script setup>
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, FloatingMenu, Editor, EditorContent } from '@tiptap/vue-3'
import MarkAI from '@/tiptap/mark-ai'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCommandStore } from '@/stores/commands'

const editor = ref(null)
const commandStore = useCommandStore()

onMounted(async () => {
  editor.value = new Editor({
    extensions: [StarterKit, MarkAI],
    content: '',
    onSelectionUpdate({ editor }) {
      if (editor.view.state.selection.from === editor.view.state.selection.to)
        editor.chain().focus().unsetMarkAI().run()
    }
  })
  commandStore.initTemplate(editor.value)
})

onBeforeUnmount(() => {
  editor.value.destroy()
})

function logHighlight() {
  // const { view, state } = editor.value
  // const { from, to } = view.state.selection
  // const text = state.doc.textBetween(from, to, '\n')
  // console.log(text)
  // editor.value.commands.insertContent(text.split('').reverse().join(''))
}

// function toggleClass() {
//   editor.value.chain().focus().toggleMarkAI().run()
// }
</script>

<template>
  <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
    <button
      v-for="prompt in commandStore.promptsEnabled.filter((c) => c.trigger === 'selection')"
      :key="prompt.name"
      @click="commandStore.run(editor, prompt, prompt.startIndex ?? 0)"
    >
      {{ prompt.name }}
    </button>
    <!-- <button @click="logHighlight" :class="{ 'is-active': editor.isActive('bold') }">log</button>
    <button @click="toggleClass" :class="{ 'is-active': editor.isActive('mark-ai') }">
      class toggle
    </button>
    <button
      @click="editor.chain().focus().toggleStrike().run()"
      :class="{ 'is-active': editor.isActive('strike') }"
    >
      strike
    </button> -->
  </bubble-menu>
  <floating-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
    <button
      v-for="prompt in commandStore.promptsEnabled.filter((c) => c.trigger === 'new-line')"
      :key="prompt.name"
      @click="commandStore.run(editor, prompt, prompt.startIndex ?? 0)"
    >
      {{ prompt.name }}
    </button>
  </floating-menu>
  <editor-content :editor="editor" class="editor" />
</template>

<style scoped>
.editor {
  grid-column: center-start / center-end;
  grid-row: center-start / center-end;

  font-size: 25px;
  line-height: 1.5;
  letter-spacing: 0.5px;
  text-rendering: geometricPrecision;

  caret-color: rgb(0, 127, 255);
  &:deep(> div:focus) {
    outline: none;
  }

  &:deep(*::selection) {
    background-color: rgba(0, 127, 255, 0.5);
  }

  &:deep(span.mark-ai) {
    font-family: 'Redaction 50';
    color: var(--color-accent);
  }
}

button {
  color: red;
}
</style>
