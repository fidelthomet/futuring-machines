<script setup>
import { useCommandStore } from '@/stores/commands'

import { RouterLink } from 'vue-router'

const commandStore = useCommandStore()
</script>

<template>
  <div class="templates">
    <h1>Story Templates</h1>
    <nav>
      <RouterLink
        v-for="template in commandStore.templatesEnabled"
        :key="template.name"
        :to="{ name: 'editor', params: { template: template.name } }"
      >
        {{ template.description }}
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.templates {
  grid-column: center-start / center-end;
  grid-row: center-start / center-end;

  h1 {
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 10px;

    a {
      text-decoration: none;
      background-color: white;
      padding: 8px 16px;
      border-radius: 30px;
      font-size: 20px;
    }
  }
}
</style>
