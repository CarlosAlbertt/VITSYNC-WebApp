import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Especialidades from '../pages/Especialidades.vue';

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        beforeEnter: (to, from, next) => {
            if (isAuthenticated()) {
                next();
            } else {
                next({ name: 'login' });
            }
        }
    },
    {
        path: '/especialidades',
        name: 'especialidades',
        component: Especialidades,
        beforeEnter: (to, from, next) => {
            if (isAuthenticated()) {
                next();
            } else {
                next({ name: 'login' });
            }
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;