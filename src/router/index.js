import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated, currentUser, initializeAuth } from '../store/auth';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Especialidades from '../pages/Especialidades.vue';

/**
 * Route table. Access control is declared via `meta`:
 * - `meta.public: true`  → reachable without a session (login/register/…)
 * - `meta.requiresAuth`  → needs a live session
 * - `meta.role`          → additionally needs that role
 *
 * IMPORTANTE: estos guards son UX (evitan montar vistas vacías). La
 * autorización REAL la impone el backend en cada endpoint: manipular el
 * estado del cliente solo muestra una carcasa sin datos.
 */
const routes = [
    { path: '/', name: 'home', component: Home, meta: { requiresAuth: true } },
    {
        path: '/especialidades',
        name: 'especialidades',
        component: Especialidades,
        meta: { requiresAuth: true }
    },
    {
        path: '/cuadro-medico',
        name: 'cuadro-medico',
        component: () => import('../pages/CuadroMedico.vue'),
        meta: { public: true } // catálogo informativo
    },
    {
        path: '/enfermedades-tratamientos',
        name: 'enfermedades',
        component: () => import('../pages/EnfermedadesTratamientos.vue'),
        meta: { public: true } // catálogo informativo
    },
    {
        path: '/especialidad/:id',
        name: 'especialidad-detalle',
        component: () => import('../pages/EspecialidadDetalle.vue'),
        meta: { public: true } // catálogo informativo
    },
    { path: '/login', name: 'login', component: Login, meta: { public: true } },
    {
        path: '/register',
        name: 'register',
        component: () => import('../pages/Register.vue'),
        meta: { public: true }
    },
    {
        path: '/verify',
        name: 'verify',
        component: () => import('../pages/VerifyAccount.vue'),
        meta: { public: true }
    },
    {
        path: '/agendar-cita',
        name: 'agendar-cita',
        component: () => import('../pages/AgendaCita.vue'),
        meta: { requiresAuth: true },
        // Redirige al home y abre el modal de reserva
        beforeEnter: (to, from, next) => {
            import('../store/bookingModal').then(({ openBooking }) => openBooking());
            next({ name: 'home' });
        }
    },
    {
        path: '/perfil',
        name: 'perfil',
        component: () => import('../pages/Perfil.vue'),
        meta: { requiresAuth: true }
    },
    {
        // Panel RGPD: acceso, portabilidad y olvido (Arts. 15/20/17)
        path: '/privacidad',
        name: 'privacidad',
        component: () => import('../pages/PrivacyDashboard.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/mi-salud/:categoria',
        name: 'mi-salud-detalle',
        component: () => import('../pages/MiSaludDetalle.vue'),
        meta: { requiresAuth: true }
    },
    {
        // Chat clínico: requiere sesión (V-F07 — antes era accesible sin login)
        path: '/comunicacion',
        name: 'comunicacion',
        component: () => import('../pages/Comunicacion.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        component: () => import('../pages/admin/AdminLayout.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' },
        children: [
            { path: '', name: 'admin-home', component: () => import('../pages/admin/AdminHome.vue') },
            { path: 'users', name: 'admin-users', component: () => import('../pages/admin/AdminUsuarios.vue') },
            { path: 'medicos', name: 'admin-medicos', component: () => import('../pages/admin/AdminMedicos.vue') },
            { path: 'especialidades', name: 'admin-especialidades', component: () => import('../pages/admin/AdminEspecialidades.vue') },
            { path: 'enfermedades', name: 'admin-enfermedades', component: () => import('../pages/admin/AdminEnfermedades.vue') }
        ]
    },
    {
        // Catch-all 404 (V-F09): antes una URL desconocida dejaba página en blanco
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../pages/NotFound.vue'),
        meta: { public: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

/**
 * Global guard. Waits for `initializeAuth()` so a page reload on a protected
 * route gives the silent refresh a chance to restore the session before any
 * redirect decision is made.
 */
router.beforeEach(async (to) => {
    await initializeAuth();

    const isPublic = to.matched.every(r => r.meta.public === true)
        || to.matched.some(r => r.meta.public === true);

    if (!isPublic && to.matched.some(r => r.meta.requiresAuth) && !isAuthenticated.value) {
        // Guardar destino para volver tras el login
        return { name: 'login', query: { redirect: to.fullPath } };
    }

    const requiredRole = to.matched.find(r => r.meta.role)?.meta.role;
    if (requiredRole && currentUser.value.role !== requiredRole) {
        return { name: 'home' };
    }

    // Usuario ya logueado entrando a login/register → al home
    if (isAuthenticated.value && (to.name === 'login' || to.name === 'register')) {
        return { name: 'home' };
    }

    return true;
});

export default router;
