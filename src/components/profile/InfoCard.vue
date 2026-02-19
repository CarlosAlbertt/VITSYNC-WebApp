<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-4 transition-colors">
    <h3 v-if="title" class="text-sm font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-4 flex items-center gap-2">
      <span v-if="icon">{{ icon }}</span>
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: null },
  icon: { type: String, default: null }
});
</script>
