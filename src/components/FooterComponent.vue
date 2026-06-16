<template>
    <footer class="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-12 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">VitSync</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Sincronizando tu salud para un mejor mañana. Encuentra a los mejores especialistas y gestiona tus citas fácilmente.
                </p>
                <router-link v-if="isAuthenticated && currentUser.role === 'ADMIN'" to="/admin"
                    class="inline-flex items-center mt-4 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 transition-colors">
                    <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Panel de administración
                </router-link>
            </div>
            <div>
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Enlaces Rápidos</h4>
                <ul class="space-y-2 text-sm">
                    <li><router-link to="/cuadro-medico" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Cuadro Médico</router-link></li>
                    <li><router-link to="/especialidades" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Especialidades</router-link></li>
                    <li><router-link to="/enfermedades-tratamientos" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Enfermedades y Tratamientos</router-link></li>
                    <li><router-link to="/privacidad" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Privacidad y tus datos</router-link></li>
                </ul>
            </div>
            <div>
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contacto</h4>
                <ul class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li>Atención al paciente: 912 33 77 99</li>
                    <li>Email: info@vitsync.com</li>
                </ul>
            </div>
        </div>
        <div class="text-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-500">
            <p>&copy; 2026 VitSync. Todos los derechos reservados.</p>
        </div>
    </footer>
</template>

<script setup>
import { isAuthenticated, currentUser } from '../store/auth';
</script>
