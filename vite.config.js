import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite' // Import Tailwind CSS plugin

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    // DevTools solo en desarrollo: nunca instrumentar el bundle de producción
    ...(mode === 'development' ? [vueDevTools()] : []),
    tailwindcss(),
  ],
  // Solo variables VITE_ llegan al cliente (default de Vite, explícito aquí).
  // Recordatorio: TODO lo VITE_ es público en el bundle — nunca secretos.
  envPrefix: 'VITE_',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  esbuild: {
    // SEGURIDAD (A09): en producción se eliminan console.* y debugger del
    // bundle — evita fugas de datos clínicos/identidad por la consola.
    // En dev se conservan para depurar.
    drop: mode === 'production' ? ['console', 'debugger'] : []
  },
  build: {
    rollupOptions: {
      output: {
        // Separar vendor para mejor cacheado entre deploys
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          utils: ['axios', 'dompurify']
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      // Necesario en Docker sobre Windows: inotify no funciona en el bridge
      // de Docker Desktop, polling detecta cambios de forma fiable.
      usePolling: true,
      interval: 300,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    coverage: {
      reporter: ['text', 'html'],
      // Umbral sobre lo testeado unitariamente (utils + auth). El resto de
      // stores son fetch+estado sin lógica; se ampliará al añadir tests.
      include: ['src/utils/**', 'src/store/auth.js'],
      thresholds: { lines: 70, functions: 70 }
    }
  },
}))
