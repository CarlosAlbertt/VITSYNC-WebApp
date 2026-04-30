<template>
  <div class="step-container">
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">¿Qué especialidad necesitas?</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div 
        v-for="spec in specialties" 
        :key="spec"
        @click="selected = spec"
        :class="[
          'p-4 rounded-xl border-2 cursor-pointer text-center transition-all duration-200',
          selected === spec 
            ? 'border-accent bg-accent/5 text-accent dark:bg-accent/10 font-bold' 
            : 'border-slate-200 dark:border-slate-700 hover:border-accent/50 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800'
        ]"
      >
        {{ spec }}
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <button @click="$emit('back')" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white font-medium py-2 px-4 rounded-lg">Atrás</button>
      <button 
        @click="$emit('next', { specialty: selected })" 
        :disabled="!selected"
        class="bg-accent hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Continuar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['bookingData']);
const emit = defineEmits(['next', 'back']);

// Mock de especialidades, en un futuro vendrán del backend
const specialties = ['Cardiología', 'Pediatría', 'Traumatología', 'Neurología', 'Dermatología', 'Oftalmología'];
const selected = ref(props.bookingData.specialty);
</script>
