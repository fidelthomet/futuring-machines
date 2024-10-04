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
    <p>Set the language for the stories.</p>
    <InputSegment :options="settingStore.langOptions" v-model="settingStore.lang" name="lang" />
    <h2>Stories</h2>
    <ButtonDefault primary class="delete" @click="storyStore.deleteStory(null, true)"
      >Delete all local stories</ButtonDefault
    >
    <br /><br />
    <span>Story import</span><br /><input type="text" v-model="url" /><ButtonDefault
      primary
      @click="storyStore.importStories(url)"
      >Import</ButtonDefault
    >

    <h2>Export</h2>
    <p>This setting defines the behavior of the upload/download button in the footer.</p>
    <p>By default it uploads only, but can also download or both. The icon adapts accordingly.</p>
    <InputSegment :options="settingStore.shareOptions" v-model="settingStore.share" name="export" />
  </div>
</template>
<style scoped>
.settings {
  grid-column: center-start / center-end;
  margin-top: calc(var(--spacing) * 4);
  .delete {
    color: var(--color-user);
  }

  h2 {
    margin-top: 30px;
  }
}
</style>
