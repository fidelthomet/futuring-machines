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

  async function uploadStory(id) {
    const url = import.meta.env.VITE_STORIES_API_URL

    // const story = JSON.parse(localStorage.getItem(`story-${id}`))

    const res = await fetch(url, {
      method: 'POST',
      // body: JSON.stringify({ [`story-${id}`]: story })
      body: localStorage.getItem(`story-${id}`)
    })

    console.log(res)
  }

  async function downloadStory(id) {
    const project = id && localStorage.getItem(`story-${id}`)
    const blob = id && new Blob([project], { type: 'application/json' })
    const link = document.createElement('a')
    link.download = `${id?.split('-')[0] ?? 'db'}.json`
    link.href = window.URL.createObjectURL(blob)
    link.dataset.downloadurl = ['text/json', link.download, link.href].join(':')
    const evt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    })
    link.dispatchEvent(evt)
    link.remove()
  }

  return {
    stories,
    update,
    deleteStory,
    importStories,
    uploadStory,
    downloadStory
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoryStore, import.meta.hot))
}
