<template>
  <div class="step-container flex flex-col h-full min-h-[300px]">
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Selecciona Fecha y Hora</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
      <!-- Calendario -->
      <div>
        <h3 class="font-semibold text-slate-700 dark:text-slate-300 mb-3">Fecha de la cita</h3>
        <DatePicker 
          v-model="selectedDate" 
          inline 
          auto-apply
          :enable-time-picker="false"
          :min-date="new Date()"
          @update:model-value="loadSlots"
          class="custom-datepicker"
        />
      </div>

      <!-- Horarios -->
      <div>
        <h3 class="font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Horarios disponibles
          <span v-if="selectedDate" class="text-xs font-normal text-slate-500 ml-2">
            para {{ formatDate(selectedDate) }}
          </span>
        </h3>
        
        <div v-if="!selectedDate" class="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700">
          Selecciona una fecha en el calendario para ver los horarios disponibles.
        </div>
        
        <div v-else-if="loadingSlots" class="text-center py-6">
          <div class="inline-block animate-spin text-xl mb-2 text-accent">⟳</div>
          <p class="text-sm text-slate-500">Cargando horarios...</p>
        </div>
        
        <div v-else-if="slots.length === 0" class="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-slate-500 dark:text-slate-400">
          No hay horarios disponibles para esta fecha.
        </div>

        <div v-else class="grid grid-cols-3 gap-2">
          <button 
            v-for="time in slots" 
            :key="time"
            @click="selectedTime = time"
            :class="[
              'py-2 px-1 rounded-lg border font-medium text-sm transition-colors',
              selectedTime === time 
                ? 'bg-accent text-white border-accent' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-accent'
            ]"
          >
            {{ time }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between mt-auto pt-4">
      <button @click="$emit('back')" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium py-2 px-4 rounded-lg">Atrás</button>
      <button 
        @click="confirmSelection" 
        :disabled="!selectedDate || !selectedTime"
        class="bg-accent hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Continuar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { fetchHorariosDisponibles } from '../../store/citas';
import { VueDatePicker as DatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps(['bookingData']);
const emit = defineEmits(['next', 'back']);

const selectedDate = ref(props.bookingData.date);
const selectedTime = ref(props.bookingData.time);
const slots = ref([]);
const loadingSlots = ref(false);

const loadSlots = async () => {
  if (!selectedDate.value) return;
  loadingSlots.value = true;
  selectedTime.value = null;
  try {
    slots.value = await fetchHorariosDisponibles(props.bookingData.doctor.id, selectedDate.value);
  } catch (error) {
    console.error('Error loading slots:', error);
    slots.value = [];
  } finally {
    loadingSlots.value = false;
  }
};

const confirmSelection = () => {
  emit('next', { date: selectedDate.value, time: selectedTime.value });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

// Si ya había fecha guardada de un paso anterior, carga sus slots
if (selectedDate.value) {
  loadSlots();
}
</script>

<style>
/* Forzar estilos del datepicker cuando VitSync está en modo oscuro */
html.dark .custom-datepicker,
html.dark .dp__theme_light,
html.dark .dp__main {
   --dp-background-color: var(--bg-surface) !important;
   --dp-text-color: var(--text-primary) !important;
   --dp-hover-color: var(--bg-elevated) !important;
   --dp-hover-text-color: var(--text-primary) !important;
   --dp-hover-icon-color: var(--text-primary) !important;
   --dp-primary-color: var(--accent) !important;
   --dp-primary-disabled-color: #61a8a8 !important;
   --dp-primary-text-color: #ffffff !important;
   --dp-secondary-color: var(--text-muted) !important;
   --dp-border-color: var(--border) !important;
   --dp-menu-border-color: var(--border) !important;
   --dp-border-color-hover: var(--accent) !important;
   --dp-disabled-color: var(--bg-elevated) !important;
   --dp-scroll-bar-background: var(--bg-elevated) !important;
   --dp-scroll-bar-color: var(--border) !important;
   --dp-icon-color: var(--text-secondary) !important;
   --dp-tooltip-color: var(--text-primary) !important;
}
</style>
