<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Importante para redirigir

// 1. Refs para los datos del formulario
const username = ref('');
const password = ref('');
const errorMessage = ref(null); // Para mostrar errores

// 2. Obtener la instancia del router
const router = useRouter();

// 3. Método que se llama al enviar el formulario
const handleLogin = async () => {
  try {
    // 4. Limpiamos errores previos
    errorMessage.value = null;

    // 5. Enviamos el POST a Spring Boot
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      // El cuerpo (body) de la petición
      username: username.value,
      password: password.value
    });

    // 6. ¡ÉXITO! El backend nos dio una respuesta 200 (OK)
    console.log('Login exitoso:', response.data);

    // Opcional: Guardar el token (JWT) que nos envía el backend
    // localStorage.setItem('token', response.data.token);

    // 7. REDIRIGIMOS al usuario a la página de "Dashboard"
    router.push('/dashboard');

  } catch (error) {
    // 8. ¡ERROR! El backend respondió con un error (ej. 401 Unauthorized)
    console.error('Error en el login:', error);
    errorMessage.value = 'Usuario o contraseña incorrectos.';
  }
};
</script>

<template>
  <div>
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Usuario: </label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label>Contraseña: </label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Entrar</button>

      <div v-if="errorMessage" style="color: red; margin-top: 10px;">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>