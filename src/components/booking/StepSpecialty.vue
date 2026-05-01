<template>
  <div class="step-container flex flex-col h-full min-h-[300px]">
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">¿Qué especialidad necesitas?</h2>
    <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">Selecciona la especialidad para tu consulta</p>
    
    <div class="flex-1 flex flex-col">
      <!-- Buscador -->
      <div class="relative mb-5 shrink-0">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar especialidad..."
          class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors placeholder:text-slate-400"
        />
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-10 text-slate-500 dark:text-slate-400">
        <div class="inline-block animate-spin text-2xl mb-2">⟳</div>
        <p class="text-sm">Cargando especialidades...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-10">
        <p class="text-red-500 dark:text-red-400 mb-3 text-sm">Error al cargar las especialidades</p>
        <button @click="loadSpecialties" class="text-accent hover:text-teal-700 font-medium text-sm">Reintentar</button>
      </div>

      <!-- Grid de especialidades -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-1 flex-1">
        <div 
          v-for="spec in filteredSpecialties" 
          :key="spec.id || spec"
          @click="selected = spec"
          :class="[
            'p-4 rounded-xl border-2 cursor-pointer text-center transition-all duration-200',
            isSelected(spec) 
              ? 'border-accent bg-accent/5 text-accent dark:bg-accent/10 font-bold' 
              : 'border-slate-200 dark:border-slate-700 hover:border-accent/50 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800'
          ]"
        >
          {{ getSpecName(spec) }}
        </div>
        
        <!-- Sin resultados -->
        <div v-if="filteredSpecialties.length === 0" class="col-span-full text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
          No se encontraron especialidades para "{{ searchQuery }}"
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between mt-auto pt-4">
      <button @click="$emit('back')" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white font-medium py-2 px-4 rounded-lg">Atrás</button>
      <button 
        @click="$emit('next', { specialty: selected, specialtyName: getSelectedName() })" 
        :disabled="!selected"
        class="bg-accent hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Continuar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchEspecialidades, especialidades, isLoading, error } from '../../store/especialidades';

const props = defineProps(['bookingData']);
const emit = defineEmits(['next', 'back']);

const selected = ref(null);
const searchQuery = ref('');

// Inicializar selección previa si hay una
if (props.bookingData.specialty) {
  selected.value = props.bookingData.specialty;
}

// Obtener el nombre legible de una especialidad (puede ser string u objeto)
const getSpecName = (spec) => {
  if (typeof spec === 'string') return spec;
  return spec.nombre || spec.name || spec.label || 'Sin nombre';
};

// Obtener el nombre de la selección actual para emitir al padre
const getSelectedName = () => {
  if (!selected.value) return null;
  return getSpecName(selected.value);
};

// Comprobar si una especialidad está seleccionada
const isSelected = (spec) => {
  if (!selected.value) return false;
  if (typeof selected.value === 'string' && typeof spec === 'string') {
    return selected.value === spec;
  }
  if (typeof selected.value === 'object' && typeof spec === 'object') {
    return selected.value.id === spec.id;
  }
  // Comparar por nombre si los tipos no coinciden
  return getSpecName(selected.value) === getSpecName(spec);
};

// Filtrar por búsqueda
const filteredSpecialties = computed(() => {
  const list = especialidades.value;
  if (!searchQuery.value.trim()) return list;
  const q = searchQuery.value.toLowerCase().trim();
  return list.filter(spec => getSpecName(spec).toLowerCase().includes(q));
});

const loadSpecialties = async () => {
  try {
    await fetchEspecialidades();
  } catch (err) {
    console.error('Error cargando especialidades:', err);
  }
};

onMounted(() => {
  if (!especialidades.value.length) {
    loadSpecialties();
  }
});
</script>
