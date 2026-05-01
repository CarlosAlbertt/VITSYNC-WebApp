<script setup>
import { login } from '../store/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const nif = ref('');
const password = ref('');
const errorMessage = ref(null);
const isLoading = ref(false);
const router = useRouter();

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
    <!-- Contenedor principal: pantalla completa, dos columnas en desktop -->
    <div class="login-root">

        <!-- ═══════════════════════════════════ -->
        <!-- COLUMNA IZQUIERDA: Formulario       -->
        <!-- ═══════════════════════════════════ -->
        <div class="login-form-col">
            <div class="back-button-wrap">
                <router-link to="/" class="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-teal-600 transition-colors" title="Volver a Inicio">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
                    </svg>
                    <span class="text-sm font-medium">Inicio</span>
                </router-link>
            </div>

            <!-- Logo y título -->
            <div class="login-header">
                <h2 class="login-brand">VITSYNC</h2>
                <h1 class="login-title">Mi VitSync</h1>
                <p class="login-subtitle">Inicia sesión para acceder a tu área de salud</p>
            </div>

            <!-- Tarjeta del formulario -->
            <div class="login-card">

                <h3 class="login-card-title">Inicia sesión</h3>

                <!-- Mensaje de error -->
                <div v-if="errorMessage" class="login-error">
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

        <!-- ═══════════════════════════════════ -->
        <!-- COLUMNA DERECHA: Panel de marca     -->
        <!-- ═══════════════════════════════════ -->
        <div class="login-brand-col">
            <!-- Círculos decorativos -->
            <div class="brand-blob brand-blob-top"></div>
            <div class="brand-blob brand-blob-bottom"></div>

            <!-- Contenido -->
            <div class="brand-content">
                <div class="brand-logo-wrap">
                    <div class="brand-logo-box">
                        <svg xmlns="http://www.w3.org/2000/svg" class="brand-logo-icon"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="1.5"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5
                                     4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0
                                     00-6.364 0z" />
                        </svg>
                    </div>
                    <h2 class="brand-headline">Tu salud, sincronizada</h2>
                    <p class="brand-body">
                        Accede a tu historial médico, gestiona tus citas y comunícate
                        directamente con tus especialistas desde un solo lugar.
                    </p>
                </div>

                <!-- Features -->
                <div class="brand-features">
                    <div v-for="feat in [
                        'Consulta tu historial desde cualquier lugar',
                        'Chat directo con tus médicos',
                        'Gestión de citas en tiempo real'
                    ]" :key="feat" class="brand-feature-item">
                        <div class="brand-check">✓</div>
                        <span>{{ feat }}</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* ─── Layout raíz ─────────────────────────────────── */
.login-root {
    min-height: 100vh;
    display: flex;
}

/* ─── Columna izquierda (formulario) ─────────────── */
.login-form-col {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    background-color: var(--bg-base);
    transition: background-color 0.25s ease;
    position: relative; /* necesario para que back-btn-wrap se posicione dentro */
}

@media (min-width: 1024px) {
    .login-form-col { width: 50%; }
}

/* ─── Botón volver ────────────────────────────────── */
.back-button-wrap {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
}

/* ─── Cabecera del formulario ─────────────────────── */
.login-header    { text-align: center; margin-bottom: 2rem; }
.login-brand     {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.5rem;
}
.login-title     {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}
.login-subtitle  {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* ─── Tarjeta del formulario ──────────────────────── */
.login-card {
    width: 100%;
    max-width: 24rem;
    background-color: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    transition: background-color 0.25s ease, border-color 0.25s ease;
}

.login-card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
}

/* ─── Error ───────────────────────────────────────── */
.login-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background-color: rgba(244, 63, 94, 0.08);
    border: 1px solid rgba(244, 63, 94, 0.3);
    border-radius: 0.75rem;
    color: #F43F5E;
    font-size: 0.875rem;
}
.login-error-icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }

/* ─── Campos del formulario ────────────────────────── */
.form-group      { margin-bottom: 1.25rem; }
.form-label      {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 0.375rem;
}
.form-label-row  {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.375rem;
}
.form-link       { font-size: 0.75rem; color: var(--accent); text-decoration: none; }
.form-link:hover { text-decoration: underline; }

.input-wrap      { position: relative; }
.input-icon      {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
}
.icon-sm         { width: 1.25rem; height: 1.25rem; }

.form-input {
    width: 100%;
    padding: 0.625rem 1rem 0.625rem 2.5rem;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    background-color: var(--bg-elevated);
    color: var(--text-primary);
    font-size: 0.9375rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-sizing: border-box;
}
.form-input::placeholder { color: var(--text-muted); }
.form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);
}
.form-input:disabled { opacity: 0.6; cursor: not-allowed; }

/* ─── Botón primario ──────────────────────────────── */
.btn-primary {
    display: block;
    width: 100%;
    padding: 0.625rem 1rem;
    border-radius: 0.75rem;
    border: none;
    background-color: var(--accent);
    color: #fff;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 35%, transparent);
}
.btn-primary:hover:not(:disabled) {
    background-color: var(--accent-hover);
    box-shadow: 0 4px 16px color-mix(in srgb, var(--accent) 40%, transparent);
}
.btn-loading { opacity: 0.65; cursor: not-allowed; }
.btn-spinner { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.spinner-svg { width: 1rem; height: 1rem; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Links inferiores ────────────────────────────── */
.register-link-text {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-secondary);
}
.text-accent-link {
    font-weight: 600;
    color: var(--accent);
    text-decoration: none;
}
.text-accent-link:hover { text-decoration: underline; }

.help-link-text { margin-top: 0.75rem; text-align: center; }
.help-link      { font-size: 0.75rem; color: var(--text-muted); text-decoration: none; }
.help-link:hover { color: var(--text-secondary); }

/* ─── Columna derecha (branding) ──────────────────── */
.login-brand-col {
    display: none;
    position: relative;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    background: linear-gradient(135deg, #0D9488 0%, #0B7A6F 40%, #065F46 100%);
}

html.dark .login-brand-col {
    background: linear-gradient(135deg, #141E2E 0%, #1E2D42 50%, #0B1120 100%);
}

@media (min-width: 1024px) {
    .login-brand-col { display: flex; width: 50%; }
}

.brand-blob {
    position: absolute;
    border-radius: 9999px;
    filter: blur(60px);
    pointer-events: none;
}
.brand-blob-top {
    top: 5rem; right: 5rem;
    width: 16rem; height: 16rem;
    background: rgba(255,255,255,0.08);
}
.brand-blob-bottom {
    bottom: 2.5rem; left: 2.5rem;
    width: 22rem; height: 22rem;
    background: rgba(255,255,255,0.05);
}

.brand-content    { position: relative; z-index: 10; text-align: center; max-width: 28rem; color: #fff; }
.brand-logo-wrap  { margin-bottom: 2rem; }
.brand-logo-box   {
    width: 5rem; height: 5rem; margin: 0 auto 1.5rem;
    border-radius: 1rem;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
}
.brand-logo-icon  { width: 2.5rem; height: 2.5rem; }
.brand-headline   { font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; }
.brand-body       { color: rgba(255,255,255,0.82); font-size: 1.0625rem; line-height: 1.7; }

.brand-features        { display: flex; flex-direction: column; gap: 1rem; text-align: left; margin-top: 2rem; }
.brand-feature-item    { display: flex; align-items: center; gap: 0.75rem; color: rgba(255,255,255,0.9); }
.brand-check {
    width: 2rem; height: 2rem; border-radius: 0.5rem;
    background: rgba(255,255,255,0.18);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 0.9rem;
}
</style>
