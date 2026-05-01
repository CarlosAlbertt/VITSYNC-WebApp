<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 transition-all hover:shadow-md group">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="font-semibold text-gray-800 dark:text-gray-100 text-sm group-hover:text-teal-600 transition-colors">{{ report.title }}</h4>
        </div>
        <p class="text-xs text-teal-600 dark:text-teal-400 font-medium">{{ report.specialty }} · {{ report.doctor }}</p>
      </div>
      <button 
        @click="$emit('filter-status', report.status)"
        class="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ml-2 transition-transform hover:scale-105 active:scale-95"
        :class="statusClass"
        title="Filtrar por este estado"
      >
        {{ report.status }}
      </button>
    </div>

    <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-5">
      <span class="flex items-center gap-1">
        <span class="opacity-50">📅</span> {{ formatDate(report.date) }}
      </span>
      <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md font-medium">{{ report.type }}</span>
    </div>

    <!-- Acciones -->
    <div class="flex gap-2 flex-wrap pt-4 border-t border-gray-50 dark:border-gray-700/50">
      <button
        @click="$emit('view', report)"
        class="px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-600 dark:hover:text-white transition-all"
      >
        Ver detalle
      </button>
      <button
        @click="$emit('download', report)"
        class="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
      >
        Descargar
      </button>
      <button
        @click="$emit('toggle-favorite', report)"
        class="p-1.5 text-xs font-medium rounded-lg border border-gray-200 transition-all"
        :class="report.favorite
          ? 'text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
          : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:border-gray-600'"
      >
        {{ report.favorite ? '⭐' : '☆' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  report: { type: Object, required: true }
});
defineEmits(['view', 'download', 'share', 'toggle-favorite', 'filter-status']);

const statusClass = computed(() => ({
  'Disponible': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/50',
  'Pendiente':  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200/50',
  'Revisado':   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Archivado':  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
}[props.report.status] || 'bg-gray-100 text-gray-600'));

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>
