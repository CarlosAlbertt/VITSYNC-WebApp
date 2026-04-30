<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Header />

    <!-- Page Header -->
    <section class="bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <nav class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <router-link to="/" class="hover:text-teal-600 transition-colors">Inicio</router-link>
          / <span class="text-teal-600 font-semibold">Enfermedades y Tratamientos</span>
        </nav>
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">Enfermedades y Tratamientos</h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl">
          Encuentra información sobre dolencias comunes, sus tratamientos y el especialista adecuado para tu bienestar.
        </p>
      </div>
    </section>

    <!-- Search Section -->
    <section class="bg-white dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-10 shadow-sm transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6 pb-8">
        <div class="relative max-w-lg">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            v-model="searchQuery" 
            type="text"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            placeholder="Buscar por enfermedad o tratamiento..." 
          />
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 flex-1">
      <div class="max-w-4xl mx-auto px-6">
        
        <div class="mb-8 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Directorio Médico
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Mostrando {{ filteredEnfermedades.length }} resultados
          </span>
        </div>

        <!-- Empty State -->
        <div v-if="filteredEnfermedades.length === 0" 
             class="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="bg-gray-50 dark:bg-gray-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron coincidencias</h3>
          <p class="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Intenta buscar con otros términos o palabras clave. También puedes buscar directamente por especialidad.
          </p>
          <button @click="searchQuery = ''" class="mt-6 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors">
            Limpiar búsqueda
          </button>
        </div>

        <!-- Accordion List -->
        <div v-else class="space-y-4">
          <div 
            v-for="enfermedad in filteredEnfermedades" 
            :key="enfermedad.id"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <!-- Accordion Header -->
            <button 
              @click="toggleAccordion(enfermedad.id)"
              class="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <div class="flex-1 pr-4">
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-teal-600 transition-colors">
                  {{ enfermedad.nombre }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                  Recomendado: <span class="font-medium text-gray-700 dark:text-gray-300">{{ enfermedad.especialidadRelacionada }}</span>
                </p>
              </div>
              <div class="flex-shrink-0 ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 transition-transform duration-300"
                   :class="{'rotate-180 bg-teal-50 dark:bg-teal-900/30 text-teal-600': isExpanded(enfermedad.id)}">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            <!-- Accordion Content -->
            <div 
              v-show="isExpanded(enfermedad.id)"
              class="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-6 py-6"
            >
              <div class="grid md:grid-cols-3 gap-8">
                <div class="md:col-span-2">
                  <h4 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Descripción</h4>
                  <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {{ enfermedad.descripcion }}
                  </p>

                  <h4 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Tratamientos Comunes</h4>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="(tratamiento, index) in enfermedad.tratamientos" 
                      :key="index"
                      class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-700 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800"
                    >
                      <svg class="h-4 w-4 mr-1.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ tratamiento }}
                    </span>
                  </div>
                </div>

                <!-- Action Card -->
                <div class="md:col-span-1 flex flex-col justify-center">
                  <div class="bg-white dark:bg-gray-700 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center h-full flex flex-col justify-center">
                    <h5 class="font-medium text-gray-800 dark:text-gray-100 mb-2">¿Necesitas ayuda con esto?</h5>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">
                      Contamos con especialistas en {{ enfermedad.especialidadRelacionada }}
                    </p>
                    
                    <button 
                      @click="verEspecialidad(enfermedad.especialidadRelacionada)"
                      class="w-full inline-flex items-center justify-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isLoadingEspecialidades"
                    >
                      <span v-if="isLoadingEspecialidades" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cargando...
                      </span>
                      <span v-else>Ver especialistas</span>
                    </button>
                    <p v-if="errorEspecialidadId === enfermedad.id" class="text-xs text-red-500 mt-2">
                      Especialidad no disponible
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../components/HeaderComponent.vue';
import Footer from '../components/FooterComponent.vue';
import { enfermedades } from '../data/enfermedades';
import { fetchEspecialidades } from '../store/especialidades';

const router = useRouter();
const searchQuery = ref('');
const expandedAccordionId = ref(null);
const especialidadesList = ref([]);
const isLoadingEspecialidades = ref(false);
const errorEspecialidadId = ref(null);

onMounted(async () => {
  try {
    isLoadingEspecialidades.value = true;
    especialidadesList.value = await fetchEspecialidades();
  } catch (error) {
    console.error("Error al cargar especialidades:", error);
  } finally {
    isLoadingEspecialidades.value = false;
  }
});

const filteredEnfermedades = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return enfermedades;
  
  return enfermedades.filter(enf => {
    const matchNombre = enf.nombre.toLowerCase().includes(query);
    const matchDesc = enf.descripcion.toLowerCase().includes(query);
    const matchEsp = enf.especialidadRelacionada.toLowerCase().includes(query);
    const matchTratamiento = enf.tratamientos.some(t => t.toLowerCase().includes(query));
    
    return matchNombre || matchDesc || matchEsp || matchTratamiento;
  });
});

const toggleAccordion = (id) => {
  if (expandedAccordionId.value === id) {
    expandedAccordionId.value = null; // Collapse if already open
  } else {
    expandedAccordionId.value = id; // Open new one
  }
};

const isExpanded = (id) => expandedAccordionId.value === id;

const verEspecialidad = (nombreEspecialidad) => {
  errorEspecialidadId.value = null;
  // Buscamos el ID de la especialidad en la lista obtenida del backend
  const especialidad = especialidadesList.value.find(
    e => e.nombre.toLowerCase() === nombreEspecialidad.toLowerCase()
  );
  
  if (especialidad) {
    router.push(`/especialidad/${especialidad.id}`);
  } else {
    // Manejar caso donde la especialidad no existe en la BD
    console.warn(`La especialidad ${nombreEspecialidad} no se encontró en la base de datos.`);
    // Buscar el ID de la enfermedad para mostrar el error en su tarjeta
    const enf = enfermedades.find(e => e.especialidadRelacionada === nombreEspecialidad);
    if (enf) errorEspecialidadId.value = enf.id;
  }
};
</script>

<style scoped>
/* Optional: Add some smooth transition for accordion */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
