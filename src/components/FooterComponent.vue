<template>
    <footer class="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-12 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">VitSync</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Sincronizando tu salud para un mejor mañana. Encuentra a los mejores especialistas y gestiona tus citas fácilmente.
                </p>
            </div>
            <div>
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Enlaces Rápidos</h4>
                <ul class="space-y-2 text-sm">
                    <li><router-link to="/cuadro-medico" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Cuadro Médico</router-link></li>
                    <li><router-link to="/especialidades" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Especialidades</router-link></li>
                    <li><router-link to="/enfermedades-tratamientos" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Enfermedades y Tratamientos</router-link></li>
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
