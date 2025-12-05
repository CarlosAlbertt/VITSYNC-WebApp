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
              <!-- Specialty Image -->
              <div class="h-48 overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200">
                <img 
                  :src="especialidad.image" 
                  :alt="especialidad.nombre" 
                  class="w-full h-full object-cover"
                >
              </div>
              
              <!-- Specialty Info -->
              <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-2xl font-bold text-gray-800 mb-4">{{ especialidad.nombre }}</h3>
                
                <!-- Doctors List -->
                <div v-if="especialidad.medicos && especialidad.medicos.length > 0" class="mb-4">
                  <p class="text-sm font-semibold text-gray-600 mb-2">Especialistas disponibles:</p>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li v-for="medico in especialidad.medicos" :key="medico" class="flex items-center">
                      <span class="w-2 h-2 bg-teal-600 rounded-full mr-2"></span>
                      Dr. {{ medico }}
                    </li>
                  </ul>
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

    <Footer />
  </div>
</template>

<script>
import Header from '../components/HeaderComponent.vue';
import Footer from '../components/FooterComponent.vue';

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      
      especialidades: [
        {
          id: 1,
          nombre: 'Alergología',
          image: '/images/specialties/alergologia.jpg',
          medicos: ['María López', 'Juan Pérez']
        },
        {
          id: 2,
          nombre: 'Análisis Clínicos y Bioquímica Clínica',
          image: '/images/specialties/analisis.jpg',
          medicos: ['Ana García', 'Vito Rufian']
        },
        {
          id: 3,
          nombre: 'Cardiología',
          image: '/images/specialties/cardiologia.jpg',
          medicos: ['Javier Crespo']
        },
        {
          id: 4,
          nombre: 'Dermatología',
          image: '/images/specialties/dermatologia.jpg',
          medicos: ['Laura Martín', 'Carlos Ruiz']
        },
        {
          id: 5,
          nombre: 'Endocrinología',
          image: '/images/specialties/endocrinologia.jpg',
          medicos: ['Sofia Fernández']
        },
        {
          id: 6,
          nombre: 'Gastroenterología',
          image: '/images/specialties/gastroenterologia.jpg',
          medicos: ['Miguel Torres', 'Elena Díaz']
        },
        {
          id: 7,
          nombre: 'Ginecología',
          image: '/images/specialties/ginecologia.jpg',
          medicos: ['Carmen Jiménez', 'Isabel Moreno']
        },
        {
          id: 8,
          nombre: 'Neurología',
          image: '/images/specialties/neurologia.jpg',
          medicos: ['David Romero']
        },
        {
          id: 9,
          nombre: 'Oftalmología',
          image: '/images/specialties/oftalmologia.jpg',
          medicos: ['Roberto Navarro', 'Patricia Gil']
        },
        {
          id: 10,
          nombre: 'Pediatría',
          image: '/images/specialties/pediatria.jpg',
          medicos: ['Carlos Albert']
        },
        {
          id: 11,
          nombre: 'Psiquiatría',
          image: '/images/specialties/psiquiatria.jpg',
          medicos: ['Andrea Vega', 'Luis Castro']
        },
        {
          id: 12,
          nombre: 'Traumatología',
          image: '/images/specialties/traumatologia.jpg',
          medicos: ['Pablo Escolano']
        },
        {
          id: 13,
          nombre: 'Urología',
          image: '/images/specialties/urologia.jpg',
          medicos: ['Fernando Ortiz', 'Raquel Ramos']
        },
      ],
    };
  },
  computed: {
    activeLetters() {
      // Get unique first letters from specialties
      const letters = [...new Set(this.especialidades.map(e => e.nombre[0].toUpperCase()))];
      return letters.sort();
    }
  },
  methods: {
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
          const offset = 100; // Account for sticky header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  }
};
</script>

<style scoped>
/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>