<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { messages } from '../../store/chat';
//import { sendMessage, connectWebSocket } from '../../services/websocket';
import { currentUser } from '../../store/auth';

// PROPS: Recibimos con quién hablamos
const props = defineProps({
    recipient: Object
});

const emit = defineEmits(['back']); // Para volver a la lista

const newMessageText = ref('');
const messagesContainer = ref(null);

onMounted(() => {
    connectWebSocket();
});

const handleSend = () => {
    if (newMessageText.value.trim() === '') return;
    
    // Usamos el ID del destinatario y MI ID (currentUser.value.id)
    sendMessage(props.recipient.id, newMessageText.value, currentUser.value.id);
    
    newMessageText.value = '';
};

// ... (El resto del script de watch/scroll se mantiene igual)
watch(messages, async () => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
});
</script>

<template>
  <div class="chat-card">
    <!-- Header Modificado con botón Volver -->
    <div class="chat-header">
        <button @click="$emit('back')" class="back-btn">←</button>
        <span>{{ recipient?.name || 'Chat' }}</span>
    </div>

    <!-- El resto del template se mantiene casi igual -->
    <div class="chat-body" ref="messagesContainer">
      <div 
        v-for="(msg, index) in messages" 
        :key="index"
        :class="['message-bubble', msg.senderId === currentUser.value.id ? 'sent' : 'received']"
      >
        {{ msg.content }}
      </div>
    </div>

    <div class="chat-footer">
      <input 
        v-model="newMessageText" 
        @keyup.enter="handleSend"
        placeholder="Escribe un mensaje..." 
      />
      <button @click="handleSend">Enviar</button>
    </div>
  </div>
</template>

<style scoped>
/* Agrega estos estilos nuevos, mantén los anteriores */
.chat-header { display: flex; align-items: center; gap: 10px; padding: 10px; background: #007bff; color: white; font-weight: bold; }
.back-btn { background: none; border: none; color: white; font-size: 1.2em; cursor: pointer; padding: 0 5px; }
/* ... (Resto de estilos) */
.chat-card { width: 300px; height: 400px; border: 1px solid #ccc; display: flex; flex-direction: column; background: white; }
.chat-body { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
.message-bubble { padding: 8px 12px; border-radius: 15px; max-width: 80%; word-wrap: break-word; }
.sent { align-self: flex-end; background-color: #007bff; color: white; border-bottom-right-radius: 2px; }
.received { align-self: flex-start; background-color: #f1f0f0; color: black; border-bottom-left-radius: 2px; }
.chat-footer { padding: 10px; display: flex; gap: 5px; border-top: 1px solid #eee; }
input { flex: 1; padding: 5px; border: 1px solid #ddd; border-radius: 4px; }
button { padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:hover { background-color: #0056b3; }
</style>
