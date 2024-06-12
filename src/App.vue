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
  /* --padding: 80px; */
  display: grid;
  grid-template-columns:
    1fr
    [outer-start] calc(var(--spacing) * 1.5)
    [outer-small-start] calc(var(--spacing) * 0.5)
    [center-start] min(100vw - var(--spacing) * 4, 800px)
    [center-end] calc(var(--spacing) * 0.5)
    [outer-small-end] calc(var(--spacing) * 1.5)
    [outer-end] 1fr;
  grid-template-rows:
    [center-start] 1fr
    [center-end];
  /* padding-bottom: 500px; */
}
</style>
