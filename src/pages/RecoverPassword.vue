<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { recoveryQuestions, recoveryVerify, recoveryReset } from '../services/recoveryService';

const router = useRouter();

// Paso del asistente: 1 = NIF, 2 = preguntas, 3 = código + nueva contraseña, 4 = hecho
const step = ref(1);
const isLoading = ref(false);
const errorMessage = ref(null);
const infoMessage = ref(null);

const nif = ref('');
const questions = ref({ question1: '', question2: '' });
const answer1 = ref('');
const answer2 = ref('');
const code = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Política idéntica al backend: ≥12 con mayúscula, minúscula, número y especial
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

const resetMessages = () => { errorMessage.value = null; infoMessage.value = null; };

const fetchQuestions = async () => {
    try {
        resetMessages();
        if (!nif.value.trim()) throw new Error('Introduce tu NIF/CIF');
        isLoading.value = true;
        questions.value = await recoveryQuestions(nif.value.trim());
        step.value = 2;
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const submitAnswers = async () => {
    try {
        resetMessages();
        if (!answer1.value.trim() || !answer2.value.trim()) {
            throw new Error('Responde a las dos preguntas');
        }
        isLoading.value = true;
        const res = await recoveryVerify(nif.value.trim(), answer1.value.trim(), answer2.value.trim());
        infoMessage.value = res.message || 'Te hemos enviado un código a tu correo.';
        step.value = 3;
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const passwordValid = computed(() => PASSWORD_RE.test(newPassword.value));

const submitReset = async () => {
    try {
        resetMessages();
        if (!/^\d{6}$/.test(code.value.trim())) throw new Error('Introduce el código de 6 dígitos');
        if (!passwordValid.value) {
            throw new Error('La contraseña debe tener al menos 12 caracteres, con mayúscula, minúscula, número y carácter especial');
        }
        if (newPassword.value !== confirmPassword.value) {
            throw new Error('Las contraseñas no coinciden');
        }
        isLoading.value = true;
        await recoveryReset(nif.value.trim(), code.value.trim(), newPassword.value);
        step.value = 4;
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const goToLogin = () => router.push({ name: 'login' });
</script>

<template>
    <div class="auth">
        <main class="auth-main">
            <div class="auth-card">
                <router-link to="/login" class="auth-back">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M19 12H5M11 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Volver al inicio de sesión
                </router-link>

                <div v-if="errorMessage" class="auth-error" role="alert">
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    {{ errorMessage }}
                </div>

                <!-- Paso 1: identificarse por NIF -->
                <template v-if="step === 1">
                    <header class="auth-head">
                        <h1 class="auth-title">Recuperar acceso</h1>
                        <p class="auth-sub">Introduce tu NIF/CIF para responder a tus preguntas de seguridad.</p>
                    </header>
                    <form @submit.prevent="fetchQuestions" novalidate>
                        <div class="field">
                            <label for="nif">NIF/CIF</label>
                            <input id="nif" type="text" v-model="nif" placeholder="12345678A"
                                   autocomplete="username" required :disabled="isLoading" />
                        </div>
                        <button type="submit" class="btn" :disabled="isLoading">
                            <span v-if="isLoading" class="btn-spin" aria-hidden="true"></span>
                            {{ isLoading ? 'Buscando…' : 'Continuar' }}
                        </button>
                    </form>
                </template>

                <!-- Paso 2: responder preguntas de seguridad -->
                <template v-else-if="step === 2">
                    <header class="auth-head">
                        <h1 class="auth-title">Preguntas de seguridad</h1>
                        <p class="auth-sub">Responde correctamente para recibir un código por email.</p>
                    </header>
                    <form @submit.prevent="submitAnswers" novalidate>
                        <div class="field">
                            <label for="a1">{{ questions.question1 }}</label>
                            <input id="a1" type="text" v-model="answer1" placeholder="Tu respuesta"
                                   autocomplete="off" required :disabled="isLoading" />
                        </div>
                        <div class="field">
                            <label for="a2">{{ questions.question2 }}</label>
                            <input id="a2" type="text" v-model="answer2" placeholder="Tu respuesta"
                                   autocomplete="off" required :disabled="isLoading" />
                        </div>
                        <button type="submit" class="btn" :disabled="isLoading">
                            <span v-if="isLoading" class="btn-spin" aria-hidden="true"></span>
                            {{ isLoading ? 'Comprobando…' : 'Enviar código' }}
                        </button>
                    </form>
                </template>

                <!-- Paso 3: código + nueva contraseña -->
                <template v-else-if="step === 3">
                    <header class="auth-head">
                        <h1 class="auth-title">Nueva contraseña</h1>
                        <p class="auth-sub">{{ infoMessage }}</p>
                    </header>
                    <form @submit.prevent="submitReset" novalidate>
                        <div class="field">
                            <label for="code">Código de verificación</label>
                            <input id="code" type="text" inputmode="numeric" maxlength="6" v-model="code"
                                   placeholder="000000" autocomplete="one-time-code" required :disabled="isLoading" />
                        </div>
                        <div class="field">
                            <label for="newpw">Nueva contraseña</label>
                            <input id="newpw" type="password" v-model="newPassword" placeholder="••••••••"
                                   autocomplete="new-password" required :disabled="isLoading" />
                            <p class="field-hint">Mínimo 12 caracteres, con mayúscula, minúscula, número y símbolo.</p>
                        </div>
                        <div class="field">
                            <label for="confirmpw">Repite la contraseña</label>
                            <input id="confirmpw" type="password" v-model="confirmPassword" placeholder="••••••••"
                                   autocomplete="new-password" required :disabled="isLoading" />
                        </div>
                        <button type="submit" class="btn" :disabled="isLoading">
                            <span v-if="isLoading" class="btn-spin" aria-hidden="true"></span>
                            {{ isLoading ? 'Guardando…' : 'Restablecer contraseña' }}
                        </button>
                    </form>
                </template>

                <!-- Paso 4: éxito -->
                <template v-else>
                    <header class="auth-head">
                        <h1 class="auth-title">Contraseña actualizada</h1>
                        <p class="auth-sub">Tu contraseña se ha cambiado y se han cerrado las sesiones anteriores. Ya puedes iniciar sesión.</p>
                    </header>
                    <button type="button" class="btn" @click="goToLogin">Ir a iniciar sesión</button>
                </template>
            </div>
        </main>
    </div>
</template>

<style scoped>
.auth {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-base);
}
.auth-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1.5rem;
}
.auth-card {
    width: 100%;
    max-width: 26rem;
    background-color: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 1rem;
    padding: 2.5rem;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05), 0 24px 48px -32px rgba(15, 23, 42, 0.28);
}
.auth-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.8125rem; color: var(--text-muted);
    text-decoration: none; margin-bottom: 1.75rem;
    transition: color 0.15s ease;
}
.auth-back svg { width: 1rem; height: 1rem; }
.auth-back:hover { color: var(--text-secondary); }

.auth-head { margin-bottom: 1.75rem; }
.auth-title { font-size: 1.625rem; font-weight: 600; letter-spacing: -0.01em; color: var(--text-primary); }
.auth-sub { font-size: 0.9375rem; color: var(--text-secondary); margin-top: 0.35rem; }

.auth-error {
    display: flex; align-items: center; gap: 0.5rem;
    margin-bottom: 1.25rem; padding: 0.7rem 0.85rem;
    font-size: 0.875rem; color: #B91C1C;
    background-color: rgba(244, 63, 94, 0.07);
    border: 1px solid rgba(244, 63, 94, 0.25);
    border-radius: 0.6rem;
}
.auth-error svg { width: 1.15rem; height: 1.15rem; flex-shrink: 0; }

.field { margin-bottom: 1.1rem; }
.field label { display: block; font-size: 0.8125rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.4rem; }
.field-hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem; }
.field input {
    width: 100%; box-sizing: border-box;
    padding: 0.7rem 0.85rem; font-size: 0.9375rem;
    color: var(--text-primary); background-color: var(--bg-base);
    border: 1px solid var(--border); border-radius: 0.6rem;
    outline: none; transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.field input::placeholder { color: var(--text-muted); }
.field input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent);
}
.field input:disabled { opacity: 0.6; cursor: not-allowed; }

.btn {
    width: 100%; margin-top: 0.5rem;
    padding: 0.75rem 1rem; font-size: 0.9375rem; font-weight: 600;
    color: #fff; background-color: var(--accent);
    border: none; border-radius: 0.6rem; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    transition: background-color 0.15s ease, opacity 0.15s ease;
}
.btn:hover:not(:disabled) { background-color: var(--accent-hover); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-spin {
    width: 0.95rem; height: 0.95rem;
    border: 2px solid rgba(255,255,255,0.5); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
    .btn-spin { animation-duration: 1.4s; }
}
</style>
