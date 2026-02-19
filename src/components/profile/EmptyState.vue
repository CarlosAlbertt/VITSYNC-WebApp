<template>
  <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div class="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4">
      <span class="text-3xl">{{ icon }}</span>
    </div>
    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-5">{{ description }}</p>
    <button
      v-if="actionText"
      @click="$emit('action')"
      class="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
    >
      {{ actionText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Sin datos' },
  description: { type: String, default: 'No hay elementos para mostrar.' },
  actionText: { type: String, default: null }
});
defineEmits(['action']);
</script>
