<template>
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">

        <h2 class="text-teal-600 font-bold text-xl mb-2">VITSYNC</h2>
        <h1 class="text-3xl font-semibold text-gray-800 mb-6">DATE DE ALTA</h1>

        <div class="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
            <!-- Mensajes de Feedback -->
            <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm font-medium">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm font-medium">
                {{ successMessage }}
            </div>

            <form @submit.prevent="handleRegister" class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <!-- Sección: Datos Personales -->
                <div class="md:col-span-2 border-b pb-2 mb-2">
                    <h3 class="text-lg font-medium text-gray-700">Datos Personales</h3>
                </div>

                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input id="name" type="text" v-model="name"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <div>
                    <label for="second_name" class="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
                    <input id="second_name" type="text" v-model="second_name"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500" />
                </div>

                <div class="md:col-span-2">
                    <label for="last_name" class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                    <input id="last_name" type="text" v-model="last_name"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <div>
                    <label for="birth_date" class="block text-sm font-medium text-gray-700 mb-1">Fecha de
                        Nacimiento</label>
                    <input id="birth_date" type="date" v-model="birth_date"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <div>
                    <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Género</label>
                    <select id="gender" v-model="gender"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500">
                        <option value="MALE">Masculino</option>
                        <option value="FEMALE">Femenino</option>
                        <option value="OTHER">Otro</option>
                    </select>
                </div>

                <!-- Sección: Contacto y Dirección -->
                <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                    <h3 class="text-lg font-medium text-gray-700">Contacto y Dirección</h3>
                </div>

                <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input id="phone" type="tel" v-model="phone"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <div>
                    <label for="country" class="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <input id="country" type="text" v-model="country"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <div>
                    <label for="post_code" class="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                    <input id="post_code" type="text" v-model="post_code"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <div>
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Dirección Completa</label>
                    <input id="address" type="text" v-model="address"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <!-- Sección: Cuenta de Usuario -->
                <div class="md:col-span-2 border-b pb-2 mb-2 mt-4">
                    <h3 class="text-lg font-medium text-gray-700">Datos de Cuenta</h3>
                </div>

                <div class="md:col-span-2">
                    <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario
                        (Username)</label>
                    <input id="username" type="text" v-model="username"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <div class="md:col-span-2">
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input id="email" type="email" v-model="email"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <div class="md:col-span-2">
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input id="password" type="password" v-model="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <div class="md:col-span-2">
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirmar
                        Contraseña</label>
                    <input id="confirmPassword" type="password" v-model="confirmPassword"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required />
                </div>

                <!-- Botón de Registro -->
                <div class="md:col-span-2 mt-6">
                    <button type="submit"
                        class="w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors font-semibold text-lg">
                        Registrarse
                    </button>
                </div>
            </form>

            <p class="mt-6 text-center text-sm text-gray-600">
                ¿Ya tienes cuenta?
                <router-link :to="{ name: 'login' }" class="font-medium text-teal-600 hover:text-teal-800">
                    Inicia sesión aquí
                </router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Refs para los datos del formulario
const name = ref('');
const second_name = ref('');
const last_name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const gender = ref('OTHER');
const role = ref('PATIENT');
const birth_date = ref('');
const phone = ref('');
const address = ref('');
const post_code = ref('');
const country = ref('');

const errorMessage = ref(null);
const successMessage = ref(null);
const router = useRouter();

const handleRegister = async () => {
    errorMessage.value = null;
    successMessage.value = null;

    try {
        // Validación básica
        if (password.value !== confirmPassword.value) {
            throw new Error('Las contraseñas no coinciden.');
        }

        const userData = {
            name: name.value,
            second_name: second_name.value,
            last_name: last_name.value,
            username: username.value,
            email: email.value,
            password: password.value, // En backend debe hashearse
            gender: gender.value,
            role: role.value,
            birth_date: birth_date.value,
            phone: phone.value,
            address: address.value,
            post_code: post_code.value,
            country: country.value
        };

        // TODO: Enviar userData al backend real
        console.log('Registrando usuario con datos completos:', userData);

        // Simulación de éxito
        successMessage.value = 'Registro completado con éxito. Redirigiendo al login...';

        setTimeout(() => {
            router.push({ name: 'login' });
        }, 1500);

    } catch (error) {
        console.error('Error en el registro:', error);
        errorMessage.value = error.message;
    }
};
</script>
