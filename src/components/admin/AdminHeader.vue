<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDark, useToggle } from '@vueuse/core';
import { logout } from '@/store/auth';
import LogoutModal from '../LogoutModal.vue';

const router = useRouter();
const showLogoutModal = ref(false);

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
});
const toggleDark = useToggle(isDark);

const handleLogout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = () => {
  showLogoutModal.value = false;
  logout();
  router.push('/login');
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <header class="bg-[var(--bg-surface)] border-b border-[var(--border)] shadow-sm sticky top-0 z-40">
    <div class="bg-teal-700 dark:bg-teal-900/80 text-white text-sm px-4 py-2.5">
      <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">

        <!-- Left Side: Back, Home & Title -->
        <div class="flex items-center space-x-3">
          <!-- Back button (navigate between CRUD) -->
          <button @click="goBack"
            class="p-1.5 rounded-lg hover:bg-teal-600/60 transition-colors focus:outline-none" title="Volver atrás">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div class="h-4 w-px bg-teal-500/40"></div>

          <!-- Home link -->
          <router-link to="/" class="flex items-center gap-1.5 hover:text-teal-200 transition-colors" title="Volver a Inicio">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
            </svg>
            <span class="hidden sm:inline text-xs font-medium">Inicio</span>
          </router-link>

          <div class="h-4 w-px bg-teal-500/40 hidden sm:block"></div>
          <span class="font-semibold hidden sm:block">Panel de Administración</span>
        </div>

        <!-- Right Side: Dark Mode & Logout -->
        <div class="flex items-center space-x-3">
          <!-- Dark Mode Toggle -->
          <button @click="toggleDark()"
            class="p-1.5 rounded-lg hover:bg-teal-600/60 transition-colors focus:outline-none" title="Cambiar modo">
            <Transition name="icon-swap" mode="out-in">
              <svg v-if="isDark" key="sun"
                  xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else key="moon"
                  xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </Transition>
          </button>

          <!-- Logout Button -->
          <button @click="handleLogout"
            class="bg-white/90 text-teal-700 px-3 py-1 rounded-md text-xs font-medium hover:bg-white dark:bg-gray-800 dark:text-teal-400 dark:hover:bg-gray-700 transition-colors">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>

    <LogoutModal
      :visible="showLogoutModal"
      @confirm="confirmLogout"
      @cancel="showLogoutModal = false">
    </LogoutModal>
  </header>
</template>

<style scoped>
.icon-swap-enter-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.icon-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.icon-swap-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}
.icon-swap-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}
</style>
