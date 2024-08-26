<script setup>
import { useCommandStore } from '@/stores/commands'
import LocalizeText from './LocalizeText.vue'

defineProps({
  crumbs: {
    type: Array,
    default: null
  }
})
defineEmits(['reset'])

const commandStore = useCommandStore()
</script>
<template>
  <div class="breadcrumb-navigation">
    <span @click="$emit('reset', 0)">prompts</span>
    <template v-for="(crumb, i) in crumbs" :key="i">
      <span> / </span>
      <span @click="$emit('reset', i + 1)">
        <LocalizeText :text="crumb" :lang="commandStore.lang" />
      </span>
    </template>
  </div>
</template>
<style scoped>
.breadcrumb-navigation {
  text-transform: lowercase;
  span {
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
    &:last-child {
      pointer-events: none;
    }
  }
}
</style>
