<template>
  <div class="esp-page">
    <Header />

    <!-- Cabecera editorial -->
    <section class="esp-hero">
      <div class="esp-hero-decor" aria-hidden="true"></div>
      <div class="esp-hero-inner">
        <nav class="esp-breadcrumb">
          <span>Inicio</span>
          <span class="esp-bc-sep">/</span>
          <span class="esp-bc-current">Especialidades</span>
        </nav>
        <span class="esp-eyebrow">Cuadro médico</span>
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
                  <span :class="getTipoBadgeClass(especialidad.tipo)"
                    class="esp-card-badge">
                    {{ especialidad.tipo }}
                  </span>
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

/* ─── Hero / cabecera ─────────────────────────────── */
.esp-hero {
  position: relative;
  overflow: hidden;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border);
}
.esp-hero-decor {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(60rem 24rem at 85% -20%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%),
    radial-gradient(color-mix(in srgb, var(--text-muted) 16%, transparent) 1px, transparent 1px);
  background-size: auto, 24px 24px;
}
.esp-hero-inner { position: relative; max-width: 80rem; margin: 0 auto; padding: 2.75rem 1.5rem 2.5rem; }
.esp-breadcrumb {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.72rem; letter-spacing: 0.06em; color: var(--text-muted);
  display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;
}
.esp-bc-sep { opacity: 0.6; }
.esp-bc-current { color: var(--accent); font-weight: 600; }
.esp-eyebrow {
  display: inline-block;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.26em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 0.5rem;
}
.esp-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2.6rem; line-height: 1.05; letter-spacing: -0.015em; color: var(--text-primary);
}
.esp-subtitle { margin-top: 0.6rem; color: var(--text-secondary); font-size: 0.975rem; max-width: 38rem; }

/* ─── Estados ─────────────────────────────────────── */
.esp-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 5rem 1.5rem; color: var(--text-secondary); }
.esp-state-error { color: #E11D48; }
.esp-spinner {
  width: 2.75rem; height: 2.75rem; border-radius: 9999px;
  border: 3px solid var(--border); border-top-color: var(--accent);
  animation: espSpin 0.9s linear infinite;
}
@keyframes espSpin { to { transform: rotate(360deg); } }

/* ─── Índice alfabético ───────────────────────────── */
.esp-index {
  position: sticky; top: 0; z-index: 20;
  background-color: color-mix(in srgb, var(--bg-surface) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.esp-index-inner {
  max-width: 80rem; margin: 0 auto; padding: 0.85rem 1.5rem;
  display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;
}
.esp-letter {
  width: 2.4rem; height: 2.4rem; border-radius: 0.6rem;
  font-weight: 700; font-size: 0.9rem; border: 1px solid var(--border);
  background-color: var(--bg-elevated); color: var(--text-muted);
  cursor: not-allowed; transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
}
.esp-letter.is-active { background-color: var(--accent); color: #fff; border-color: transparent; cursor: pointer; }
.esp-letter.is-active:hover { background-color: var(--accent-hover); transform: translateY(-2px); }

/* ─── Grid ────────────────────────────────────────── */
.esp-grid-section { padding: 3rem 0 4rem; }
.esp-grid-inner { max-width: 80rem; margin: 0 auto; padding: 0 1.5rem; }
.esp-group { margin-bottom: 3rem; scroll-margin-top: 6rem; }
.esp-group-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2rem; color: var(--text-primary); margin-bottom: 1.5rem;
  padding-bottom: 0.5rem; display: inline-block;
  border-bottom: 3px solid var(--accent);
}
.esp-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 768px) { .esp-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .esp-grid { grid-template-columns: repeat(3, 1fr); } }

/* ─── Tarjeta ─────────────────────────────────────── */
.esp-card {
  display: flex; flex-direction: column; overflow: hidden;
  background-color: var(--bg-surface);
  border: 1px solid var(--border); border-radius: 1.1rem;
  box-shadow: 0 1px 2px rgba(15,23,42,0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.esp-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  box-shadow: 0 24px 44px -28px rgba(15,23,42,0.4);
}
.esp-card-media { position: relative; aspect-ratio: 4 / 3; overflow: hidden; border-bottom: 1px solid var(--border); }
.esp-card-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; transition: transform 0.4s ease; }
.esp-card:hover .esp-card-img { transform: scale(1.06); }
.esp-card-badge {
  position: absolute; top: 0.75rem; left: 0.75rem;
  padding: 0.25rem 0.6rem; border-radius: 999px;
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.03em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.esp-card-body { display: flex; flex-direction: column; flex: 1; padding: 1.5rem; }
.esp-card-titlelink { text-decoration: none; }
.esp-card-title { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; transition: color 0.2s ease; }
.esp-card-titlelink:hover .esp-card-title { color: var(--accent); }
.esp-card-desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 1rem; }

.esp-doctors { margin-bottom: 1.25rem; }
.esp-doctors-label {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 0.5rem;
}
.esp-doctors-list { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.875rem; color: var(--text-secondary); }
.esp-doctors-list li { display: flex; align-items: center; }
.esp-dot { width: 0.45rem; height: 0.45rem; border-radius: 9999px; background: var(--accent); margin-right: 0.55rem; flex-shrink: 0; }
.esp-doctors-empty { font-size: 0.85rem; color: var(--text-muted); font-style: italic; margin-bottom: 1.25rem; }

.esp-card-actions { display: flex; gap: 0.6rem; margin-top: auto; }
.esp-btn-primary {
  background-color: var(--accent); color: #fff;
  font-weight: 600; padding: 0.7rem 1.25rem; border-radius: 0.7rem; border: none;
  cursor: pointer; transition: background-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 20px -10px color-mix(in srgb, var(--accent) 70%, transparent);
}
.esp-btn-primary:hover { background-color: var(--accent-hover); }
.esp-btn-grow { flex: 1; }
.esp-btn-icon {
  width: 3rem; display: flex; align-items: center; justify-content: center;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--border));
  color: var(--accent); border-radius: 0.7rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.esp-btn-icon svg { width: 1.2rem; height: 1.2rem; }
.esp-btn-icon:hover { background-color: var(--accent); color: #fff; }

@media (prefers-reduced-motion: reduce) {
  .esp-spinner { animation-duration: 1.2s; }
  .esp-card, .esp-card-img, .esp-letter { transition: none; }
}
</style>
