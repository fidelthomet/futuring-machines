<script setup>
import ButtonDefault from '@/components/ButtonDefault.vue'
import { useStoryStore } from '@/stores/story'

const storyStore = useStoryStore()
</script>

<template>
  <div class="settings">
    <h1>Settings</h1>

    <ButtonDefault class="delete" @click="storyStore.deleteStory(null, true)"
      >Delete all local stories</ButtonDefault
    >
  </div>
</template>
<style scoped>
.settings {
  grid-column: center-start / center-end;
  /* row-gap: var(--spacing); */
  margin-top: calc(var(--spacing) * 4);
  .delete {
    color: var(--color-user);
  }
}
</style>
