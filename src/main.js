import './assets/main.css'

import { createApp } from 'vue' // Importa la función para crear la aplicación Vue
import App from './App.vue' // Importa el componente raíz de la aplicación
import router from './router' // Importa el router configurado

const app = createApp(app)

app.mount('#app');
