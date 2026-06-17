<template>
  <div class="flex flex-col min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
    <Header />

    <!-- 1. Hero compacto: foto + overlay sólido (sin gradiente) -->
    <section class="home-hero">
      <div class="home-hero-overlay" aria-hidden="true"></div>
      <div class="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div class="max-w-2xl animate-fade-in">
          <span class="text-sm font-semibold tracking-wide text-white/70">VitSync</span>
          <h1 class="mt-3 text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-white">
            Tu salud, gestionada en un solo lugar
          </h1>
          <p class="mt-4 text-lg leading-relaxed text-white/85 max-w-xl">
            Reserva citas, consulta tu historial y comunícate con tus especialistas, cuando y donde quieras.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <button @click="irAAgendarCita" class="home-btn-primary">Solicitar cita</button>
            <router-link to="/especialidades" class="home-btn-light">Ver especialidades</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Accesos rápidos -->
    <section class="w-full max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div class="mb-8">
        <h2 class="text-2xl md:text-3xl font-semibold tracking-tight">¿Qué necesitas hoy?</h2>
        <p class="mt-2 text-[var(--text-secondary)]">Accede en un clic a lo más importante.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button v-for="a in quickActions" :key="a.title" type="button" class="qa-card" @click="handleAction(a)">
          <span class="qa-icon" v-html="sanitizeSvg(a.icon)"></span>
          <span class="qa-text">
            <span class="qa-title">{{ a.title }}</span>
            <span class="qa-desc">{{ a.desc }}</span>
          </span>
          <svg class="qa-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </section>

    <!-- 3. Especialistas (datos reales) -->
    <section class="border-t border-[var(--border)] bg-[var(--bg-surface)]">
      <div class="w-full max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div class="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-semibold tracking-tight">Nuestros especialistas</h2>
            <p class="mt-2 text-[var(--text-secondary)]">Profesionales verificados, listos para atenderte.</p>
          </div>
          <button @click="$router.push('/cuadro-medico')" class="home-link hidden md:inline-flex">
            Ver cuadro médico
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </div>

        <div v-if="loadingMedicos" class="py-10 text-center text-[var(--text-secondary)]">Cargando especialistas…</div>
        <div v-else-if="medicos.length === 0" class="py-10 text-center text-[var(--text-secondary)]">
          No hay especialistas disponibles por el momento.
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <article v-for="medico in medicos" :key="medico.id" class="doc-card">
            <img :src="medico.image" :alt="medico.name" class="doc-avatar" loading="lazy" />
            <div class="doc-info">
              <p class="doc-spec">{{ medico.especialidad }}</p>
              <h3 class="doc-name">Dr. {{ medico.name }}</h3>
              <p v-if="medico.telefono" class="doc-phone">{{ medico.telefono }}</p>
            </div>
            <button @click="irAAgendarCita" class="doc-cta">Agendar</button>
          </article>
        </div>
      </div>
    </section>

    <!-- 4. Valores -->
    <section class="w-full max-w-7xl mx-auto px-6 py-16 md:py-20">
      <div class="max-w-2xl mb-10">
        <h2 class="text-2xl md:text-3xl font-semibold tracking-tight">El estándar VitSync</h2>
        <p class="mt-2 text-[var(--text-secondary)]">Innovación, empatía y profesionalismo en cada paso de tu cuidado.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="value in values" :key="value.title" class="value-card">
          <span class="value-icon" v-html="sanitizeSvg(value.icon)"></span>
          <h3 class="value-title">{{ value.title }}</h3>
          <p class="value-desc">{{ value.description }}</p>
        </div>
      </div>
    </section>

    <!-- 5. Cifras -->
    <section class="border-y border-[var(--border)] bg-[var(--bg-surface)]">
      <div class="w-full max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div v-for="stat in statistics" :key="stat.label">
            <div class="text-3xl md:text-4xl font-semibold text-accent">{{ stat.value }}</div>
            <div class="mt-1 text-sm text-[var(--text-secondary)]">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. CTA -->
    <section class="w-full max-w-3xl mx-auto px-6 py-20 text-center">
      <h2 class="text-2xl md:text-3xl font-semibold tracking-tight">No dejes tu salud para mañana</h2>
      <p class="mt-3 text-[var(--text-secondary)]">
        Gestiona tu bienestar médico de forma rápida, segura y profesional.
      </p>
      <div class="mt-7 flex justify-center">
        <button v-if="!isLoggedIn" @click="irARegistro" class="home-btn-primary">Crear mi cuenta gratis</button>
        <button v-else @click="irAAgendarCita" class="home-btn-primary">Agendar una cita</button>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Header from '../components/HeaderComponent.vue';
import Footer from '../components/FooterComponent.vue';
import heroBackground from '/images/hero-background.png';
import { openBooking } from '../store/bookingModal';
import { sanitizeSvg } from '../utils/sanitize';
import { isAuthenticated } from '../store/auth';
import { fetchMedicos } from '../store/medicos';

export default {
  components: {
    Header,
    Footer,
  },
  computed: {
    // Para mostrar el CTA de "crear cuenta" solo a usuarios sin sesión.
    isLoggedIn() {
      return isAuthenticated.value;
    }
  },
  methods: {
    irAAgendarCita() {
      openBooking();
    },
    irARegistro() {
      this.$router.push('/register');
    },
    // Navega o abre la reserva según el acceso rápido pulsado.
    handleAction(a) {
      if (a.to) this.$router.push(a.to);
      else this.irAAgendarCita();
    },
    // Carga los médicos reales desde la API y los normaliza al formato de la card.
    async loadMedicos() {
      this.loadingMedicos = true;
      try {
        const data = await fetchMedicos();
        this.medicos = (data || []).slice(0, 6).map((m) => ({
          id: m.id,
          name: m.name,
          especialidad: m.especialidad?.nombre || 'General',
          telefono: m.phone || null,
          image: m.fotoUrl || '/images/doctors/Usuario.png',
        }));
      } catch (e) {
        console.error('No se pudieron cargar los médicos:', e);
        this.medicos = [];
      } finally {
        this.loadingMedicos = false;
      }
    },
    sanitizeSvg
  },
  mounted() {
    this.loadMedicos();
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
      // Accesos rápidos del Home. `to` navega; sin `to` abre la reserva.
      quickActions: [
        {
          title: 'Pedir cita',
          desc: 'Reserva con el especialista que necesites.',
          icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11v6m-3-3h6M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M4.5 6h15a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75v-12A.75.75 0 014.5 6z"/></svg>'
        },
        {
          title: 'Especialidades',
          desc: 'Explora todas nuestras áreas médicas.',
          to: '/especialidades',
          icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25A2.25 2.25 0 018.25 10.5H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>'
        },
        {
          title: 'Cuadro médico',
          desc: 'Conoce a nuestros profesionales.',
          to: '/cuadro-medico',
          icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>'
        },
        {
          title: 'Mi perfil',
          desc: 'Tus datos, citas e historial.',
          to: '/perfil',
          icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
        },
        {
          title: 'Enfermedades y tratamientos',
          desc: 'Información clínica de referencia.',
          to: '/enfermedades-tratamientos',
          icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/></svg>'
        },
        {
          title: 'Privacidad y datos',
          desc: 'Controla el uso de tus datos (RGPD).',
          to: '/privacidad',
          icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>'
        },
      ],
      // Se cargan desde la API en mounted() (loadMedicos).
      medicos: [],
      loadingMedicos: true,
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
/* Minimalista profesional sobre los tokens del tema. */

/* ── Hero: foto + overlay sólido (sin gradiente) ────── */
.home-hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 60vh;
  background-color: #0B3B37;
  background-image: url('/images/hero-background.png');
  background-size: cover;
  background-position: center;
}
html.dark .home-hero { background-color: #0B1120; }
.home-hero-overlay {
  position: absolute; inset: 0;
  background-color: rgba(8, 48, 44, 0.78);
}
html.dark .home-hero-overlay { background-color: rgba(8, 14, 26, 0.82); }

.home-btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.75rem 1.5rem; border-radius: 0.6rem;
  background-color: var(--accent); color: #fff;
  font-weight: 600; font-size: 0.9375rem; border: none; cursor: pointer;
  transition: background-color 0.15s ease;
}
.home-btn-primary:hover { background-color: var(--accent-hover); }
.home-btn-light {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.75rem 1.5rem; border-radius: 0.6rem;
  background-color: rgba(255,255,255,0.12); color: #fff;
  font-weight: 600; font-size: 0.9375rem;
  border: 1px solid rgba(255,255,255,0.35); text-decoration: none;
  transition: background-color 0.15s ease;
}
.home-btn-light:hover { background-color: rgba(255,255,255,0.2); }

.home-link {
  align-items: center; gap: 0.4rem;
  color: var(--accent); font-weight: 600; font-size: 0.9375rem;
  background: none; border: none; cursor: pointer;
}
.home-link svg { width: 1.05rem; height: 1.05rem; }
.home-link:hover { color: var(--accent-hover); }

/* ── Accesos rápidos ────────────────────────────────── */
.qa-card {
  display: flex; align-items: center; gap: 1rem; text-align: left;
  width: 100%; padding: 1.25rem;
  background-color: var(--bg-surface); color: var(--text-primary);
  border: 1px solid var(--border); border-radius: 0.75rem;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}
.qa-card:hover {
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
  box-shadow: 0 8px 24px -16px rgba(15,23,42,0.3);
}
.qa-icon {
  display: flex; align-items: center; justify-content: center;
  width: 2.75rem; height: 2.75rem; flex-shrink: 0;
  border-radius: 0.6rem; color: var(--accent);
  background-color: var(--accent-subtle);
}
.qa-icon :deep(svg) { width: 1.4rem; height: 1.4rem; }
.qa-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.qa-title { font-weight: 600; font-size: 0.975rem; }
.qa-desc { font-size: 0.825rem; color: var(--text-secondary); margin-top: 0.15rem; }
.qa-arrow { width: 1.1rem; height: 1.1rem; color: var(--text-muted); flex-shrink: 0; transition: transform 0.15s ease, color 0.15s ease; }
.qa-card:hover .qa-arrow { color: var(--accent); transform: translateX(3px); }

/* ── Cards de especialista ──────────────────────────── */
.doc-card {
  display: flex; align-items: center; gap: 1rem; padding: 1.25rem;
  background-color: var(--bg-surface); border: 1px solid var(--border); border-radius: 0.75rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.doc-card:hover { border-color: color-mix(in srgb, var(--accent) 35%, var(--border)); box-shadow: 0 8px 24px -16px rgba(15,23,42,0.25); }
.doc-avatar { width: 3.5rem; height: 3.5rem; border-radius: 9999px; object-fit: cover; background-color: var(--bg-elevated); flex-shrink: 0; }
.doc-info { flex: 1; min-width: 0; }
.doc-spec { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--accent); }
.doc-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-top: 0.1rem; }
.doc-phone { font-size: 0.825rem; color: var(--text-secondary); margin-top: 0.1rem; }
.doc-cta {
  flex-shrink: 0; padding: 0.45rem 0.9rem; border-radius: 0.5rem;
  font-size: 0.825rem; font-weight: 600; color: var(--accent);
  background-color: transparent; border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
  cursor: pointer; transition: background-color 0.15s ease, color 0.15s ease;
}
.doc-cta:hover { background-color: var(--accent); color: #fff; }

/* ── Valores ────────────────────────────────────────── */
.value-card { padding: 1.5rem; background-color: var(--bg-surface); border: 1px solid var(--border); border-radius: 0.75rem; }
.value-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 2.75rem; height: 2.75rem; border-radius: 0.6rem;
  color: var(--accent); background-color: var(--accent-subtle); margin-bottom: 1rem;
}
.value-icon :deep(svg) { width: 1.4rem; height: 1.4rem; }
.value-title { font-size: 1.0625rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem; }
.value-desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55; }

.text-accent { color: var(--accent); }

/* ── Animación de entrada ───────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeUp 0.6s ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in { animation: none; }
  .qa-card, .doc-card, .qa-arrow { transition: none; }
}
</style>
