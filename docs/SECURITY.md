# SEGURIDAD DEL FRONTEND — VITSYNC-WebApp

> Decisiones de seguridad tomadas y su porqué. Complementa
> `AUDITORIA_FRONTEND.md` (hallazgos) y `PROGRESS_FRONTEND.md` (cronología).
> El backend tiene su propio `docs/SECURITY.md` en VITSYNC-API.

## Modelo de sesión (la decisión más importante)

| Pieza | Dónde vive | Por qué |
|---|---|---|
| Access token (JWT RS256, 15 min) | **Memoria JS** (`services/api.js`, variable de módulo) | Un XSS no puede leerlo de storage; muere al cerrar pestaña |
| Refresh token (opaco, 7 días, rotación) | **Cookie httpOnly** (`Set-Cookie` del backend: `HttpOnly; Secure; SameSite=None; Path=/api/auth`) | Invisible para JavaScript por diseño; el navegador la envía solo a `/api/auth/*` |
| Identidad (id, nif, email, role) | Memoria (store `auth.js`) | Nada persiste en el cliente |

- **Prohibido** `localStorage`/`sessionStorage` para tokens o identidad.
  La implementación antigua se purga en el arranque (migración en `auth.js`).
- Al recargar: `initializeAuth()` llama a `/api/auth/refresh` (la cookie viaja
  sola) y reconstruye la sesión. Sin cookie válida → login.
- 401 en cualquier llamada → el interceptor refresca UNA vez (single-flight:
  con rotación, dos refresh concurrentes serían replay) y reintenta; si el
  refresh falla → logout y redirect.
- `SameSite=None; Secure` es obligatorio: Vercel y Render son sitios
  distintos; `Strict/Lax` descartaría la cookie en cada XHR.

## Control de acceso en rutas

- Guard global `router.beforeEach` declarativo: `meta.public`,
  `meta.requiresAuth`, `meta.role`. Espera a `initializeAuth()`.
- `?redirect=` post-login validado contra rutas internas (anti open-redirect).
- **Los guards son UX, no seguridad**: la autorización real la impone el
  backend por endpoint. Manipular el estado del cliente solo muestra una
  carcasa sin datos.

## XSS

- Vue escapa `{{ }}` por defecto. `v-html` solo se permite a través de
  `utils/sanitize.js` (DOMPurify, perfiles estrictos SVG/rich-text).
- CSP `script-src 'self' https://cdn.talkjs.com` — sin inline scripts
  (los de `index.html` viven en `public/boot.js`).
- `console.*` se elimina del bundle de producción (`esbuild.drop`); en dev,
  `utils/logger.js` con regla: nunca tokens/NIF/contenido clínico.

## Headers (vercel.json + nginx.conf, mantener en paridad)

CSP restrictiva (connect-src limitado a las APIs Render y TalkJS,
`frame-ancestors 'none'`, `object-src 'none'`), nosniff, X-Frame-Options
DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy
(cámara/micro/geo/payment bloqueados), HSTS 1 año.
X-XSS-Protection se omite a propósito (deprecado, contraproducente).

## Variables de entorno

Todo `VITE_*` se incrusta en el bundle público: **jamás secretos en el
frontend**. `.env` está gitignorado y fue purgado del historial
(2026-06-11, ver AUDITORIA_FRONTEND §0). Plantilla en `.env.example`.

## Chat

- STOMP propio (`services/websocket.js`): JWT en handshake, refresh ante
  caducidad, heartbeats, sin logs de payloads.
- TalkJS (chat activo): su iframe sanitiza el contenido. **Pendiente
  V-F14**: Identity Verification (firma HMAC del userId desde el backend
  con la Secret Key de TalkJS) — sin ella, un cliente puede suplantar ids.

## Pendientes conocidos

- V-F14 TalkJS Identity Verification (requiere endpoint backend).
- Persistir fecha/hora de consentimiento del registro (campos en la API).
- Retirar el fallback de refresh token en body JSON del backend cuando no
  queden clientes legados.
- E2E Playwright.
