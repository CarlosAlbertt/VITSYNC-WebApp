<template>
  <Teleport to="body">
    <Transition name="booking-modal">
      <div v-if="visible" class="fixed inset-0 z-[9990] flex items-center justify-center" @click.self="handleClose">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Modal Container -->
        <div class="relative z-10 w-full h-full md:h-auto md:max-h-[94vh] md:max-w-5xl lg:max-w-6xl md:mx-4 bg-white dark:bg-[var(--bg-surface)] md:rounded-2xl shadow-2xl border-0 md:border border-slate-100 dark:border-[var(--border)] overflow-hidden flex flex-col">
          
          <!-- Botón de cierre -->
          <button 
            @click="handleClose"
            class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        
          <!-- Header del Stepper -->
          <div class="bg-accent text-white p-6 md:p-8 text-center flex-shrink-0">
            <h1 class="text-2xl md:text-3xl font-bold mb-1">Agendar Cita Médica</h1>
            <p class="text-white/80 text-sm">Sigue los pasos para programar tu consulta en VitSync</p>
            
            <!-- Indicadores de Progreso -->
            <div v-if="currentStep <= totalSteps" class="flex justify-center items-center mt-6 space-x-1 md:space-x-3">
              <div v-for="step in totalSteps" :key="step" class="flex items-center">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300',
                  currentStep === step ? 'bg-white text-accent' : 
                  currentStep > step ? 'bg-teal-400 text-white' : 'bg-teal-700 text-white/50'
                ]">
                  {{ currentStep > step ? '✓' : step }}
                </div>
                <div v-if="step < totalSteps" :class="[
                  'w-6 md:w-12 h-1 mx-1 rounded-full transition-colors duration-300',
                  currentStep > step ? 'bg-teal-400' : 'bg-teal-700/50'
                ]"></div>
              </div>
            </div>

            <!-- Header especial para paso de éxito -->
            <div v-else class="mt-4">
              <div class="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold">
                <span>✓</span> Reserva completada
              </div>
            </div>
          </div>

          <!-- Contenido Dinámico de los Pasos -->
          <div class="p-6 md:p-8 min-h-[380px] md:min-h-[480px] overflow-y-auto flex-1 flex flex-col relative">
            <Transition name="fade" mode="out-in">
              <div :key="currentStep === totalSteps + 1 ? 'success' : `${currentStep}-${confirmKey}`" class="w-full h-full flex flex-col flex-1">
                <StepSuccess
                  v-if="currentStep > totalSteps"
                  :bookingData="bookingData"
                  @restart="restartBooking"
                  @close="handleClose"
                />
                <component 
                  v-else
                  :is="currentStepComponent" 
                  :bookingData="bookingData"
                  @next="nextStep"
                  @back="prevStep"
                  @submit="submitBooking"
                />
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import { crearCita } from '../store/citas';
import { closeBooking, initialBookingData } from '../store/bookingModal';
import { showToast } from '../store/profile';

import StepLocation from '../components/booking/StepLocation.vue';
import StepSpecialty from '../components/booking/StepSpecialty.vue';
import StepDoctor from '../components/booking/StepDoctor.vue';
import StepCalendar from '../components/booking/StepCalendar.vue';
import StepConfirmation from '../components/booking/StepConfirmation.vue';
import StepSuccess from '../components/booking/StepSuccess.vue';

const props = defineProps({
  visible: { type: Boolean, default: false }
});
const emit = defineEmits(['close']);

const currentStep = ref(1);
const totalSteps = 5;
// Se incrementa al fallar el envío para remontar el paso de confirmación y
// liberar su estado "Confirmando..." (botón deshabilitado).
const confirmKey = ref(0);

// Estado global de la reserva
const bookingData = reactive({
  location: null,
  specialty: null,
  specialtyName: null,
  doctor: null,
  date: null,
  time: null,
  reason: ''
});

// Cuando se abre el modal, aplicar datos iniciales si existen
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    if (initialBookingData.value) {
      Object.assign(bookingData, initialBookingData.value);
    }
  } else {
    // Resetear data al cerrar el modal (después de la animación)
    setTimeout(() => restartBooking(), 300);
  }
});

const steps = [
  StepLocation,
  StepSpecialty,
  StepDoctor,
  StepCalendar,
  StepConfirmation
];

const currentStepComponent = computed(() => steps[currentStep.value - 1]);

const nextStep = (data) => {
  Object.assign(bookingData, data);
  
  if (currentStep.value < totalSteps) {
    // Si estamos en StepLocation (1) y ya hay especialidad seleccionada, saltamos a StepDoctor (3)
    if (currentStep.value === 1 && bookingData.specialty) {
      currentStep.value = 3;
    } else {
      currentStep.value++;
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    // Si estamos en StepDoctor (3) y la especialidad vino pre-seleccionada desde fuera,
    // al darle atrás permitimos ir al StepSpecialty (2) para que el usuario pueda cambiarla si quiere.
    currentStep.value--;
  }
};

const submitBooking = async (finalData) => {
  Object.assign(bookingData, finalData);

  const result = await crearCita(bookingData);
  if (result?.success) {
    // Solo avanzamos a "éxito" si el backend confirmó la reserva
    currentStep.value = totalSteps + 1;
  } else {
    // El POST falló: avisamos y remontamos la confirmación para reactivar el botón
    showToast(result?.message || 'No se pudo agendar la cita. Inténtalo de nuevo.', 'error');
    confirmKey.value++;
  }
};

const restartBooking = () => {
  currentStep.value = 1;
  Object.assign(bookingData, {
    location: null,
    specialty: null,
    specialtyName: null,
    doctor: null,
    date: null,
    time: null,
    reason: ''
  });
};

const handleClose = () => {
  closeBooking();
  emit('close');
  // Reset al cerrar para que la próxima apertura empiece limpia
  setTimeout(() => {
    restartBooking();
  }, 300);
};

// Resetear cuando se oculta
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      restartBooking();
    }, 300);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.booking-modal-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.booking-modal-leave-active {
  transition: all 0.25s ease-in;
}
.booking-modal-enter-from {
  opacity: 0;
}
.booking-modal-enter-from > div:last-child {
  transform: scale(0.95) translateY(20px);
}
.booking-modal-leave-to {
  opacity: 0;
}
.booking-modal-leave-to > div:last-child {
  transform: scale(0.97) translateY(10px);
}
</style>
