<template>
  <div class="esp-page">
    <Header />

    <!-- Cabecera -->
    <section class="esp-hero">
      <div class="esp-hero-inner">
        <nav class="esp-breadcrumb">
          <span>Inicio</span>
          <span class="esp-bc-sep">/</span>
          <span class="esp-bc-current">Especialidades</span>
        </nav>
        <h1 class="esp-title">Índice de Especialidades</h1>
        <p class="esp-subtitle">Explora nuestras áreas médicas y pide cita con el especialista adecuado para ti.</p>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="isLoading" class="esp-state">
      <div class="esp-spinner" aria-hidden="true"></div>
      <p>Cargando especialidades...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="esp-state">
      <p class="esp-state-error">{{ errorMessage }}</p>
      <button @click="loadEspecialidades" class="esp-btn-primary">Reintentar</button>
    </div>

    <template v-else>
      <!-- Índice alfabético -->
      <section class="esp-index">
        <div class="esp-index-inner">
          <button v-for="letter in alphabet" :key="letter" @click="scrollToLetter(letter)"
            class="esp-letter" :class="{ 'is-active': hasSpecialtiesForLetter(letter) }"
            :disabled="!hasSpecialtiesForLetter(letter)">
            {{ letter }}
          </button>
        </div>
      </section>

      <!-- Grid de especialidades -->
      <section class="esp-grid-section">
        <div class="esp-grid-inner">
          <div v-for="letter in activeLetters" :key="letter" class="esp-group">
            <h2 :id="`letter-${letter}`" class="esp-group-title">{{ letter }}</h2>

            <div class="esp-grid">
              <article
                v-for="especialidad in getSpecialtiesByLetter(letter)"
                :key="especialidad.id"
                class="esp-card">
                <!-- Imagen + badge -->
                <div class="esp-card-media">
                  <img
                    :src="getEspecialidadImage(especialidad.nombre, especialidad.tipo)"
                    :alt="especialidad.nombre"
                    class="esp-card-img"
                    loading="lazy"
                    @error="onImageError" />
                  <span class="esp-card-badge">{{ especialidad.tipo }}</span>
                </div>

                <!-- Info -->
                <div class="esp-card-body">
                  <router-link :to="`/especialidad/${especialidad.id}`" class="esp-card-titlelink">
                    <h3 class="esp-card-title">{{ especialidad.nombre }}</h3>
                  </router-link>
                  <p class="esp-card-desc">{{ especialidad.descripcion }}</p>

                  <!-- Médicos -->
                  <div v-if="especialidad.medicos && especialidad.medicos.length > 0" class="esp-doctors">
                    <p class="esp-doctors-label">Especialistas disponibles</p>
                    <ul class="esp-doctors-list">
                      <li v-for="medico in especialidad.medicos" :key="medico.id">
                        <span class="esp-dot" aria-hidden="true"></span>
                        Dr. {{ medico.nombre }}
                      </li>
                    </ul>
                  </div>
                  <p v-else class="esp-doctors-empty">Sin especialistas asignados</p>

                  <!-- Acciones -->
                  <div class="esp-card-actions">
                    <button @click="pedirCita(especialidad)" class="esp-btn-primary esp-btn-grow">
                      Pedir cita
                    </button>
                    <router-link :to="`/especialidad/${especialidad.id}`" class="esp-btn-icon" :aria-label="`Ver ${especialidad.nombre}`">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </router-link>
                  </div>
                </div>
              </article>
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
import { openBooking } from '../store/bookingModal';

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
    pedirCita(especialidad) {
      openBooking({
        specialty: especialidad,
        specialtyName: especialidad.nombre
      });
    },
    
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
      
      // Fallback cuando no hay imagen específica para la especialidad
      return specialtyImages['../assets/images/specialties/medicina_general.png'];
    },

    onImageError(event) {
      const fallback = specialtyImages['../assets/images/specialties/medicina_general.png'];
      if (fallback && event.target.src !== fallback) {
        event.target.src = fallback;
      }
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
html { scroll-behavior: smooth; }

.esp-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-base);
  color: var(--text-primary);
}

/* Minimalista profesional: sans del sistema, superficies planas, hairlines. */

/* ─── Cabecera ────────────────────────────────────── */
.esp-hero {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border);
}
.esp-hero-inner { max-width: 72rem; margin: 0 auto; padding: 2.5rem 1.5rem; }
.esp-breadcrumb {
  font-size: 0.8125rem; color: var(--text-muted);
  display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;
}
.esp-bc-sep { opacity: 0.6; }
.esp-bc-current { color: var(--text-secondary); font-weight: 500; }
.esp-title { font-size: 1.875rem; font-weight: 600; letter-spacing: -0.01em; color: var(--text-primary); }
.esp-subtitle { margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9375rem; max-width: 40rem; }

/* ─── Estados ─────────────────────────────────────── */
.esp-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 5rem 1.5rem; color: var(--text-secondary); }
.esp-state-error { color: #B91C1C; }
.esp-spinner {
  width: 2.25rem; height: 2.25rem; border-radius: 9999px;
  border: 2px solid var(--border); border-top-color: var(--accent);
  animation: espSpin 0.8s linear infinite;
}
@keyframes espSpin { to { transform: rotate(360deg); } }

/* ─── Índice alfabético ───────────────────────────── */
.esp-index {
  position: sticky; top: 0; z-index: 20;
  background-color: color-mix(in srgb, var(--bg-base) 90%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.esp-index-inner {
  max-width: 72rem; margin: 0 auto; padding: 0.75rem 1.5rem;
  display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center;
}
.esp-letter {
  width: 2.25rem; height: 2.25rem; border-radius: 0.5rem;
  font-weight: 600; font-size: 0.875rem; border: 1px solid transparent;
  background-color: transparent; color: var(--text-muted);
  cursor: not-allowed; transition: background-color 0.15s ease, color 0.15s ease;
}
.esp-letter.is-active { color: var(--text-secondary); cursor: pointer; }
.esp-letter.is-active:hover { background-color: var(--bg-elevated); color: var(--accent); }

/* ─── Grid ────────────────────────────────────────── */
.esp-grid-section { padding: 2.5rem 0 4rem; }
.esp-grid-inner { max-width: 72rem; margin: 0 auto; padding: 0 1.5rem; }
.esp-group { margin-bottom: 2.75rem; scroll-margin-top: 5.5rem; }
.esp-group-title {
  font-size: 1.125rem; font-weight: 600; color: var(--text-secondary);
  margin-bottom: 1.25rem; padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--border);
}
.esp-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 768px) { .esp-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .esp-grid { grid-template-columns: repeat(3, 1fr); } }

/* ─── Tarjeta ─────────────────────────────────────── */
.esp-card {
  display: flex; flex-direction: column; overflow: hidden;
  background-color: var(--bg-surface);
  border: 1px solid var(--border); border-radius: 0.75rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.esp-card:hover {
  border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
  box-shadow: 0 8px 24px -16px rgba(15,23,42,0.25);
}
.esp-card-media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border-bottom: 1px solid var(--border); }
.esp-card-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.esp-card-badge {
  position: absolute; top: 0.7rem; left: 0.7rem;
  padding: 0.2rem 0.55rem; border-radius: 0.4rem;
  font-size: 0.66rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
  color: var(--text-secondary);
  background-color: color-mix(in srgb, var(--bg-surface) 88%, transparent);
  border: 1px solid var(--border);
  backdrop-filter: blur(4px);
}
.esp-card-body { display: flex; flex-direction: column; flex: 1; padding: 1.35rem; }
.esp-card-titlelink { text-decoration: none; }
.esp-card-title { font-size: 1.0625rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem; transition: color 0.15s ease; }
.esp-card-titlelink:hover .esp-card-title { color: var(--accent); }
.esp-card-desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 1rem; }

.esp-doctors { margin-bottom: 1.25rem; }
.esp-doctors-label {
  font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.45rem;
}
.esp-doctors-list { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.875rem; color: var(--text-secondary); }
.esp-doctors-list li { display: flex; align-items: center; }
.esp-dot { width: 0.35rem; height: 0.35rem; border-radius: 9999px; background: var(--accent); margin-right: 0.55rem; flex-shrink: 0; }
.esp-doctors-empty { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem; }

.esp-card-actions { display: flex; gap: 0.5rem; margin-top: auto; }
.esp-btn-primary {
  background-color: var(--accent); color: #fff;
  font-weight: 600; font-size: 0.9375rem; padding: 0.6rem 1.1rem; border-radius: 0.6rem; border: none;
  cursor: pointer; transition: background-color 0.15s ease;
}
.esp-btn-primary:hover { background-color: var(--accent-hover); }
.esp-btn-grow { flex: 1; }
.esp-btn-icon {
  width: 2.75rem; display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--border); color: var(--text-secondary); border-radius: 0.6rem;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.esp-btn-icon svg { width: 1.1rem; height: 1.1rem; }
.esp-btn-icon:hover { border-color: var(--accent); color: var(--accent); }

@media (prefers-reduced-motion: reduce) {
  .esp-spinner { animation-duration: 1.2s; }
  .esp-card, .esp-letter { transition: none; }
}
</style>
