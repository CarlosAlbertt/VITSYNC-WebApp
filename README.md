# 🌐 VITSYNC-WebApp — Frontend

> Aplicación web SPA (Single Page Application) del ecosistema VitSync, construida con Vue 3 + Vite + Tailwind CSS v4. Interfaz completa para pacientes, médicos y administradores.

---

## 📋 Índice

- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Arranque](#-instalación-y-arranque)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Páginas y Rutas](#-páginas-y-rutas)
- [Gestión de Estado (Stores)](#-gestión-de-estado-stores)
- [Comunicación con la API](#-comunicación-con-la-api)
- [Sistema de Diseño (CSS)](#-sistema-de-diseño-css)
- [Chat en Tiempo Real](#-chat-en-tiempo-real)
- [Despliegue](#-despliegue)

---

## 🔧 Requisitos Previos

| Herramienta | Versión mínima | Descripción |
|---|---|---|
| **Node.js** | 20+ | Entorno de ejecución JavaScript. [Descargar](https://nodejs.org/) |
| **npm** | 10+ | Gestor de paquetes (incluido con Node.js) |
| **IDE** | VS Code | Recomendado con extensiones Vue, Tailwind CSS IntelliSense |
| **Backend** | VITSYNC-API | Necesario para funcionalidades con datos reales |

---

## 🚀 Instalación y Arranque

### 1. Clonar el repositorio

```bash
git clone https://github.com/CarlosAlbertt/VITSYNC-WebApp.git
cd VITSYNC-WebApp
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copiar plantilla
cp .env.example .env

# Editar .env con tus valores
# VITE_API_URL=http://localhost:8080
```

### 4. Arrancar en modo desarrollo

```bash
npm run dev
# → Abre http://localhost:5173
```

### 5. Build de producción (opcional)

```bash
npm run build    # Genera la carpeta dist/
npm run preview  # Previsualiza el build
```

---

## 🛠 Stack Tecnológico

### ¿Qué es cada cosa?

| Tecnología | Versión | ¿Para qué sirve? |
|---|---|---|
| **Vue 3** | 3.5 | Framework JavaScript para construir interfaces de usuario. Usa el patrón de **componentes**: cada pieza de la UI es un archivo `.vue` con su HTML, CSS y JavaScript |
| **Vite** | 6.x | Herramienta de desarrollo. Arranca un servidor ultrarrápido con Hot Module Replacement (los cambios se ven al instante en el navegador sin recargar) |
| **Tailwind CSS** | 4.x | Framework de CSS utilitario. En vez de escribir CSS en archivos separados, usas clases directamente en el HTML: `class="text-white bg-teal-600 p-4"` |
| **Vue Router** | 4.x | Navegación entre páginas. Gestiona las URLs sin recargar la página completa (SPA) |
| **Axios** | 1.13 | Cliente HTTP para comunicarse con la API REST del backend |
| **SockJS + STOMP** | - | WebSocket para el chat en tiempo real |
| **TalkJS** | 0.44 | Widget de chat externo (complementario al WebSocket propio) |
| **VueDatePicker** | 12.x | Componente calendario para seleccionar fechas (usado en citas) |

### ¿Qué es una SPA?

**SPA = Single Page Application**. La app carga UNA vez y luego:
- Navegar entre "páginas" NO recarga el navegador
- Solo cambia el contenido interior (Vue Router se encarga)
- La experiencia es más rápida y fluida (como una app nativa)

```
Navegación clásica:               SPA (Vue Router):
  /home    → Recarga completa      /home    → Solo cambia el <RouterView>
  /login   → Recarga completa      /login   → Solo cambia el <RouterView>
  /perfil  → Recarga completa      /perfil  → Solo cambia el <RouterView>
```

---

## 🏗 Arquitectura del Proyecto

### Estructura de carpetas

```
src/
├── App.vue                          # Componente raíz (contiene <RouterView>)
├── main.js                          # Punto de entrada: crea la app Vue
├── router/
│   └── index.js                     # Definición de todas las rutas + guards
│
├── pages/                           # 📄 Páginas completas (una por ruta)
│   ├── Home.vue                     # Landing page pública
│   ├── Login.vue                    # Inicio de sesión
│   ├── Register.vue                 # Registro de usuario
│   ├── VerifyAccount.vue            # Verificación por código email
│   ├── Perfil.vue                   # Mi perfil (autenticado)
│   ├── Comunicacion.vue             # Chat en tiempo real
│   ├── CuadroMedico.vue             # Lista de médicos
│   ├── Especialidades.vue           # Lista de especialidades
│   ├── EspecialidadDetalle.vue       # Detalle de una especialidad
│   ├── EnfermedadesTratamientos.vue  # Enfermedades y tratamientos
│   ├── MiSaludDetalle.vue           # Dashboard de salud del paciente
│   ├── AgendaCita.vue               # Calendario de citas
│   └── admin/                       # 🔒 Panel de administración
│       ├── AdminHome.vue            # Dashboard admin
│       ├── AdminLayout.vue          # Layout compartido (sidebar + header)
│       ├── AdminUsuarios.vue        # CRUD de usuarios
│       ├── AdminMedicos.vue         # CRUD de médicos
│       ├── AdminEspecialidades.vue   # CRUD de especialidades
│       └── AdminEnfermedades.vue     # CRUD de enfermedades
│
├── components/                      # 🧩 Componentes reutilizables
│   ├── HeaderComponent.vue          # Navbar principal
│   ├── FooterComponent.vue          # Footer del sitio
│   ├── BackButton.vue               # Botón de volver
│   ├── LogoutModal.vue              # Modal de confirmación de logout
│   ├── booking/                     # Componentes del flujo de reserva de citas
│   ├── chat/                        # Componentes del chat
│   ├── profile/                     # Componentes del perfil
│   ├── admin/                       # Componentes del panel admin
│   └── icons/                       # Iconos SVG como componentes Vue
│
├── store/                           # 📦 Estado global de la aplicación
│   ├── auth.js                      # Autenticación (login, logout, token)
│   ├── profile.js                   # Datos del perfil del usuario
│   ├── citas.js                     # CRUD de citas médicas
│   ├── medicos.js                   # Lista de médicos
│   ├── especialidades.js            # Lista de especialidades
│   ├── enfermedades.js              # Enfermedades y tratamientos
│   ├── hospitales.js                # Centros médicos
│   ├── usuarios.js                  # Gestión de usuarios (admin)
│   ├── bookingModal.js              # Estado del modal de reserva
│   └── chat.js                      # Mensajes del chat
│
├── services/                        # 🔌 Comunicación con el exterior
│   ├── api.js                       # Instancia de Axios configurada
│   ├── websocket.js                 # Conexión WebSocket (STOMP + SockJS)
│   ├── profileService.js            # Lógica de negocio del perfil
│   └── relationships.js             # Relaciones paciente-médico
│
└── assets/                          # 🎨 Recursos estáticos
    ├── main.css                     # CSS global + tema de Tailwind
    └── ...
```

---

## 📄 Páginas y Rutas

### ¿Qué es el Router?

El archivo `router/index.js` define qué componente se muestra para cada URL:

```javascript
{
    path: '/login',           // URL en el navegador
    name: 'login',            // Nombre interno (para navegar con nombre)
    component: Login          // Componente Vue que se renderiza
}
```

### Mapa de rutas

| Ruta | Página | Acceso | Descripción |
|---|---|---|---|
| `/` | `Home.vue` | 🌍 Público | Landing page con hero, especialistas, valores |
| `/login` | `Login.vue` | 🌍 Público | Formulario de login con NIF + contraseña |
| `/register` | `Register.vue` | 🌍 Público | Formulario de registro multi-campo |
| `/verify-account` | `VerifyAccount.vue` | 🌍 Público | Código de verificación por email |
| `/perfil` | `Perfil.vue` | 🔐 Autenticado | Mi perfil: datos, avatar, historial |
| `/comunicacion` | `Comunicacion.vue` | 🔐 Autenticado | Chat en tiempo real con médicos |
| `/cuadro-medico` | `CuadroMedico.vue` | 🔐 Autenticado | Lista de médicos por especialidad |
| `/especialidades` | `Especialidades.vue` | 🔐 Autenticado | Catálogo de especialidades médicas |
| `/especialidad/:slug` | `EspecialidadDetalle.vue` | 🔐 Autenticado | Detalle de una especialidad |
| `/enfermedades` | `EnfermedadesTratamientos.vue` | 🔐 Autenticado | Buscador de enfermedades |
| `/mi-salud/:id` | `MiSaludDetalle.vue` | 🔐 Autenticado | Dashboard de salud personal |
| `/agenda-cita` | `AgendaCita.vue` | 🔐 Autenticado | Calendario de citas |
| `/admin` | `AdminHome.vue` | 🔒 ADMIN | Dashboard de administración |
| `/admin/usuarios` | `AdminUsuarios.vue` | 🔒 ADMIN | CRUD de usuarios |
| `/admin/medicos` | `AdminMedicos.vue` | 🔒 ADMIN | CRUD de médicos |
| `/admin/especialidades` | `AdminEspecialidades.vue` | 🔒 ADMIN | CRUD de especialidades |
| `/admin/enfermedades` | `AdminEnfermedades.vue` | 🔒 ADMIN | CRUD de enfermedades |

### Guards de navegación

Los **guards** protegen rutas que requieren autenticación o rol específico:

```javascript
// Guard para rutas autenticadas
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !localStorage.getItem('token')) {
        next('/login');  // No autenticado → redirige a login
    } else {
        next();          // Autenticado → permite acceso
    }
});

// Guard para rutas admin (valida JWT contra el servidor)
beforeEnter: async (to, from, next) => {
    const response = await api.get('/api/auth/validate');
    if (response.data.role !== 'ADMIN') {
        next('/');  // No es admin → redirige a home
    }
}
```

---

## 📦 Gestión de Estado (Stores)

### ¿Qué es un Store?

Un **store** es un archivo que contiene **estado compartido** entre múltiples componentes. Usamos el patrón **Composition API** de Vue 3 con `ref()` para crear variables reactivas.

```
                    ┌──────────────┐
                    │   Store      │
                    │  (auth.js)   │
                    │              │
                    │ isAuthed ────┼──→ HeaderComponent (muestra "Logout")
                    │ currentUser ─┼──→ Perfil (muestra datos del usuario)
                    │ login() ─────┼──→ Login.vue (llama al hacer submit)
                    │ logout() ────┼──→ LogoutModal (llama al confirmar)
                    └──────────────┘
```

### Stores disponibles

| Store | Qué gestiona | Funciones principales |
|---|---|---|
| `auth.js` | Sesión del usuario | `login()`, `register()`, `logout()`, `getAuthHeader()` |
| `profile.js` | Perfil del usuario actual | `loadProfile()`, `updateProfile()`, `uploadAvatar()` |
| `citas.js` | Citas médicas | `fetchCitas()`, `crearCita()`, `cancelarCita()` |
| `medicos.js` | Lista de médicos | `fetchMedicos()`, `fetchMedicoById()` |
| `especialidades.js` | Especialidades | `fetchEspecialidades()`, `fetchBySlug()` |
| `enfermedades.js` | Enfermedades | `fetchEnfermedades()`, `buscar()` |
| `hospitales.js` | Centros médicos | `fetchHospitales()` |
| `usuarios.js` | Usuarios (admin) | `fetchUsuarios()`, `updateUsuario()`, `deleteUsuario()` |
| `bookingModal.js` | Modal de reserva | `openBooking()`, `closeBooking()` |
| `chat.js` | Mensajes del chat | `addMessage()`, `messages` |

### ¿Cómo se usa un store?

```vue
<script setup>
import { login, isAuthenticated } from '../store/auth';

// isAuthenticated es reactivo — el template se actualiza automáticamente
</script>

<template>
  <div v-if="isAuthenticated">Bienvenido</div>
  <button v-else @click="login(nif, password)">Iniciar sesión</button>
</template>
```

---

## 🔌 Comunicación con la API

### Axios — Cliente HTTP

El archivo `services/api.js` configura una instancia de Axios centralizada:

```
┌─────────────────────────────────────────────────────────┐
│  api.js (Axios)                                         │
│                                                         │
│  baseURL: VITE_API_URL  ←  Variables de entorno (.env)  │
│                                                         │
│  Interceptor de REQUEST:                                │
│  ├── Lee token de localStorage                          │
│  └── Añade header: Authorization: Bearer <token>        │
│                                                         │
│  Interceptor de RESPONSE:                               │
│  ├── Si 401 → limpia sesión → redirige a /login         │
│  └── Cualquier otro error → lo propaga al componente    │
└─────────────────────────────────────────────────────────┘
```

### Flujo de una petición

```
1. Componente llama: await api.get('/api/citas')
2. Interceptor REQUEST añade: { Authorization: "Bearer eyJ..." }
3. Axios envía GET a VITE_API_URL + /api/citas
4. Backend responde con JSON
5. Interceptor RESPONSE:
   - Si 200: devuelve los datos al componente
   - Si 401: limpia sesión + redirige a login
   - Si error: el componente lo captura con try/catch
```

### Ejemplo en un store

```javascript
// store/citas.js
import api from '../services/api';

export const fetchCitas = async () => {
    try {
        const response = await api.get('/api/citas');
        citas.value = response.data;
    } catch (error) {
        console.error('Error cargando citas:', error);
    }
};
```

---

## 🎨 Sistema de Diseño (CSS)

### Tailwind CSS v4

Este proyecto usa **Tailwind CSS v4**, que funciona de forma diferente a v3:

| Característica | Tailwind v3 | Tailwind v4 |
|---|---|---|
| Configuración | `tailwind.config.js` | `@theme` en CSS |
| Plugin | PostCSS | Plugin de Vite (`@tailwindcss/vite`) |
| Temas | JavaScript | CSS nativo |

### Cómo se definen los colores del tema

```css
/* assets/main.css */
@import "tailwindcss";

@theme {
    --color-accent: #0d9488;      /* Verde principal de VitSync */
    --color-surface: #ffffff;
    --color-surface-dark: #1e293b;
}
```

### Variables CSS para Dark Mode

El proyecto usa **variables CSS semánticas** para soportar modo oscuro:

```css
:root {
    --bg-base: #f8fafc;           /* Fondo claro */
    --bg-surface: #ffffff;        /* Superficie */
    --text-primary: #0f172a;      /* Texto principal */
    --border: #e2e8f0;            /* Bordes */
}

[data-theme="dark"] {
    --bg-base: #0B1120;           /* Fondo oscuro */
    --bg-surface: #1E293B;        /* Superficie oscura */
    --text-primary: #F1F5F9;
    --border: #334155;
}
```

### Usar clases de Tailwind

```html
<!-- Ejemplo: botón primario -->
<button class="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300">
    Agendar Cita
</button>
```

---

## 💬 Chat en Tiempo Real

### Tecnologías usadas

| Componente | Tecnología | Función |
|---|---|---|
| Transporte | SockJS (fallback WebSocket) | Conexión bidireccional con el servidor |
| Protocolo | STOMP | Organiza mensajes en canales/destinos |
| Widget externo | TalkJS | Chat integrado para comunicación paciente-médico |

### WebSocket — Cómo funciona

```
1. Usuario abre la app → connectWebSocket() se ejecuta
2. Se conecta a: VITE_API_URL + "/ws" (detecta automáticamente el entorno)
3. Se suscribe a: /user/queue/messages (buzón personal)
4. Cuando llega un mensaje:
   ├── Se parsea el JSON
   ├── Se añade al store (chat.js → addMessage())
   └── El componente se re-renderiza automáticamente
5. Al hacer logout → disconnectWebSocket() cierra la conexión
```

### URL dinámica del WebSocket

```javascript
// websocket.js detecta el entorno automáticamente:
const getSocketUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;  // Variable de entorno
    if (apiUrl) return `${apiUrl}/ws`;              // Usa el entorno configurado
    if (hostname === 'localhost') return 'http://localhost:8080/ws';
    return 'https://vitsync-api.onrender.com/ws';   // Producción
};
```

---

## 📂 Archivos de Componente Vue

### ¿Cómo es un archivo `.vue`?

Cada componente Vue es un archivo con 3 secciones:

```vue
<template>
  <!-- HTML del componente -->
  <div class="p-4">
    <h1>{{ titulo }}</h1>
    <button @click="saludar">Hola</button>
  </div>
</template>

<script>
// Lógica JavaScript del componente
export default {
  data() {
    return {
      titulo: 'Mi Componente'
    }
  },
  methods: {
    saludar() {
      alert('¡Hola!')
    }
  }
}
</script>

<style scoped>
/* CSS específico de este componente (no afecta a otros) */
h1 { color: var(--accent); }
</style>
```

### Conceptos clave de Vue

| Concepto | Sintaxis | Qué hace |
|---|---|---|
| Interpolación | `{{ variable }}` | Muestra el valor de una variable |
| Binding | `:src="imagen"` | Vincula un atributo HTML a una variable |
| Evento | `@click="metodo"` | Ejecuta un método al hacer clic |
| Condicional | `v-if="condicion"` | Muestra/oculta un elemento |
| Bucle | `v-for="item in lista"` | Repite un elemento por cada item |
| Modelo | `v-model="campo"` | Sincroniza un input con una variable (bidireccional) |

---

## 🚀 Despliegue

| Entorno | Plataforma | Comando | Trigger |
|---|---|---|---|
| Local | `localhost:5173` | `npm run dev` | Manual |
| Testing | Vercel | Auto | Push a `develop` |
| Producción | Vercel | Auto | Push a `master` |

### Variables de entorno por entorno

| Variable | Local | Testing | Producción |
|---|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | `https://vitsync-api-testing.onrender.com` | `https://vitsync-api.onrender.com` |
