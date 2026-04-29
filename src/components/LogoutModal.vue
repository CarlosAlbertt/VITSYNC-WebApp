<script setup>

/**
 * LogoutModal.vue
 * 
 * Modal de confirmación para cerrar sesión.
 * Diseñado para ser reutilizable: recibe título/mensaje por props
 * y emite 'confirm' o 'cancel' al padre.
 * 
 * Props:
 * - visible (Bolean): Controla si el modal se muestra
 * 
 * Emits:
 * - confirm: El usuario quiere cerrar sesión
 * - cancel: El usuario cancela la acción 
 */

 defineProps({
    visible: {
        type: Boolean,
        required: true,
    }
 })
 const emit = defineEmits(['confirm', 'cancel'])
</script>
<template>
    <!-- Overlay oscuro de fondo (cierra el modal al hacer click fuera) -->

    <Transition name="fade">

        <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
         <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('cancel')"></div>

         <!-- Contenido del modal -->
          <Transition name="scale-up">
            <div v-if="visible" class="relative z-10 bg-white dark:bg-dark-card rounded-2x1 shadow-2x1 p-8 max-w-sm w-full mx-4 text-center">
            
            <!-- Icono -->
            <div class="mx-auto mb-4 w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">

                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">

                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 
                                     01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
            </div>

            <!-- Título -->
             <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                ¿Cerrar sesión?
             </h3>

             <!-- Mensaje -->
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Vas a salir de tu cuenta. Tendrás que volver a iniciar sesión para acceder.
              </p>

              <!-- Botones de acción -->
               <div class="flex gap-3">
                <!-- Cancelar -->
                 <button
                    @click="emit('cancel')"
                    class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
                        border border-slate-200 dark:border-dark-border
                        text-slate-700 dark:text-slate-300
                        hover:bg-slate-50 dark:hover:bg-dark-surface
                        transition-colors duration-200"
                 >
                Cancelar
                </button>

                <!-- Confirmar logout -->
                 <button
                    @click="emit('confirm')"
                    class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
                        bg-danger text-white
                        hover:bg-rose-600
                        transition-colors duration-200"
                 >
                    Cerrar sesión
                 </button>
               </div>
            </div>
        </Transition>
        </div>
    </Transition>
</template>

<style scoped>

/* Animación del backdrop (fade) */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Animación del modal (escala + fade) */
.scale-up-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-up-leave-active {
    opacity: 0;
    transform: scale(0.9);
}

.scale-up-enter-from {
    opacity: 0;
    transform: scale(0.9);
}

.scale-up-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>