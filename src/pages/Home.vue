<template>
  <div class="flex flex-col min-h-screen font-sans">
    <Header />

    <!-- Hero Section -->
    <section class="hero-section relative min-h-[600px] flex items-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 w-full h-full">
        <img :src="heroBackground" class="w-full h-full object-cover object-center" alt="VitSync Hero" />
      </div>
      
      <!-- Premium Overlay (Darker to make text pop, but transparent enough to see the image) -->
      <div class="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/80 to-transparent dark:from-[#0B1120]/95 dark:via-[#0B1120]/80"></div>

      <!-- Hero Content -->
      <div class="relative z-10 px-6 md:px-12 lg:px-20 max-w-3xl">
        <div class="inline-block px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent font-semibold text-sm mb-6 backdrop-blur-sm">
          Innovación en Salud Digital
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Tu Salud, <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">Nuestra Prioridad</span>
        </h1>
        <p class="text-lg md:text-xl text-slate-200 mb-10 font-light leading-relaxed max-w-2xl">
          Conectamos a pacientes y especialistas en una plataforma única. 
          Gestiona tus citas, accede a tu historial y recibe atención médica de primer nivel.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <button @click="irAAgendarCita" class="bg-accent hover:bg-teal-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-accent/30 transform transition-all duration-300 hover:-translate-y-1">
            Solicitar Cita
          </button>
          <button class="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300">
            Conoce Más
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Section (Floating overlapping the hero) -->
    <section class="relative z-20 -mt-16 px-6 max-w-7xl mx-auto">
      <div class="bg-white dark:bg-[var(--bg-surface)] rounded-2xl shadow-xl border border-slate-100 dark:border-[var(--border)] p-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100 dark:divide-[var(--border)]">
          <div v-for="stat in statistics" :key="stat.label" class="flex flex-col items-center justify-center">
            <div class="text-4xl font-bold text-slate-800 dark:text-white mb-1">{{ stat.value }}</div>
            <div class="text-sm font-semibold text-accent uppercase tracking-widest">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Specialists Section -->
    <section class="py-24 bg-slate-50 dark:bg-[var(--bg-base)] transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12">
          <div class="max-w-2xl">
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Nuestros Especialistas</h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 font-light">
              Un equipo de profesionales altamente calificados, listos para brindarte la mejor atención médica.
            </p>
          </div>
          <button class="hidden md:block text-accent font-semibold hover:text-teal-700 transition-colors">
            Ver todo el cuadro médico &rarr;
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="medico in medicos" :key="medico.id" class="group bg-white dark:bg-[var(--bg-surface)] rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-[var(--border)] transition-all duration-300 overflow-hidden">
            <div class="h-64 overflow-hidden relative bg-slate-100 dark:bg-[var(--bg-base)]">
              <img :src="medico.image" :alt="medico.name" class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105">
            </div>
            <div class="p-8 relative">
              <!-- Specialty Floating Badge -->
              <div class="absolute -top-5 right-6 bg-accent text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                {{ medico.especialidad }}
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Dr. {{ medico.name }}</h3>
              
              <div class="space-y-3 mb-8">
                <div class="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                  <svg class="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  {{ medico.telefono }}
                </div>
                <div class="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                  <svg class="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ medico.horario }}
                </div>
              </div>

              <button @click="irAAgendarCita" class="w-full bg-slate-50 hover:bg-accent hover:text-white dark:bg-slate-800 dark:hover:bg-accent text-accent font-semibold px-6 py-3 rounded-xl transition-colors duration-300">
                Agendar Consulta
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-24 bg-white dark:bg-[var(--bg-surface)] transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">El estándar VitSync</h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light">
            Innovación, empatía y profesionalismo en cada paso de tu cuidado médico.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="value in values" :key="value.title" class="p-6 rounded-2xl bg-slate-50 dark:bg-[var(--bg-base)] border border-slate-100 dark:border-[var(--border)] hover:border-accent transition-colors duration-300">
            <div class="w-12 h-12 mb-6 bg-white dark:bg-[var(--bg-surface)] rounded-xl shadow-sm flex items-center justify-center text-accent">
              <span v-html="value.icon"></span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">{{ value.title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed font-light text-sm">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-20 relative overflow-hidden bg-accent dark:bg-[#0B1120]">
      <div class="absolute inset-0 opacity-10 bg-[url('/images/hero-background.png')] bg-cover bg-center"></div>
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">No dejes tu salud para mañana</h2>
        <p class="text-lg text-white/90 mb-10 font-light max-w-2xl mx-auto">
          Únete a los miles de pacientes que ya confían en VitSync para gestionar su bienestar médico de forma rápida, segura y profesional.
        </p>
        <button @click="irAAgendarCita" class="bg-white text-accent hover:bg-slate-50 font-bold px-10 py-4 rounded-xl shadow-xl transform transition-transform hover:-translate-y-1 text-lg">
          Crear mi cuenta gratis
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
  methods: {
    irAAgendarCita() {
      this.$router.push('/agendar-cita');
    }
  },
  data() {
    return {
      heroBackground,
      statistics: [
        { value: '15k+', label: 'Pacientes' },
        { value: '25+', label: 'Años Exp.' },
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
          icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
          title: 'Excelencia Médica',
          description: 'Especialistas seleccionados rigurosamente por su trayectoria y formación académica.'
        },
        {
          icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
          title: 'Trato Personalizado',
          description: 'Entendemos que cada caso es único. Nos enfocamos en escuchar y resolver tus necesidades.'
        },
        {
          icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>',
          title: 'Tecnología Avanzada',
          description: 'Plataforma digital intuitiva y equipamiento clínico de última generación.'
        },
        {
          icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
          title: 'Máxima Confianza',
          description: 'Protección de datos rigurosa y años de experiencia avalando nuestros servicios.'
        },
      ],
    };
  }
};
</script>

<style scoped>
/* Estilos extra si es necesario. Tailwind hace el 99% del trabajo. */
.bg-accent {
  background-color: var(--accent);
}
.text-accent {
  color: var(--accent);
}
.border-accent {
  border-color: var(--accent);
}
</style>