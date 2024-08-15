<script setup>
import ButtonDefault from '@/components/ButtonDefault.vue'
import InputSegment from '@/components/InputSegment.vue'
import { useStoryStore } from '@/stores/story'
import { useSettingStore } from '@/stores/setting'
import { ref } from 'vue'

const storyStore = useStoryStore()
const settingStore = useSettingStore()
const url = ref(import.meta.env.VITE_STORIES_STATIC_URL)
</script>

<template>
  <div class="settings">
    <h1>Settings</h1>
    <h2>Language</h2>
    <InputSegment :options="settingStore.langOptions" v-model="settingStore.lang" name="lang" />
    <h2>Stories</h2>
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
  margin-top: calc(var(--spacing) * 4);
  .delete {
    color: var(--color-user);
  }
}
</style>
