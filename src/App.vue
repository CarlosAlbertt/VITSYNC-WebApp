<script setup>
// Aquí va la lógica de JavaScript si la hubiera.
// Para un "Hola Mundo" simple, ¡no necesitamos nada!

import { ref } from 'vue';

const mensaje = ref("Hola Mundo desde Vue 3!");

</script>

<template>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
/* Estilos opcionales específicos para este componente */
/* Si usas Tailwind CSS (como en el template), esta sección es opcional */
</style>