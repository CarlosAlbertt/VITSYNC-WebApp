<template>
  <div class="step-container">
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Selecciona Fecha y Hora</h2>
    
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Calendario -->
      <div class="flex-1">
        <h3 class="font-semibold text-slate-700 dark:text-slate-300 mb-3">Día de la cita</h3>
        <!-- Integración del Vue Datepicker de forma en línea -->
        <DatePicker 
          v-model="selectedDate" 
          inline 
          auto-apply 
          :enable-time-picker="false" 
          @update:model-value="loadSlots"
          dark
        />
      </div>

      <!-- Horas -->
      <div class="flex-1">
        <h3 class="font-semibold text-slate-700 dark:text-slate-300 mb-3">Horario disponible</h3>
        
        <div v-if="!selectedDate" class="text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          Por favor, selecciona un día en el calendario primero.
        </div>
        
        <div v-else-if="loadingSlots" class="text-sm text-slate-500 py-4">
          Cargando horarios...
        </div>
        
        <div v-else class="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
          <button 
            v-for="time in slots" 
            :key="time"
            @click="selectedTime = time"
            :class="[
              'py-2 rounded-lg font-medium border transition-colors',
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

    <div class="mt-8 flex justify-between">
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
  selectedTime.value = null; // reset time
  // Llama al backend (mock) enviando el id del médico y la fecha
  slots.value = await fetchHorariosDisponibles(props.bookingData.doctor.id, selectedDate.value);
  loadingSlots.value = false;
};

const confirmSelection = () => {
  emit('next', { date: selectedDate.value, time: selectedTime.value });
};

// Si ya había fecha guardada de un paso anterior, carga sus slots
if (selectedDate.value) {
  loadSlots();
}
</script>

<style>
/* Ajustar estilos oscuros del datepicker para que coincidan con VitSync */
.dp__theme_dark {
   --dp-background-color: var(--bg-surface);
   --dp-text-color: var(--text-primary);
   --dp-hover-color: var(--bg-elevated);
   --dp-primary-color: var(--accent);
}
</style>
