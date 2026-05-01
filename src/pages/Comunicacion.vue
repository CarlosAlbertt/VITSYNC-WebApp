<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-500 overflow-x-hidden">
    <Header />

    <!-- Premium Hero Section -->
    <section class="relative min-h-[60vh] flex items-center justify-center pt-20 pb-32 overflow-hidden">
      <!-- Animated Background Blobs -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[60%] bg-teal-400/20 dark:bg-teal-600/10 rounded-full blur-[120px] animate-blob"></div>
        <div class="absolute top-[20%] -right-[5%] w-[35%] h-[50%] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-[10%] left-[20%] w-[30%] h-[40%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div class="relative max-w-5xl mx-auto px-6 text-center z-10">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 mb-8 animate-fade-in-up">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span class="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-widest">Soporte Disponible</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight animate-fade-in-up animation-delay-200">
          ¿Cómo podemos <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">ayudarte</span> hoy?
        </h1>
        
        <p class="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
          Encuentra respuestas inmediatas o contacta directamente con nuestro equipo de atención al paciente.
        </p>
        
        <!-- Smart Search Bar -->
        <form @submit.prevent="handleSearch" class="max-w-2xl mx-auto relative animate-fade-in-up animation-delay-600">
          <div class="absolute inset-0 bg-teal-500/20 blur-2xl rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative flex items-center bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-[2rem] p-2 shadow-2xl shadow-slate-200/50 dark:shadow-none focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
            <div class="pl-6 pr-4 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Busca respuestas sobre citas, informes, dudas..."
              class="flex-1 bg-transparent border-none focus:outline-none text-slate-800 dark:text-white placeholder-slate-400 py-4 text-lg"
            />
            <button type="submit" class="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-[1.5rem] font-bold transition-all hover:shadow-lg hover:shadow-teal-500/30">
              Buscar
            </button>
          </div>
          <div v-if="searchQuery && filteredFaqs.length > 0" class="mt-4 text-sm text-teal-600 dark:text-teal-400 font-bold animate-pulse">
             {{ filteredFaqs.length }} resultados encontrados abajo
          </div>
        </form>
      </div>
    </section>

    <!-- Content Sections -->
    <main class="max-w-7xl mx-auto px-6 -mt-16 pb-32 relative z-20">
      
      <!-- Interactive Grid Actions (Without icons) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-4xl mx-auto">
        <div 
          v-for="(action, i) in quickActions" 
          :key="action.title"
          @click="action.handler"
          class="group relative p-1 rounded-[2.5rem] bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-xl transition-all duration-500 hover:-translate-y-3 cursor-pointer hover:shadow-2xl animate-fade-in-up"
          :style="{ animationDelay: (800 + i * 200) + 'ms' }"
        >
          <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" :class="action.gradient"></div>
          
          <div class="relative h-full p-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-[2.4rem] border border-white dark:border-slate-800 flex flex-col items-center text-center overflow-hidden">
            <!-- Decorative circle behind content -->
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors"></div>
            
            <h3 class="text-3xl font-black text-slate-800 dark:text-white mb-5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors relative z-10">{{ action.title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-[280px] relative z-10">{{ action.desc }}</p>
            
            <div class="mt-auto flex items-center gap-3 px-8 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-teal-600 dark:text-teal-400 font-black text-sm group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 relative z-10">
              Comenzar ahora
              <span class="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>

      <div id="faq-section" class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <!-- Modern FAQ Section -->
        <div class="lg:col-span-8">
          <div class="flex flex-col mb-12">
            <span class="text-teal-600 dark:text-teal-400 font-black text-xs uppercase tracking-[0.3em] mb-4">Resolución de dudas</span>
            <h2 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Preguntas Frecuentes</h2>
          </div>

          <div class="space-y-6">
            <div 
              v-for="(faq, index) in filteredFaqs" 
              :key="index"
              class="group relative bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:border-teal-500/30"
              :class="{ 'ring-2 ring-teal-500/20 bg-slate-50/50 dark:bg-slate-800': activeFaq === index }"
            >
              <button 
                @click="toggleFaq(index)"
                class="w-full px-8 py-7 text-left flex items-center justify-between gap-6"
              >
                <div class="flex items-center gap-6">
                   <span class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                     0{{ index + 1 }}
                   </span>
                   <span class="font-bold text-slate-800 dark:text-slate-200 text-lg leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{{ faq.q }}</span>
                </div>
                <div 
                  class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center transition-all duration-500"
                  :class="{ 'rotate-180 bg-teal-600 text-white': activeFaq === index }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div 
                v-if="activeFaq === index"
                class="px-20 pb-8 text-slate-600 dark:text-slate-400 text-base leading-relaxed animate-accordion-down"
              >
                <div class="pt-2 border-t border-slate-100 dark:border-slate-700/50">
                   {{ faq.a }}
                </div>
              </div>
            </div>

            <div v-if="filteredFaqs.length === 0" class="text-center py-20 bg-white dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
               <span class="text-5xl mb-4 block">🔍</span>
               <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">No hemos encontrado nada para "{{ searchQuery }}"</h3>
               <p class="text-slate-500 dark:text-slate-400">Intenta con otras palabras clave o contáctanos directamente.</p>
            </div>
          </div>
        </div>

        <!-- Floating Contact Sidebar -->
        <div class="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
          <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none relative overflow-hidden group">
            <div class="absolute -right-20 -top-20 w-60 h-60 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
            
            <h3 class="text-2xl font-black mb-6 relative z-10 text-slate-800 dark:text-white">Contacto Directo</h3>
            <p class="text-slate-500 dark:text-slate-400 mb-10 relative z-10 text-sm leading-relaxed font-medium">
              ¿Tienes una consulta específica? Nuestro equipo especializado está listo para asesorarte.
            </p>
            
            <div class="space-y-6 relative z-10">
              <a href="tel:912337799" class="flex items-center gap-6 group/item">
                <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-2xl group-hover/item:bg-teal-600 group-hover/item:text-white transition-all duration-300">
                  📞
                </div>
                <div>
                  <div class="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-widest mb-1">Centralita</div>
                  <div class="font-black text-lg text-slate-800 dark:text-white">912 33 77 99</div>
                </div>
              </a>
              
              <a href="mailto:ayuda@vitsync.com" class="flex items-center gap-6 group/item">
                <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-2xl group-hover/item:bg-teal-600 group-hover/item:text-white transition-all duration-300">
                  ✉️
                </div>
                <div>
                  <div class="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-widest mb-1">Email Soporte</div>
                  <div class="font-black text-lg text-slate-800 dark:text-white">ayuda@vitsync.com</div>
                </div>
              </a>
            </div>

            <div class="mt-12 pt-10 border-t border-slate-100 dark:border-white/5 relative z-10">
               <p class="text-[11px] text-slate-400 dark:text-slate-500 font-bold text-center leading-relaxed">Nuestro compromiso es tu bienestar. Contacta con nosotros si necesitas ayuda personalizada.</p>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 class="text-xl font-black text-slate-900 dark:text-white mb-8">Sedes VitSync</h3>
            <div class="space-y-8">
              <div v-for="center in centers" :key="center.name" class="group/center cursor-default">
                <div class="flex items-start gap-4">
                  <div class="mt-1 text-teal-500 opacity-50 group-hover/center:opacity-100 transition-opacity">📍</div>
                  <div>
                    <div class="font-bold text-slate-800 dark:text-slate-200 group-hover/center:text-teal-600 transition-colors">{{ center.name }}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ center.addr }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../components/HeaderComponent.vue';
import Footer from '../components/FooterComponent.vue';

const router = useRouter();
const searchQuery = ref('');
const activeFaq = ref(0);

const quickActions = [
  { 
    title: 'Pedir Cita', 
    desc: 'Agenda tu próxima consulta presencial con nuestros especialistas de forma rápida.',
    gradient: 'from-blue-500/10 to-transparent',
    handler: () => router.push('/perfil?section=citas')
  },
  { 
    title: 'Resultados', 
    desc: 'Descarga tus informes médicos, analíticas y pruebas diagnósticas de forma segura.',
    gradient: 'from-teal-500/10 to-transparent',
    handler: () => router.push('/perfil?section=informes')
  }
];

const faqs = [
  { q: '¿Cómo puedo acceder a mis resultados médicos?', a: 'Tus informes están disponibles en tiempo real en la sección "Mis Informes" de tu perfil personal. Puedes visualizarlos online o descargarlos en formato PDF con firma digital oficial.' },
  { q: '¿Cómo gestiono la cancelación de una cita?', a: 'Dentro de "Mis Citas" encontrarás el listado de consultas pendientes. Solo tienes que seleccionar la cita y pulsar en "Cancelar". Recuerda hacerlo con al menos 24h de antelación.' },
  { q: '¿Qué medidas de seguridad protegen mi historial?', a: 'VitSync utiliza encriptación AES-256 de grado militar y cumple estrictamente con el Esquema Nacional de Seguridad y el RGPD. Tus datos médicos residen en servidores seguros y solo tú controlas el acceso.' },
  { q: '¿Puedo solicitar una segunda opinión médica?', a: 'Sí, a través de nuestro canal de Comunicación puedes solicitar una revisión de tu caso por un comité de expertos. Solo tienes que adjuntar tu historial previo y seleccionar la especialidad.' },
  { q: '¿Cómo funciona la receta electrónica?', a: 'Tras tu consulta, el médico emitirá la receta que aparecerá automáticamente en tu perfil. Puedes presentar el código QR en cualquier farmacia asociada para retirar tu medicación.' }
];

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs;
  const q = searchQuery.value.toLowerCase();
  return faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
});

const handleSearch = () => {
  if (searchQuery.value) {
    const el = document.getElementById('faq-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (filteredFaqs.value.length > 0) {
      activeFaq.value = 0; // Abrir la primera encontrada
    }
  }
};

const centers = [
  { name: 'VitSync Hospital Central', addr: 'Calle Mayor 120, Madrid (28013)' },
  { name: 'Campus Salud Norte', addr: 'Av. de Europa 45, Alcobendas (28108)' },
  { name: 'Policlínico Sur', addr: 'Calle Real 12, Getafe (28901)' }
];

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? -1 : index;
};
</script>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-400 { animation-delay: 0.4s; }
.animation-delay-600 { animation-delay: 0.6s; }

@keyframes accordionDown {
  from { height: 0; opacity: 0; }
  to { height: auto; opacity: 1; }
}
.animate-accordion-down {
  animation: accordionDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
