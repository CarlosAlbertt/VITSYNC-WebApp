<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 transition-all hover:shadow-md">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{{ appointment.doctor }}</h4>
        </div>
        <p class="text-xs text-teal-600 dark:text-teal-400 font-medium">{{ appointment.specialty }}</p>
      </div>
      <span class="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ml-2" :class="statusClass">
        {{ appointment.status }}
      </span>
    </div>

    <!-- Detalles -->
    <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 mb-4">
      <div class="flex items-center gap-1">
        <span>{{ formatDate(appointment.date) }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span>{{ appointment.time }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span>{{ appointment.type }}</span>
      </div>
      <div v-if="appointment.location" class="flex items-center gap-1">
        <span class="truncate">{{ appointment.location }}</span>
      </div>
    </div>

    <p v-if="appointment.reason" class="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
      "{{ appointment.reason }}"
    </p>

    <!-- Acciones y Estados -->
    <div class="flex gap-2 flex-wrap items-center mt-2">
      <template v-if="showActions">
        <button
          v-if="appointment.type === 'Telemedicina'"
          @click="$emit('start-video', appointment)"
          class="px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm"
        >
          Iniciar videoconsulta
        </button>
        <button
          @click="$emit('upload-docs', appointment)"
          class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Subir docs
        </button>
        
        <!-- Botón Consultar (Añadir a contactos) -->
        <button
          @click="consultarMedico"
          :disabled="isAssigning"
          class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1 disabled:opacity-50"
        >
          <span v-if="isAssigning" class="animate-spin text-xs">⟳</span>
          <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          {{ isAssigning ? 'Añadiendo...' : 'Consultar' }}
        </button>

        <button
          @click="$emit('cancel', appointment)"
          class="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
        >
          Cancelar
        </button>
      </template>

      <div v-else-if="appointment.status === 'Completada'" class="text-xs text-gray-400 italic">
        Cita completada
      </div>
      <div v-else-if="appointment.status === 'Cancelada'" class="text-xs text-red-400 italic">
        Cita cancelada
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { openChatWith } from '../../store/chat';
import { assignPatientToProfessional } from '../../services/relationships';
import { currentUser } from '../../store/auth';

const props = defineProps({
  appointment: { type: Object, required: true }
});
defineEmits(['cancel', 'start-video', 'upload-docs']);

const isAssigning = ref(false);

const consultarMedico = async () => {
  if (!currentUser.value?.id) return;
  const medicoId = props.appointment.medicoId;
  
  if (!medicoId) {
    alert('No se pudo encontrar el ID del médico.');
    return;
  }

  isAssigning.value = true;
  try {
    // Intentamos añadir la relación en backend.
    await assignPatientToProfessional(currentUser.value.id, medicoId);
  } catch (error) {
    // Verificamos si el error es "Ya existe la relación". Si es así, lo ignoramos y abrimos el chat.
    // Si es otro error (ej: ID falso de los datos de prueba), mostramos un alert.
    const msg = error.response?.data || error.message;
    if (typeof msg === 'string' && msg.includes('Ya existe')) {
      console.log('El médico ya estaba en la lista de contactos.');
    } else {
      console.error('Error al añadir contacto:', error);
      alert('No se pudo añadir a contactos: ' + msg);
      isAssigning.value = false;
      return; // Detenemos la ejecución y no abrimos el chat
    }
  } finally {
    if (isAssigning.value) { // Solo si no ha hecho return en el catch
      isAssigning.value = false;
      
      // Abrimos el chat
      openChatWith({
        id: medicoId,
        name: props.appointment.doctor,
        role: 'doctor',
        photo: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(props.appointment.doctor || 'Dr')
      });
    }
  }
};

const showActions = computed(() => ['Programada', 'Confirmada'].includes(props.appointment.status));

const typeIcon = computed(() => props.appointment.type === 'Telemedicina' ? 'Virtual' : 'Presencial');

const statusClass = computed(() => ({
  'Programada':  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Confirmada':  'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'Completada':  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  'Cancelada':   'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'En curso':    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
}[props.appointment.status] || 'bg-gray-100 text-gray-600'));

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>
