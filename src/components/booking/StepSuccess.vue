<template>
  <div class="step-container flex flex-col items-center justify-center text-center py-4">
    <!-- Icono animado de éxito -->
    <div class="success-icon-wrapper mb-6">
      <div class="success-circle">
        <svg class="success-check" viewBox="0 0 52 52">
          <circle class="success-circle-bg" cx="26" cy="26" r="25" fill="none" />
          <path class="success-check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>
    </div>

    <h2 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3">
      ¡Cita Reservada con Éxito!
    </h2>
    <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
      Tu cita ha sido confirmada. Recibirás una notificación con los detalles.
    </p>

    <!-- Resumen de la cita -->
    <div class="w-full max-w-md bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 mb-8 text-left">
      <h3 class="font-bold text-sm text-accent uppercase tracking-wider mb-4">Resumen de tu cita</h3>
      
      <div class="space-y-3">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div>
            <p class="text-xs text-slate-400 dark:text-slate-500">Hospital</p>
            <p class="font-medium text-slate-800 dark:text-white text-sm">{{ bookingData.location?.name || '---' }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          </div>
          <div>
            <p class="text-xs text-slate-400 dark:text-slate-500">Especialidad</p>
            <p class="font-medium text-slate-800 dark:text-white text-sm">{{ bookingData.specialtyName || bookingData.specialty?.nombre || '---' }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <div>
            <p class="text-xs text-slate-400 dark:text-slate-500">Médico</p>
            <p class="font-medium text-slate-800 dark:text-white text-sm">{{ bookingData.doctor?.name || '---' }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p class="text-xs text-slate-400 dark:text-slate-500">Fecha y Hora</p>
            <p class="font-bold text-accent text-sm">{{ formatDate(bookingData.date) }} — {{ bookingData.time || '---' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <button
        @click="goToCitas"
        class="flex-1 bg-accent hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
      >
        Ver mis citas
      </button>
      <button
        @click="$emit('restart')"
        class="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
      >
        Agendar otra cita
      </button>
      <button
        @click="$emit('close')"
        class="flex-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white font-medium py-3 px-6 rounded-xl transition-colors"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { closeBooking } from '../../store/bookingModal';
import { setSection } from '../../store/profile';

const props = defineProps(['bookingData']);
const emit = defineEmits(['restart', 'close']);
const router = useRouter();

const formatDate = (dateString) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const goToCitas = () => {
  closeBooking();
  setSection('citas');
  router.push('/perfil');
};
</script>

<style scoped>
.success-icon-wrapper {
  width: 80px;
  height: 80px;
}

.success-circle {
  width: 80px;
  height: 80px;
}

.success-circle svg {
  width: 80px;
  height: 80px;
}

.success-circle-bg {
  stroke: var(--accent, #0d9488);
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke-draw 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.success-check-path {
  stroke: var(--accent, #0d9488);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke-draw 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
}

@keyframes stroke-draw {
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
