<script setup>
import { useCommandStore } from '@/stores/commands'
import { useStoryStore } from '@/stores/story'
import { RouterLink } from 'vue-router'
import ButtonTile from './ButtonTile.vue'
import LocalizeText from '@/components/LocalizeText.vue'
import { onMounted } from 'vue'
import ButtonDefault from './ButtonDefault.vue'
import { useSettingStore } from '@/stores/setting'
import { localize } from '@/assets/js/utils'
import IconImport from '~icons/base/Import'

const commandStore = useCommandStore()
const storyStore = useStoryStore()
const settingStore = useSettingStore()

onMounted(() => {
  storyStore.update()
})

function importFile(e) {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.addEventListener('load', (event) => {
    const id = JSON.parse(event.target.result).id
    if (id == null) return
    localStorage.setItem(`story-${id}`, event.target.result)
    storyStore.update()
  })
  reader.readAsText(file)
}
</script>

<template>
  <div class="templates">
    <h1>Futuring Machines</h1>
    <h2>Story Templates</h2>
    <div class="template-buttons">
      <RouterLink
        v-for="template in commandStore.templatesEnabled"
        :key="template.id"
        :to="{ name: 'editor', params: { template: template.id ?? localize(template.name) } }"
      >
        <ButtonTile tag="div" :height="280" :width="260">
          <template v-slot:title><LocalizeText :text="template.name" /></template>
          <template v-slot:description><LocalizeText :text="template.description" /></template>
        </ButtonTile>
      </RouterLink>
    </div>
    <template v-if="storyStore.stories?.length > 0">
      <h2>Recent stories</h2>
      <ul class="selection-list">
        <RouterLink
          v-for="story in storyStore.stories"
          :key="story.id"
          :to="{ name: 'editor', params: { template: story.template, id: story.id } }"
        >
          <li>
            {{ story.name || story.templateName }} ({{ story.author || 'anonymous' }})
            {{ story.updated.toLocaleString() }}
            <ButtonDefault @click.stop.prevent="storyStore.deleteStory(story.id)"
              >delete</ButtonDefault
            >
          </li>
        </RouterLink>
      </ul>
    </template>
    <div class="import">
      <ButtonDefault
        tag="label"
        for="file-import"
        type="file"
        accept="application/json"
        disable-padding
        title="import"
      >
        Import Story&nbsp;<IconImport />
      </ButtonDefault>
      <input id="file-import" type="file" accept="application/json" @change="importFile" />
    </div>
  </div>
</template>

<style scoped>
.templates {
  display: grid;
  grid: inherit;
  grid-column: 1 / -1;
  row-gap: var(--spacing);
  /* grid-row: center-start / center-end; */
  padding: calc(var(--spacing) * 4) 0;

  h1 {
    /* margin-bottom: 20px; */
    font: var(--font-ui-serif);
    font-size: var(--font-size-heading);
    grid-column: center-start / center-end;
  }

  h2 {
    font: var(--font-ui);
    font-weight: 600;
    grid-column: center-start / center-end;
  }

  .horizontal-slider,
  .selection-list {
    grid-column: outer-start / outer-end;

    a {
      text-decoration: none;
      color: var(--color-user);
    }
  }

  .template-buttons {
    margin: 0 calc(var(--spacing) * 1.5);
    display: flex;
    gap: var(--spacing);
    flex-wrap: wrap;

    grid-column: outer-start / outer-end;

    a {
      text-decoration: none;
      color: var(--color-user);
    }
  }

  .import {
    grid-column: center-start / center-end;
    margin-left: -10px;
    display: flex;

    label {
      display: flex;
      align-items: center;
    }
  }

  nav {
    display: flex;
    grid-column: outer-start / outer-end;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    a {
      text-decoration: none;
      background-color: var(--color-ui-secondary);
      color: var(--color-ui-primary);
      border: 1.5px solid var(--color-ui-primary);
      box-shadow: 0px 2px 0px var(--color-ui-primary);
      padding: 4px 16px;
      border-radius: 30px;
      font-size: 20px;

      &:hover {
        background-color: var(--color-ui-primary);
        color: var(--color-ui-secondary);
      }
    }
  }

  #file-import {
    display: none;
  }
}
</style>
