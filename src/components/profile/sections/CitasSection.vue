<template>
  <div>
    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5">Mis Citas Médicas</h2>

    <!-- Tabs próximas / pasadas y Toggle vista -->
    <div class="flex items-center justify-between mb-5 border-b border-gray-200 dark:border-gray-700">
      <div class="flex gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-[1px]"
          :class="activeTab === tab.id
            ? 'border-teal-600 text-teal-700 dark:text-teal-400'
            : 'border-transparent text-gray-500 hover:text-teal-600 dark:text-gray-400'"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="ml-1 bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded-full">{{ tab.count }}</span>
        </button>
      </div>

      <div class="flex gap-1 pb-1 pr-2" v-if="activeTab === 'upcoming'">
        <button @click="viewMode = 'list'" class="p-1 px-2 rounded-lg transition-colors text-sm font-medium" :class="viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'">
          Lista
        </button>
        <button @click="viewMode = 'calendar'" class="p-1 px-2 rounded-lg transition-colors text-sm font-medium" :class="viewMode === 'calendar' ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'">
          Calendario
        </button>
      </div>
    </div>

    <!-- Cargando -->
    <LoadingSpinner v-if="loading" size="lg" class="my-10" />

    <!-- Sin citas -->
    <EmptyState
      v-else-if="!filteredAppointments.length"
      :title="activeTab === 'upcoming' ? 'No tienes citas programadas' : 'Sin citas pasadas'"
      :description="activeTab === 'upcoming' ? 'Solicita una cita con tu médico para empezar.' : 'Aquí aparecerán tus consultas anteriores.'"
    />

    <!-- Lista o Calendario de citas -->
    <div v-else>
      <div v-if="viewMode === 'calendar' && activeTab === 'upcoming'" class="mb-4">
        <Calendar 
          :appointments="filteredAppointments" 
          @select-appointment="handleSelectAppointment" 
        />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="viewMode === 'list' || activeTab === 'past'">
        <AppointmentCard
          v-for="appt in filteredAppointments"
          :key="appt.id"
          :appointment="appt"
          @cancel="confirmCancel"
          @start-video="startVideo"
          @upload-docs="uploadDocs"
        />
      </div>
    </div>

    <!-- Modal cancelación -->
    <ConfirmModal
      v-model="showCancelModal"
      title="Cancelar cita"
      :message="`¿Quieres cancelar la cita con ${cancelTarget?.doctor} el ${cancelTarget ? formatDate(cancelTarget.date) : ''}?`"
      confirm-text="Sí, cancelar"
      cancel-text="No, mantener"
      variant="danger"
      :show-input="true"
      input-label="Motivo (opcional)"
      input-placeholder="Ej: Conflicto de agenda"
      :loading="cancelling"
      @confirm="doCancel"
    />

    <!-- Input file oculto para docs -->
    <input type="file" ref="docUploadInput" class="hidden" @change="handleDocUpload" accept=".pdf,.png,.jpg,.jpeg" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import EmptyState from '../EmptyState.vue';
import AppointmentCard from '../AppointmentCard.vue';
import ConfirmModal from '../ConfirmModal.vue';
import Calendar from '../Calendar.vue';
import { getAppointments, cancelAppointment, uploadAppointmentDoc } from '../../../services/profileService';
import { showToast } from '../../../store/profile';

const appointments = ref([]);
const loading = ref(false);
const activeTab = ref('upcoming');
const viewMode = ref('list');
const showCancelModal = ref(false);
const cancelTarget = ref(null);
const cancelling = ref(false);

const tabs = computed(() => [
  { id: 'upcoming', label: 'Próximas', count: upcomingCount.value },
  { id: 'past',     label: 'Pasadas',  count: 0 }
]);

const today = new Date().toISOString().split('T')[0];

const upcomingCount = computed(() =>
  appointments.value.filter(a => a.date >= today && ['Programada','Confirmada'].includes(a.status)).length
);

const filteredAppointments = computed(() => {
  if (activeTab.value === 'upcoming') {
    return appointments.value
      .filter(a => a.date >= today && ['Programada','Confirmada'].includes(a.status))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
  return appointments.value
    .filter(a => a.date < today || ['Completada','Cancelada'].includes(a.status))
    .sort((a, b) => b.date.localeCompare(a.date));
});

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
};

const confirmCancel = (appt) => {
  // Validar política: >24h de anticipación
  const apptDate = new Date(appt.date + 'T' + appt.time);
  const diff = apptDate - new Date();
  if (diff < 24 * 60 * 60 * 1000) {
    showToast('Solo puedes cancelar citas con más de 24 horas de antelación', 'error');
    return;
  }
  cancelTarget.value = appt;
  showCancelModal.value = true;
};

const handleSelectAppointment = (appt) => {
  showToast(`Cita con ${appt.doctor} el ${formatDate(appt.date)} a las ${appt.time}`, 'info');
};

const startVideo = (appt) => {
  showToast(`Iniciando videoconsulta con ${appt.doctor}...`, 'info');
};

const docUploadInput = ref(null);
const docTargetAppt = ref(null);

const uploadDocs = (appt) => {
  docTargetAppt.value = appt;
  docUploadInput.value.click();
};

const handleDocUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || !docTargetAppt.value) return;
  
  showToast(`Subiendo documento a la cita con ${docTargetAppt.value.doctor}...`, 'info');
  try {
    await uploadAppointmentDoc(docTargetAppt.value.id, file);
    showToast('Documento subido y enlazado correctamente', 'success');
  } catch (err) {
    showToast('Error al subir documento', 'error');
  } finally {
    event.target.value = '';
    docTargetAppt.value = null;
  }
};

const doCancel = async (reason) => {
  if (!cancelTarget.value) return;
  cancelling.value = true;
  try {
    await cancelAppointment(cancelTarget.value.id, reason);
    cancelTarget.value.status = 'Cancelada';
    showCancelModal.value = false;
    showToast('Cita cancelada correctamente');
  } catch {
    showToast('Error al cancelar la cita', 'error');
  } finally {
    cancelling.value = false;
    cancelTarget.value = null;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    appointments.value = await getAppointments();
  } finally {
    loading.value = false;
  }
});
</script>
