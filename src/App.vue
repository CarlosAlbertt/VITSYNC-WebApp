@import './assets/main.css';

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
      <div>

      </div>
  </header>

  <main>
    <form style="text-align: center">
      <label style="text-align: center">User:</label><br>
      <input type="text" name="user"></input>
      <br>
      <label style="text-align: center">Password:</label><br>
      <input type="password" name="password"></input>
      <br><br>
      <input type="submit" value="Submit"></input>




    </form>

  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
<script setup lang="ts">
</script>