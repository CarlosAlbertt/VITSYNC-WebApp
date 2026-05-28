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
        path: '/cuadro-medico',
        name: 'cuadro-medico',
        component: () => import('../pages/CuadroMedico.vue')
    },
    {
        path: '/enfermedades-tratamientos',
        name: 'enfermedades',
        component: () => import('../pages/EnfermedadesTratamientos.vue')
    },
    {
        path: '/especialidad/:id',
        name: 'especialidad-detalle',
        component: () => import('../pages/EspecialidadDetalle.vue')
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
        path: '/mi-salud/:categoria',
        name: 'mi-salud-detalle',
        component: () => import('../pages/MiSaludDetalle.vue'),
        beforeEnter: (to, from, next) => {
            if (isAuthenticated()) {
                next();
            } else {
                next({ name: 'login' });
            }
        }
    },
    {
        path: '/comunicacion',
        name: 'comunicacion',
        component: () => import('../pages/Comunicacion.vue')
    },
    {
        path: '/admin',
        component: () => import('../pages/admin/AdminLayout.vue'),
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
            },
            {
                path: 'enfermedades',
                name: 'admin-enfermedades',
                component: () => import('../pages/admin/AdminEnfermedades.vue')
            }
        ],
        beforeEnter: async (to, from, next) => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            // Verificación rápida en cliente (primera barrera)
            if (!token) {
                next({ name: 'login' });
                return;
            }
            if (role !== 'ADMIN') {
                next({ name: 'home' });
                return;
            }

            // Verificación real contra el backend (segunda barrera — anti-tampering)
            try {
                const { default: api } = await import('../services/api');
                const response = await api.get('/api/auth/validate');
                const data = response.data;

                // Parsear respuesta JSON si viene como string
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;

                if (!parsed.valid || parsed.role !== 'ADMIN') {
                    // Token inválido o rol no es admin — limpiar sesión
                    localStorage.clear();
                    next({ name: 'login' });
                    return;
                }

                next(); // Token válido y rol confirmado por el servidor
            } catch (error) {
                console.error('[Router] Error validando token admin:', error);
                // Si falla la validación del servidor, permitir acceso basado en localStorage
                // (el backend rechazará las peticiones de todas formas con 401/403)
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