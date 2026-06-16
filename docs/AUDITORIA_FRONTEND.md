# AUDITORÍA INICIAL DE SEGURIDAD — VITSYNC-WebApp

> **Fecha:** 2026-06-11
> **Alcance:** rama `develop` (post-purga de historial), código fuente completo,
> configuración de build/deploy, dependencias npm.
> **Contexto:** SPA Vue 3 que consume VITSYNC-API (datos de salud, categoría
> especial Art. 9 RGPD).

---

## 0. INCIDENTE PREVIO — `.env` comiteado (RESUELTO 2026-06-11)

- `.env` estuvo trackeado durante todo el historial del repo público.
- **Purgado** de las 20 ramas con `git-filter-repo` (`.env`, `.env.local`,
  `.env.production`, `.env.development`); 14 ramas reescritas y forzadas,
  6 ramas obsoletas eliminadas (contenido íntegramente mergeado en
  `develop`/`master`). Backup espejo pre-purga conservado en local.
- **Evaluación de lo expuesto:**

| Valor expuesto | Riesgo real | Acción |
|---|---|---|
| `VITE_API_KEY=vitsync-dev-api-key-2026-s3cur3` | **Nulo**: el backend no valida ninguna `X-API-Key` (verificado en VITSYNC-API). Peso muerto. | Eliminar header del código (Fase 3) |
| `VITE_TALKJS_APP_ID=tcyeReLZ` | Bajo: App ID de TalkJS es identificador público de cliente; el secreto (Secret Key) no está en el repo | Ninguna |
| URLs Render (testing/prod) | Bajo: visibles en el bundle público de todos modos | Ninguna |

- **Nota estructural:** toda variable `VITE_*` se incrusta en el bundle JS
  público en build. El `.env` de un frontend Vite **nunca puede contener
  secretos**, esté o no en git.
- **Caveat GitHub:** los commits antiguos pueden seguir accesibles por SHA
  directo vía refs de PRs y cachés de GitHub hasta su GC. Garantía total =
  solicitar purga a GitHub Support (innecesario aquí: no hay secretos reales).

---

## 1.1 INVENTARIO DE SEGURIDAD

### ¿Dónde se almacena el JWT?
**`localStorage`** (`token`, más `nif`, `email`, `role`, `id`) — `src/store/auth.js:21-25`.
- Vulnerable a exfiltración por XSS. Para datos sanitarios: **inaceptable** (V-F01).
- El **NIF completo** (dato identificativo) persiste en localStorage (V-F02).
- El backend ya soporta refresh token opaco + rotación (`/api/auth/refresh`),
  pero **el frontend no lo usa en absoluto**: en 401 borra todo y redirige (V-F03).

### Tokens / URLs hardcodeadas
- `src/services/api.js:4` — fallback hardcodeado `https://vitsync-api-testing.onrender.com` (V-F04).
- `src/services/websocket.js:9-17` — URLs localhost/Render hardcodeadas, ignora `VITE_API_URL` (V-F05).
- `src/services/api.js:7` — header `X-API-Key` con `VITE_API_KEY`: el backend no lo valida; peso muerto que aparenta seguridad (V-F06).

### Gestión del estado de autenticación
- **Sin Pinia.** Stores = módulos planos con `ref()` exportados (`src/store/*.js`).
- `isAuthenticated` se deriva de `localStorage.getItem('token') !== null` — no
  valida expiración: token caducado = "autenticado" hasta el primer 401.

### Guards de navegación (`src/router/index.js`)
| Ruta | Guard | Problema |
|---|---|---|
| `/`, `/especialidades`, `/perfil`, `/mi-salud/:categoria`, `/agendar-cita` | auth | OK (duplicación de código) |
| `/cuadro-medico`, `/enfermedades-tratamientos`, `/especialidad/:id` | **ninguno** | Catálogo, aceptable pero inconsistente |
| **`/comunicacion` (chat médico)** | **ninguno** | **V-F07: chat clínico accesible sin login** (la API rechazará las llamadas, pero la vista monta y conecta WS) |
| `/admin/**` | token + `role==='ADMIN'` de localStorage | Solo UX: cualquiera puede escribir `localStorage.role='ADMIN'` y ver la SHELL admin (los datos los protege el backend). Sin patrón `meta.role` (V-F08) |
| Catch-all 404 | **no existe** | Ruta desconocida → página en blanco (V-F09) |

- No hay guard global `router.beforeEach`: cada ruta repite su `beforeEnter` a mano.

### Datos visibles en DevTools / store
- `profileData` (store `profile.js`): perfil completo del backend en memoria — aceptable (memoria, no persistido).
- localStorage persiste NIF/email/role/id — visible para cualquier script y entre sesiones (V-F02).

### Sanitización de inputs
- No hay librería de validación; validaciones ad-hoc por componente (Register valida algo, resto inconsistente).
- No hay sanitización antes de enviar (el backend sí sanitiza con HtmlSanitizer — la defensa real existe server-side).

### Usos de `v-html` (4)
- `src/pages/Home.vue:108`, `src/components/profile/sections/MiSaludSection.vue:68,96,140`.
- Contenido: **constantes SVG locales** (iconos hardcodeados en el propio componente), no input de usuario ni de API → riesgo actual **bajo**, pero patrón peligroso sin DOMPurify si alguien lo reutiliza con datos remotos (V-F10).

### Errores de API mostrados raw
- `auth.js:38,48` — `error.response?.data?.message` se muestra tal cual al usuario. El backend ya emite mensajes limpios (GlobalExceptionHandler), riesgo bajo, pero sin fallback robusto si cambia el backend (V-F11).

### WebSocket (`src/services/websocket.js`)
- **Sin autenticación**: no envía `Authorization` en el handshake STOMP (V-F12).
  El backend (WebSocketAuthInterceptor) exige JWT → el chat STOMP propio está
  roto o conecta anónimo según configuración.
- `console.log` del contenido de cada mensaje clínico recibido (V-F13).
- Sin manejo de token expirado, sin heartbeats configurados.
- Conviven DOS sistemas de chat: STOMP propio + TalkJS (`ChatWindow.vue`) — duplicidad a resolver.

---

## 1.2 INVENTARIO DE ESTRUCTURA

### Vistas (`src/pages/`)
| Vista | Ruta | Rol requerido (actual) |
|---|---|---|
| Home.vue | `/` | autenticado |
| Login.vue / Register.vue / VerifyAccount.vue | `/login` `/register` `/verify` | público |
| Especialidades.vue | `/especialidades` | autenticado |
| EspecialidadDetalle.vue | `/especialidad/:id` | público (inconsistente) |
| CuadroMedico.vue | `/cuadro-medico` | público |
| EnfermedadesTratamientos.vue | `/enfermedades-tratamientos` | público |
| AgendaCita.vue | `/agendar-cita` | autenticado (redirige a modal) |
| Perfil.vue | `/perfil` | autenticado |
| MiSaludDetalle.vue | `/mi-salud/:categoria` | autenticado |
| Comunicacion.vue | `/comunicacion` | **ninguno (V-F07)** |
| admin/* (6 vistas) | `/admin/**` | ADMIN (localStorage) |
| HomeView.vue, HelloWorld.vue, TheWelcome.vue, WelcomeItem.vue | — | **muertas** (scaffolding Vite sin ruta) |

### Stores (`src/store/`, módulos planos, sin Pinia)
auth (token+identidad), profile (perfil+toast), chat (mensajes), citas,
especialidades, medicos, hospitales, enfermedades, usuarios (admin),
bookingModal (UI). Varios con `console.log` de datos.

### Composables
**No existen** (`src/composables/` no existe). Lógica reutilizable mezclada en stores/componentes.

### Llamadas API
- Instancia central `src/services/api.js` (axios + interceptors) — **bien**.
- `profileService.js`, `relationships.js` la usan. Algunos componentes llaman a `api` directo. Sin capa de servicios completa pero no hay fetch dispersos con URLs propias (salvo websocket.js).

### WebSocket
`@stomp/stompjs` + `sockjs-client`, singleton módulo, reconexión 5s, sin auth, sin heartbeat. TalkJS en paralelo para chat médico-paciente.

---

## 1.3 INVENTARIO DE DEPENDENCIAS

### `npm audit`: **68 vulnerabilidades** (10 critical, 37 high, 20 moderate, 1 low)
Causa raíz: dependencias **basura** en `dependencies` que arrastran árboles
antiguos (hoek/hawk/request-era):

| Paquete | Problema |
|---|---|
| `@anthropic-ai/claude-code` | CLI de IA comiteada como dependencia de la app (instalación accidental) |
| `npx` | Paquete npx ancestral (2017), arrastra ~50 vulns transitivas |
| `yarn` | Gestor de paquetes como dependencia de runtime |
| `node.url` | Paquete dudoso/typosquat de `url` |

**Eliminar estas 4 resuelve la inmensa mayoría de las 68 vulns.**
`axios` 1.13.2 tiene aviso high propio → subir a 1.17.x.

### Desactualizadas relevantes
axios 1.13→1.17, @stomp/stompjs 7.2→7.3, tailwind 4.1→4.3, vite 7.3 (8.x major, no urgente), talkjs 0.44→0.46, @vuepic/vue-datepicker 12→14 (major).

### Sin usar (verificar antes de borrar)
`node.url`, `npx`, `yarn`, `@anthropic-ai/claude-code` (ningún import en `src/`).
Componentes muertos: HelloWorld, TheWelcome, WelcomeItem, HomeView.

---

## 1.4 ANÁLISIS OWASP TOP 10 (frontend)

| Ítem | Estado | Detalle |
|---|---|---|
| **A01 Broken Access Control** | ⚠️ Parcial | Guards inconsistentes; `/comunicacion` sin guard (V-F07); rol en localStorage manipulable (UX, el backend protege los datos). Sin `meta.role` declarativo |
| **A02 Cryptographic Failures** | ❌ Presente | JWT + NIF + identidad en localStorage (V-F01/02); sin uso del refresh httpOnly que el backend ya ofrece (V-F03) |
| **A03 Injection (XSS)** | ⚠️ Mitigado parcial | 4 `v-html` solo con SVG locales (bajo); sin DOMPurify; mensajes de chat renderizados — verificar interpolación (Vue escapa por defecto en `{{ }}`) |
| **A05 Security Misconfiguration** | ❌ Presente | Sin CSP; `vercel.json` sin headers de seguridad (solo rewrite SPA); sin X-Frame-Options/HSTS/nosniff; `vite-plugin-vue-devtools` activo; sin drop de console en build |
| **A06 Vulnerable Components** | ❌ Presente | 68 vulns npm por deps basura (ver 1.3) |
| **A09 Security Logging Failures** | ❌ Presente | 59 `console.log/error` en 22 archivos; incluyen mensajes clínicos del chat (V-F13) y objetos de perfil; nada se elimina en build de producción |

---

## INVENTARIO DE VULNERABILIDADES (resumen priorizado)

| ID | Vulnerabilidad | Severidad | Archivo | Solución |
|---|---|---|---|---|
| V-F01 | JWT en localStorage | **Alta** | `store/auth.js` | Access token solo en memoria + refresh httpOnly (Fase 2) |
| V-F02 | NIF/identidad persistidos en localStorage | Alta | `store/auth.js`, `profileService.js` | Solo en memoria; derivar de /validate o del perfil |
| V-F03 | Refresh token sin usar (logout forzado cada 15 min) | Alta | `services/api.js` | Interceptor 401 → refresh → retry (Fase 2) |
| V-F06 | Header X-API-Key inútil | Media | `services/api.js` | Eliminar |
| V-F07 | `/comunicacion` sin guard | Media | `router/index.js` | Guard global + meta |
| V-F12 | WebSocket sin JWT en handshake | Media | `services/websocket.js` | connectHeaders con Bearer (Fase 5) |
| V-F13 | console.log de mensajes clínicos | Media | `services/websocket.js` + 21 archivos | Logger condicional + drop en build (Fase 3) |
| A06 | 68 vulns npm | Media | `package.json` | Quitar deps basura, subir axios |
| A05 | Sin CSP ni security headers | Media | `vercel.json`, `index.html` | Fase 4 |
| V-F04/05 | URLs hardcodeadas | Baja | `api.js`, `websocket.js` | `import.meta.env` siempre |
| V-F08 | Guards duplicados sin meta.role | Baja | `router/index.js` | beforeEach global declarativo |
| V-F09 | Sin ruta 404 | Baja | `router/index.js` | Catch-all |
| V-F10 | v-html sin DOMPurify (SVG locales) | Baja | Home, MiSaludSection | Componente de icono o DOMPurify |
| V-F11 | Mensajes de error del servidor raw | Baja | `store/auth.js` | Mapa de mensajes + fallback |
