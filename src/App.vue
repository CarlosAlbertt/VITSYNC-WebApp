<script setup>
// Aquí va la lógica de JavaScript si la hubiera.
// Para un "Hola Mundo" simple, ¡no necesitamos nada!

import { ref } from 'vue';

const mensaje = ref("Hola Mundo desde Vue 3!");

</script>

<template>
  <main>
    <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 mt-10 border border-indigo-200">
      <div class="flex-shrink-0">
        <!-- Icono simple (emoji o SVG inline) -->
        <span class="text-4xl">👋</span>
      </div>
      <div>
        <div class="text-xl font-medium text-indigo-600">Aplicación Vue</div>
        <!-- Mostramos la variable reactiva -->
        <p class="text-gray-500">{{ mensaje }}</p>
      </div>
    </div>
    <router-view />
  </main>
</template>

<style scoped>
/* Estilos opcionales específicos para este componente */
/* Si usas Tailwind CSS (como en el template), esta sección es opcional */
</style>