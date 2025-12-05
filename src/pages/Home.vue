<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    
    <!-- Hero Section with Background Image -->
    <section class="hero-section relative h-[400px] flex items-center text-white" :style="{ backgroundImage: `url(${heroBackground})` }">
      <!-- Gradient Overlay for better readability -->
      <div class="absolute inset-0 bg-gradient-to-r from-teal-900 opacity-70 via-teal-800 opacity-70 to-transparent"></div>
      
      <!-- Hero Content - Aligned Left -->
      <div class="relative z-10 px-6 md:px-12 lg:px-20 max-w-2xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Tu Salud, Nuestra Prioridad</h1>
        <p class="text-lg md:text-xl mb-8 font-light leading-relaxed">
          Somos una empresa líder en servicios médicos especializados, comprometidos con ofrecer 
          atención de calidad y profesionales altamente capacitados para cuidar de tu bienestar 
          y el de tu familia.
        </p>
        <button class="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-10 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
          Solicitar Cita
        </button>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="bg-teal-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="stat in statistics" :key="stat.label" class="stat-item">
            <div class="text-5xl md:text-6xl font-bold mb-2">{{ stat.value }}</div>
            <div class="text-lg md:text-xl font-light opacity-90">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Medical Professionals Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">Nuestros Especialistas</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Profesionales médicos altamente calificados dedicados a tu bienestar
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="medico in medicos" :key="medico.id" 
               class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
            <!-- Doctor Image -->
            <div class="h-64 overflow-hidden bg-gray-200">
              <img :src="medico.image" :alt="medico.name" class="w-full h-full object-cover">
            </div>
            
            <!-- Doctor Info -->
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-800 mb-3">Dr. {{ medico.name }}</h3>
              
              <!-- Specialty Badge -->
              <div class="inline-block bg-teal-100 text-teal-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {{ medico.especialidad }}
              </div>
              
              <!-- Contact and Schedule Info -->
              <div class="space-y-2 text-gray-600 mb-4">
                <p class="text-sm">
                  <span class="font-semibold">Contacto:</span> {{ medico.telefono }}
                </p>
                <p class="text-sm">
                  <span class="font-semibold">Horario:</span> {{ medico.horario }}
                </p>
              </div>
              
              <!-- Action Button -->
              <button class="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300">
                Agendar Consulta
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Company Values Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">Nuestros Valores</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprometidos con la excelencia en cada aspecto de nuestro servicio
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="value in values" :key="value.title" 
               class="text-center p-6 border border-gray-200 rounded-lg hover:border-teal-500 transition-all duration-300 hover:shadow-md">
            <h3 class="text-xl font-bold text-gray-800 mb-3">{{ value.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-16 bg-teal-50">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">¿Listo para cuidar de tu salud?</h2>
        <p class="text-xl text-gray-600 mb-8 leading-relaxed">
          Agenda tu cita con nuestros especialistas y da el primer paso hacia una vida más saludable. 
          Estamos aquí para acompañarte en cada momento.
        </p>
        <button class="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-10 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
          Contactar Ahora
        </button>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Header from '../components/HeaderComponent.vue';
import Footer from '../components/FooterComponent.vue';
import heroBackground from '/images/hero-background.png';

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      heroBackground,
      
      statistics: [
        { value: '15,000+', label: 'Pacientes Atendidos' },
        { value: '25+', label: 'Años de Experiencia' },
        { value: '50+', label: 'Especialistas' },
        { value: '98%', label: 'Satisfacción' },
      ],
      
      medicos: [
        { 
          id: 1, 
          name: 'Pablo Escolano', 
          especialidad: 'Traumatología',
          telefono: '677 77 77 77',
          horario: 'Lun-Vie 8:00-15:00',
          image: '/images/doctors/Usuario.png'
        },
        { 
          id: 2, 
          name: 'Carlos Albert', 
          especialidad: 'Pediatría',
          telefono: '655 55 99 00',
          horario: 'Lun-Vie 15:00-22:00',
          image: '/images/doctors/Usuario.png'
        },
        { 
          id: 3, 
          name: 'Javier Crespo', 
          especialidad: 'Cardiología',
          telefono: '699 99 00 99',
          horario: 'Mar-Sáb 22:00-06:00',
          image: '/images/doctors/Usuario.png'
        },
      ],
      
      values: [
        {
          title: 'Excelencia Profesional',
          description: 'Médicos especializados con la más alta formación académica y experiencia comprobada.'
        },
        {
          title: 'Atención Personalizada',
          description: 'Cada paciente es único. Ofrecemos tratamientos adaptados a tus necesidades específicas.'
        },
        {
          title: 'Tecnología Avanzada',
          description: 'Equipamiento médico de última generación para diagnósticos precisos y tratamientos efectivos.'
        },
        {
          title: 'Confianza y Experiencia',
          description: 'Más de 25 años cuidando la salud de miles de familias con dedicación y compromiso.'
        },
      ],
    };
  },
};
</script>

<style scoped>
.hero-section {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.animate-fade-in {
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-item {
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: scale(1.05);
}
</style>