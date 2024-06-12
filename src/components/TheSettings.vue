<script setup>
import ButtonDefault from '@/components/ButtonDefault.vue'
import { useStoryStore } from '@/stores/story'
import { ref } from 'vue'

const storyStore = useStoryStore()
const url = ref(import.meta.env.VITE_STATIC_STORIES_URL)
</script>

<template>
  <div class="settings">
    <h1>Settings</h1>
    <ButtonDefault primary class="delete" @click="storyStore.deleteStory(null, true)"
      >Delete all local stories</ButtonDefault
    >
    <br /><br />
    <span>story import</span><br /><input type="text" v-model="url" /><ButtonDefault
      primary
      @click="storyStore.importStories(url)"
      >Import</ButtonDefault
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
