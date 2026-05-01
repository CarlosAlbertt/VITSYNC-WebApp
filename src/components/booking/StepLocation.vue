<template>
  <div class="step-container flex flex-col h-full min-h-[300px]">
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-6">Selecciona el Hospital o Centro</h2>
    
    <div class="flex-1">
      <div v-if="loading" class="text-center py-10">Cargando centros...</div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="loc in locations" 
          :key="loc.id"
          @click="selectLocation(loc)"
          :class="[
            'p-6 rounded-xl border-2 cursor-pointer transition-all duration-200',
            selected?.id === loc.id 
              ? 'border-accent bg-accent/5 dark:bg-accent/10' 
              : 'border-slate-200 dark:border-slate-700 hover:border-accent/50 bg-white dark:bg-slate-800'
          ]"
        >
          <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-1">{{ loc.name }}</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm flex items-center">
            <svg class="w-4 h-4 mr-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {{ loc.address }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-end mt-auto pt-4">
      <button 
        @click="$emit('next', { location: selected })" 
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
import { getLocations } from '../../store/hospitales';

const props = defineProps(['bookingData']);
const emit = defineEmits(['next']);

const locations = ref([]);
const loading = ref(true);
const selected = ref(props.bookingData.location);

onMounted(async () => {
  locations.value = await getLocations();
  loading.value = false;
});

const selectLocation = (loc) => {
  selected.value = loc;
};
</script>
