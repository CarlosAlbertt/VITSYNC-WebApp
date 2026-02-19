<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <Header />

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <!-- Título de página -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Mi Perfil</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestiona tu información personal y preferencias</p>
      </div>

      <!-- Layout Principal: sidebar + contenido -->
      <div class="flex flex-col lg:flex-row gap-6 items-start">

        <!-- Navegación lateral (desktop) / tabs (mobile) -->
        <NavigationMenu />

        <!-- Contenido de la sección activa -->
        <div class="flex-1 min-w-0">
          <Transition name="fade-section" mode="out-in">
            <component
              :is="currentSection"
              :key="activeSection"
            />
          </Transition>
        </div>
      </div>
    </main>

    <!-- Toast global -->
    <ToastNotification />

    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Header from '../components/HeaderComponent.vue';
import Footer from '../components/FooterComponent.vue';
import NavigationMenu from '../components/profile/NavigationMenu.vue';
import ToastNotification from '../components/profile/ToastNotification.vue';
import GeneralSection from '../components/profile/sections/GeneralSection.vue';
import InformesSection from '../components/profile/sections/InformesSection.vue';
import CitasSection from '../components/profile/sections/CitasSection.vue';
import ConfiguracionSection from '../components/profile/sections/ConfiguracionSection.vue';

import { activeSection, loadProfile } from '../store/profile';
import { computed } from 'vue';

const sectionMap = {
  general: GeneralSection,
  informes: InformesSection,
  citas: CitasSection,
  configuracion: ConfiguracionSection
};

const currentSection = computed(() => sectionMap[activeSection.value] || GeneralSection);

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.fade-section-enter-active,
.fade-section-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-section-enter-from {
  opacity: 0;
  transform: translateX(8px);
}
.fade-section-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
