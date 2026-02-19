<template>
  <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div class="flex-1 pr-4">
      <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ label }}</p>
      <p v-if="description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ description }}</p>
    </div>
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      @click="$emit('update:modelValue', !modelValue)"
      class="relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex-shrink-0"
      :class="modelValue ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'"
    >
      <span
        class="inline-block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow transform transition-transform duration-200"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      />
    </button>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  description: { type: String, default: null },
  modelValue: Boolean
});
defineEmits(['update:modelValue']);
</script>
