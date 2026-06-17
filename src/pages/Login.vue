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
    <!-- Contenedor principal: pantalla completa, dos columnas en desktop -->
    <div class="login-root">

        <!-- ═══════════════════════════════════ -->
        <!-- COLUMNA IZQUIERDA: Panel de marca   -->
        <!-- ═══════════════════════════════════ -->
        <div class="login-brand-col">
            <div class="brand-grain" aria-hidden="true"></div>
            <div class="brand-blob brand-blob-top" aria-hidden="true"></div>
            <div class="brand-blob brand-blob-bottom" aria-hidden="true"></div>

            <!-- Motivo ECG -->
            <svg class="brand-ecg" viewBox="0 0 600 80" fill="none" aria-hidden="true" preserveAspectRatio="none">
                <path d="M0 40 H180 l14 -28 l16 56 l14 -42 l12 28 H320 l16 -34 l18 60 l12 -26 H600"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <div class="brand-content">
                <span class="brand-eyebrow">Plataforma clínica · RGPD</span>
                <h2 class="brand-headline">Tu salud,<br />sincronizada.</h2>
                <p class="brand-body">
                    Accede a tu historial médico, gestiona tus citas y comunícate
                    directamente con tus especialistas desde un solo lugar.
                </p>

                <div class="brand-features">
                    <div v-for="feat in [
                        'Consulta tu historial desde cualquier lugar',
                        'Chat directo con tus médicos',
                        'Gestión de citas en tiempo real'
                    ]" :key="feat" class="brand-feature-item">
                        <span class="brand-check" aria-hidden="true">
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M5 10.5l3.5 3.5L15 6.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                        <span>{{ feat }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ═══════════════════════════════════ -->
        <!-- COLUMNA DERECHA: Formulario         -->
        <!-- ═══════════════════════════════════ -->
        <div class="login-form-col">
            <div class="back-button-wrap">
                <router-link to="/" class="back-link" title="Volver a Inicio">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
                    </svg>
                    <span class="text-sm font-medium">Inicio</span>
                </router-link>
            </div>

            <div class="login-stage">
                <!-- Cabecera -->
                <div class="login-header">
                    <span class="login-brand">Mi VitSync</span>
                    <h1 class="login-title">Bienvenido de vuelta</h1>
                    <p class="login-subtitle">Inicia sesión para acceder a tu área de salud.</p>
                </div>

                <!-- Tarjeta del formulario -->
                <div class="login-card">
                    <!-- Mensaje de error -->
                    <div v-if="errorMessage" class="login-error" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" class="login-error-icon"
                             viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7
                                  4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1
                                  1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        {{ errorMessage }}
                    </div>

                    <form @submit.prevent="handleLogin">
                        <!-- Campo NIF -->
                        <div class="form-group">
                            <label for="username" class="form-label">NIF/CIF</label>
                            <div class="input-wrap">
                                <span class="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-sm"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              stroke-width="1.5"
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input id="username" type="text" v-model="nif"
                                       placeholder="12345678A"
                                       class="form-input"
                                       required :disabled="isLoading" />
                            </div>
                        </div>

                        <!-- Campo Contraseña -->
                        <div class="form-group">
                            <div class="form-label-row">
                                <label for="password" class="form-label">Contraseña</label>
                                <a href="#" class="form-link">¿Olvidaste tu contraseña?</a>
                            </div>
                            <div class="input-wrap">
                                <span class="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-sm"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              stroke-width="1.5"
                                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0
                                                 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4
                                                 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input id="password" type="password" v-model="password"
                                       placeholder="••••••••"
                                       class="form-input"
                                       required :disabled="isLoading" />
                            </div>
                        </div>

                        <!-- Botón de login -->
                        <button type="submit" :disabled="isLoading" class="btn-primary"
                                :class="{ 'btn-loading': isLoading }">
                            <span v-if="isLoading" class="btn-spinner">
                                <svg class="spinner-svg" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10"
                                            stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                                             5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824
                                             3 7.938l3-2.647z"></path>
                                </svg>
                                Entrando...
                            </span>
                            <span v-else>Entrar</span>
                        </button>
                    </form>

                    <!-- Enlace de registro -->
                    <p class="register-link-text">
                        ¿No tienes usuario?
                        <router-link to="/register" class="text-accent-link">
                            Date de alta ahora
                        </router-link>
                    </p>

                    <p class="help-link-text">
                        <a href="#" class="help-link">¿Problemas con el acceso o alta?</a>
                    </p>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* Dirección estética: "clinical editorial" — serif display (Georgia, sin
   fuentes externas por CSP), eyebrow mono, acento teal, textura y motivo ECG. */

/* ─── Layout raíz ─────────────────────────────────── */
.login-root {
    min-height: 100vh;
    display: flex;
}

/* ─── Columna del formulario ──────────────────────── */
.login-form-col {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3.5rem 1.5rem;
    background-color: var(--bg-base);
    /* Textura de puntos sutil */
    background-image: radial-gradient(color-mix(in srgb, var(--text-muted) 22%, transparent) 1px, transparent 1px);
    background-size: 22px 22px;
}

@media (min-width: 1024px) {
    .login-form-col { width: 50%; }
}

.login-stage { width: 100%; max-width: 25rem; }

/* ─── Botón volver ────────────────────────────────── */
.back-button-wrap { position: absolute; top: 1.5rem; left: 1.5rem; }
.back-link {
    display: inline-flex; align-items: center; gap: 0.375rem;
    color: var(--text-secondary);
    transition: color 0.2s ease;
}
.back-link:hover { color: var(--accent); }

/* ─── Cabecera ────────────────────────────────────── */
.login-header { margin-bottom: 1.75rem; }
.login-brand {
    display: inline-block;
    font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--accent);
    padding-bottom: 0.5rem;
}
.login-title {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 2.25rem;
    line-height: 1.1;
    letter-spacing: -0.01em;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}
.login-subtitle { font-size: 0.9375rem; color: var(--text-secondary); }

/* ─── Tarjeta ─────────────────────────────────────── */
.login-card {
    position: relative;
    width: 100%;
    background-color: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 2rem;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 18px 40px -24px rgba(15, 23, 42, 0.25);
}
/* Regla de acento superior */
.login-card::before {
    content: "";
    position: absolute; top: 0; left: 2rem; right: 2rem; height: 3px;
    border-radius: 0 0 3px 3px;
    background: linear-gradient(90deg, var(--accent), transparent);
}

/* ─── Error ───────────────────────────────────────── */
.login-error {
    display: flex; align-items: center; gap: 0.5rem;
    margin-bottom: 1.25rem; padding: 0.75rem 0.875rem;
    background-color: rgba(244, 63, 94, 0.08);
    border: 1px solid rgba(244, 63, 94, 0.3);
    border-radius: 0.75rem;
    color: #E11D48; font-size: 0.875rem;
}
.login-error-icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }

/* ─── Campos ──────────────────────────────────────── */
.form-group { margin-bottom: 1.25rem; }
.form-label {
    display: block;
    font-size: 0.8125rem; font-weight: 600;
    color: var(--text-secondary); margin-bottom: 0.4rem;
    letter-spacing: 0.01em;
}
.form-label-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem; }
.form-link { font-size: 0.75rem; color: var(--accent); text-decoration: none; }
.form-link:hover { text-decoration: underline; }

.input-wrap { position: relative; }
.input-icon {
    position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
    color: var(--text-muted); pointer-events: none;
    transition: color 0.2s ease;
}
.icon-sm { width: 1.2rem; height: 1.2rem; }

.form-input {
    width: 100%;
    padding: 0.7rem 1rem 0.7rem 2.6rem;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    background-color: var(--bg-elevated);
    color: var(--text-primary);
    font-size: 0.9375rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    box-sizing: border-box;
}
.form-input::placeholder { color: var(--text-muted); }
.form-input:focus {
    border-color: var(--accent);
    background-color: var(--bg-surface);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent);
}
.form-input:focus + .input-icon,
.input-wrap:focus-within .input-icon { color: var(--accent); }
.form-input:disabled { opacity: 0.6; cursor: not-allowed; }

/* ─── Botón primario ──────────────────────────────── */
.btn-primary {
    display: block; width: 100%; margin-top: 0.25rem;
    padding: 0.8rem 1rem;
    border-radius: 0.75rem; border: none;
    background-color: var(--accent); color: #fff;
    font-size: 0.9375rem; font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    box-shadow: 0 8px 20px -8px color-mix(in srgb, var(--accent) 70%, transparent);
}
.btn-primary:hover:not(:disabled) { background-color: var(--accent-hover); }
.btn-primary:active:not(:disabled) { transform: translateY(1px); }
.btn-loading { opacity: 0.7; cursor: not-allowed; }
.btn-spinner { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.spinner-svg { width: 1rem; height: 1rem; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Links inferiores ────────────────────────────── */
.register-link-text { margin-top: 1.5rem; text-align: center; font-size: 0.875rem; color: var(--text-secondary); }
.text-accent-link { font-weight: 600; color: var(--accent); text-decoration: none; }
.text-accent-link:hover { text-decoration: underline; }
.help-link-text { margin-top: 0.75rem; text-align: center; }
.help-link { font-size: 0.75rem; color: var(--text-muted); text-decoration: none; }
.help-link:hover { color: var(--text-secondary); }

/* ─── Columna de marca ────────────────────────────── */
.login-brand-col {
    display: none;
    position: relative;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    padding: 3.5rem;
    background: linear-gradient(150deg, #0F766E 0%, #0D9488 45%, #0B5F57 100%);
    color: #fff;
}
html.dark .login-brand-col {
    background: linear-gradient(150deg, #0B1120 0%, #14302E 55%, #0B1120 100%);
}
@media (min-width: 1024px) {
    .login-brand-col { display: flex; width: 50%; }
}

/* Grano sutil sobre el gradiente */
.brand-grain {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
    background-image: radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px);
    background-size: 18px 18px;
    mask-image: radial-gradient(ellipse at 30% 30%, #000 0%, transparent 75%);
}
.brand-blob { position: absolute; border-radius: 9999px; filter: blur(70px); pointer-events: none; }
.brand-blob-top { top: 4rem; right: 4rem; width: 16rem; height: 16rem; background: rgba(255,255,255,0.10); }
.brand-blob-bottom { bottom: 2rem; left: 2rem; width: 22rem; height: 22rem; background: rgba(45,212,191,0.18); }

/* Motivo ECG inferior */
.brand-ecg {
    position: absolute; left: 0; right: 0; bottom: 14%;
    width: 100%; height: 80px; color: rgba(255,255,255,0.35);
    stroke-dasharray: 1400; stroke-dashoffset: 1400;
    animation: ecgDraw 3.2s ease-out 0.3s forwards;
}
@keyframes ecgDraw { to { stroke-dashoffset: 0; } }

.brand-content { position: relative; z-index: 10; max-width: 28rem; }
.brand-eyebrow {
    display: inline-block;
    font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
    font-size: 0.7rem; letter-spacing: 0.24em; text-transform: uppercase;
    color: rgba(255,255,255,0.7); margin-bottom: 1.25rem;
    padding: 0.3rem 0.7rem; border: 1px solid rgba(255,255,255,0.25); border-radius: 999px;
}
.brand-headline {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 2.75rem; line-height: 1.05; letter-spacing: -0.015em; margin-bottom: 1.25rem;
}
.brand-body { color: rgba(255,255,255,0.85); font-size: 1.0625rem; line-height: 1.7; max-width: 26rem; }
.brand-features { display: flex; flex-direction: column; gap: 0.875rem; margin-top: 2.25rem; }
.brand-feature-item { display: flex; align-items: center; gap: 0.75rem; color: rgba(255,255,255,0.92); font-size: 0.95rem; }
.brand-check {
    width: 1.65rem; height: 1.65rem; border-radius: 0.5rem; flex-shrink: 0;
    background: rgba(255,255,255,0.16);
    display: flex; align-items: center; justify-content: center;
}
.brand-check svg { width: 1rem; height: 1rem; }

/* ─── Entrada escalonada ──────────────────────────── */
.login-header, .login-card { animation: fadeUp 0.6s ease-out both; }
.login-card { animation-delay: 0.08s; }
.brand-eyebrow, .brand-headline, .brand-body, .brand-features {
    animation: fadeUp 0.6s ease-out both;
}
.brand-headline { animation-delay: 0.06s; }
.brand-body { animation-delay: 0.12s; }
.brand-features { animation-delay: 0.18s; }
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
    .brand-ecg { animation: none; stroke-dashoffset: 0; }
    .login-header, .login-card, .brand-eyebrow, .brand-headline, .brand-body, .brand-features {
        animation: none;
    }
}
</style>
