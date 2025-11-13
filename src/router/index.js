import { createRouter, createWebHistory } from 'vue-router';

// 1. Importa tus componentes de "página" (Vistas)
// (Estos son los componentes que quieres que se muestren en cada ruta)
import HomeView from '../components/HomeView.vue';

// 2. Define el array de rutas
const routes = [
    {
        path: '/',          // La URL en el navegador
        name: 'home',       // Un nombre opcional para la ruta
        component: HomeView // El componente que se cargará
    },
    /*
    {
        path: '/about',
        name: 'about',
        component: AboutView
    },
    {
        path: '/login',     // La ruta para tu formulario
        name: 'login',
        component: LoginView
    }*/
    // ...puedes añadir más rutas aquí
];

// 3. Crea la instancia del router
const router = createRouter({
    // 'history' le dice al router cómo gestionar el historial de navegación
    history: createWebHistory(), // Usa las URLs "limpias" (ej. /about)
    routes, // (equivale a routes: routes)
});

// 4. Exporta el router para que tu app principal lo use
export default router;