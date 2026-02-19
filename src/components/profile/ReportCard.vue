<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 transition-all hover:shadow-md">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="font-semibold text-gray-800 dark:text-gray-100 text-sm">{{ report.title }}</h4>
        </div>
        <p class="text-xs text-teal-600 dark:text-teal-400">{{ report.specialty }} · {{ report.doctor }}</p>
      </div>
      <span class="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ml-2" :class="statusClass">
        {{ report.status }}
      </span>
    </div>

    <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
      <span>📅 {{ formatDate(report.date) }}</span>
      <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">{{ report.type }}</span>
    </div>

    <!-- Acciones -->
    <div class="flex gap-2 flex-wrap">
      <button
        @click="$emit('view', report)"
        class="px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50 transition-colors"
      >
        👁 Ver detalle
      </button>
      <button
        @click="$emit('download', report)"
        class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        ⬇ Descargar PDF
      </button>
      <button
        @click="$emit('toggle-favorite', report)"
        class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 transition-colors"
        :class="report.favorite
          ? 'text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'"
      >
        {{ report.favorite ? '★' : '☆' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  report: { type: Object, required: true }
});
defineEmits(['view', 'download', 'toggle-favorite']);

const statusClass = computed(() => ({
  'Disponible':         'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Revisado':           'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  'Archivado':          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Pendiente de revisión': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
}[props.report.status] || 'bg-gray-100 text-gray-600'));

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>
