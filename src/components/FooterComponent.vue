<template>
    <footer class="bg-[var(--bg-surface)] text-[var(--text-secondary)] py-12 border-t border-[var(--border)]">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h3 class="text-xl font-bold text-accent mb-4">VitSync</h3>
                <p class="text-sm text-[var(--text-muted)] leading-relaxed">
                    Sincronizando tu salud para un mejor mañana. Encuentra a los mejores especialistas y gestiona tus citas fácilmente.
                </p>
                <router-link v-if="isAuthenticated && currentUser.role === 'ADMIN'" to="/admin"
                    class="inline-flex items-center mt-4 text-sm font-medium text-accent hover:text-[var(--accent-hover)] transition-colors duration-200">
                    <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Panel de administración
                </router-link>
            </div>
            <div>
                <h4 class="text-lg font-semibold text-[var(--text-primary)] mb-4">Enlaces Rápidos</h4>
                <ul class="space-y-2 text-sm">
                    <li><router-link to="/cuadro-medico" class="hover:text-accent transition-colors duration-200">Cuadro Médico</router-link></li>
                    <li><router-link to="/especialidades" class="hover:text-accent transition-colors duration-200">Especialidades</router-link></li>
                    <li><router-link to="/enfermedades-tratamientos" class="hover:text-accent transition-colors duration-200">Enfermedades y Tratamientos</router-link></li>
                    <li><router-link to="/privacidad" class="hover:text-accent transition-colors duration-200">Privacidad y tus datos</router-link></li>
                </ul>
            </div>
            <div>
                <h4 class="text-lg font-semibold text-[var(--text-primary)] mb-4">Contacto</h4>
                <ul class="space-y-2 text-sm text-[var(--text-muted)]">
                    <li>Atención al paciente: 912 33 77 99</li>
                    <li>Email: info@vitsync.com</li>
                </ul>
            </div>
        </div>
        <div class="text-center mt-12 pt-8 border-t border-[var(--border)] text-sm text-[var(--text-muted)]">
            <p>&copy; 2026 VitSync. Todos los derechos reservados.</p>
        </div>
    </footer>
</template>

<script setup>
import { isAuthenticated, currentUser } from '../store/auth';
</script>
