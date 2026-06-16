<template>
  <div class="step-container flex flex-col h-full min-h-[300px]">
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Elige a tu profesional</h2>
    
    <div class="flex-1">
      <div v-if="loading" class="text-center py-10">Buscando especialistas...</div>
      
      <div v-else-if="doctors.length === 0" class="text-center py-10">
        <p class="text-slate-500 dark:text-slate-400 mb-2">No se encontraron especialistas</p>
        <p class="text-sm text-slate-400 dark:text-slate-500">Prueba con otra especialidad</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Médicos desde la BD -->
        <div 
          v-for="medico in doctors" 
          :key="medico.id"
          @click="selected = medico"
          :class="[
            'p-4 rounded-xl border-2 cursor-pointer flex items-center transition-all duration-200',
            selected?.id === medico.id ? 'border-accent bg-accent/5 dark:bg-accent/10' : 'border-slate-200 dark:border-slate-700 hover:border-accent/50 bg-white dark:bg-slate-800'
          ]"
        >
          <img :src="medico.fotoUrl || '/images/doctors/Usuario.png'" class="w-12 h-12 rounded-full object-cover mr-4" />
          <div>
            <h3 class="font-bold text-slate-800 dark:text-white">Dr. {{ medico.name }} {{ medico.firstName || '' }}</h3>
            <p class="text-xs text-accent font-semibold">{{ medico.especialidad?.nombre || '' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between mt-auto pt-4">
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
  if (!props.bookingData.specialty) {
    emit('back');
    loading.value = false;
    return;
  }
  try {
    doctors.value = await getMedicosByEspecialidad(props.bookingData.specialty);
  } catch (error) {
    console.error('Error al cargar médicos:', error);
    doctors.value = [];
  } finally {
    loading.value = false;
  }
});
</script>
