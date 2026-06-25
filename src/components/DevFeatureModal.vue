<script setup>
// Modal global "Funcionalidad en desarrollo". Se controla con el store devModal.
import { isDevModalOpen, closeDevModal } from '../store/devModal';
</script>

<template>
  <Teleport to="body">
    <Transition name="dev-fade">
      <div v-if="isDevModalOpen" class="fixed inset-0 z-[10000] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" @click="closeDevModal"></div>
        <div class="relative bg-white dark:bg-slate-900 rounded-[2rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-700 text-center">
          <div class="mx-auto mb-6 w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
            <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter uppercase">Funcionalidad en desarrollo</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
            Esta opción todavía no está disponible. Estamos trabajando en ella y llegará en una próxima actualización.
          </p>
          <button @click="closeDevModal" class="w-full py-4 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-teal-600 transition-all shadow-xl">
            Entendido
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dev-fade-enter-active, .dev-fade-leave-active { transition: opacity 0.2s ease; }
.dev-fade-enter-from, .dev-fade-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .dev-fade-enter-active, .dev-fade-leave-active { transition: none; }
}
</style>
