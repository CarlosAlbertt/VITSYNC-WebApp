<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Refs para los datos del formulario
const username = ref('');
const password = ref('');
const errorMessage = ref(null);

// Obtener la instancia del router
const router = useRouter();

// Método que se llama al enviar el formulario
const handleLogin = async () => {
    try {

        errorMessage.value = null;

        // Enviamos el POST a Spring Boot
        const response = await axios.post('http://localhost:8080/api/auth/login', {
            username: username.value,
            password: password.value
        });

        console.log('Login exitoso:', response.data);

    } catch (error) {
        console.error('Error en el login:', error);
        errorMessage.value = 'Usuario o contraseña incorrectos.';
    }
};
</script>

<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 class="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label class="block text-gray-700" for="username">Usuario:</label>
                    <input type="text" v-model="username" required
                        class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700" for="password">Contraseña:</label>
                    <input type="password" v-model="password" required
                        class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit"
                    class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                    Entrar
                </button>

                <div v-if="errorMessage" class="text-red-500 mt-4 text-center">
                    {{ errorMessage }}
                </div>
            </form>
        </div>
    </div>
</template>
