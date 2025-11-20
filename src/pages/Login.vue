<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Refs para los datos del formulario
const username = ref('');
const password = ref('');
const errorMessage = ref(null);
const router = useRouter();

// Datos de usuario de prueba
const testUser = {
    username: 'user',
    password: '123'
};

const handleLogin = async () => {
    try {
        errorMessage.value = null;

        if (username.value === testUser.username && password.value === testUser.password) {
            console.log('Login exitoso');
            localStorage.setItem('token', 'dummyToken');
            router.push({ name: 'home' });
        } else {
            throw new Error('Usuario o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error en el login:', error);
        errorMessage.value = error.message;
    }
};
</script>

<template>
    <div class="min-h-screen bg-white flex flex-col items-center justify-center px-4">

        <h2 class="text-teal-600 font-large m4-8">VITSYNC</h2>
        <h1 class="text-4xl font-semibold text-gray-800 mb-2">Mi VitSync</h1>

        <div class="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-medium text-gray-800 mb-6">Inicia sesión</h3>

            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                    <input id="username" type="text" v-model="username" placeholder="nombre@mail.com"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <div class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                        <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
                        <a href="#" class="text-sm text-teal-600 hover:text-teal-800">¿Has olvidado tu contraseña?</a>
                    </div>
                    <input id="password" type="password" v-model="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <button type="submit" 
                    class="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors">
                    Entrar
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-600">
                ¿No tienes usuario?
                <a href="#" class="font-medium text-teal-600 hover:text-teal-800">Date de alta ahora</a>
            </p>

            <p class="mt-4 text-center text-xs text-gray-500">
                <a href="#" class="hover:text-gray-700">¿Problemas con el acceso o alta?</a>
            </p>
        </div>
    </div>
</template>