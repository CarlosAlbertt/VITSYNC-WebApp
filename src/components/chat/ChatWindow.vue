<script setup>
import { onMounted, ref, watch } from 'vue';
import Talk from 'talkjs';
import { currentUser } from '../../store/auth';

const props = defineProps({
  isOpen: Boolean,
  recipientId: Number,
  recipientName: String,
  recipientRole: String,
  recipientPhoto: String
});

const emit = defineEmits(['close', 'back']);
const chatContainer = ref(null);
let session = null;
let chatbox = null;

onMounted(() => {
  if (props.isOpen) {
    initTalkJS();
  }
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    initTalkJS();
  }
});

watch(() => props.recipientId, () => {
    if (props.isOpen) {
        initTalkJS();
    }
});

const initTalkJS = async () => {
  await Talk.ready;
  
  const user = currentUser.value;
  if (!user || !user.id) return;

  // 1. Crear usuario actual (Me)
  const me = new Talk.User({
    id: user.id.toString(),
    name: user.nif || 'Usuario',
    email: user.email || 'user@vitsync.es',
    photoUrl: 'https://ui-avatars.com/api/?name=' + (user.nif || 'U'),
    role: user.role || 'default'
  });

  // 2. Iniciar sesión TalkJS
  if (!session) {
      session = new Talk.Session({
        appId: import.meta.env.VITE_TALKJS_APP_ID,
        me: me,
      });
  }

  // 3. Crear el otro usuario
  const other = new Talk.User({
    id: props.recipientId.toString(),
    name: props.recipientName || 'Usuario',
    email: 'other@vitsync.es',
    photoUrl: props.recipientPhoto || 'https://ui-avatars.com/api/?name=' + (props.recipientName || 'U'),
    role: props.recipientRole || 'default'
  });

  // 4. Crear conversación
  const conversationId = Talk.oneOnOneId(me, other);
  const conversation = session.getOrCreateConversation(conversationId);
  
  conversation.setParticipant(me);
  conversation.setParticipant(other);

  // 5. Montar chatbox
  if (chatbox) {
      chatbox.select(conversation);
  } else {
      chatbox = session.createChatbox();
      chatbox.select(conversation);
      chatbox.mount(chatContainer.value);
  }
};
</script>

<template>
  <div class="chat-window">
    <div class="chat-header">
      <button class="back-btn" @click="$emit('back')" title="Volver">←</button>
      <div class="header-info">
        <div class="status-dot"></div>
        <span class="header-name">{{  recipientName }}</span>
      </div>
      <button class="close-btn" @click="$emit('close')" title="Cerrar chat">✕</button>
    </div>
    <div class="chat-body" ref="chatContainer">
      <div class="chat-loading">Cargando chat...</div>
    </div>
  </div>
</template>

<style scoped>
.chat-window { display: flex; flex-direction: column; height: 100%; }
.chat-header {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px;
  background: #0d9488; color: white;
  flex-shrink: 0;
}
.back-btn, .close-btn {
  background: rgba(255,255,255,0.15); border: none; color: white;
  width: 30px; height: 30px; border-radius: 50%;
  cursor: pointer; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.back-btn:hover, .close-btn:hover { background: rgba(255,255,255,0.3); }
.header-info { flex: 1; display: flex; align-items: center; gap: 6px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; }
.header-name { font-weight: 500; font-size: 0.95em; }
.chat-body { flex: 1; min-height: 0; background: #f9fafb; }
.chat-loading { display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af; font-size: 0.9em; }
</style>
