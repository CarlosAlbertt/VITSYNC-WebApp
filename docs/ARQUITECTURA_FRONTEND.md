# 🏗 Arquitectura Frontend — VITSYNC-WebApp

> Documentación técnica profunda de la arquitectura del frontend: patrones de diseño, flujos de datos, estructura de componentes y decisiones técnicas.

---

## 📋 Índice

- [Diagrama de Arquitectura General](#-diagrama-de-arquitectura-general)
- [Flujo de Datos](#-flujo-de-datos)
- [Patrón de Estado (Stores)](#-patrón-de-estado-stores)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Capa de Servicios](#-capa-de-servicios)
- [Routing y Navigation Guards](#-routing-y-navigation-guards)
- [Sistema de Componentes](#-sistema-de-componentes)
- [Convenciones y Reglas](#-convenciones-y-reglas)

---

## 🔄 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER                                                        │
│                                                                 │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌───────────┐  │
│  │  Pages   │───▶│  Stores  │───▶│ Services │───▶│  Backend  │  │
│  │ (.vue)   │◀───│  (ref)   │◀───│ (axios)  │◀───│  (API)    │  │
│  └────┬─────┘    └──────────┘    └──────────┘    └───────────┘  │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────┐    ┌──────────────┐                               │
│  │Components│    │  Vue Router   │                               │
│  │(reusable)│    │  (SPA nav)    │                               │
│  └──────────┘    └──────────────┘                               │
│                                                                 │
│  ┌──────────────────────────────────────────┐                   │
│  │           Tailwind CSS v4 + CSS Vars      │                   │
│  │           (Design System / Dark Mode)     │                   │
│  └──────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo general

```
Usuario interactúa con una Page
    → Page llama a una función del Store
        → Store llama a un Service (API)
            → Service usa Axios para hacer HTTP request
                → Backend responde con JSON
            → Service devuelve los datos
        → Store actualiza su estado reactivo (ref)
    → Vue detecta el cambio y re-renderiza el componente
```

---

## 📡 Flujo de Datos

### Patrón unidireccional

```
┌─────────┐  import  ┌─────────┐  import  ┌───────────┐
│  Page   │─────────▶│  Store  │─────────▶│  Service  │
│         │          │         │          │  (api.js) │
│ .vue    │◀─────────│ .js     │◀─────────│           │
└─────────┘  reactivo└─────────┘ async    └───────────┘
                 │                              │
                 │ ref() + computed()            │ axios
                 ▼                              ▼
          Template se                    Backend REST
          actualiza solo                 (VITSYNC-API)
```

### Ejemplo concreto: Cargar lista de médicos

```
1. CuadroMedico.vue    →  import { fetchMedicos, medicos } from '../store/medicos'
2. onMounted()         →  fetchMedicos()
3. store/medicos.js    →  const res = await api.get('/api/medicos')
4. services/api.js     →  GET http://localhost:8080/api/medicos + Bearer token
5. Backend responde    →  [{ id: 1, name: "Pablo", ... }, ...]
6. store/medicos.js    →  medicos.value = res.data
7. Vue detecta cambio  →  CuadroMedico.vue se re-renderiza con los nuevos datos
```

---

## 📦 Patrón de Estado (Stores)

### ¿Por qué no Pinia?

Este proyecto usa **stores manuales** con la Composition API de Vue 3 (`ref`, `reactive`, `computed`) en lugar de Pinia. Las razones:

1. **Simplicidad**: Cada store es un archivo JS puro con `ref()` — no necesitas aprender una librería adicional
2. **Rendimiento**: Sin overhead de un framework de estado
3. **Escalabilidad**: Los stores se pueden migrar a Pinia si el proyecto crece

### Anatomía de un store

```javascript
// store/medicos.js
import { ref } from 'vue';         // Reactividad de Vue
import api from '../services/api'; // Cliente HTTP

// ─── Estado reactivo ──────────────────────
export const medicos = ref([]);       // Lista de médicos
export const loading = ref(false);    // Indicador de carga
export const error = ref(null);       // Mensaje de error

// ─── Acciones (modifican el estado) ──────
export const fetchMedicos = async () => {
    loading.value = true;
    error.value = null;
    try {
        const res = await api.get('/api/medicos');
        medicos.value = res.data;
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};
```

### Principios del store

1. **El estado es readonly fuera del store**: Solo las funciones del store modifican el estado
2. **Las acciones son async**: Toda comunicación con la API es asíncrona
3. **Loading + Error**: Cada store gestiona su propio estado de carga y error

---

## 🔐 Sistema de Autenticación

### Flujo completo

```
┌──────────┐    POST /api/auth/login     ┌──────────┐
│  Login   │  ──────────────────────────▶│ Backend  │
│  .vue    │                             │          │
│          │  ◀──────────────────────────│  AuthCtrl│
│          │    { token, nif, role, id }  │          │
└─────┬────┘                             └──────────┘
      │
      ▼
┌──────────────────┐
│  store/auth.js   │
│                  │
│  1. localStorage │ ← Persiste token, nif, role, id
│  2. ref()        │ ← Actualiza isAuthenticated, currentUser
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  api.js          │
│  interceptor     │ ← Cada petición incluye: Authorization: Bearer <token>
└──────────────────┘
```

### Persistencia con localStorage

```
localStorage:
├── token:  "eyJhbGciOiJIUzI1NiJ9..."   ← JWT firmado
├── nif:    "12345678A"                   ← Identificador del usuario
├── email:  "user@vitsync.es"             ← Email
├── role:   "PACIENTE"                    ← Rol (PACIENTE/MEDICO/ADMIN)
└── id:     "42"                          ← ID numérico en la BD
```

### Doble guard para rutas admin

```
                    ┌──────────────────┐
                    │   1ª Barrera     │
                    │   (Cliente)      │
                    │   localStorage   │
                    │   role === ADMIN │
                    └───────┬──────────┘
                            │ ✅
                            ▼
                    ┌──────────────────┐
                    │   2ª Barrera     │
                    │   (Servidor)     │
                    │   GET /validate  │
                    │   JWT real check │
                    └───────┬──────────┘
                            │ ✅
                            ▼
                    ┌──────────────────┐
                    │   Admin Panel    │
                    │   Acceso OK      │
                    └──────────────────┘
```

> **¿Por qué doble guard?** Un usuario podría manipular `localStorage.setItem('role', 'ADMIN')` desde la consola del navegador. La segunda barrera valida el JWT contra el servidor, que es infalsificable.

---

## 🔌 Capa de Servicios

### api.js — Centro neurálgico

```
Toda petición HTTP pasa por api.js:

                          api.js
┌─────────────────────────────────────────────────────┐
│                                                     │
│  baseURL ← import.meta.env.VITE_API_URL             │
│            (o fallback a testing Render)             │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  REQUEST Interceptor                          │  │
│  │  ──────────────────                           │  │
│  │  1. Lee token de localStorage                 │  │
│  │  2. Añade header: Authorization: Bearer xxx   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  RESPONSE Interceptor                         │  │
│  │  ───────────────────                          │  │
│  │  Si status 401:                               │  │
│  │    1. Limpia localStorage (5 keys)            │  │
│  │    2. Redirige a /login                       │  │
│  │  Otros errores: los propaga al caller         │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### websocket.js — Chat en tiempo real

Gestiona la conexión WebSocket de forma independiente a Axios:

| Función | Qué hace |
|---|---|
| `getSocketUrl()` | Detecta el entorno y construye la URL del WebSocket |
| `connectWebSocket()` | Abre la conexión + suscripción al buzón personal |
| `disconnectWebSocket()` | Cierra la conexión limpiamente |

---

## 🛡 Routing y Navigation Guards

### Tipos de rutas

```javascript
// 1. Pública (cualquiera puede acceder)
{ path: '/login', component: Login }

// 2. Autenticada (necesita token)
{ path: '/perfil', component: Perfil, meta: { requiresAuth: true } }

// 3. Admin (necesita token + rol ADMIN + validación servidor)
{ path: '/admin', component: Admin, beforeEnter: adminGuard }
```

### Guard global (beforeEach)

Se ejecuta en **cada** navegación de la app:

```javascript
router.beforeEach((to, from, next) => {
    // Si la ruta requiere auth Y no hay token → login
    if (to.meta.requiresAuth && !localStorage.getItem('token')) {
        next({ name: 'login' });
    } else {
        next();
    }
});
```

---

## 🧩 Sistema de Componentes

### Jerarquía de componentes

```
App.vue
├── <RouterView />                    ← Renderiza la página actual
│   ├── Home.vue                      ← Página completa
│   │   ├── HeaderComponent.vue       ← Navbar reutilizable
│   │   ├── [Secciones de la home]    ← Hero, stats, médicos, valores
│   │   └── FooterComponent.vue       ← Footer reutilizable
│   │
│   ├── Login.vue                     ← Página de login
│   │   └── BackButton.vue            ← Botón "Volver"
│   │
│   ├── Perfil.vue                    ← Página de perfil
│   │   └── profile/                  ← Sub-componentes del perfil
│   │       ├── ProfileHeader.vue
│   │       ├── ProfileTabs.vue
│   │       └── ...
│   │
│   └── Admin (Layout)                ← Layout admin con sidebar
│       ├── AdminLayout.vue           ← Sidebar + header + <RouterView>
│       └── AdminUsuarios.vue         ← Contenido de la pestaña
│
└── booking/                          ← Modal de reserva de citas
    └── BookingModal.vue              ← Overlay global
```

### Reglas de componentes

| Regla | Ejemplo |
|---|---|
| Un componente = una responsabilidad | `HeaderComponent.vue` solo maneja la navegación |
| Props para datos de entrada | `<MedicoCard :medico="medico" />` |
| Eventos para datos de salida | `@click="$emit('seleccionar', medico)"` |
| `scoped` en CSS | `<style scoped>` para evitar conflictos CSS |
| Nombres PascalCase | `HeaderComponent.vue`, `BackButton.vue` |

---

## 📏 Convenciones y Reglas

### Nomenclatura de archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
| Páginas | PascalCase | `CuadroMedico.vue`, `MiSaludDetalle.vue` |
| Componentes | PascalCase + sufijo descriptivo | `HeaderComponent.vue`, `LogoutModal.vue` |
| Stores | camelCase | `medicos.js`, `bookingModal.js` |
| Services | camelCase | `api.js`, `websocket.js` |

### Uso de `import.meta.env`

Vite usa `import.meta.env` para variables de entorno:

```javascript
// ✅ Correcto — Vite las reemplaza en build time
const apiUrl = import.meta.env.VITE_API_URL;

// ❌ Incorrecto — process.env no existe en Vite
const apiUrl = process.env.VUE_APP_API_URL;
```

> **Prefijo obligatorio**: Solo las variables que empiezan con `VITE_` son accesibles desde el código del navegador.

### Cómo añadir una nueva página

1. **Crear el archivo** en `src/pages/MiNuevaPagina.vue`
2. **Crear el store** (si necesita datos) en `src/store/miDatos.js`
3. **Añadir la ruta** en `src/router/index.js`:
   ```javascript
   {
       path: '/mi-pagina',
       name: 'mi-pagina',
       component: () => import('../pages/MiNuevaPagina.vue'),
       meta: { requiresAuth: true }
   }
   ```
4. **Añadir al menú** en `HeaderComponent.vue` (si es pública)
