<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCommandStore } from '@/stores/commands'

import { RouterLink } from 'vue-router'

const commandStore = useCommandStore()
</script>

<template>
  <div class="templates">
    <h1>Templates</h1>
    <ul>
      <RouterLink
        v-for="template in commandStore.templatesEnabled"
        :key="template.name"
        :to="{ name: 'editor', params: { template: template.name } }"
      >
        <li>
          {{ template.name }}
        </li>
      </RouterLink>
    </ul>
  </div>
</template>

<style scoped>
.templates {
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
