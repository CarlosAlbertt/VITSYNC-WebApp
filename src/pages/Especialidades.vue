<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Header />
    
    <!-- Page Header -->
    <section class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <nav class="text-sm text-gray-600 mb-4">
          <span>Inicio</span> / <span class="text-teal-600 font-semibold">Especialidades</span>
        </nav>
        <h1 class="text-4xl font-bold text-gray-800">Índice de Especialidades</h1>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando especialidades...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="flex-1 flex items-center justify-center py-20">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ errorMessage }}</p>
        <button @click="loadEspecialidades" class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
          Reintentar
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Alphabetical Index -->
      <section class="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex flex-wrap gap-3 justify-center">
            <button 
              v-for="letter in alphabet" 
              :key="letter"
              @click="scrollToLetter(letter)"
              :class="[
                'w-10 h-10 rounded-lg font-semibold transition-all duration-200',
                hasSpecialtiesForLetter(letter) 
                  ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              ]"
              :disabled="!hasSpecialtiesForLetter(letter)"
            >
              {{ letter }}
            </button>
          </div>
        </div>
      </section>

      <!-- Specialties Grid -->
      <section class="py-12">
        <div class="max-w-7xl mx-auto px-6">
          <!-- Group specialties by first letter -->
          <div v-for="letter in activeLetters" :key="letter" class="mb-12">
            <h2 :id="`letter-${letter}`" class="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-teal-600 pb-2">
              {{ letter }}
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="especialidad in getSpecialtiesByLetter(letter)" 
                :key="especialidad.id"
                class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <!-- Specialty Image/Icon -->
                <div class="h-48 overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                  <div class="text-6xl text-teal-600">
                    {{ getEspecialidadIcon(especialidad.tipo) }}
                  </div>
                </div>
                
                <!-- Specialty Info -->
                <div class="p-6 flex flex-col flex-grow">
                  <h3 class="text-xl font-bold text-gray-800 mb-2">{{ especialidad.nombre }}</h3>
                  <p class="text-sm text-gray-600 mb-4">{{ especialidad.descripcion }}</p>
                  
                  <!-- Tipo badge -->
                  <span :class="getTipoBadgeClass(especialidad.tipo)" class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit">
                    {{ especialidad.tipo }}
                  </span>
                  
                  <!-- Doctors List -->
                  <div v-if="especialidad.medicos && especialidad.medicos.length > 0" class="mb-4">
                    <p class="text-sm font-semibold text-gray-600 mb-2">Especialistas disponibles:</p>
                    <ul class="text-sm text-gray-600 space-y-1">
                      <li v-for="medico in especialidad.medicos" :key="medico.id" class="flex items-center">
                        <span class="w-2 h-2 bg-teal-600 rounded-full mr-2"></span>
                        Dr. {{ medico.nombre }}
                      </li>
                    </ul>
                  </div>
                  <div v-else class="mb-4">
                    <p class="text-sm text-gray-400 italic">Sin especialistas asignados</p>
                  </div>
                  
                  <!-- Action Buttons - Fixed at bottom -->
                  <div class="flex gap-3 mt-auto">
                    <button class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300">
                      Pedir cita
                    </button>
                    <button class="w-12 h-12 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 flex items-center justify-center">
                      →
                    </button>
                  </div>
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

<script>
import Header from '../components/HeaderComponent.vue';
import Footer from '../components/FooterComponent.vue';
import { fetchEspecialidades } from '../store/especialidades';

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      especialidades: [],
      isLoading: false,
      errorMessage: null,
    };
  },
  computed: {
    activeLetters() {
      const letters = [...new Set(this.especialidades.map(e => e.nombre[0].toUpperCase()))];
      return letters.sort();
    }
  },
  methods: {
    async loadEspecialidades() {
      try {
        this.isLoading = true;
        this.errorMessage = null;
        this.especialidades = await fetchEspecialidades();
      } catch (error) {
        this.errorMessage = 'Error al cargar las especialidades. Por favor, intenta de nuevo.';
      } finally {
        this.isLoading = false;
      }
    },
    
    hasSpecialtiesForLetter(letter) {
      return this.especialidades.some(e => e.nombre[0].toUpperCase() === letter);
    },
    
    getSpecialtiesByLetter(letter) {
      return this.especialidades.filter(e => e.nombre[0].toUpperCase() === letter);
    },
    
    scrollToLetter(letter) {
      if (this.hasSpecialtiesForLetter(letter)) {
        const element = document.getElementById(`letter-${letter}`);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    },
    
    getEspecialidadIcon(tipo) {
      const icons = {
        'MEDICA': '🏥',
        'QUIRURGICA': '🔬',
        'DIAGNOSTICO': '📋',
        'GENERAL': '👨‍⚕️',
        'UNIDAD': '🏨'
      };
      return icons[tipo] || '🏥';
    },
    
    getTipoBadgeClass(tipo) {
      const classes = {
        'MEDICA': 'bg-blue-100 text-blue-800',
        'QUIRURGICA': 'bg-red-100 text-red-800',
        'DIAGNOSTICO': 'bg-yellow-100 text-yellow-800',
        'GENERAL': 'bg-green-100 text-green-800',
        'UNIDAD': 'bg-purple-100 text-purple-800'
      };
      return classes[tipo] || 'bg-gray-100 text-gray-800';
    }
  },
  mounted() {
    this.loadEspecialidades();
  }
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>