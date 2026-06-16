# ARQUITECTURA — VITSYNC-WebApp

SPA Vue 3 (Composition API) + Vite + Tailwind CSS 4. Consume VITSYNC-API
(Spring Boot, REST + STOMP). Deploy: Vercel (develop→testing, main→prod)
y Docker/nginx.

## Estructura de carpetas

```
src/
├── assets/            Estilos globales e imágenes de especialidades
├── components/        Componentes reutilizables
│   ├── admin/         Cabecera del panel admin
│   ├── booking/       Wizard de reserva de citas (steps)
│   ├── chat/          ChatWidget/ChatWindow (TalkJS), ContactList
│   ├── icons/         Iconos SVG como componentes
│   ├── profile/       Secciones del perfil (informes, citas, salud, config)
│   ├── CookieConsent.vue   Aviso RGPD de almacenamiento
│   └── Header/Footer/LogoutModal/BackButton
├── pages/             Vistas enrutadas (una por ruta) + admin/
├── router/index.js    Tabla de rutas + guard global (meta.public/requiresAuth/role)
├── services/          Capa de acceso a API
│   ├── api.js         Axios central: token en memoria, withCredentials,
│   │                  interceptor 401→refresh→retry. ÚNICA puerta a la API
│   ├── gdprService.js Derechos RGPD (my-data, export, gdpr-delete)
│   ├── profileService.js  Perfil, informes, citas, salud, configuración
│   ├── relationships.js   Relaciones paciente-médico
│   └── websocket.js   Cliente STOMP autenticado (chat propio)
├── store/             Estado global (módulos reactivos planos, sin Pinia)
│   ├── auth.js        Sesión: identidad en memoria, initializeAuth/login/logout
│   ├── profile.js     Perfil cargado + toasts
│   └── …              catálogos (especialidades, medicos, hospitales…) y UI
├── tests/             Vitest (setup.js + unit/)
└── utils/             logger, sanitize (DOMPurify), validators (espejo backend)
```

## Patrones

- **Stores = módulos reactivos planos** (refs exportados), no Pinia.
  Convención: estado arriba, acciones abajo, nada persistido salvo
  preferencias de UI no sensibles.
- **Toda llamada HTTP pasa por `services/api.js`** (interceptores de auth).
  Los componentes no importan axios directamente.
- Rutas lazy (`() => import(...)`) salvo Home/Login/Especialidades.
- Acceso declarativo por `meta` en el router; el guard global es el único
  punto de decisión.
- Validación de formularios con `utils/validators.js` (espejo de las reglas
  del backend, incluida la letra de control del NIF).

## Flujo de sesión

```
Arranque SPA ──▶ router.beforeEach ──▶ initializeAuth()
                                          │ POST /api/auth/refresh (cookie httpOnly)
                              ┌───────────┴───────────┐
                          200: token+identidad     4xx: sin sesión
                          en memoria                  │
                              │                       ▼
                          ruta solicitada      /login (si la ruta lo exige)

Llamada API ──▶ 401 ──▶ interceptor: POST /refresh (single-flight) ──▶ retry
                                  └─ falla ──▶ logout + /login
```

## Chat

Dos sistemas conviven:
- **TalkJS** (activo): widget iframe, `ChatWindow.vue`. Pendiente Identity
  Verification (V-F14).
- **STOMP propio** (`services/websocket.js`): operativo y autenticado,
  apunta al `/ws` del backend; sin UI conectada actualmente.

## Build

- `npm run build` → Vite: console/debugger eliminados, chunks
  vendor/utils separados, devtools fuera de producción.
- CSP exige scripts externos: el bootstrap pre-Vue está en `public/boot.js`.
