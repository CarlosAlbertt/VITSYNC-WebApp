<template>
  <div>
    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5">Mis Informes Médicos</h2>

    <!-- Buscador y filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-4 flex flex-wrap gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por título, médico, especialidad..."
        class="flex-1 min-w-[200px] px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        @input="fetchReports"
      />
      <select
        v-model="filterType"
        class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        @change="fetchReports"
      >
        <option value="">Todos los tipos</option>
        <option v-for="t in reportTypes" :key="t" :value="t">{{ t }}</option>
      </select>
      <select
        v-model="filterStatus"
        class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        @change="fetchReports"
      >
        <option value="">Todos los estados</option>
        <option value="Disponible">Disponible</option>
        <option value="Revisado">Revisado</option>
        <option value="Archivado">Archivado</option>
      </select>
    </div>

    <!-- Cargando -->
    <LoadingSpinner v-if="loading" size="lg" class="my-10" />

    <!-- Sin resultados -->
    <EmptyState
      v-else-if="!reports.length"
      title="No hay informes"
      description="No se encontraron informes médicos con los filtros seleccionados."
    />

    <!-- Grid de informes -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ReportCard
        v-for="report in paginatedReports"
        :key="report.id"
        :report="report"
        @view="viewReport"
        @download="downloadReport"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
      <button
        @click="page--"
        :disabled="page === 1"
        class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        ← Anterior
      </button>
      <span class="text-sm text-gray-600 dark:text-gray-300">{{ page }} / {{ totalPages }}</span>
      <button
        @click="page++"
        :disabled="page === totalPages"
        class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        Siguiente →
      </button>
    </div>

    <!-- Modal detalle informe -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedReport" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="selectedReport = null">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-gray-800 dark:text-gray-100">{{ selectedReport.title }}</h3>
              <button @click="selectedReport = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">✕</button>
            </div>
            <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Tipo:</strong> {{ selectedReport.type }}</p>
              <p><strong>Especialidad:</strong> {{ selectedReport.specialty }}</p>
              <p><strong>Médico:</strong> {{ selectedReport.doctor }}</p>
              <p><strong>Fecha:</strong> {{ selectedReport.date }}</p>
              <p><strong>Estado:</strong> {{ selectedReport.status }}</p>
            </div>
            <div class="mt-5 flex gap-3 justify-end">
              <button @click="downloadReport(selectedReport)" class="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
                ⬇ Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import EmptyState from '../EmptyState.vue';
import ReportCard from '../ReportCard.vue';
import { getReports } from '../../../services/profileService';
import { showToast } from '../../../store/profile';

const reports = ref([]);
const loading = ref(false);
const search = ref('');
const filterType = ref('');
const filterStatus = ref('');
const page = ref(1);
const perPage = 10;
const selectedReport = ref(null);

const reportTypes = ['Laboratorio', 'Diagnóstico', 'Imagen', 'Receta electrónica', 'Consulta', 'Seguimiento'];

const totalPages = computed(() => Math.max(1, Math.ceil(reports.value.length / perPage)));
const paginatedReports = computed(() => {
  const start = (page.value - 1) * perPage;
  return reports.value.slice(start, start + perPage);
});

const fetchReports = async () => {
  loading.value = true;
  page.value = 1;
  try {
    reports.value = await getReports({
      search: search.value,
      type: filterType.value,
      status: filterStatus.value
    });
  } finally {
    loading.value = false;
  }
};

const viewReport = (report) => { selectedReport.value = report; };

const downloadReport = (report) => {
  // TODO: reemplazar con descarga real del backend
  showToast(`Descargando "${report.title}"...`, 'info');
};

const toggleFavorite = (report) => {
  report.favorite = !report.favorite;
  showToast(report.favorite ? 'Añadido a favoritos' : 'Eliminado de favoritos');
};

onMounted(fetchReports);
</script>

<style scoped>
.modal-enter-active { transition: all 0.3s ease; }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from  { opacity: 0; transform: scale(0.96); }
.modal-leave-to   { opacity: 0; }
</style>
