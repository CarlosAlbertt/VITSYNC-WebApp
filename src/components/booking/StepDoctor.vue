<template>
  <div class="step-container">
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">Elige a tu profesional</h2>
    <p class="text-slate-500 dark:text-slate-400 mb-6">Especialistas en {{ bookingData.specialty }}</p>
    
    <div v-if="loading" class="text-center py-10">Buscando especialistas...</div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Opción genérica -->
      <div 
        @click="selected = { id: 'any', name: 'Cualquier profesional disponible' }"
        :class="[
          'p-4 rounded-xl border-2 cursor-pointer flex items-center transition-all duration-200',
          selected?.id === 'any' ? 'border-accent bg-accent/5 dark:bg-accent/10' : 'border-slate-200 dark:border-slate-700 hover:border-accent/50 bg-white dark:bg-slate-800'
        ]"
      >
        <div class="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-4">
           <span class="text-2xl">⚡</span>
        </div>
        <span class="font-bold text-slate-800 dark:text-white">Cualquier profesional disponible</span>
      </div>

      <!-- Médicos específicos -->
      <div 
        v-for="medico in doctors" 
        :key="medico.id"
        @click="selected = medico"
        :class="[
          'p-4 rounded-xl border-2 cursor-pointer flex items-center transition-all duration-200',
          selected?.id === medico.id ? 'border-accent bg-accent/5 dark:bg-accent/10' : 'border-slate-200 dark:border-slate-700 hover:border-accent/50 bg-white dark:bg-slate-800'
        ]"
      >
        <img :src="medico.image" class="w-12 h-12 rounded-full object-cover mr-4" />
        <div>
          <h3 class="font-bold text-slate-800 dark:text-white">Dr. {{ medico.name }}</h3>
          <p class="text-xs text-accent font-semibold">{{ medico.especialidad }}</p>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <button @click="$emit('back')" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium py-2 px-4 rounded-lg">Atrás</button>
      <button 
        @click="$emit('next', { doctor: selected })" 
        :disabled="!selected"
        class="bg-accent hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Continuar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMedicosByEspecialidad } from '../../store/citas';

const props = defineProps(['bookingData']);
const emit = defineEmits(['next', 'back']);

const doctors = ref([]);
const loading = ref(true);
const selected = ref(props.bookingData.doctor);

onMounted(async () => {
  doctors.value = await getMedicosByEspecialidad(props.bookingData.specialty);
  loading.value = false;
});
</script>
