<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const router = useRouter();

const email = ref('');
const code = ref('');
const isLoading = ref(false);
const message = ref(null);
const isError = ref(false);

onMounted(() => {
    // Si viene el email por query param, lo rellenamos
    if (route.query.email) {
        email.value = route.query.email;
    }
});

const handleVerify = async () => {
    isLoading.value = true;
    message.value = null;
    isError.value = false;

    try {
        await api.post('/api/auth/verify', {
            email: email.value,
            code: code.value
        });

        message.value = '¡Cuenta verificada con éxito! Redirigiendo al login...';
        isError.value = false;

        setTimeout(() => {
            router.push('/login');
        }, 2000);

    } catch (error) {
        message.value = error.response?.data?.message || error.message || 'Error en la verificación';
        isError.value = true;
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 class="text-teal-600 font-bold mb-6 text-2xl">Verificación de Cuenta</h2>
        
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <p class="text-gray-600 mb-6 text-center">
                Introduce el código de 6 dígitos que hemos enviado a tu correo electrónico.
            </p>

            <div v-if="message" :class="[
                'p-4 mb-4 rounded text-sm text-center',
                isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            ]">
                {{ message }}
            </div>

            <form @submit.prevent="handleVerify">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input 
                        v-model="email" 
                        type="email" 
                        required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="tu@email.com"
                    >
                </div>

                <div class="mb-6">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Código de Verificación</label>
                    <input 
                        v-model="code" 
                        type="text" 
                        required
                        maxlength="6"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 tracking-widest text-center text-xl"
                        placeholder="123456"
                    >
                </div>

                <button 
                    type="submit" 
                    :disabled="isLoading"
                    :class="[
                        'w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150',
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'
                    ]"
                >
                    {{ isLoading ? 'Verificando...' : 'Verificar Cuenta' }}
                </button>
            </form>

            <div class="mt-4 text-center">
                <router-link to="/login" class="text-sm text-teal-600 hover:underline">
                    ¿Ya tienes cuenta verificada? Inicia sesión
                </router-link>
            </div>
        </div>
    </div>
</template>
