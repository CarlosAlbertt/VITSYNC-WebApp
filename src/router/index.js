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
        /*
        beforeEnter: (to, from, next) => {
            if (isAuthenticated()) {
                next();
            } else {
                next({ name: 'login' });
            }
        }
        */
    },
    {
        path: '/especialidades',
        name: 'especialidades',
        component: Especialidades,
        /*
        beforeEnter: (to, from, next) => {
            /*if (isAuthenticated()) {
                next();
            } else {
                next({ name: 'login' });
            }
        }*/
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../pages/Register.vue') // Lazy loading para optimizar
    },
    {
        path: '/verify',
        name: 'verify',
        component: () => import('../pages/VerifyAccount.vue')
    },
    {
        path: '/admin',
        children: [
            {
                path: '',
                name: 'admin-home',
                component: () => import('../pages/admin/AdminHome.vue')
            },
            {
                path: 'users',
                name: 'admin-users',
                component: () => import('../pages/admin/AdminUsuarios.vue')
            },
            {
                path: 'medicos',
                name: 'admin-medicos',
                component: () => import('../pages/admin/AdminMedicos.vue')
            },
            {
                path: 'especialidades',
                name: 'admin-especialidades',
                component: () => import('../pages/admin/AdminEspecialidades.vue')
            }
        ],
        /*
        beforeEnter: (to, from, next) => {
            // TODO: Implement actual Admin Role check
            if (isAuthenticated()) {
                next();
            } else {
                next({ name: 'login' });
            }
        }
        */
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;