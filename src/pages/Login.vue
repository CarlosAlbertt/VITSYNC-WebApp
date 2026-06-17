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
        <!-- Panel lateral con foto + overlay sólido (sin gradiente) -->
        <aside class="auth-aside">
            <div class="auth-aside-overlay" aria-hidden="true"></div>
            <span class="auth-ring auth-ring-1" aria-hidden="true"></span>
            <span class="auth-ring auth-ring-2" aria-hidden="true"></span>

            <div class="auth-aside-content">
                <div class="auth-mark" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12h14" stroke-linecap="round" />
                    </svg>
                </div>
                <p class="auth-wordmark">VitSync</p>
                <h2 class="auth-aside-title">Tu salud, en un solo lugar.</h2>
                <ul class="auth-points">
                    <li>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 10.5l3.5 3.5L15 6.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        Historial médico siempre disponible
                    </li>
                    <li>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 10.5l3.5 3.5L15 6.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        Chat directo con tus especialistas
                    </li>
                    <li>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 10.5l3.5 3.5L15 6.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        Gestión de citas en tiempo real
                    </li>
                </ul>
                <p class="auth-aside-foot">Datos cifrados · Cumplimiento RGPD</p>
            </div>
        </aside>

        <!-- Formulario -->
        <main class="auth-main">
            <div class="auth-card">
                <router-link to="/" class="auth-back">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M19 12H5M11 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Volver al inicio
                </router-link>

                <header class="auth-head">
                    <h1 class="auth-title">Inicia sesión</h1>
                    <p class="auth-sub">Bienvenido de vuelta. Accede a tu área de salud.</p>
                </header>

                <div v-if="errorMessage" class="auth-error" role="alert">
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    {{ errorMessage }}
                </div>

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
        </main>
    </div>
</template>

<style scoped>
.auth {
    min-height: 100vh;
    display: flex;
    background-color: var(--bg-base);
}

/* ── Panel lateral (solo desktop) ───────────────────── */
.auth-aside {
    display: none;
    position: relative;
    width: 45%;
    overflow: hidden;
    /* Color base sólido + foto; el overlay da legibilidad (sin gradiente) */
    background-color: #0B3B37;
    background-image: url('/images/hero-background.png');
    background-size: cover;
    background-position: center;
    color: #fff;
}
html.dark .auth-aside { background-color: #0B1120; }

.auth-aside-overlay {
    position: absolute; inset: 0;
    background-color: rgba(8, 48, 44, 0.82);
}
html.dark .auth-aside-overlay { background-color: rgba(8, 14, 26, 0.86); }

.auth-ring {
    position: absolute;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    pointer-events: none;
}
.auth-ring-1 { width: 30rem; height: 30rem; top: -10rem; right: -8rem; }
.auth-ring-2 { width: 20rem; height: 20rem; bottom: -6rem; left: -5rem; border-color: rgba(255,255,255,0.08); }

.auth-aside-content {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    height: 100%;
    padding: 3.5rem;
    justify-content: center;
    max-width: 30rem;
}
.auth-mark {
    width: 2.75rem; height: 2.75rem; border-radius: 0.75rem;
    background-color: rgba(255, 255, 255, 0.14);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem;
}
.auth-mark svg { width: 1.5rem; height: 1.5rem; }
.auth-wordmark { font-size: 0.875rem; font-weight: 600; letter-spacing: 0.02em; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; }
.auth-aside-title { font-size: 2rem; font-weight: 600; line-height: 1.2; letter-spacing: -0.015em; margin-bottom: 2rem; }
.auth-points { display: flex; flex-direction: column; gap: 0.85rem; }
.auth-points li { display: flex; align-items: center; gap: 0.7rem; font-size: 0.95rem; color: rgba(255,255,255,0.9); }
.auth-points svg { width: 1.1rem; height: 1.1rem; color: #fff; flex-shrink: 0; }
.auth-aside-foot { margin-top: 2.5rem; font-size: 0.8rem; color: rgba(255,255,255,0.6); }

/* ── Zona del formulario ────────────────────────────── */
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
.field-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem; }
.field-row label { margin-bottom: 0; }
.field-aux { font-size: 0.75rem; color: var(--accent); text-decoration: none; }
.field-aux:hover { text-decoration: underline; }

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

.auth-foot { margin-top: 1.75rem; text-align: center; font-size: 0.875rem; color: var(--text-secondary); }
.auth-foot a { color: var(--accent); font-weight: 500; text-decoration: none; }
.auth-foot a:hover { text-decoration: underline; }
.auth-foot-sub { margin-top: 0.6rem; text-align: center; }
.auth-foot-sub a { font-size: 0.8125rem; color: var(--text-muted); text-decoration: none; }
.auth-foot-sub a:hover { color: var(--text-secondary); }

@media (min-width: 1024px) {
    .auth-aside { display: block; }
}
@media (prefers-reduced-motion: reduce) {
    .btn-spin { animation-duration: 1.4s; }
}
</style>
