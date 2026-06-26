<script setup>
/**
 * Cookie/storage notice (RGPD/LSSI).
 *
 * VitSync solo usa almacenamiento técnico imprescindible (cookie httpOnly de
 * sesión y preferencias de UI): no requiere consentimiento previo, pero sí
 * información clara. Si algún día se añade analítica, ese tracking deberá
 * BLOQUEARSE hasta consentimiento explícito en este componente.
 */
import { ref } from 'vue';
import { openDevModal } from '../store/devModal';

// localStorage es el sitio correcto para ESTA preferencia: no es dato
// personal, solo "ya he visto el aviso"
const STORAGE_KEY = 'vitsync_cookie_notice_ack';

const visible = ref(localStorage.getItem(STORAGE_KEY) !== '1');

const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    visible.value = false;
};
</script>

<template>
    <Transition name="consent">
        <div v-if="visible"
            class="fixed bottom-0 inset-x-0 z-[10000] p-4 sm:p-6"
            role="dialog" aria-live="polite" aria-label="Aviso de cookies">
            <div
                class="mx-auto max-w-3xl rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                    VitSync usa únicamente almacenamiento <strong>técnico imprescindible</strong>:
                    una cookie de sesión segura y tus preferencias de interfaz.
                    No usamos cookies de publicidad ni de seguimiento.
                    Más información en la
                    <a href="#" @click.prevent="openDevModal" class="text-teal-600 dark:text-teal-400 font-semibold underline">
                        Política de Privacidad</a>.
                </p>
                <button @click="accept"
                    class="shrink-0 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 transition-colors">
                    Entendido
                </button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.consent-enter-active,
.consent-leave-active {
    transition: all 0.3s ease;
}

.consent-enter-from,
.consent-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>
