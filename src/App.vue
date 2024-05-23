<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  --padding: 80px;
  display: grid;
  grid-template-columns:
    1fr [center-start] min(100vw - var(--padding) * 2, 800px)
    [center-end] 1fr;
  grid-template-rows:
    [center-start] 1fr
    [center-end];
  /* padding-bottom: 500px; */
}
</style>
