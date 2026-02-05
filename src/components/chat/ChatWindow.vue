<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { messages, addMessage, activeChatRecipient, setRecipient } from '../../store/chat';
import { sendMessage as sendSocketMessage, connectWebSocket } from '../../services/websocket';
import { currentUser } from '../../store/auth'; // Importar usuario real
import { getMyMedicos, getMyPacientes } from '../../services/relationships';

const emit = defineEmits(['close']); // Para cerrar desde la X
const newMessageText = ref('');
const messagesContainer = ref(null);
const tempRecipientInput = ref(''); // Input temporal para elegir destinatario
// Si ya hay destinatario elegido, mostramos el chat. Si no, la selección.
const showChat = computed(() => !!activeChatRecipient.value);
const contacts = ref([]);

onMounted(async () => {

    try{
        if(currentUser.value.role === 'PACIENTE'){
            contacts.value = await getMyMedicos(currentUser.value.id);
        }else{
            contacts.value = await getMyPacientes(currentUser.value.id);
        }
    }catch(error){
        console.error("Error cargando los contactos ", error);
    }
});
const selectRecipient = () => {
    if(tempRecipientInput.value) {
        setRecipient(tempRecipientInput.value);
    }
};
const handleSend = () => {
    const text = newMessageText.value.trim();
    if (text === '') return;
    const myNIF = currentUser.value.username; // O el campo correcto de tu auth
    const targetNIF = activeChatRecipient.value;
    // 1. Enviar al socket
    sendSocketMessage(targetNIF, text, myNIF);
    // 2. OPTIMISTIC UI: Añadirlo localmente YA (sin esperar server)
    addMessage({
        senderId: myNIF, // Asegúrate que tu lógica de comparar ID use Strings si NIF es string
        recipientId: targetNIF,
        content: text,
        timestamp: new Date().toISOString()
    });
    newMessageText.value = '';
};
watch(messages, async () => {
    await nextTick();
    if(messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
}, { deep: true });
</script>
<template>
  <div class="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 font-sans">
    
    <!-- HEADER -->
    <div class="bg-teal-600 p-4 flex justify-between items-center text-white shadow-md">
       <div class="flex flex-col">
           <span class="font-bold text-lg">Consulta Médica</span>
           <span v-if="activeChatRecipient" class="text-xs text-teal-100 opacity-90">Con: {{ activeChatRecipient }}</span>
       </div>
       <button @click="$emit('close')" class="hover:bg-teal-700 p-1 rounded transition">✕</button>
    </div>
    <!-- PANTALLA 1: SELECCIÓN DE DESTINATARIO (Si no hay nadie elegido) -->
    <div v-if="!showChat" class="flex-1 flex flex-col p-4 gap-4 bg-gray-50 overflow-y-auto">
    <p class="text-gray-600 text-center font-bold">Selecciona un chat:</p>
    
    <!-- Lista de Contactos -->
    <div v-for="contact in contacts" :key="contact.id" 
         @click="setRecipient(contact.nif)"
         class="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-teal-50 transition">
        
        <!-- Avatar generado con iniciales -->
        <div class="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            {{ contact.name.charAt(0) }}
        </div>
        
        <div class="flex flex-col">
            <span class="font-medium text-gray-800">{{ contact.name }} {{ contact.lastName }}</span>
            <span class="text-xs text-gray-400">NIF: {{ contact.nif }}</span>
        </div>
    </div>
    <!-- Mensaje si no hay contactos -->
    <p v-if="contacts.length === 0" class="text-center text-gray-400 text-sm mt-4">
        No tienes contactos asignados aún.
    </p>
</div>
    <!-- PANTALLA 2: MENSAJES -->
    <div v-else class="flex-1 bg-slate-50 overflow-y-auto p-4 flex flex-col gap-3" ref="messagesContainer">
       <div v-for="(msg, index) in messages" :key="index"
            class="max-w-[85%] p-3 rounded-2xl text-sm shadow-sm"
            :class="[
                msg.senderId === currentUser.username 
                ? 'bg-teal-600 text-white self-end rounded-br-none' 
                : 'bg-white text-gray-800 self-start border border-gray-200 rounded-bl-none'
            ]">
            {{ msg.content }}
       </div>
    </div>
    <!-- FOOTER (Input) -->
    <div v-if="showChat" class="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
       <input 
          v-model="newMessageText" 
          @keyup.enter="handleSend"
          placeholder="Escribe tu consulta..."
          class="flex-1 bg-gray-100/50 text-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 border border-transparent focus:border-teal-500/50 transition-all"
       />
       <button @click="handleSend" class="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-teal-700 shadow-lg shadow-teal-500/30 transition-transform active:scale-95">
          ➤
       </button>
    </div>
  </div>
</template>