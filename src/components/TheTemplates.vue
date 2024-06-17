<script setup>
import { useCommandStore } from '@/stores/commands'
import { useStoryStore } from '@/stores/story'
import { RouterLink } from 'vue-router'
import HorizontalSlider from './HorizontalSlider.vue'
import ButtonTile from './ButtonTile.vue'
import { onMounted } from 'vue'
import ButtonDefault from './ButtonDefault.vue'
const commandStore = useCommandStore()
const storyStore = useStoryStore()

onMounted(() => {
  storyStore.update()
})
</script>

<template>
  <div class="templates">
    <h1>Futuring Machines</h1>
    <h2>Templates</h2>
    <!-- <HorizontalSlider> -->
    <div class="template-buttons">
      <RouterLink
        v-for="template in commandStore.templatesEnabled"
        :key="template.name"
        :to="{ name: 'editor', params: { template: template.name } }"
      >
        <ButtonTile tag="div" :height="300" :width="300">
          <template v-slot:title>{{ template.name }}</template>
          <template v-slot:description>{{ template.description }}</template>
        </ButtonTile>
      </RouterLink>
    </div>
    <!-- </HorizontalSlider> -->
    <template v-if="storyStore.stories?.length > 0">
      <h2>Recent stories</h2>
      <ul class="selection-list">
        <RouterLink
          v-for="story in storyStore.stories"
          :key="story.id"
          :to="{ name: 'editor', params: { template: story.template, id: story.id } }"
        >
          <li>
            {{ story.template }} {{ story.updated.toLocaleString() }}
            <ButtonDefault @click.stop.prevent="storyStore.deleteStory(story.id)"
              >delete</ButtonDefault
            >
          </li>
        </RouterLink>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.templates {
  display: grid;
  grid: inherit;
  grid-column: 1 / -1;
  row-gap: var(--spacing);
  /* grid-row: center-start / center-end; */
  margin-top: calc(var(--spacing) * 4);

  h1 {
    font-size: 1.5em;
    /* margin-bottom: 20px; */
    font: var(--font-heading);
    grid-column: center-start / center-end;
  }

  h2 {
    font: var(--font-ui);
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
}
</style>
