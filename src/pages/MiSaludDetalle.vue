<template>
  <div v-if="loading" class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
     <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
  </div>
  <div v-else-if="categoria" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

    <!-- Header con gradiente -->
    <div class="py-12 px-6 shadow-lg" :style="{ background: categoria.gradient }">
      <div class="max-w-5xl mx-auto">
        <button
          @click="router.push('/perfil?section=misalud')"
          class="flex items-center gap-2 text-white/90 hover:text-white text-sm mb-8 transition-all hover:-translate-x-1 group"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 transition-transform group-hover:scale-110">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span class="font-medium">Volver a Mi Salud</span>
        </button>
<div class="flex flex-col md:flex-row items-center md:items-end gap-8">
          <div class="relative flex-shrink-0 group" style="width:140px;height:140px">
            <svg class="w-full h-full drop-shadow-xl" viewBox="0 0 120 120" style="transform:rotate(-90deg)">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="10"/>
              <circle
                cx="60" cy="60" r="52"
                fill="none" stroke="white" stroke-width="10" stroke-linecap="round"
                :stroke-dasharray="326.72"
                :stroke-dashoffset="326.72 * (1 - categoria.porcentaje / 100)"
                class="transition-all duration-1000 ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-white text-3xl font-extrabold">{{ Math.round(categoria.porcentaje) }}%</span>
            </div>
          </div>

          <div class="text-white text-center md:text-left">
            <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-2">{{ categoria.nombre }}</h1>
            <div class="flex items-center justify-center md:justify-start gap-3">
               <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{{ categoria.indicadores.length }} Indicadores</span>
               <span class="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
               <span class="text-white/80 text-sm font-medium">Actualizado recientemente</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Columna Izquierda: Gráfico y Resumen -->
        <div class="lg:col-span-7 space-y-8">
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 border border-gray-100 dark:border-gray-700 transition-colors">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">Tendencia histórica</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400">Evolución del índice de {{ categoria.nombre.toLowerCase() }}</p>
              </div>
              <div class="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: chartColor }"></span>
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300">Score %</span>
              </div>
            </div>
            
            <div class="relative h-64">
              <svg
                :viewBox="`0 0 ${W} ${H}`"
                class="w-full h-full text-gray-300 dark:text-gray-600"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient :id="`grad-${catId}`" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" :stop-color="chartColor" stop-opacity="0.3"/>
                    <stop offset="100%" :stop-color="chartColor" stop-opacity="0"/>
                  </linearGradient>
                </defs>

                <!-- Grid horizontales -->
                <line
                  v-for="tick in chart.yTicks" :key="'gl' + tick.y"
                  :x1="PL" :y1="tick.y" :x2="W - PR" :y2="tick.y"
                  stroke="currentColor" stroke-opacity="0.2" stroke-width="1" stroke-dasharray="4"
                />

                <!-- Área relleno -->
                <path :d="chart.areaPath" :fill="`url(#grad-${catId})`" class="transition-all duration-1000"/>

                <!-- Línea principal -->
                <path
                  :d="chart.linePath"
                  fill="none" :stroke="chartColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"
                  class="transition-all duration-1000"
                />

                <!-- Puntos -->
                <g v-for="(pt, i) in chart.points" :key="i">
                  <circle :cx="pt.x" :cy="pt.y" r="6" fill="white" :stroke="chartColor" stroke-width="3" class="transition-all duration-500 hover:r-8 cursor-pointer"/>
                  <text
                    :x="pt.x" :y="pt.y - 12"
                    text-anchor="middle"
                    class="text-[10px] font-bold fill-gray-600 dark:fill-gray-300 pointer-events-none"
                  >
                    {{ Math.round(pt.value) }}%
                  </text>
                </g>
              </svg>
              
              <!-- Eje X (meses) posicionado fuera del SVG para mejor control -->
              <div class="flex justify-between mt-4 px-[44px]">
                <span v-for="mes in meses" :key="mes" class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ mes }}</span>
              </div>
            </div>
          </div>

          <!-- Card Informativa Adicional -->
          <div class="bg-teal-50 dark:bg-teal-900/20 rounded-3xl p-6 border border-teal-100 dark:border-teal-800/50 flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white text-xl shadow-lg shadow-teal-200 dark:shadow-none">
              💡
            </div>
            <div>
              <h3 class="font-bold text-teal-900 dark:text-teal-100">¿Sabías qué?</h3>
              <p class="text-sm text-teal-700 dark:text-teal-300 mt-1 leading-relaxed">
                Mantener tu índice de {{ categoria.nombre.toLowerCase() }} por encima del 75% reduce significativamente los riesgos de salud a largo plazo. Consulta con tu médico si notas variaciones bruscas.
              </p>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Indicadores -->
        <div class="lg:col-span-5">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">Métricas detalladas</h2>
            <button class="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">Ver rangos de referencia</button>
          </div>
          <div class="space-y-4">
            <div
              v-for="ind in categoria.indicadores"
              :key="ind.nombre"
              class="bg-white dark:bg-gray-800 rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  📊
                </div>
                <div>
                  <p class="text-gray-800 dark:text-gray-100 font-bold text-sm">{{ ind.nombre }}</p>
                  <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Última medición</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-black text-gray-900 dark:text-gray-100">
                  {{ ind.valor }}<span class="text-xs font-medium text-gray-400 ml-1">{{ ind.unidad }}</span>
                </p>
                <span
                  class="text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter"
                  :class="ind.estado === 'NORMAL'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'"
                >
                  {{ ind.estado }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSaludDetalle } from '../services/profileService'

const route = useRoute()
const router = useRouter()
const loading = ref(true)

// ── Constantes SVG ──────────────────────────────────────────────
const W = 500, H = 180
const PL = 44, PR = 20, PT = 22, PB = 36
const CW = W - PL - PR   // 436
const CH = H - PT - PB   // 122

const catId = computed(() => route.params.categoria)

const visualConfig = {
  cardio: {
    nombre: 'Cardio',
    gradient: 'linear-gradient(135deg,#f43f5e,#be123c)',
    color: '#f43f5e'
  },
  metabolismo: {
    nombre: 'Metabolismo',
    gradient: 'linear-gradient(135deg,#f97316,#b45309)',
    color: '#f97316'
  },
  actividad: {
    nombre: 'Actividad',
    gradient: 'linear-gradient(135deg,#22c55e,#15803d)',
    color: '#22c55e'
  },
  nutricion: {
    nombre: 'Nutrición',
    gradient: 'linear-gradient(135deg,#14b8a6,#0f766e)',
    color: '#14b8a6'
  },
  audicion: {
    nombre: 'Audición',
    gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)',
    color: '#a855f7'
  },
  pulmones: {
    nombre: 'Pulmones',
    gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    color: '#3b82f6'
  }
}

const categoriaData = ref(null)

const categoria = computed(() => {
  if (!categoriaData.value) return null
  return {
    ...visualConfig[catId.value],
    porcentaje: categoriaData.value.porcentaje,
    indicadores: categoriaData.value.indicadores
  }
})

const chartColor = computed(() => visualConfig[catId.value]?.color ?? '#14b8a6')

const meses = computed(() => {
  if (!categoriaData.value?.historico) return []
  return categoriaData.value.historico.map(h => {
    const d = new Date(h.fecha)
    return d.toLocaleString('es-ES', { month: 'short' })
  })
})

const chart = computed(() => {
  const history = categoriaData.value?.historico || []
  const data = history.map(h => h.porcentaje)
  if (data.length < 1) return { points: [], linePath: '', areaPath: '', yTicks: [] }

  const dataMin = Math.min(...data, 0)
  const dataMax = Math.max(...data, 100)
  const vMin = Math.max(0, dataMin - 10)
  const vMax = Math.min(100, dataMax + 10)

  const toX = i => PL + (i / (Math.max(data.length - 1, 1))) * CW
  const toY = v => PT + ((vMax - v) / (vMax - vMin)) * CH

  const points = data.map((v, i) => ({ x: toX(i), y: toY(v), value: v }))

  let linePath = `M ${points[0].x} ${points[0].y}`
  if (points.length > 1) {
    for (let i = 1; i < points.length; i++) {
      const p = points[i - 1], c = points[i]
      const cpx = (p.x + c.x) / 2
      linePath += ` C ${cpx} ${p.y} ${cpx} ${c.y} ${c.x} ${c.y}`
    }
  } else {
    linePath += ` L ${points[0].x + 10} ${points[0].y}` // Línea mínima si solo hay un punto
  }

  const last = points[points.length - 1]
  const areaPath = `${linePath} L ${last.x} ${PT + CH} L ${points[0].x} ${PT + CH} Z`

  const yTicks = [vMax, Math.round((vMax + vMin) / 2), vMin].map(value => ({
    value,
    y: toY(value),
  }))

  return { points, linePath, areaPath, yTicks }
})

onMounted(async () => {
  try {
    const data = await getSaludDetalle(catId.value.toUpperCase())
    categoriaData.value = data
  } catch (err) {
    console.error('Error cargando detalle de salud:', err)
  } finally {
    loading.value = false
  }
})

watchEffect(() => {
  if (catId.value && !visualConfig[catId.value]) {
    router.replace('/perfil?section=misalud')
  }
})
</script>
