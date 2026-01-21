<script setup>
import { register } from '../store/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Refs para los datos del formulario
const formData = ref({
    name: '',
    firstName: '',
    secondName: '',
    nif: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'HOMBRE',
    role: 'PACIENTE',
    birthDate: '',
    phone: '',
    address: '',
    postCode: '',
    country: 'España'
});

const errorMessage = ref(null);
const successMessage = ref(null);
const isLoading = ref(false);
const router = useRouter();

const handleRegister = async () => {
    try {
        errorMessage.value = null;
        successMessage.value = null;

        // Validar contraseñas
        if (formData.value.password !== formData.value.confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
        }

        if (formData.value.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        isLoading.value = true;

        // Preparar datos para enviar (sin confirmPassword)
        const { confirmPassword, ...registerData } = formData.value;

        // Llamar a la función de registro del store
        // await register(registerData); 
        // Nota: register ya no hace auto-login

         await register(registerData);

        successMessage.value = '¡Registro exitoso! Por favor revisa tu correo para el código de verificación.';
        
        setTimeout(() => {
            router.push({ 
                name: 'verify', 
                query: { email: formData.value.email } 
            });
        }, 1500);
    } catch (error) {
        console.error('Error en el registro:', error);
        errorMessage.value = error.message || 'Error de conexión con el servidor';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">

        <h2 class="text-teal-600 font-large mb-2">VITSYNC</h2>
        <h1 class="text-3xl font-semibold text-gray-800 mb-4">Crear cuenta</h1>

        <div class="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
            
            <!-- Mensajes de error/éxito -->
            <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                {{ successMessage }}
            </div>

            <form @submit.prevent="handleRegister">
                <!-- Datos personales -->
                <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Datos personales</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <input type="text" v-model="formData.name"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                        <input type="text" v-model="formData.firstName"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido *</label>
                        <input type="text" v-model="formData.secondName"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento *</label>
                        <input type="date" v-model="formData.birthDate"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Género *</label>
                        <select v-model="formData.gender"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading">
                            <option value="HOMBRE">Hombre</option>
                            <option value="MUJER">Mujer</option>
                            <option value="OTRO">Otro</option>
                        </select>
                    </div>
                </div>

                <!-- Datos de cuenta -->
                <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2 mt-6">Datos de cuenta</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">NIF/CIF *</label>
                        <input type="text" v-model="formData.nif"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" v-model="formData.email"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                        <input type="password" v-model="formData.password"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" minlength="6" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
                        <input type="password" v-model="formData.confirmPassword"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" minlength="6" />
                    </div>
                </div>

                <!-- Tipo de usuario -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de cuenta *</label>
                    <select v-model="formData.role"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        required :disabled="isLoading">
                        <option value="PACIENTE">Paciente</option>
                        <option value="PROFESIONAL">Profesional de la salud</option>
                    </select>
                </div>

                <!-- Datos de contacto -->
                <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2 mt-6">Datos de contacto</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                        <input type="tel" v-model="formData.phone"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">País *</label>
                        <input type="text" v-model="formData.country"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                        <input type="text" v-model="formData.address"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Código postal *</label>
                        <input type="text" v-model="formData.postCode"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            required :disabled="isLoading" />
                    </div>
                </div>

                <button type="submit"
                    :disabled="isLoading"
                    :class="[
                        'w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors text-lg font-medium',
                        isLoading 
                            ? 'bg-teal-400 cursor-not-allowed text-white' 
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                    ]">
                    <span v-if="isLoading">Registrando...</span>
                    <span v-else>Crear cuenta</span>
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-600">
                ¿Ya tienes cuenta?
                <router-link to="/login" class="font-medium text-teal-600 hover:text-teal-800">Inicia sesión</router-link>
            </p>
        </div>
    </div>
</template>
