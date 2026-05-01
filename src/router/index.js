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
        path: '/agendar-cita',
        name: 'agendar-cita',
        // Redirigir al home y abrir el modal de booking
        beforeEnter: (to, from, next) => {
            if (!isAuthenticated()) {
                next({ name: 'login' });
            } else {
                // Importar dinámicamente para evitar dependencia circular
                import('../store/bookingModal').then(({ openBooking }) => {
                    openBooking();
                });
                next({ name: 'home' });
            }
        },
        component: () => import('../pages/AgendaCita.vue')
    },
    {
        path: '/perfil',
        name: 'perfil',
        component: () => import('../pages/Perfil.vue'),
        beforeEnter: (to, from, next) => {
            if (isAuthenticated()) {
                next();
            } else {
                next({ name: 'login' });
            }
        }
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
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            if (!token) {
                next({ name: 'login' });
            } else if (role !== 'ADMIN') {
                next({ name: 'home' });
            } else {
                next();
            }
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;