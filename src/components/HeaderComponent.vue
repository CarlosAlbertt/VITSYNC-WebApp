<template>
  <header class="bg-white shadow-sm">
    <!-- Barra superior de contacto e idioma -->
    <div class="bg-teal-600 text-white text-sm px-4 py-2">
      <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center space-x-6">
          <span>Atención al paciente: 912 33 77 99</span>
          <div class="flex space-x-4">
            <a href="#" class="hover:underline">Trabaja con nosotros</a>
            <a href="#" class="hover:underline">International patient</a>
          </div>
        </div>
        <router-link v-if="!isAuthenticated" to="/login"
          class="bg-white text-teal-600 px-3 py-1 rounded text-sm font-medium">
          Iniciar sesion
        </router-link>
        <button v-else @click="handleLogout" class="bg-white text-teal-600 px-3 py-1 rounded text-sm font-medium">
          Cerrar sesion
        </button>
      </div>
    </div>

    <!-- Navegación principal -->
    <nav class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex flex-wrap items-center justify-between">
        <router-link to="/"
          class="text-2xl font-bold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer">
          VitSync
        </router-link>

        <!-- Barra de búsqueda -->
        <div class="flex-1 max-w-2xl mx-6">
          <div class="relative">
            <input type="text" placeholder="Buscar centro, médico, especialidad..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            <button class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </button>
          </div>
        </div>

        <!-- Enlaces principales -->
        <div class="flex items-center space-x-6">
          <a v-if="isAuthenticated" href="#" class="text-teal-600 font-medium hover:text-teal-800">Mi Perfil</a>
          <button class="md:hidden text-gray-600">
            ☰
          </button>
        </div>
      </div>

      <!-- Menú de navegación (oculto en móviles) -->
      <div class="hidden md:flex pt-4 border-t border-gray-100 mt-4">
        <nav class="flex space-x-8">
          <template v-for="item in menuItems" :key="item.name">
            <router-link v-if="item.route" :to="item.route"
              class="text-gray-700 hover:text-teal-600 text-sm font-medium">
              {{ item.name }}
            </router-link>
            <a v-else href="#" class="text-gray-700 hover:text-teal-600 text-sm font-medium">
              {{ item.name }}
            </a>
          </template>
        </nav>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from '../store/auth'

const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/')
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
