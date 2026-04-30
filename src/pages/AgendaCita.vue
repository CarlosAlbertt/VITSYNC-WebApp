<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[var(--bg-base)] flex flex-col font-sans transition-colors duration-300">
    <Header />

    <main class="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div class="max-w-4xl w-full bg-white dark:bg-[var(--bg-surface)] rounded-2xl shadow-xl border border-slate-100 dark:border-[var(--border)] overflow-hidden">
        
        <!-- Header del Stepper -->
        <div class="bg-accent text-white p-8 text-center">
          <h1 class="text-3xl font-bold mb-2">Agendar Cita Médica</h1>
          <p class="text-white/80">Sigue los pasos para programar tu consulta en VitSync</p>
          
          <!-- Indicadores de Progreso -->
          <div class="flex justify-center items-center mt-8 space-x-2 md:space-x-4">
            <div v-for="step in 5" :key="step" class="flex items-center">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300',
                currentStep === step ? 'bg-white text-accent' : 
                currentStep > step ? 'bg-teal-400 text-white' : 'bg-teal-700 text-white/50'
              ]">
                {{ currentStep > step ? '✓' : step }}
              </div>
              <div v-if="step < 5" :class="[
                'w-8 md:w-16 h-1 mx-1 md:mx-2 rounded-full transition-colors duration-300',
                currentStep > step ? 'bg-teal-400' : 'bg-teal-700/50'
              ]"></div>
            </div>
          </div>
        </div>

        <!-- Contenido Dinámico de los Pasos -->
        <div class="p-8 min-h-[400px] relative">
          <!-- Transición suave entre componentes -->
          <Transition name="fade" mode="out-in">
            <component 
              :is="currentStepComponent" 
              :key="currentStep"
              :bookingData="bookingData"
              @next="nextStep"
              @back="prevStep"
              @submit="submitBooking"
            />
          </Transition>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { crearCita } from '../store/citas';
import Header from '../components/HeaderComponent.vue';
import Footer from '../components/FooterComponent.vue';

import StepLocation from '../components/booking/StepLocation.vue';
import StepSpecialty from '../components/booking/StepSpecialty.vue';
import StepDoctor from '../components/booking/StepDoctor.vue';
import StepCalendar from '../components/booking/StepCalendar.vue';
import StepConfirmation from '../components/booking/StepConfirmation.vue';

const router = useRouter();
const currentStep = ref(1);

// Estado global de la reserva
const bookingData = reactive({
  location: null,
  specialty: null,
  doctor: null,
  date: null,
  time: null,
  reason: ''
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
  if (currentStep.value < 5) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const submitBooking = async (finalData) => {
  Object.assign(bookingData, finalData);
  
  try {
    // Llama al store para hacer el POST al backend
    await crearCita(bookingData);
    alert('¡Cita reservada con éxito! Revisa tu perfil o tu correo.');
    router.push('/perfil'); // Redirige al perfil para ver la cita en "Citas Programadas"
  } catch (error) {
    alert('Hubo un error al reservar la cita. Inténtalo de nuevo.');
  }
};
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
</style>
