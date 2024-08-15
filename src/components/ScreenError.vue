<script setup>
import ButtonDefault from '@/components/ButtonDefault.vue'
import { useCommandStore } from '@/stores/commands'

const commandStore = useCommandStore()
const emit = defineEmits(['cancel', 'try-again'])

function tryAgain() {
  emit('try-again')
  commandStore.isError = false
}

function cancel() {
  emit('cancel')
  commandStore.isError = false
}
</script>

<template>
  <div class="screen-generating">
    <div>unexpected error :(</div>
    <div class="options">
      <ButtonDefault primary @click="tryAgain">try again</ButtonDefault>
      <ButtonDefault primary @click="cancel">cancel</ButtonDefault>
    </div>
  </div>
</template>
<style scoped>
.screen-generating {
  height: 140px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: calc(var(--spacing) / 2);

  .options {
    display: flex;
    gap: calc(var(--spacing) * 1.5);
  }
}
</style>
