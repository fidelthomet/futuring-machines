<script setup>
defineProps({
  crumbs: {
    type: Array,
    default: () => ['Prompts']
  }
})
</script>
<template>
  <div class="breadcrumb-navigation">
    <template v-for="(crumb, i) in crumbs" :key="i">
      <span>{{ crumb }}</span>
      <span v-if="i < crumbs.length - 1"> / </span>
    </template>
  </div>
</template>
<style scoped>
.button-tile {
  width: 210px;
  height: 140px;
  border: 1px solid var(--color-ai);
  border-radius: var(--border-radius);
  background: none;
  padding: calc(var(--spacing) / 2);
  display: flex;
  color: var(--color-ai);
  font: var(--font-ui);
  text-align: left;

  h2 {
    font: var(--font-ui);
    font-weight: 500;
  }
}
</style>
