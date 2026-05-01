<template>
  <div class="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm p-7 transition-all duration-300 hover:shadow-xl group">
    <!-- Header: Doctor & Status -->
    <div class="flex items-start justify-between mb-8">
      <div class="flex-1 min-w-0">
        <h4 class="text-xl font-black text-slate-800 dark:text-white truncate group-hover:text-teal-600 transition-colors tracking-tight">
          {{ appointment.doctor }}
        </h4>
        <p class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-[0.2em] mt-2">
          {{ appointment.specialty }}
        </p>
      </div>
      <span 
        class="flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-transparent"
        :class="statusClass"
      >
        {{ appointment.status }}
      </span>
    </div>

    <!-- Details Grid (No icons) -->
    <div class="grid grid-cols-2 gap-y-8 gap-x-4 mb-10">
      <div class="flex flex-col">
        <span class="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Fecha</span>
        <span class="text-base font-bold text-slate-700 dark:text-slate-200">{{ formatDate(appointment.date) }}</span>
      </div>
      
      <div class="flex flex-col">
        <span class="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Hora</span>
        <span class="text-base font-bold text-slate-700 dark:text-slate-200">{{ appointment.time }}</span>
      </div>

      <div class="flex flex-col">
        <span class="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Modalidad</span>
        <span class="text-base font-bold text-slate-700 dark:text-slate-200">{{ appointment.type }}</span>
      </div>

      <div v-if="appointment.location" class="flex flex-col">
        <span class="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Ubicación</span>
        <span class="text-base font-bold text-slate-700 dark:text-slate-200 truncate">{{ appointment.location }}</span>
      </div>
    </div>

    <!-- Reason (if exists) -->
    <div v-if="appointment.reason" class="mb-10 p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-l-4 border-teal-500/30">
      <span class="block text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">Motivo de consulta</span>
      <p class="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
        {{ appointment.reason }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/50">
      <div class="flex items-center gap-2">
        <div v-if="appointment.status === 'Completada'" class="text-teal-600 dark:text-teal-400 font-black text-[11px] uppercase tracking-widest">
          Cita Finalizada
        </div>
        <div v-else-if="appointment.status === 'Cancelada'" class="text-red-400 dark:text-red-500/60 font-black text-[11px] uppercase tracking-widest">
          Cita Cancelada
        </div>
        <div v-else class="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
          Cita Pendiente
        </div>
      </div>

      <button
        v-if="showActions"
        @click="$emit('cancel', appointment)"
        class="px-8 py-3 text-[11px] font-black uppercase tracking-[0.15em] rounded-xl bg-slate-900 text-white hover:bg-red-600 transition-all duration-300 shadow-lg shadow-slate-200 dark:shadow-none"
      >
        Anular Cita
      </button>
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
defineEmits(['cancel']);

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

const statusClass = computed(() => ({
  'Programada':  'bg-blue-50 text-blue-600 dark:bg-blue-500/10 border-blue-100/50',
  'Confirmada':  'bg-teal-50 text-teal-600 dark:bg-teal-500/10 border-teal-100',
  'Completada':  'bg-slate-100 text-slate-500 dark:bg-slate-700',
  'Cancelada':   'bg-red-50 text-red-500 dark:bg-red-500/10 border-red-100',
  'En curso':    'bg-amber-50 text-amber-600 dark:bg-amber-500/10 border-amber-100'
}[props.appointment.status] || 'bg-slate-100 text-slate-600'));

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
};
</script>
