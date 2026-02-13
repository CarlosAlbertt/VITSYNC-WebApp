<script setup>
import { ref } from 'vue';
import ChatWidget from './components/chat/ChatWidget.vue'; // Cambiar ChatWindow por ChatWidget
import ChatButton from './components/chat/ChatButton.vue';

const isChatOpen = ref(false);

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};
</script>

<template>
  <main>
    <router-view />
    
    <!-- Chat Overlay -->
    <div class="chat-container">
      <Transition name="slide-fade">
        <!-- USAR ChatWidget AQUI -->
        <ChatWidget v-if="isChatOpen" @close="toggleChat" />
      </Transition>

      <Transition name="scale">
        <ChatButton v-if="!isChatOpen" @toggle="toggleChat" />
      </Transition>
    </div>
  </main>
</template>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px; 
  z-index: 9999;
}

.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease-out; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(20px); opacity: 0; }

.scale-enter-active, .sclae-leave-active { transition: all 0.3s ease; }
.scale-enter-from, .scale-leave-to { transform: scale(0); opacity: 0; }
</style>