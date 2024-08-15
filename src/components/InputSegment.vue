<script setup>
defineProps({
  modelValue: [String, Boolean, Number],
  options: Array,
  name: String
})
defineEmits(['update:modelValue'])
</script>
<template>
  <div class="input-segment">
    <label v-for="(option, i) in options" :key="i" :title="option.tooltip">
      {{ option.label ?? option.value ?? option }}
      <input
        type="radio"
        :name="name"
        :checked="(option.value === undefined ? option : option.value) === modelValue"
        :disabled="option.disabled"
        :value="option.value ?? option"
        @change="$emit('update:modelValue', option.value === undefined ? option : option.value)"
      />
    </label>
  </div>
</template>

<style scoped>
.input-segment {
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  background: color-mix(in lab, var(--color-ui), transparent 90%);
  border-radius: var(--border-radius);
  padding: 2px;
  gap: 2px;

  label {
    border-radius: var(--border-radius);

    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:has(input:checked),
    &:hover {
      background: color-mix(in lab, var(--color-ui), transparent 70%);
      color: var(--ui-accent-deep);
    }

    input {
      appearance: none;
    }
  }
}
</style>
