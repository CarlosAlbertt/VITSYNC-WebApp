import { ref } from 'vue';

// ESTADO (La Memoria)
// 'ref' hace que si esta variable cambia, la pantalla se actualice sola (Reactividad)
export const messages = ref([]);
export const isConnected = ref([false]);
export const activeRecipientId = ref(null);
export const activeChatRecipient = ref(null);

// MÉTODOS

// Añadir mensaje: Lo usamos cuando llega uno nuevo o enviamos uno
export const addMessage = (msg) => {
    messages.value.push(msg);
};

export const setRecipient = (recipientId) => {
    activeRecipientId.value = recipientId;
};

