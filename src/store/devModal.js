import { ref } from 'vue';

/**
 * Estado global del modal "Funcionalidad en desarrollo".
 *
 * Lo usan los controles aún no implementados (buscador del header, enlaces
 * informativos, preferencias de idioma/notificaciones, etc.) para avisar al
 * usuario en lugar de no hacer nada o fingir que funcionan.
 */
export const isDevModalOpen = ref(false);

export const openDevModal = () => { isDevModalOpen.value = true; };
export const closeDevModal = () => { isDevModalOpen.value = false; };
