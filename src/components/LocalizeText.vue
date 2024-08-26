<script setup>
import { localize } from '@/assets/js/utils'
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: [String, Object, Array],
    default: null
  },
  lang: {
    type: String,
    default: null
  },
  separator: {
    type: String,
    default: '; '
  }
})

const displayText = computed(() => transform(props.text))

function transform(d) {
  if (typeof d === 'string') return d
  if (d === null) return
  if (Array.isArray(d)) return d.map((d) => transform(d)).join(props.separator)
  if (typeof d === 'object') return localize(d, props.lang)
}
</script>

<template>
  {{ displayText }}
</template>
