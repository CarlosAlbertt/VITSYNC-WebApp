# VitSync WebApp

Frontend de **VitSync** — plataforma SaaS de gestión sanitaria
(paciente ↔ médico): citas, informes clínicos, indicadores de salud, chat
y panel de administración. Maneja datos de salud (categoría especial,
Art. 9 RGPD): la seguridad es requisito de primera clase también en el
cliente — ver [`docs/SECURITY.md`](docs/SECURITY.md).

Backend: [VITSYNC-API](https://github.com/CarlosAlbertt/VITSYNC-API)
(Spring Boot 3 + PostgreSQL).

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Build | Vite 7 |
| Estilos | Tailwind CSS 4 |
| Routing | Vue Router 4 (guard global declarativo por `meta`) |
| HTTP | Axios (instancia central con auth en memoria + refresh httpOnly) |
| Chat | TalkJS · cliente STOMP/SockJS propio |
| Tests | Vitest + jsdom + @vue/test-utils (cobertura v8) |
| Deploy | Vercel (develop → testing, main → prod) · Docker + nginx |

## Setup de desarrollo

Requisitos: Node `^20.19.0 || >=22.12.0`, backend VITSYNC-API corriendo
(por defecto en `http://localhost:8080`).

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno (ver docs/ENV_VARIABLES.md)
cp .env.example .env
#    → ajusta VITE_API_URL si tu backend no está en localhost:8080

# 3. Arrancar
npm run dev          # http://localhost:5173
```

> ⚠️ `.env` está gitignorado y purgado del historial: **no lo comitees**.
> Todo `VITE_*` acaba en el bundle público — nunca secretos en el frontend.

## Comandos

```bash
npm run dev          # desarrollo con HMR
npm run build        # build de producción (console.* eliminados, chunks)
npm run preview      # sirve el build localmente
npm test             # suite Vitest completa
npm run test:watch   # tests en modo watch
npm run coverage     # tests + cobertura (umbral 70% en utils/auth)
```

## Arquitectura de carpetas (resumen)

```
src/
├── components/   Reutilizables (chat, booking, profile, admin, Cookie/Header/Footer)
├── pages/        Vistas enrutadas (+ admin/)
├── router/       Rutas + guard global (meta.public / requiresAuth / role)
├── services/     api.js (Axios central), gdprService, profileService, websocket
├── store/        Módulos reactivos planos (auth, profile, catálogos, UI)
├── tests/        Vitest (setup + unit/)
└── utils/        logger, sanitize (DOMPurify), validators (espejo backend)
```

Detalle completo: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Seguridad (resumen)

- Access token **solo en memoria**; refresh token en **cookie httpOnly**
  rotada por el backend. Nada en localStorage.
- Interceptor 401 → refresh silencioso → retry; sesión restaurada al
  recargar vía `initializeAuth()`.
- CSP + headers de seguridad (`vercel.json` / `nginx.conf`), DOMPurify en
  todo `v-html`, validación espejo del backend (NIF con letra de control).
- Panel RGPD en `/privacidad`: acceso, exportación y derecho al olvido.

## Documentación

| Doc | Contenido |
|---|---|
| [`docs/SECURITY.md`](docs/SECURITY.md) | Decisiones de seguridad y porqués |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Estructura, patrones, flujo de sesión |
| [`docs/GDPR_FRONTEND.md`](docs/GDPR_FRONTEND.md) | RGPD: derechos, consentimiento, inventario de storage |
| [`docs/TESTING.md`](docs/TESTING.md) | Cómo ejecutar y escribir tests |
| [`docs/ENV_VARIABLES.md`](docs/ENV_VARIABLES.md) | Variables de entorno |
| [`docs/AUDITORIA_FRONTEND.md`](docs/AUDITORIA_FRONTEND.md) | Auditoría de seguridad (2026-06) |
| [`docs/PROGRESS_FRONTEND.md`](docs/PROGRESS_FRONTEND.md) | Cronología del hardening |

## Contribuir

1. Rama desde `develop` (`VITSYNC-XX-descripcion` o `feature/...`).
2. Respeta las reglas de `CLAUDE.md` (seguridad no negociable: nada de
   tokens en storage, nada de `v-html` sin sanitizar, URLs solo por env).
3. `npm test` y `npm run build` verdes antes del PR a `develop`.
4. Commits en español, formato conventional commits.

> **Nota (2026-06-11):** el historial git fue reescrito para purgar un
> `.env` comiteado. Si tienes un clon antiguo: bórralo y re-clona. No
> hagas push desde clones previos a esa fecha.
