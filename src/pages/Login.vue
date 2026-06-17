<script setup>
import { login } from '../store/auth';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const nif = ref('');
const password = ref('');
const errorMessage = ref(null);
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();

const validateLogin = () => {
    if(!nif.value.trim()){
        throw new Error('El campo NIF/CIF no puede estar vacío');
    }
    if (!password.value || !password.value.trim()) {
        throw new Error('La contraseña no puede estar vacía');
    }
};

const handleLogin = async () => {
    try {
        errorMessage.value = null;
        validateLogin();
        isLoading.value = true;
        await login(nif.value, password.value);
        // Volver a la ruta protegida que originó el redirect (solo rutas
        // internas: un redirect absoluto permitiría open-redirect)
        const redirect = typeof route.query.redirect === 'string'
            && route.query.redirect.startsWith('/') ? route.query.redirect : null;
        router.push(redirect || { name: 'home' });
    } catch (error) {
        errorMessage.value = error.message || 'Error de conexión con el servidor';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="auth">
        <div class="auth-card">
            <router-link to="/" class="auth-back">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M19 12H5M11 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Volver al inicio
            </router-link>

            <header class="auth-head">
                <span class="auth-kicker">VitSync</span>
                <h1 class="auth-title">Inicia sesión</h1>
                <p class="auth-sub">Accede a tu área de salud.</p>
            </header>

            <div v-if="errorMessage" class="auth-error" role="alert">{{ errorMessage }}</div>

            <form @submit.prevent="handleLogin" novalidate>
                <div class="field">
                    <label for="username">NIF/CIF</label>
                    <input id="username" type="text" v-model="nif" placeholder="12345678A"
                           autocomplete="username" required :disabled="isLoading" />
                </div>

                <div class="field">
                    <div class="field-row">
                        <label for="password">Contraseña</label>
                        <a href="#" class="field-aux">¿Olvidaste tu contraseña?</a>
                    </div>
                    <input id="password" type="password" v-model="password" placeholder="••••••••"
                           autocomplete="current-password" required :disabled="isLoading" />
                </div>

                <button type="submit" class="btn" :disabled="isLoading">
                    <span v-if="isLoading" class="btn-spin" aria-hidden="true"></span>
                    {{ isLoading ? 'Entrando…' : 'Entrar' }}
                </button>
            </form>

            <p class="auth-foot">
                ¿No tienes usuario?
                <router-link to="/register">Date de alta</router-link>
            </p>
            <p class="auth-foot-sub">
                <a href="#">¿Problemas con el acceso o alta?</a>
            </p>
        </div>
    </div>
</template>

<style scoped>
.auth {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
    background-color: var(--bg-base);
}

.auth-card {
    width: 100%;
    max-width: 25rem;
    background-color: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 0.875rem;
    padding: 2.25rem;
}

.auth-back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8125rem;
    color: var(--text-muted);
    text-decoration: none;
    margin-bottom: 2rem;
    transition: color 0.15s ease;
}
.auth-back svg { width: 1rem; height: 1rem; }
.auth-back:hover { color: var(--text-secondary); }

.auth-head { margin-bottom: 1.75rem; }
.auth-kicker {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--accent);
}
.auth-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-top: 0.4rem;
    letter-spacing: -0.01em;
}
.auth-sub {
    font-size: 0.9375rem;
    color: var(--text-secondary);
    margin-top: 0.3rem;
}

.auth-error {
    margin-bottom: 1.25rem;
    padding: 0.7rem 0.85rem;
    font-size: 0.875rem;
    color: #B91C1C;
    background-color: rgba(244, 63, 94, 0.07);
    border: 1px solid rgba(244, 63, 94, 0.25);
    border-radius: 0.6rem;
}

.field { margin-bottom: 1.1rem; }
.field label {
    display: block;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 0.4rem;
}
.field-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem; }
.field-row label { margin-bottom: 0; }
.field-aux { font-size: 0.75rem; color: var(--accent); text-decoration: none; }
.field-aux:hover { text-decoration: underline; }

.field input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.625rem 0.8rem;
    font-size: 0.9375rem;
    color: var(--text-primary);
    background-color: var(--bg-base);
    border: 1px solid var(--border);
    border-radius: 0.6rem;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.field input::placeholder { color: var(--text-muted); }
.field input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent);
}
.field input:disabled { opacity: 0.6; cursor: not-allowed; }

.btn {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.7rem 1rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #fff;
    background-color: var(--accent);
    border: none;
    border-radius: 0.6rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background-color 0.15s ease, opacity 0.15s ease;
}
.btn:hover:not(:disabled) { background-color: var(--accent-hover); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-spin {
    width: 0.95rem; height: 0.95rem;
    border: 2px solid rgba(255,255,255,0.5);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.auth-foot {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-secondary);
}
.auth-foot a { color: var(--accent); font-weight: 500; text-decoration: none; }
.auth-foot a:hover { text-decoration: underline; }
.auth-foot-sub { margin-top: 0.6rem; text-align: center; }
.auth-foot-sub a { font-size: 0.8125rem; color: var(--text-muted); text-decoration: none; }
.auth-foot-sub a:hover { color: var(--text-secondary); }

@media (prefers-reduced-motion: reduce) {
    .btn-spin { animation-duration: 1.4s; }
}
</style>
