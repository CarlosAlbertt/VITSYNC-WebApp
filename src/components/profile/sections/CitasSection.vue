<template>
  <div>
    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5">Mis Citas Médicas</h2>

    <!-- Tabs próximas / pasadas -->
    <div class="flex gap-1 mb-5 border-b border-gray-200 dark:border-gray-700">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 text-sm font-medium border-b-2 transition-all"
        :class="activeTab === tab.id
          ? 'border-teal-600 text-teal-700 dark:text-teal-400'
          : 'border-transparent text-gray-500 hover:text-teal-600 dark:text-gray-400'"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="ml-1 bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded-full">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Cargando -->
    <LoadingSpinner v-if="loading" size="lg" class="my-10" />

    <!-- Sin citas -->
    <EmptyState
      v-else-if="!filteredAppointments.length"
      :title="activeTab === 'upcoming' ? 'No tienes citas programadas' : 'Sin citas pasadas'"
      :description="activeTab === 'upcoming' ? 'Solicita una cita con tu médico para empezar.' : 'Aquí aparecerán tus consultas anteriores.'"
    />

    <!-- Lista de citas -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppointmentCard
        v-for="appt in filteredAppointments"
        :key="appt.id"
        :appointment="appt"
        @cancel="confirmCancel"
      />
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import EmptyState from '../EmptyState.vue';
import AppointmentCard from '../AppointmentCard.vue';
import ConfirmModal from '../ConfirmModal.vue';
import { getAppointments, cancelAppointment } from '../../../services/profileService';
import { showToast } from '../../../store/profile';

const appointments = ref([]);
const loading = ref(false);
const activeTab = ref('upcoming');
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
