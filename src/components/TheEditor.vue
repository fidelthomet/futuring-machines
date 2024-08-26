<script setup>
import { EditorContent } from '@tiptap/vue-3'
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useCommandStore } from '@/stores/commands'
import { useEditorStore } from '@/stores/editor'
import TheCommandPalette from '@/components/TheCommandPalette.vue'
import { localize } from '@/assets/js/utils'

const editorStore = useEditorStore()
const commandStore = useCommandStore()

onMounted(async () => {
  editorStore.createEditor()
  commandStore.initTemplate(editorStore.editor)
})

onBeforeUnmount(() => {
  editorStore.editor.destroy()
})

watch(
  () => [commandStore.storyAuthor, commandStore.storyName],
  () => editorStore.saveStory()
)
</script>

<template>
  <div class="editor-wrapper">
    <input
      class="input-meta title"
      :placeholder="localize(commandStore.template?.name, commandStore.lang)"
      v-model="commandStore.storyName"
      @click.stop
      @keydown.stop
    />
    <input
      class="input-meta author"
      placeholder="anonymous"
      @click.stop
      @keydown.stop
      v-model="commandStore.storyAuthor"
    />
    <editor-content :editor="editorStore.editor" class="editor" />
  </div>
  <TheCommandPalette />
</template>

<style scoped>
.editor-wrapper {
  margin-top: 50vh;
  margin-bottom: 50vh;
  grid-column: center-start / center-end;
  grid-row: center-start / center-end;

  font: var(--font-text);
  letter-spacing: 0.5px;
  color: var(--color-user);

  caret-color: var(--color-user);

  @media print {
    margin-top: calc(var(--spacing) * 1.5);
    margin-bottom: calc(var(--spacing) * 1.5);
  }

  .input-meta {
    font: var(--font-heading);
    color: inherit;
    padding: 0;
    margin: 0;
    border: none;
    color: var(--color-user);

    &.title {
      font-weight: bold;
    }

    &.author {
      font-size: var(--font-size-ui);
      font: var(--font-ui);
      margin-bottom: var(--spacing);
    }

    &:focus-visible {
      outline: none;
    }
  }
}

.input-meta::placeholder {
  color: var(--color-ai);
}
.editor:deep(> div:focus) {
  outline: none;
}

.editor:deep(*::selection) {
  background-color: color-mix(in lab, var(--color-user), transparent 85%);
}

.editor:deep(span.mark-ai) {
  color: var(--color-ai);
}

.editor:deep(span.mark-ai::selection) {
  background-color: color-mix(in lab, var(--color-ai), transparent 85%);
}

.editor:deep(p + p) {
  margin-top: calc(var(--font-size) * var(--line-height));
}

.editor:deep(h1, h2, h3, h4) {
  font: var(--font-heading);
  letter-spacing: 0;
}

.editor:deep([data-type='placeholder']) {
  font: var(--font-heading);
  font-weight: 425;
  font-size: 22px;
  color: var(--color-user);
  background: color-mix(in lab, var(--color-user), transparent 85%);
  border-radius: 5px;
  padding: 0 calc(var(--spacing) / 4);
  box-decoration-break: clone;
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
