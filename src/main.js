/**
 * Punto de entrada principal de la aplicación VitSync WebApp.
 *
 * Inicializa Vue 3, registra el router y monta la app en el DOM.
 * Los componentes de página (Home, Login, etc.) se importan
 * automáticamente a través del router — no necesitan importarse aquí.
 */
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
