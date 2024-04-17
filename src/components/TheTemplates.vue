<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCommandStore } from '@/stores/commands'

import { RouterLink } from 'vue-router'

const commandStore = useCommandStore()
</script>

<template>
  <div class="templates">
    <h1>Story Templates</h1>
    <ul>
      <RouterLink
        v-for="template in commandStore.templatesEnabled"
        :key="template.name"
        :to="{ name: 'editor', params: { template: template.name } }"
      >
        <li>
          <button>{{ template.description }}</button>
        </li>
      </RouterLink>
    </ul>
  </div>
</template>

<style scoped>
.templates {
  grid-column: center-start / center-end;
  grid-row: center-start / center-end;

  /* font-size: 25px;
  line-height: 1.5;
  letter-spacing: 0.5px; */
  text-rendering: geometricPrecision;

  a {
    color: var(--color-accent);
    text-decoration: none;
  }
  

  caret-color: var(--color-cursor);
  &:deep(> div:focus) {
    outline: none;
  }

  &:deep(*::selection) {
    background-color: var(--color-selection);
  }

  &:deep(span.mark-ai) {
    color: var(--color-accent);
  }

  h1 {
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  button {
    padding: 8px 16px;
    border-radius: 30px;
    font-size: 20px;
    margin-bottom: 10px;
  }
}
</style>
