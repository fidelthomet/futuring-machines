<script setup>
import { useCommandStore } from '@/stores/commands'
import LocalizeText from './LocalizeText.vue'
import IconRepeat from '~icons/base/Repeat'

defineProps({
  crumbs: {
    type: Array,
    default: null
  },
  repeatable: {
    type: Boolean,
    default: false
  }
})
defineEmits(['reset', 'try-again'])

const commandStore = useCommandStore()
</script>
<template>
  <div class="breadcrumb-navigation">
    <span @click="$emit('reset', 0)">prompts</span>
    <template v-for="(crumb, i) in crumbs" :key="i">
      <span class="separator"> / </span>
      <span v-if="i + 1 < crumbs.length" @click="$emit('reset', i + 1)">
        <LocalizeText :text="crumb" :lang="commandStore.lang" />
      </span>
      <span v-else :class="{ disabled: !repeatable, repeatable }" @click="$emit('try-again')">
        <LocalizeText :text="crumb" :lang="commandStore.lang" />
        <IconRepeat v-if="repeatable" />
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
      color: var(--color-user);
    }

    &.separator,
    &.disabled {
      pointer-events: none;
    }

    &.repeatable {
      display: inline-flex;
    }
  }
}
</style>
