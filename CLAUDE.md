# VITSYNC WebApp — CLAUDE.md

## ¿Qué es este proyecto?
Plataforma médica web donde pacientes gestionan citas, informes, chat con médicos y su perfil personal. Orientada a comunicación y orientación de salud.

- **URL Producción:** https://vitsync.es
- **URL Testing:** https://vitsync-web-app-testing.vercel.app
- **Deploy:** Vercel (auto-deploy desde rama `develop` → testing, `master` → prod)

---

## Stack técnico
- **Framework:** Vue 3 (Composition API + Options API mezclados — preferir Composition API en código nuevo)
- **Build:** Vite 7
- **Estilos:** Tailwind CSS 4
- **Router:** Vue Router 4
- **HTTP:** Axios con interceptores JWT en `src/services/api.js`
- **WebSocket:** STOMP + SockJS para chat en tiempo real
- **Chat externo:** TalkJS (`talkjs` package)
- **Estado:** stores reactivos propios en `src/store/` (sin Pinia)
- **Node requerido:** ^20.19.0 || >=22.12.0

---

## Estructura del proyecto
```
src/
├── pages/           → Vistas principales (Home, Login, Register, Perfil, Especialidades, VerifyAccount)
│   └── admin/       → Panel admin (AdminHome, AdminUsuarios, AdminMedicos, AdminEspecialidades)
├── components/
│   ├── profile/     → Componentes del perfil (secciones, cards, modales)
│   │   └── sections/→ GeneralSection, CitasSection, InformesSection, ConfiguracionSection
│   ├── chat/        → ChatButton, ChatWidget, ChatWindow, ContactList
│   └── icons/       → Iconos SVG como componentes Vue
├── services/
│   ├── api.js       → Instancia Axios base con interceptores JWT y 401 handler
│   ├── profileService.js → Servicios de perfil (MUCHOS SON MOCK — ver TODOs)
│   ├── relationships.js  → Relaciones paciente-médico
│   └── websocket.js      → Conexión WebSocket STOMP
├── store/
│   ├── auth.js      → Estado autenticación
│   ├── profile.js   → Estado perfil y secciones activas
│   ├── medicos.js   → Lista de médicos
│   ├── especialidades.js → Lista especialidades
│   └── usuarios.js  → Gestión usuarios (admin)
└── router/index.js  → Rutas con guards de autenticación
```

---

## Variables de entorno
```env
VITE_API_URL=http://localhost:8080          # local
VITE_API_URL=https://vitsync-api.onrender.com  # producción
VITE_TALKJS_APP_ID=tu_id_aqui
```

---

## API Backend
- **Base URL local:** `http://localhost:8080`
- **Base URL prod:** `https://vitsync-api.onrender.com`
- **Auth:** JWT en header `Authorization: Bearer <token>`
- **Token:** guardado en `localStorage.getItem('token')`
- **ID usuario:** `localStorage.getItem('id')`
- **Rol:** `localStorage.getItem('role')` → `PATIENT` | `MEDICO` | `ADMIN`

### Endpoints implementados en backend:
```
GET    /VitSync-app/{id}           → perfil usuario
PATCH  /VitSync-app/api/users/{id}/avatar → actualizar avatar URL
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/verify
GET    /api/citas                  → citas del usuario
PUT    /api/citas/{id}/cancel      → cancelar cita
GET    /api/informes               → informes del usuario
PUT    /api/informes/{id}/notes    → actualizar notas informe
POST   /api/upload/avatar          → subir imagen (multipart)
GET    /api/especialidades
GET    /api/medicos
```

---

## Estado actual — Lo que funciona y lo que NO

### ✅ Funciona
- Login / Register / Verificación de email
- Carga del perfil desde backend (`GET /VitSync-app/{id}`)
- Avatar: patch URL en backend (endpoint implementado)
- Panel admin (usuarios, médicos, especialidades)
- Listado de especialidades con imágenes
- Chat (TalkJS integrado)
- Dark mode toggle

### ⚠️ MOCKS pendientes de conectar al backend real (en `profileService.js`)
- `updateProfile()` → TODO: `PUT /api/user/profile` (backend tiene stub vacío)
- `uploadAvatar()` → TODO: `POST /api/upload/avatar` (descomentar código existente en el servicio)
- `getReports()` → TODO: `GET /api/informes` (endpoint existe en backend)
- `getAppointments()` → TODO: `GET /api/citas` (endpoint existe en backend)
- `cancelAppointment()` → TODO: `PUT /api/citas/{id}/cancel` (endpoint existe en backend)
- `changePassword()` → TODO: backend no implementado aún
- `getSessions()` → TODO: backend no implementado aún

---

## Sprint actual — Tareas a hacer

### 1. Conectar perfil al backend real (prioridad alta)
- Implementar `uploadAvatar()` real en `profileService.js` (el código está comentado, solo descomentar)
- Implementar `updateProfile()` real cuando backend exponga el endpoint PUT
- Conectar `getReports()` a `GET /api/informes`
- Conectar `getAppointments()` a `GET /api/citas`
- Conectar `cancelAppointment()` a `PUT /api/citas/{id}/cancel`

### 2. Descarga de PDF de informes
- En `InformesSection.vue`, implementar botón de descarga que genere/descargue el informe como PDF
- Usar la librería que más convenga (jsPDF o llamar al endpoint del backend si lo expone)

### 3. Sección "Mi Salud" — Dashboard de indicadores de salud (NUEVA FUNCIONALIDAD)
Inspirada en app de sanidad. Sistema de hexágonos con indicadores de salud del paciente:
- Vista principal: grid de hexágonos, cada uno representa una categoría (Cardio, Metabolismo, Actividad, Nutrición, Audición, Pulmones)
- Cada hexágono muestra: icono, nombre, porcentaje de salud con círculo de progreso, variación respecto al período anterior
- Al hacer clic en un hexágono → vista detalle de esa categoría con:
  - Gráfico de evolución temporal (línea)
  - Lista de indicadores específicos (ej. Cardio: Colesterol HDL, Diabetes, Tabaco) con valor y estado (verde/rojo)
  - Cada indicador es navegable a su propia sub-vista de detalle
- Los datos vienen de los informes del paciente (o se alimentan manualmente al principio)
- Nueva ruta: `/mi-salud` con subrutas `/mi-salud/:categoria`
- Añadir en navegación principal y en el perfil

### 4. Especialidades — Normalizar imágenes
- Todas las tarjetas de especialidades deben tener imágenes del mismo tamaño y formato
- Revisar `src/assets/images/specialties/` — hay imágenes duplicadas en `public/images/specialties/`
- Unificar en una sola carpeta y aplicar mismo aspect ratio (recomendado: 1:1 o 4:3)
- Aplicar `object-cover` y contenedor de tamaño fijo en todas las tarjetas

### 5. Mejoras de seguridad frontend
- Revisar que no haya tokens o API keys hardcodeadas en el código
- Verificar que rutas protegidas tengan guards correctos (algunos están comentados en router)
- Activar guards comentados en `/especialidades` si se decide protegerla
- Sanitizar inputs de usuario antes de enviarlos a la API
- Asegurarse de que errores del backend no expongan información sensible al usuario

---

## Convenciones de código
- Composition API con `<script setup>` para componentes nuevos
- Clases Tailwind directamente en template, sin CSS scoped salvo casos muy específicos
- Nombre de componentes en PascalCase
- Nombre de archivos de páginas en PascalCase
- Servicios en camelCase, funciones exportadas nombradas
- Commits en español descriptivos

## Comandos útiles
```bash
npm run dev      # desarrollo local (puerto 5173)
npm run build    # build producción
npm run preview  # preview del build
```

## Colores principales del diseño
- Principal: `teal-600` (#0d9488)
- Hover: `teal-700`
- Fondo claro: `gray-50`
- Fondo oscuro: `gray-900`
- Texto principal: `gray-800` / dark: `gray-100`
