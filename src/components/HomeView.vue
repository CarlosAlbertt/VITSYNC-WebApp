<template>
  <div class="categorias">
    <h2>Categorías</h2>
    <ul>
      <li v-for="categoria in lista" :key="categoria.id">
        {{ categoria.nombre }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Categorias',
  data() {
    return {
      lista: [
        { id: 1, nombre: 'Tecnología' },
        { id: 2, nombre: 'Moda' },
        { id: 3, nombre: 'Deportes' }
      ]
    }
  }
}
</script>

<style scoped>
.categorias {
  margin: 20px 0;
}
li {
  list-style: none;
  margin: 5px 0;
}
</style>