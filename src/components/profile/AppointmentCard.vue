<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 transition-all hover:shadow-md">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{{ appointment.doctor }}</h4>
        </div>
        <p class="text-xs text-teal-600 dark:text-teal-400 font-medium">{{ appointment.specialty }}</p>
      </div>
      <span class="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ml-2" :class="statusClass">
        {{ appointment.status }}
      </span>
    </div>

    <!-- Detalles -->
    <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 mb-4">
      <div class="flex items-center gap-1">
        <span>{{ formatDate(appointment.date) }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span>{{ appointment.time }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span>{{ appointment.type }}</span>
      </div>
      <div v-if="appointment.location" class="flex items-center gap-1">
        <span>📍</span>
        <span class="truncate">{{ appointment.location }}</span>
      </div>
    </div>

    <p v-if="appointment.reason" class="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
      "{{ appointment.reason }}"
    </p>

    <!-- Acciones (solo para citas futuras activas) -->
    <div v-if="showActions" class="flex gap-2 flex-wrap">
      <button
        @click="$emit('cancel', appointment)"
        class="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
      >
        Cancelar
      </button>
    </div>
    <div v-else-if="appointment.status === 'Completada'" class="text-xs text-gray-400 italic">
      Cita completada
    </div>
    <div v-else-if="appointment.status === 'Cancelada'" class="text-xs text-red-400 italic">
      Cita cancelada
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  appointment: { type: Object, required: true }
});
defineEmits(['cancel']);

const showActions = computed(() => ['Programada', 'Confirmada'].includes(props.appointment.status));

const typeIcon = computed(() => props.appointment.type === 'Telemedicina' ? '💻' : '🏥');

const statusClass = computed(() => ({
  'Programada':  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Confirmada':  'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'Completada':  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  'Cancelada':   'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'En curso':    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
}[props.appointment.status] || 'bg-gray-100 text-gray-600'));

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>
