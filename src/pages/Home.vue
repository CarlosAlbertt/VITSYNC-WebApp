<template>
  <div class="flex flex-col min-h-screen">
    <HeaderComponent title="Bienvenido a nuestra Tienda" :navItems="navItems" loginText="Iniciar Sesión" />
    <main class="flex-grow flex flex-col items-center justify-center p-6">
      <h2 class="text-2xl font-bold mb-4">Explora Nuestros Médicos especialistas</h2>
      <p class="mb-8">Descubre una variedad de especialidades que tenemos para ofrecerte.</p>
      <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-4" v-for="medico in medicos" :key="medico.id">
          <h3 class="text-lg font-semibold">{{ medico.nombre }}</h3>
          <p class="text-gray-700">Especialidad: {{ medico.especialidad }} €</p>
          <button
            class="bg-blue-500 text-white rounded-lg px-4 py-2 mt-2 hover:scale-105 transition-transform">Contactanos</button>
        </div>
      </section>
    </main>
    <footer class="bg-gray-800 text-white text-center py-4">
      <h3>@Copyright 2025</h3>
    </footer>
  </div>
</template>

<script>
import Header from '../components/HeaderComponent.vue';

export default {
  components: {
    Header,
  },
  data() {
    return {
      navItems: [
        { text: 'Perfil', link: '#' },
        { text: 'Inicio', link: '#' },
        { text: 'Médicos', link: '#' },
      ],
      products: [
        { id: 1, name: 'Pablo', especialidad: "Músculos" },
        { id: 2, name: 'Carlos', especialidad: "Huesos" },
        { id: 3, name: 'Javier', especialdad: "Articulaciones" },
      ],
    };
  },
};
</script>

<style scoped></style>