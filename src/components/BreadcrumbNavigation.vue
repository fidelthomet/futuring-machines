<script setup>
defineProps({
  crumbs: {
    type: Array,
    default: null
  }
  // prompt: {
  //   type: String,
  //   default: null
  // }
})
defineEmits(['reset'])
</script>
<template>
  <div class="breadcrumb-navigation">
    <span @click="$emit('reset', 0)">prompts</span>
    <template v-for="(crumb, i) in crumbs" :key="i">
      <span> / </span>
      <span @click="$emit('reset', i + 1)">{{ crumb }}</span>
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
      /* font-weight: 600; */
    }
  }
}
</style>
