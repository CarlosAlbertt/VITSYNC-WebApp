<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Header />

    <!-- Page Header -->
    <section class="bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <nav class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <router-link to="/" class="hover:text-teal-600 transition-colors">Inicio</router-link>
          / <span class="text-teal-600 font-semibold">Cuadro médico</span>
        </nav>
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">Cuadro Médico</h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl">
          Conoce a nuestros profesionales. Encuentra al especialista que necesitas por nombre o especialidad.
        </p>
      </div>
    </section>

    <!-- Search & Filters -->
    <section class="bg-white dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-10 shadow-sm transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6 pb-8 flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="relative flex-1 max-w-lg">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input v-model="searchQuery" type="text"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            placeholder="Buscar por nombre o especialidad..." />
        </div>
        <!-- Specialty Filter -->
        <select v-model="filterEspecialidad"
          class="border border-gray-300 dark:border-gray-600 rounded-lg text-sm px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors">
          <option value="all">Todas las especialidades</option>
          <option v-for="esp in especialidadesList" :key="esp.id" :value="esp.id">
            {{ esp.nombre }}
          </option>
        </select>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Cargando cuadro médico...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="flex-1 flex items-center justify-center py-20">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ errorMessage }}</p>
        <button @click="loadData"
          class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Reintentar
        </button>
      </div>
    </div>

    <!-- Doctors Grid -->
    <template v-else>
      <section class="py-12 flex-1">
        <div class="max-w-7xl mx-auto px-6">

          <!-- Results count -->
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ filteredDoctors.length }} {{ filteredDoctors.length === 1 ? 'médico encontrado' : 'médicos encontrados' }}
          </p>

          <!-- Empty State -->
          <div v-if="filteredDoctors.length === 0"
            class="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <svg class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-gray-500 dark:text-gray-400 font-medium">No se encontraron médicos con los filtros seleccionados.</p>
            <button @click="clearFilters"
              class="mt-4 text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors">
              Limpiar filtros
            </button>
          </div>

          <!-- Cards -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="doctor in filteredDoctors" :key="doctor.id"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden group">

              <!-- Card Header with avatar -->
              <div class="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 px-6 pt-6 pb-10 relative">
                <div
                  class="absolute -bottom-8 left-6 h-16 w-16 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-700 shadow-md flex items-center justify-center overflow-hidden">
                  <img v-if="doctor.fotoUrl" :src="doctor.fotoUrl" :alt="fullName(doctor)"
                    class="h-full w-full object-cover" />
                  <span v-else class="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {{ doctor.name?.charAt(0)?.toUpperCase() || '?' }}
                  </span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="pt-12 px-6 pb-6 flex flex-col grow">
                <!-- Name -->
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                  {{ fullName(doctor) }}
                </h3>

                <!-- Colegiado -->
                <p v-if="doctor.numeroColegiado" class="text-xs text-gray-400 dark:text-gray-500 font-mono mb-3">
                  Nº Col. {{ doctor.numeroColegiado }}
                </p>

                <!-- Specialty badge -->
                <div class="mb-4">
                  <span v-if="doctor.especialidad"
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                    {{ doctor.especialidad.nombre }}
                  </span>
                  <span v-else class="text-xs text-gray-400 italic">Sin especialidad asignada</span>
                </div>

                <!-- Bio excerpt -->
                <p v-if="doctor.bio" class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {{ doctor.bio }}
                </p>

                <!-- Contact Info -->
                <div class="mt-auto space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <a v-if="doctor.email" :href="`mailto:${doctor.email}`"
                    class="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group/link">
                    <svg class="h-4 w-4 mr-2 text-gray-400 group-hover/link:text-teal-500 flex-shrink-0" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="truncate">{{ doctor.email }}</span>
                  </a>
                  <a v-if="doctor.phone" :href="`tel:${doctor.phone}`"
                    class="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group/link">
                    <svg class="h-4 w-4 mr-2 text-gray-400 group-hover/link:text-teal-500 flex-shrink-0" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{{ doctor.phone }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </template>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Header from '../components/HeaderComponent.vue';
import Footer from '../components/FooterComponent.vue';
import { fetchMedicos } from '../store/medicos';
import { fetchEspecialidades } from '../store/especialidades';

// ── State ───────────────────────────────────────────────────────────────────
const doctors = ref([]);
const especialidadesList = ref([]);
const loading = ref(false);
const errorMessage = ref(null);
const searchQuery = ref('');
const filterEspecialidad = ref('all');

// ── Helpers ─────────────────────────────────────────────────────────────────
const fullName = (d) => [d.name, d.firstName, d.secondName].filter(Boolean).join(' ');

const clearFilters = () => {
  searchQuery.value = '';
  filterEspecialidad.value = 'all';
};

// ── Data loading ────────────────────────────────────────────────────────────
const loadData = async () => {
  try {
    loading.value = true;
    errorMessage.value = null;
    const [medicosData, especialidadesData] = await Promise.all([
      fetchMedicos(),
      fetchEspecialidades()
    ]);
    doctors.value = medicosData;
    especialidadesList.value = especialidadesData;
  } catch (err) {
    console.error('Error cargando cuadro médico:', err);
    errorMessage.value = 'Error al cargar el cuadro médico. Por favor, intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

// ── Filtering ───────────────────────────────────────────────────────────────
const filteredDoctors = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  return doctors.value.filter(d => {
    const matchSearch = !q
      || fullName(d).toLowerCase().includes(q)
      || d.especialidad?.nombre?.toLowerCase().includes(q);
    const matchEsp = filterEspecialidad.value === 'all'
      || d.especialidad?.id === filterEspecialidad.value;
    return matchSearch && matchEsp;
  });
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
