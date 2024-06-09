import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useStoryStore = defineStore('story', () => {
  const stories = ref(null)

  function update() {
    const storage = { ...localStorage }
    const storyKeys = Object.keys(storage).filter((key) => /^story-/.test(key))
    stories.value = storyKeys
      .map((key) => {
        const data = JSON.parse(storage[key])
        data.updated = new Date(data.updated)
        return data
      })
      .sort((a, b) => (a.updated < b.updated ? 1 : -1))
  }
  return {
    stories,
    update
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoryStore, import.meta.hot))
}
