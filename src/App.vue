<script setup>
import { watch } from 'vue';
import { isAuthenticated } from './store/auth';
import { loadProfile } from './store/profile';
import ChatWidget from './components/chat/ChatWidget.vue'; // Cambiar ChatWindow por ChatWidget
import ChatButton from './components/chat/ChatButton.vue';
import CookieConsent from './components/CookieConsent.vue';
import { isChatOpen, toggleChat } from './store/chat';
import AgendaCita from './pages/AgendaCita.vue';
import { isBookingOpen, closeBooking } from './store/bookingModal';

// La sesión se restaura de forma asíncrona (refresh httpOnly): watch en vez
// de onMounted, que se ejecutaba antes de que initializeAuth() terminara
watch(isAuthenticated, (authed) => {
  if (authed) loadProfile();
}, { immediate: true });
</script>

<template>
  <main
    class="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
    <RouterView v-slot="{ Component, route}">
      <Transition :name="route.meta.transition || 'page'">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>

    <!-- Modal de Reserva de Citas (global) -->
    <AgendaCita :visible="isBookingOpen" @close="closeBooking" />

    <!-- Aviso de cookies/almacenamiento (RGPD/LSSI) -->
    <CookieConsent />
    
    <!-- Chat Overlay -->
    <div v-if="isAuthenticated" class="chat-container">
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

.scale-enter-active, .scale-leave-active { transition: all 0.3s ease; }
.scale-enter-from, .scale-leave-to { transform: scale(0); opacity: 0; }

.page-enter-active{
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>