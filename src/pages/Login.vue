<script setup>
import { login } from '../store/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Refs para los datos del formulario
const nif = ref('');
const password = ref('');
const errorMessage = ref(null);
const isLoading = ref(false);
const router = useRouter();

const handleLogin = async () => {
    try {
        errorMessage.value = null;
        isLoading.value = true;

        // Llamar a la función de login del store (conecta con la API)
        await login(nif.value, password.value);
        
        console.log('Login exitoso');
        router.push({ name: 'home' });
        
    } catch (error) {
        console.error('Error en el login:', error);
        errorMessage.value = error.message || 'Error de conexión con el servidor';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-white flex flex-col items-center justify-center px-4">

        <h2 class="text-teal-600 font-large m4-8">VITSYNC</h2>
        <h1 class="text-4xl font-semibold text-gray-800 mb-2">Mi VitSync</h1>

        <div class="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-medium text-gray-800 mb-6">Inicia sesión</h3>

            <!-- Mensaje de error -->
            <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700 mb-1">NIF/CIF</label>
                    <input id="username" type="text" v-model="nif"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required :disabled="isLoading" />
                </div>

                <div class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                        <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
                        <a href="#" class="text-sm text-teal-600 hover:text-teal-800">¿Has olvidado tu contraseña?</a>
                    </div>
                    <input id="password" type="password" v-model="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required :disabled="isLoading" />
                </div>

                <button type="submit"
                    :disabled="isLoading"
                    :class="[
                        'w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors',
                        isLoading 
                            ? 'bg-teal-400 cursor-not-allowed text-white' 
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                    ]">
                    <span v-if="isLoading">Entrando...</span>
                    <span v-else>Entrar</span>
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-600">
                ¿No tienes usuario?
                <router-link to="/register" class="font-medium text-teal-600 hover:text-teal-800">Date de alta ahora</router-link>
            </p>

            <p class="mt-4 text-center text-xs text-gray-500">
                <a href="#" class="hover:text-gray-700">¿Problemas con el acceso o alta?</a>
            </p>
        </div>
    </div>
</template>