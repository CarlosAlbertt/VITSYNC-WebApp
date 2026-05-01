<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Header />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Cargando especialidad...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage || !especialidad" class="flex-1 flex flex-col items-center justify-center py-20">
      <p class="text-red-600 text-xl font-semibold mb-4">{{ errorMessage || 'Especialidad no encontrada' }}</p>
      <router-link to="/especialidades" class="text-teal-600 hover:underline">Volver a Especialidades</router-link>
    </div>

    <template v-else>
    <!-- Page Header -->
    <section class="bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <nav class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <router-link to="/" class="hover:text-teal-600 transition-colors">Inicio</router-link>
          / <router-link to="/especialidades" class="hover:text-teal-600 transition-colors">Especialidades</router-link>
          / <span class="text-teal-600 font-semibold">{{ especialidad.nombre }}</span>
        </nav>
        <div class="flex items-center gap-4">
          <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">{{ especialidad.nombre }}</h1>
          <span :class="getTipoBadgeClass(especialidad.tipo)" class="px-3 py-1 rounded-full text-xs font-semibold">
            {{ especialidad.tipo }}
          </span>
        </div>
        <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
          {{ especialidad.descripcion }}
        </p>
      </div>
    </section>

      <!-- Specialists Section -->
      <section class="py-16 flex-1">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Especialistas en {{ especialidad.nombre }}
            </h2>
            <span class="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 py-1 px-4 rounded-full font-medium">
              {{ especialidad.medicos?.length || 0 }} disponibles
            </span>
          </div>

          <!-- Empty State -->
          <div v-if="!especialidad.medicos || especialidad.medicos.length === 0" 
               class="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <svg class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p class="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">Sin especialistas por el momento</p>
            <p class="text-gray-400 dark:text-gray-500">Actualmente no tenemos médicos asignados a esta especialidad.</p>
          </div>

          <!-- Doctors Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="doctor in especialidad.medicos" :key="doctor.id"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden group">

              <!-- Card Header with avatar -->
              <div class="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 px-6 pt-6 pb-10 relative">
                <div
                  class="absolute -bottom-8 left-6 h-16 w-16 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-700 shadow-md flex items-center justify-center overflow-hidden">
                  <img v-if="doctor.fotoUrl" :src="doctor.fotoUrl" :alt="doctor.nombre || fullName(doctor)"
                    class="h-full w-full object-cover" />
                  <span v-else class="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {{ (doctor.nombre || doctor.name)?.charAt(0)?.toUpperCase() || '?' }}
                  </span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="pt-12 px-6 pb-6 flex flex-col grow">
                <!-- Name -->
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Dr/a. {{ doctor.nombre || fullName(doctor) }}
                </h3>

                <!-- Colegiado -->
                <p v-if="doctor.numeroColegiado" class="text-xs text-gray-400 dark:text-gray-500 font-mono mb-3">
                  Nº Col. {{ doctor.numeroColegiado }}
                </p>

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

                <button class="mt-6 w-full bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white dark:bg-gray-700 dark:text-teal-400 dark:hover:bg-teal-600 dark:hover:text-white font-semibold py-2.5 rounded-lg transition-colors duration-300">
                  Solicitar Cita
                </button>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Header from '../components/HeaderComponent.vue';
import Footer from '../components/FooterComponent.vue';
import { fetchEspecialidades, fetchEspecialidadById } from '../store/especialidades';
import { fetchMedicos } from '../store/medicos';

const route = useRoute();
const especialidad = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);

const fullName = (d) => [d.name, d.firstName, d.secondName].filter(Boolean).join(' ');

const getTipoBadgeClass = (tipo) => {
  const classes = {
    'MEDICA': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'QUIRURGICA': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'DIAGNOSTICO': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'GENERAL': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'UNIDAD': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  };
  return classes[tipo] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
};

const loadEspecialidad = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = null;
    const espId = parseInt(route.params.id);
    
    // Fetch both specialty info and all doctors to ensure we have full details (bio, email, etc.)
    const [especialidadesData, allDoctors] = await Promise.all([
      fetchEspecialidades(),
      fetchMedicos()
    ]);

    const found = especialidadesData.find(e => e.id === espId);
    
    if (found) {
      // Enrich specialty medicos with full data from allDoctors
      if (found.medicos) {
        found.medicos = allDoctors.filter(d => d.especialidad?.id === espId);
      }
      especialidad.value = found;
    } else {
      errorMessage.value = 'No se encontró la especialidad solicitada.';
    }
  } catch (err) {
    console.error('Error loading specialty:', err);
    errorMessage.value = 'Error al cargar la información. Inténtalo de nuevo.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadEspecialidad);
</script>
