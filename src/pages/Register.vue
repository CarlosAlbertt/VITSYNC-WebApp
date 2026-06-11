<script setup>
import { register } from '../store/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/BackButton.vue';
import {
    validateNif, validateEmail, validatePassword, validatePhone,
    validateName, validatePostalCode, validateBirthDate
} from '../utils/validators';

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

// Consentimiento RGPD (Art. 7): explícito, granular y nunca pre-marcado
const privacyAccepted = ref(false);
const commsAccepted = ref(false);

// Validación espejo del backend (src/utils/validators.js): mismo dígito de
// control de NIF/NIE y misma política de contraseña que @ValidNif y los DTOs.
// Esto es UX: la validación de seguridad real la hace el backend.
const validateForm = () => {
    const f = formData.value;
    const checks = [
        validateName(f.name) && `Nombre: ${validateName(f.name)}`,
        validateName(f.firstName) && `Primer apellido: ${validateName(f.firstName)}`,
        validateName(f.secondName) && `Segundo apellido: ${validateName(f.secondName)}`,
        validateBirthDate(f.birthDate),
        validateNif(f.nif),
        validateEmail(f.email),
        f.password !== f.confirmPassword ? 'Las contraseñas no coinciden' : null,
        validatePassword(f.password),
        validatePhone(f.phone),
        validatePostalCode(f.postCode)
    ];
    const firstError = checks.find(e => e);
    if (firstError) throw new Error(firstError);
    if (!privacyAccepted.value) {
        throw new Error('Debes aceptar la Política de Privacidad para crear la cuenta');
    }
};

const handleRegister = async () => {
    try {
        errorMessage.value = null;
        successMessage.value = null;

        validateForm();

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
    <div class="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center px-4 py-8 text-[var(--text-primary)]">

        <h2 class="text-[var(--accent)] font-bold mb-2 text-sm tracking-widest uppercase">VITSYNC</h2>
        <h1 class="text-3xl font-semibold text-[var(--text-primary)] mb-4">Crear cuenta</h1>

        <div class="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border)] p-8 rounded-xl shadow-md dark:shadow-2xl">

            <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 dark:bg-rose-500/10 border border-red-400/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="mb-4 p-3 bg-green-50 dark:bg-green-500/10 border border-green-400/30 text-green-600 dark:text-green-400 rounded-lg text-sm">
                {{ successMessage }}
            </div>

            <form @submit.prevent="handleRegister">
                <h3 class="text-lg font-medium text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-2">Datos personales</h3>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Nombre *</label>
                        <input type="text" v-model="formData.name"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Apellido *</label>
                        <input type="text" v-model="formData.firstName"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Segundo Apellido *</label>
                        <input type="text" v-model="formData.secondName"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Fecha de nacimiento *</label>
                        <input type="date" v-model="formData.birthDate"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Género *</label>
                        <select v-model="formData.gender"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
                            required :disabled="isLoading">
                            <option value="HOMBRE">Hombre</option>
                            <option value="MUJER">Mujer</option>
                            <option value="OTRO">Otro</option>
                        </select>
                    </div>
                </div>

                <h3 class="text-lg font-medium text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-2 mt-6">Datos de cuenta</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">NIF/CIF *</label>
                        <input type="text" v-model="formData.nif"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email *</label>
                        <input type="email" v-model="formData.email"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Contraseña *</label>
                        <input type="password" v-model="formData.password"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" minlength="6" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Confirmar contraseña *</label>
                        <input type="password" v-model="formData.confirmPassword"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" minlength="6" />
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tipo de cuenta *</label>
                    <select v-model="formData.role"
                        class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
                        required :disabled="isLoading">
                        <option value="PACIENTE">Paciente</option>
                        <option value="MEDICO">Profesional de la salud</option>
                    </select>
                </div>

                <h3 class="text-lg font-medium text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-2 mt-6">Datos de contacto</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Teléfono *</label>
                        <input type="tel" v-model="formData.phone"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">País *</label>
                        <input type="text" v-model="formData.country"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Dirección *</label>
                        <input type="text" v-model="formData.address"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">Código postal *</label>
                        <input type="text" v-model="formData.postCode"
                            class="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
                            required :disabled="isLoading" />
                    </div>
                </div>

                <!-- Consentimiento RGPD: obligatorio, NUNCA pre-marcado -->
                <div class="mb-4 space-y-3">
                    <label class="flex items-start gap-3 text-sm text-[var(--text-secondary)] cursor-pointer">
                        <input type="checkbox" v-model="privacyAccepted" :disabled="isLoading"
                            class="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]" />
                        <span>
                            He leído y acepto la
                            <router-link to="/privacidad" target="_blank"
                                class="font-semibold text-[var(--accent)] underline">Política de Privacidad</router-link>
                            y el tratamiento de mis datos de salud para la prestación asistencial *
                        </span>
                    </label>
                    <label class="flex items-start gap-3 text-sm text-[var(--text-secondary)] cursor-pointer">
                        <input type="checkbox" v-model="commsAccepted" :disabled="isLoading"
                            class="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]" />
                        <span>Acepto recibir comunicaciones por email (opcional)</span>
                    </label>
                </div>

                <button type="submit"
                    :disabled="isLoading || !privacyAccepted"
                    :class="[
                        'w-full py-3 px-4 rounded-xl text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:ring-offset-2 transition-colors',
                        (isLoading || !privacyAccepted)
                            ? 'bg-[var(--accent)]/60 cursor-not-allowed'
                            : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)]'
                    ]">
                    <span v-if="isLoading">Registrando...</span>
                    <span v-else>Crear cuenta</span>
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-[var(--text-secondary)]">
                ¿Ya tienes cuenta?
                <router-link to="/login" class="font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity">Inicia sesión</router-link>
            </p>
        </div>
    </div>
</template>
