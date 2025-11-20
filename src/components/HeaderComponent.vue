<template>
  <header class="bg-white shadow-sm">
    <!-- Barra superior de contacto e idioma -->
    <div class="bg-teal-600 text-white text-sm px-4 py-2">
      <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center space-x-6">
          <span>Atención al paciente: 000 000 000</span>
          <div class="flex space-x-4">
            <a href="#" class="hover:underline">Trabaja con nosotros</a>
            <a href="#" class="hover:underline">International patient</a>
          </div>
        </div>
        <router-link to="/login" class="bg-white text-teal-600 px-3 py-1 rounded text-sm font-medium">
          Iniciar sesion
        </router-link>
      </div>
    </div>

    <!-- Navegación principal -->
    <nav class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex flex-wrap items-center justify-between">
        <!-- Logo -->
        <div class="text-2xl font-bold text-teal-600">
          VitSync
        </div>

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
          <a href="#" class="text-teal-600 font-medium hover:text-teal-800">Mi Perfil</a>
          <button class="md:hidden text-gray-600">
            ☰
          </button>
        </div>
      </div>

      <!-- Menú de navegación (oculto en móviles) -->
      <div class="hidden md:flex pt-4 border-t border-gray-100 mt-4">
        <nav class="flex space-x-8">
          <a v-for="item in menuItems" :key="item" href="#"
            class="text-gray-700 hover:text-teal-600 text-sm font-medium">
            {{ item }}
          </a>
        </nav>
      </div>
    </nav>
  </header>
</template>

<script>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

export default {
  name: 'HeaderQuironsalud',
  data() {
    return {
      menuItems: [
        'Hospitales',
        'Cuadro médico',
        'Especialidades',
        'Enfermedades y tratamientos',
        'Unidades médicas',
        'Investigación',
        'El grupo',
        'Comunicación',
        'Orientador de salud'
      ]
    }
  }
}
</script>