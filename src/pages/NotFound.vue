<script setup>
// Página 404: catch-all del router (antes una URL desconocida
// renderizaba una página en blanco)
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <p class="text-7xl font-extrabold text-teal-600 dark:text-teal-400">404</p>
        <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Página no encontrada
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400 text-center">
            La página que buscas no existe o ha sido movida.
        </p>
        <router-link
            to="/"
            class="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-3 text-white font-semibold hover:bg-teal-700 transition-colors">
            Volver al inicio
        </router-link>
    </div>
</template>
