<script setup>
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, FloatingMenu, Editor, EditorContent } from '@tiptap/vue-3'
import MarkAI from '@/tiptap/mark-ai'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCommandStore } from '@/stores/commands'

const editor = ref(null)
const commandStore = useCommandStore()

onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit, MarkAI],
    content: `
        <h1>Story</h1>
        <p>
          In a world where technology has advanced beyond our wildest dreams, design practices have evolved to keep pace. As we step into the future, designers are no longer confined by the limitations of physical materials and two-dimensional screens. Instead, they have the power to create immersive experiences that blur the line between reality and imagination. From holographic interfaces to AI-assisted design tools, the future of design is a breathtaking landscape of limitless possibilities. In this story, we'll explore some of the exciting trends and innovations shaping the future of design practice, and how they're transforming the way we live, work, and play. So buckle up, dear reader, as we embark on a journey through the wondrous world of tomorrow's design!
        </p>
      `,
    onSelectionUpdate({ editor }) {
      if (editor.view.state.selection.from === editor.view.state.selection.to)
        editor.chain().focus().unsetMarkAI().run()
    }
  })
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
      v-for="command in commandStore.commands.filter((c) => c.type === 'selection')"
      :key="command.name"
      @click="command.handler(editor, $event)"
    >
      {{ command.name }}
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
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
    >
      H1
    </button>
    <button
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
    >
      H2
    </button>
    <button
      @click="editor.chain().focus().toggleBulletList().run()"
      :class="{ 'is-active': editor.isActive('bulletList') }"
    >
      Bullet List
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
