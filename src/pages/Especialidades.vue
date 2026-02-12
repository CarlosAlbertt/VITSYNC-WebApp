<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Header />

    <!-- Page Header -->
    <section class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <nav class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>Inicio</span> / <span class="text-teal-600 font-semibold">Especialidades</span>
        </nav>
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">Índice de Especialidades</h1>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Cargando especialidades...</p>
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
      <section
        class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10 shadow-sm transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex flex-wrap gap-3 justify-center">
            <button v-for="letter in alphabet" :key="letter" @click="scrollToLetter(letter)" :class="[
              'w-10 h-10 rounded-lg font-semibold transition-all duration-200',
              hasSpecialtiesForLetter(letter)
                ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            ]" :disabled="!hasSpecialtiesForLetter(letter)">
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
            <h2 :id="`letter-${letter}`"
              class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b-2 border-teal-600 pb-2">
              {{ letter }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="especialidad in getSpecialtiesByLetter(letter)" 
                :key="especialidad.id"
                class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <!-- Specialty Icon (Updated) -->
                <div class="h-40 bg-white flex items-center justify-center relative group border-b border-gray-100 overflow-hidden">
                  <img 
                    :src="getEspecialidadImage(especialidad.nombre, especialidad.tipo)" 
                    :alt="especialidad.nombre"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <!-- Specialty Info -->
                <div class="p-6 flex flex-col grow">
                  <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ especialidad.nombre }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ especialidad.descripcion }}</p>

                  <!-- Tipo badge -->
                  <span :class="getTipoBadgeClass(especialidad.tipo)"
                    class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit">
                    {{ especialidad.tipo }}
                  </span>

                  <!-- Doctors List -->
                  <div v-if="especialidad.medicos && especialidad.medicos.length > 0" class="mb-4">
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Especialistas disponibles:
                    </p>
                    <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
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
                    <button
                      class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300">
                      Pedir cita
                    </button>
                    <button
                      class="w-12 h-12 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 flex items-center justify-center">
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

// Import all specialty images
const specialtyImages = import.meta.glob('../assets/images/specialties/*.png', { eager: true, query: '?url', import: 'default' });

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
    
    getEspecialidadImage(nombre, tipo) {
      // Mapa de nombres de especialidad a nombres de archivo (sin extensión)
      const imageMap = {
        'Cardiología': 'cardiologia',
        'Medicina General': 'medicina_general',
        'Pediatría': 'pediatria',
        'Cirugía Ortopédica y Traumatología': 'traumatologia',
        'Dermatología y Venereología': 'dermatologia',
        'Ginecología y Obstetricia': 'ginecologia',
        'Oftalmología': 'oftalmologia',
        'Urología': 'urologia',
        'Psicología Clínica': 'psicologia',
        'Neumología': 'neumologia',
        'Alergología': 'alergologia',
        'Medicina Interna': 'medicina_interna',
        'Cirugía General y del Aparato Digestivo': 'cirugia_general',
        'Angiología y Cirugía Vascular': 'angiologia',
        'Rehabilitación y Fisioterapia': 'rehabilitacion',
        'Hematología y Hemoterapia': 'hematologia',
        'Reumatología': 'reumatologia',
        'Cirugía Plástica, Reparadora y Estética': 'cirugia_plastica',
        'Oncología Médica': 'oncologia',
        'Aparato Digestivo': 'aparato_digestivo',
        'Urgencias': 'urgencias',
        'Otorrinolaringología': 'otorrinolaringologia',
        'Cirugía Pediátrica': 'cirugia_pediatrica',
        'Análisis Clínicos': 'analisis_clinicos',
        'Anestesiología y Reanimación': 'anestesiologia',
        'Chequeos Médicos': 'chequeos_medicos',
        'Cirugía Oral y Maxilofacial': 'cirugia_maxilofacial',
        'Diagnóstico por la Imagen': 'diagnostico_imagen',
        'Endocrinología y Nutrición': 'endocrinologia',
        'Unidad del Dolor': 'unidad_dolor',
        'Neurología': 'neurologia',
      };
      
      const fileName = imageMap[nombre];
      
      // Intentar encontrar la imagen específica
      if (fileName) {
        const path = `../assets/images/specialties/${fileName}.png`;
        if (specialtyImages[path]) {
          return specialtyImages[path];
        }
      }
      
      // Fallback: usar medicina_general por defecto si no hay imagen específica
      //return specialtyImages['../assets/images/specialties/medicina_general.png'];
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