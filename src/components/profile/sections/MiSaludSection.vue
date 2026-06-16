<template>
  <div class="mi-salud-container">
    <div class="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 mb-6 transition-all">
      <div class="max-w-4xl mx-auto">
        <div class="mb-14">
          <h1 class="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Mi Salud</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Panel de indicadores biométricos y bienestar</p>
        </div>

        <div v-if="loading" class="flex justify-center py-24">
          <div class="animate-spin rounded-full h-14 w-14 border-b-4 border-teal-600 shadow-lg"></div>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-y-16 gap-x-8 justify-items-center pb-12">
          <div
            v-for="cat in categorias"
            :key="cat.id"
            class="group cursor-pointer select-none perspective-1000"
            @click="handleClick(cat)"
          >
            <div
              class="relative flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2 group-active:scale-95"
              style="width:170px; height:195px; filter: drop-shadow(0 12px 35px rgba(0,0,0,0.18))"
            >
              <!-- Hexagon border rim -->
              <div
                class="absolute inset-0"
                style="clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); background: rgba(255,255,255,0.3)"
              />
              <!-- Hexagon gradient fill -->
              <div
                class="absolute"
                style="inset: 4px; clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)"
                :style="{ background: cat.gradient }"
              />
              <!-- Gloss sheen -->
              <div
                class="absolute pointer-events-none"
                style="inset: 4px; clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); background: linear-gradient(165deg, rgba(255,255,255,0.25) 0%, transparent 60%)"
              />
              
              <!-- Coming soon dim overlay -->
              <div
                v-if="cat.comingSoon"
                class="absolute pointer-events-none"
                style="inset: 4px; clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); background: rgba(0,0,0,0.2)"
              />

              <!-- Main content -->
              <div class="relative z-10 flex flex-col items-center gap-1 text-white">
                <div class="relative" style="width:80px; height:80px">
                  <svg class="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 80 80" style="transform:rotate(-90deg)">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="5"/>
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke="white"
                      stroke-width="5"
                      stroke-linecap="round"
                      :stroke-dasharray="213.6"
                      :stroke-dashoffset="213.6 * (1 - (cat.porcentaje || 0) / 100)"
                      class="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"
                      stroke-linecap="round" stroke-linejoin="round" class="w-9 h-9">
                      <g v-html="sanitizeSvg(cat.icon)" />
                    </svg>
                  </div>
                </div>

                <span class="text-2xl font-black leading-none mt-2 tracking-tighter">{{ Math.round(cat.porcentaje || 0) }}%</span>
                <span class="text-[11px] font-black uppercase tracking-widest text-center leading-tight px-3 mt-1">{{ cat.nombre }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Coming Soon Modal -->
    <Teleport to="body">
      <Transition name="fade-scale">
        <div v-if="showComingSoonModal" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="showComingSoonModal = false" />
          <div class="relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center border border-white/10">
            <div class="flex justify-center mb-8">
              <div
                class="w-20 h-24 flex items-center justify-center shadow-xl"
                style="clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)"
                :style="{ background: modalCat?.gradient }"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" class="w-9 h-9">
                  <g v-html="sanitizeSvg(modalCat?.icon)" />
                </svg>
              </div>
            </div>

            <h2 class="text-2xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">Próximamente</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
              Esta métrica detallada tendrá una
              <span class="font-bold text-teal-600 dark:text-teal-400">próxima implementación en móvil</span>.
            </p>

            <button
              @click="showComingSoonModal = false"
              class="w-full py-4 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-teal-600 transition-all shadow-lg"
            >
              Entendido
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Health Detail Modal -->
    <Teleport to="body">
      <Transition name="detail-modal">
        <div v-if="showDetailModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity" @click="closeDetailModal"></div>
          
          <div class="relative bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
            <!-- Modal Header (Gradient) -->
            <div class="relative h-48 sm:h-64 flex-shrink-0 flex items-center justify-center overflow-hidden" :style="{ background: detailCat?.gradient }">
              <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
              
              <button 
                @click="closeDetailModal"
                class="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:rotate-90 z-20"
              >
                ✕
              </button>

              <div class="relative z-10 text-center text-white px-6">
                <div class="flex items-center justify-center gap-6 mb-4">
                  <div class="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl shadow-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-10 h-10">
                      <g v-html="sanitizeSvg(detailCat?.icon)" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <h2 class="text-4xl sm:text-5xl font-black tracking-tighter">{{ detailCat?.nombre }}</h2>
                    <p class="text-white/70 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Métricas de Bienestar</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Content (Scrollable) -->
            <div class="flex-1 overflow-y-auto p-8 sm:p-12 custom-scrollbar">
              <div v-if="detailLoading" class="flex flex-col items-center justify-center py-20 gap-4">
                <div class="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-slate-400 font-bold text-sm uppercase tracking-widest">Cargando métricas...</p>
              </div>

              <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <!-- Charts / Trends -->
                <div class="lg:col-span-7 space-y-8">
                  <div class="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700">
                    <div class="flex items-center justify-between mb-8">
                      <div>
                        <h3 class="text-lg font-black text-slate-800 dark:text-white">Histórico de salud</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Evolución de los últimos 6 meses</p>
                      </div>
                      <div class="px-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-[10px] font-black text-teal-600 tracking-widest uppercase shadow-sm">
                        SCORE %
                      </div>
                    </div>

                    <!-- SVG Chart Logic Simplified -->
                    <div class="relative h-48 w-full mt-4">
                       <svg viewBox="0 0 500 150" class="w-full h-full" preserveAspectRatio="none">
                         <defs>
                           <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.2"/>
                             <stop offset="100%" stop-color="#14b8a6" stop-opacity="0"/>
                           </linearGradient>
                         </defs>
                         <!-- Simple area chart -->
                         <path 
                           :d="chartData.areaPath" 
                           fill="url(#chartGrad)" 
                         />
                         <path 
                           :d="chartData.linePath" 
                           fill="none" 
                           stroke="#14b8a6" 
                           stroke-width="4" 
                           stroke-linecap="round" 
                           stroke-linejoin="round"
                         />
                         <!-- Points -->
                         <circle 
                            v-for="(p, i) in chartData.points" :key="i"
                            :cx="p.x" :cy="p.y" r="5" 
                            fill="white" stroke="#14b8a6" stroke-width="3"
                         />
                       </svg>
                       <!-- Months -->
                       <div class="flex justify-between mt-6 px-4">
                         <span v-for="m in meses" :key="m" class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ m }}</span>
                       </div>
                    </div>
                  </div>

                  <div class="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-3xl border border-teal-100 dark:border-teal-800/50 flex items-start gap-4">
                    <span class="text-2xl">⚡</span>
                    <p class="text-xs text-teal-800 dark:text-teal-300 font-medium leading-relaxed">
                      Este índice se calcula basándose en tus últimas métricas y el cumplimiento de objetivos. Mantenerlo por encima del 80% indica un estado de salud óptimo.
                    </p>
                  </div>
                </div>

                <!-- Metrics List -->
                <div class="lg:col-span-5 space-y-4">
                  <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Valores Actuales</h3>
                  <div 
                    v-for="ind in detailInfo?.indicadores" 
                    :key="ind.nombre"
                    class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group/item hover:border-teal-500/30 transition-all"
                  >
                    <div>
                      <p class="text-sm font-black text-slate-800 dark:text-white mb-1">{{ ind.nombre }}</p>
                      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Última medición</p>
                    </div>
                    <div class="text-right">
                      <div class="text-xl font-black text-slate-900 dark:text-white">
                        {{ ind.valor }}<span class="text-xs text-slate-400 ml-1 font-medium">{{ ind.unidad }}</span>
                      </div>
                      <span 
                        class="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter"
                        :class="ind.estado === 'NORMAL' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40' : 'bg-red-100 text-red-700 dark:bg-red-900/40'"
                      >
                        {{ ind.estado }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                @click="closeDetailModal"
                class="px-10 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getSaludResumen, getSaludDetalle } from '../../../services/profileService'
import { sanitizeSvg } from '../../../utils/sanitize'

const loading = ref(true)
const showDetailModal = ref(false)
const showComingSoonModal = ref(false)
const detailLoading = ref(false)
const detailCat = ref(null)
const modalCat = ref(null)
const detailInfo = ref(null)

const visualConfig = {
  CARDIO: {
    nombre: 'Cardio',
    gradient: 'linear-gradient(135deg,#f43f5e,#be123c)',
    icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
  },
  METABOLISMO: {
    nombre: 'Metabolismo',
    gradient: 'linear-gradient(135deg,#f97316,#b45309)',
    icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'
  },
  ACTIVIDAD: {
    nombre: 'Actividad',
    gradient: 'linear-gradient(135deg,#22c55e,#15803d)',
    icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    comingSoon: true
  },
  NUTRICION: {
    nombre: 'Nutrición',
    gradient: 'linear-gradient(135deg,#14b8a6,#0f766e)',
    icon: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    comingSoon: true
  },
  AUDICION: {
    nombre: 'Audición',
    gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)',
    icon: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>'
  },
  PULMONES: {
    nombre: 'Pulmones',
    gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    icon: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2"/><path d="M10.59 19.41A2 2 0 1 0 14 16H2"/><path d="M15.73 13.73A2.5 2.5 0 1 1 19.5 12H2"/>'
  }
}

const categorias = ref([])

const handleClick = async (cat) => {
  if (cat.comingSoon) {
    modalCat.value = cat
    showComingSoonModal.value = true
    return
  }
  
  detailCat.value = cat
  showDetailModal.value = true
  detailLoading.value = true
  try {
    const data = await getSaludDetalle(cat.id.toUpperCase())
    detailInfo.value = data
  } catch (err) {
    console.error('Error cargando detalles:', err)
  } finally {
    detailLoading.value = false
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  detailInfo.value = null
}

// Chart Logic simplified for Modal
const chartData = computed(() => {
  if (!detailInfo.value?.historico) return { linePath: '', areaPath: '', points: [] }
  const history = detailInfo.value.historico
  const data = history.map(h => h.porcentaje)
  const W = 500, H = 150
  const step = W / (data.length - 1)
  
  let linePath = `M 0 ${H - (data[0] * H / 100)}`
  const points = []
  
  data.forEach((v, i) => {
    const x = i * step
    const y = H - (v * H / 100)
    if (i > 0) linePath += ` L ${x} ${y}`
    points.push({ x, y })
  })
  
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`
  return { linePath, areaPath, points }
})

const meses = computed(() => {
  if (!detailInfo.value?.historico) return []
  return detailInfo.value.historico.map(h => {
    const d = new Date(h.fecha)
    return d.toLocaleString('es-ES', { month: 'short' }).toUpperCase()
  })
})

onMounted(async () => {
  try {
    const data = await getSaludResumen()
    categorias.value = data.categorias.map(cat => {
      const isComingSoon = visualConfig[cat.nombre]?.comingSoon
      return {
        id: cat.nombre.toLowerCase(),
        ...visualConfig[cat.nombre],
        porcentaje: isComingSoon ? 0 : cat.porcentaje,
        variacion: isComingSoon ? 0 : cat.variacion
      }
    })
  } catch (err) {
    console.error('Error cargando resumen de salud:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.perspective-1000 { perspective: 1000px; }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

/* Animations */
.detail-modal-enter-active, .detail-modal-leave-active,
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.detail-modal-enter-from, .detail-modal-leave-to,
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
