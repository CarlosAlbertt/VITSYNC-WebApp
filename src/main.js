import './assets/main.css'

import { createApp } from 'vue' // Importa la función para crear la aplicación Vue
import App from './App.vue' // Importa el componente raíz de la aplicación
import router from './router'

import Home from './pages/Home.vue'
import Login from './pages/Login.vue'

const app = createApp(App)

app.use(router);
app.mount('#app');
