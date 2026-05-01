<template>
  <div class="step-container flex flex-col h-full min-h-[300px]">
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Confirma tu cita</h2>
    
    <div class="flex-1">
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
        <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Resumen de Reserva</h3>
        
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-slate-400">Hospital:</span>
            <span class="font-medium text-slate-800 dark:text-white text-right">{{ bookingData.location?.name || '---' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-slate-400">Especialidad:</span>
            <span class="font-medium text-slate-800 dark:text-white">{{ bookingData.specialtyName || bookingData.specialty?.nombre || '---' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-slate-400">Médico:</span>
            <span class="font-medium text-slate-800 dark:text-white">{{ bookingData.doctor?.name || '---' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-slate-400">Fecha y Hora:</span>
            <span class="font-bold text-accent">{{ formatDate(bookingData.date) }} a las {{ bookingData.time || '---' }}</span>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Motivo de la consulta (Opcional)</label>
        <textarea 
          v-model="reason" 
          rows="3" 
          placeholder="Ayuda al especialista a conocer tus síntomas de antemano..."
          class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
        ></textarea>
      </div>
    </div>

    <div class="mt-8 flex justify-between items-center mt-auto pt-4">
      <button @click="$emit('back')" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium py-2 px-4 rounded-lg">Atrás</button>
      
      <button 
        @click="submit" 
        :disabled="isSubmitting"
        class="bg-accent hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-70 flex items-center"
      >
        <span v-if="isSubmitting" class="animate-spin mr-2">↻</span>
        {{ isSubmitting ? 'Confirmando...' : 'Confirmar Reserva' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['bookingData']);
const emit = defineEmits(['submit', 'back']);

const reason = ref(props.bookingData.reason || '');
const isSubmitting = ref(false);

const formatDate = (dateString) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const submit = () => {
  isSubmitting.value = true;
  emit('submit', { reason: reason.value });
};
</script>
