<template>
  <header class="bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
    <!-- Barra superior de contacto e idioma -->
    <div class="bg-teal-600 dark:bg-teal-800 text-white text-sm px-4 py-2 relative z-50 transition-colors duration-300">
      <div class="max-w-7xl mx-auto">
        <!-- Mobile Toggle (visible < 550px) -->
        <div class="flex justify-center min-[550px]:hidden">
          <button @click="toggleTopBarMenu" class="focus:outline-none transform transition-transform duration-200"
            :class="{ 'rotate-180': isTopBarMenuOpen }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-wrap justify-between items-center gap-4 transition-all duration-300 ease-in-out"
          :class="[isTopBarMenuOpen ? 'flex flex-col py-2' : 'hidden', 'min-[550px]:flex min-[550px]:flex-row min-[550px]:py-0']">
          <div class="flex items-center space-x-6"
            :class="{ 'flex-col space-y-2 space-x-0 min-[550px]:flex-row min-[550px]:space-y-0 min-[550px]:space-x-6': isTopBarMenuOpen }">
            <span>Atención al paciente: 912 33 77 99</span>
            <div class="flex space-x-4">
              <a href="#" class="hover:underline">Trabaja con nosotros</a>
              <a href="#" class="hover:underline">International patient</a>
            </div>
            <!-- Dark Mode Toggle -->
            <button @click="toggleDark()"
              class="p-2 rounded-full hover:bg-teal-700 transition-colors focus:outline-none" title="Toggle Dark Mode">
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
          <router-link v-if="!isAuthenticated" to="/login"
            class="bg-white text-teal-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 dark:bg-gray-800 dark:text-teal-400 dark:hover:bg-gray-700 transition-colors">
            Iniciar sesion
          </router-link>
          <button v-else @click="handleLogout"
            class="bg-white text-teal-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 dark:bg-gray-800 dark:text-teal-400 dark:hover:bg-gray-700 transition-colors">
            Cerrar sesion
          </button>
        </div>
      </div>
    </div>

    <!-- Navegación principal -->
    <nav class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex flex-wrap items-center justify-between">
        <!-- Logo -->
        <router-link to="/"
          class="text-2xl font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer">
          VitSync
        </router-link>

        <!-- Barra de búsqueda -->
        <div class="flex-1 max-w-2xl mx-6">
          <div class="relative">
            <input type="text" placeholder="Buscar centro, médico, especialidad..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors" />
            <button class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hidden min-[550px]:block">
              🔍
            </button>
          </div>
        </div>

        <!-- Enlaces principales -->
        <div class="flex items-center space-x-6">
          <a v-if="isAuthenticated" href="#"
            class="text-teal-600 dark:text-teal-400 font-medium hover:text-teal-800 dark:hover:text-teal-200 transition-colors">Mi
            Perfil</a>
          <button class="lg:hidden text-gray-600 dark:text-gray-300 focus:outline-none" @click="toggleMobileMenu">
            <span v-if="!isMobileMenuOpen">☰</span>
            <span v-else>✕</span>
          </button>
        </div>
      </div>

      <!-- Menú de navegación (oculto en móviles) -->
      <div class="hidden lg:flex pt-4 border-t border-gray-100 dark:border-gray-700 mt-4 transition-colors">
        <nav class="flex space-x-8">
          <template v-for="item in menuItems" :key="item.name">
            <router-link v-if="item.route" :to="item.route"
              class="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition-colors">
              {{ item.name }}
            </router-link>
            <a v-else href="#"
              class="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition-colors">
              {{ item.name }}
            </a>
          </template>
        </nav>
      </div>

      <!-- Mobile Navigation Menu -->
      <div v-show="isMobileMenuOpen"
        class="lg:hidden mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 transition-colors">
        <nav class="flex flex-col space-y-4">
          <template v-for="item in menuItems" :key="item.name">
            <router-link v-if="item.route" :to="item.route"
              class="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium block transition-colors"
              @click="isMobileMenuOpen = false">
              {{ item.name }}
            </router-link>
            <a v-else href="#"
              class="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium block transition-colors"
              @click="isMobileMenuOpen = false">
              {{ item.name }}
            </a>
          </template>
        </nav>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from '../store/auth'
import { useDark, useToggle } from '@vueuse/core'

const router = useRouter()
const isMobileMenuOpen = ref(false);
const isTopBarMenuOpen = ref(false);

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
})
const toggleDark = useToggle(isDark)

const handleLogout = () => {
  logout()
  router.push('/')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

const toggleTopBarMenu = () => {
  isTopBarMenuOpen.value = !isTopBarMenuOpen.value;
}

const menuItems = [
  { name: 'Hospitales', route: null },
  { name: 'Cuadro médico', route: null },
  { name: 'Especialidades', route: '/especialidades' },
  { name: 'Enfermedades y tratamientos', route: null },
  { name: 'Unidades médicas', route: null },
  { name: 'Investigación', route: null },
  { name: 'El grupo', route: null },
  { name: 'Comunicación', route: null },
  { name: 'Orientador de salud', route: null }
]
</script>
