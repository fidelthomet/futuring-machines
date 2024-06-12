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

  function deleteStory(id, all) {
    if (!all) {
      localStorage.removeItem(`story-${id}`)
    } else {
      update()
      const storage = { ...localStorage }
      Object.keys(storage)
        .filter((key) => /^story-/.test(key))
        .forEach((key) => localStorage.removeItem(key))
    }
    update()
  }

  async function importStories(url) {
    deleteStory(null, true)
    const stories = await fetch(url).then((r) => r.json())

    for (const key in stories) {
      if (Object.hasOwnProperty.call(stories, key)) {
        console.log(stories[key])
        localStorage.setItem(key, JSON.stringify(stories[key]))
      }
    }
    console.log(stories)
  }

  return {
    stories,
    update,
    deleteStory,
    importStories
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoryStore, import.meta.hot))
}
