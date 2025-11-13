<template>
  <header class="flex justify-between items-center bg-white rounded-lg p-4 shadow">
    <h3 class="text-xl font-bold">{{ title }}</h3>
    <nav class="space-x-4">
      <a v-for="item in navItems" :key="item.text" :href="item.link" class="text-lg font-medium hover:text-blue-500">{{
        item.text }}</a>
    </nav>
    <button class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:scale-105 transition-transform">{{ loginText
      }}</button>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      default: 'VitSync'
    },
    navItems: {
      type: Array,
      default: () => [
        { text: 'Perfil', link: '#' },
        { text: 'Inicio', link: '#' },
        { text: 'Tienda', link: '#' }
      ]
    },
    loginText: {
      type: String,
      default: 'Login'
    }
  }
};
</script>

<style scoped></style>
