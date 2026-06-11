# PROGRESO DEL HARDENING — VITSYNC-WebApp

## Fase 0 — Acción prioritaria ✅ (2026-06-11)

**Qué se hizo:**
- `.env` purgado de TODO el historial git con `git-filter-repo` sobre un
  mirror clone (también `.env.local`/`.env.production`/`.env.development`;
  `.env.example` conservado deliberadamente).
- 14 ramas reescritas y forzadas a GitHub. 6 ramas obsoletas con historial
  viejo no se pudieron forzar (protección GH007 "email privacy" de GitHub) y
  se **eliminaron** en remoto — verificado antes que su contenido estaba
  íntegramente mergeado en `develop` (5) o `master` (VITSYNC-DESARROLLO-FINAL).
- Backup espejo pre-purga: `~/vitsync-webapp-BACKUP-pre-purge.git` (local).
- Evaluación de secretos expuestos: **ninguno utilizable** — la `VITE_API_KEY`
  no la valida el backend; TalkJS App ID es público; URLs Render públicas.
  Detalle en `docs/AUDITORIA_FRONTEND.md` §0.
- Eliminados del repo: `Test.java`, `Test.class` (artefactos Java),
  `payload.json` (fixture). `.gitignore` ampliado (`.env*` salvo example,
  `*.class`, `Thumbs.db`). `.env.example` documentado.
- `.vscode/extensions.json` se mantiene (recomendaciones de proyecto, correcto).

**Decisiones:**
- NO se purgó `.env.example` (el glob `*.env*` propuesto lo habría borrado).
- Borrado de ramas en vez de pelear con GH007: cero pérdida de contenido,
  purga más completa (las refs viejas desaparecen enteras).
- Los commits viejos pueden sobrevivir por SHA directo en refs de PR/cachés de
  GitHub hasta GC; sin secretos reales no se escala a GitHub Support.

**Acción manual del equipo:** todos los colaboradores deben **re-clonar** el
repo (o `git fetch && git reset --hard origin/<rama>` en cada rama local).
El historial antiguo no debe volver a pushearse.

## Fase 1 — Auditoría inicial ✅ (2026-06-11)

**Qué se hizo:** auditoría completa de seguridad, estructura, dependencias y
OWASP en `docs/AUDITORIA_FRONTEND.md`: 14 hallazgos priorizados (V-F01…V-F13 + A06).

**Hallazgos clave:** JWT+NIF en localStorage; refresh token del backend sin
usar; chat `/comunicacion` sin guard; WebSocket sin auth; 68 vulns npm por 4
dependencias basura (`@anthropic-ai/claude-code`, `npx`, `yarn`, `node.url`);
59 console.log (incluye mensajes clínicos); sin CSP ni security headers.

**Pendiente para Fase 2:** auth en memoria + refresh httpOnly, interceptor
401-refresh-retry, guard global con `meta.role`, limpieza de deps.

## Fase 2 — Seguridad de autenticación ✅ (2026-06-11)

**Qué se hizo (V-F01/02/03/04/06/07/08/09):**
- **Backend (VITSYNC-API, commit `93565c8`):** `/login` y `/refresh` setean
  cookie `refresh_token` HttpOnly+Secure+SameSite=None (Vercel↔Render es
  cross-site) con Path=/api/auth; `/refresh` y `/logout` leen cookie con
  fallback a body (legado); `/logout` borra la cookie. 160 tests verdes.
- `services/api.js` reescrito: access token SOLO en memoria de módulo
  (`setAccessToken`/`getAccessToken`), `withCredentials: true`, timeout 10s,
  interceptor request inyecta Bearer, interceptor response 401→refresh
  silencioso (single-flight, compatible con rotación)→retry una vez→si falla,
  logout y redirect. Sin fallback de URL hardcodeado (falla claro si falta
  `VITE_API_URL`). Eliminado header `X-API-Key` (el backend no lo validaba).
- `store/auth.js` reescrito: nada persistido en cliente; `initializeAuth()`
  restaura sesión al arrancar vía cookie httpOnly; identidad mínima en
  memoria; migración que purga las claves antiguas de localStorage
  (token/nif/email/role/id); `logout()` revoca en servidor y limpia memoria.
- `router/index.js` reescrito: guard global `beforeEach` declarativo con
  `meta.public/requiresAuth/role` (espera a `initializeAuth()` para que la
  recarga en ruta protegida no expulse al login antes del refresh);
  `/comunicacion` ahora requiere sesión (V-F07); redirect post-login con
  `?redirect=` validado solo-rutas-internas (anti open-redirect); catch-all
  404 → `pages/NotFound.vue` (V-F09); logueado en /login|/register → home.
- `profileService.js` **reconstruido**: estaba truncado a mitad de
  `getSettings` en el commit anterior (bug preexistente: rompía
  Configuración y Mi Salud). Restaurado completo desde `e71c854` y migrado:
  id desde el store en memoria, sin headers manuales (los pone el
  interceptor), sin `vitsync_settings` con datos sensibles (solo prefs UI).
- `store/profile.js`: eliminado el manejo manual de 401 (limpieza
  localStorage + redirect) — lo hace el interceptor.
- `HeaderComponent`/`AdminHeader`: `await logout()` antes de navegar
  (evita carrera con el guard).

**Decisiones:**
- El token de acceso vive en `api.js` (módulo), no en el store: rompe el
  ciclo de imports api⇄auth.
- El refresh usa single-flight: con rotación de tokens en el backend, dos
  refresh concurrentes serían replay (el segundo revocaría la sesión).
- El campo `refreshToken` del body de la API queda como legado hasta retirar
  los clientes antiguos; el frontend ya no lo lee ni almacena.
- Sesión se pierde al recargar SOLO si la cookie expiró (7d) — comportamiento
  esperado; el refresh silencioso la restaura en caso normal.

**Pendiente para Fase 3:** console.log (59), DOMPurify/v-html, validación de
formularios, limpieza deps basura (68 vulns npm).

## Fase 3 — Datos y comunicaciones ✅ (2026-06-11)

**Qué se hizo:**
- **Dependencias (A06): 68 → 0 vulnerabilidades npm.** Desinstaladas
  `@anthropic-ai/claude-code`, `npx`, `yarn`, `node.url` (instalaciones
  accidentales que arrastraban árboles antiguos); axios 1.13→1.17;
  `npm audit fix` para el resto. +`dompurify`.
- **console (V-F13/A09):** `vite.config.js` → `esbuild.drop` elimina
  `console.*` y `debugger` del bundle de producción (verificado: 0
  ocurrencias en dist). `src/utils/logger.js` para logging condicional en
  dev con regla escrita: nunca tokens/NIF/contenido clínico.
  `vite-plugin-vue-devtools` ahora solo en modo development.
- **XSS (V-F10):** `src/utils/sanitize.js` (DOMPurify, perfiles estrictos
  SVG y rich-text); los 4 `v-html` (Home + MiSaludSection) pasan por
  `sanitizeSvg()` — defensa en profundidad sobre iconos hoy locales.
- **Validación (3.3):** `src/utils/validators.js` espejo del backend:
  NIF/NIE con dígito de control mod-23 (mismo algoritmo que @ValidNif),
  password ≥12 con mayúscula/minúscula/número/especial (antes el frontend
  aceptaba 8 alfanumérica y el backend la rechazaba con 400), teléfono
  español, email ≤254, CP provincia 01-52, fecha no futura. Cableado en
  Register.vue.
- **WebSocket STOMP (V-F12, adelanta Fase 5.1):** `websocket.js` reescrito —
  era código muerto roto (importaba `addMessage` inexistente, nadie lo
  importaba a él): JWT en `connectHeaders` (el backend lo exige), refresh
  automático del token en `beforeConnect` y ante error de auth, heartbeats
  10s, sin URLs hardcodeadas (deriva de `VITE_API_URL`), nunca loguea
  payloads clínicos. Expone connect/send/disconnect.
- `vite.config.js`: `envPrefix` explícito, `manualChunks` (vendor/utils).

**Hallazgo nuevo (V-F14):** TalkJS (chat activo) crea la sesión sin firma de
identidad — cualquier cliente puede suplantar el id de otro usuario en el
chat. Arreglo real = Identity Verification de TalkJS: endpoint backend que
firme el userId con la Secret Key (no está en ningún repo, bien). Pendiente.

**Pendiente para Fase 4:** CSP + security headers en vercel.json e index.html.

## Fase 4 — CSP y headers de seguridad ✅ (2026-06-11)

**Qué se hizo (A05):**
- `vercel.json`: CSP completa como header HTTP (mejor que meta tag: el meta
  no soporta `frame-ancestors`): `default-src 'self'`, scripts solo self +
  cdn.talkjs.com, `connect-src` limitado a las APIs Render (https+wss) y
  TalkJS, `frame-src` solo TalkJS (su widget es iframe), `object-src 'none'`,
  `frame-ancestors 'none'`, `base-uri/form-action 'self'`. Más nosniff,
  X-Frame-Options DENY, Referrer-Policy, Permissions-Policy (cámara/micro/
  geo/payment bloqueados), HSTS 1 año.
- `nginx.conf` (deploy Docker): mismos headers en paridad (+ localhost en
  connect-src para dev); X-Frame-Options SAMEORIGIN→DENY; eliminado
  X-XSS-Protection (deprecado; el auditor XSS antiguo creaba vulns propias).
- `index.html`: scripts inline (tema oscuro + shim global de sockjs) movidos
  a `public/boot.js` — la CSP `script-src 'self'` prohíbe inline sin
  nonce/hash. `lang="es"`.

**Decisiones:**
- CSP en header (vercel.json/nginx) y no en meta: cubre frame-ancestors y
  se aplica antes del parseo del documento.
- `style-src 'unsafe-inline'` se mantiene: Vue/Tailwind generan estilos
  inline; quitarlo rompería el render y su riesgo es muy inferior al de
  scripts inline.
- Los dominios de la CSP son estáticos (vercel.json no interpola env vars):
  incluye testing y prod de Render; al cambiar de dominio API hay que
  actualizar vercel.json y nginx.conf a la vez.

**Pendiente para Fase 5:** sanitización de mensajes TalkJS ya la gestiona su
iframe; V-F14 (Identity Verification TalkJS) sigue abierto — necesita
endpoint backend de firma HMAC.

## Fase 5 — WebSocket ✅ (2026-06-11, adelantada en Fase 3)

Cliente STOMP reescrito con JWT en handshake, refresh ante caducidad,
heartbeats y sin logs de contenido (ver Fase 3). El chat activo es TalkJS;
V-F14 (firma de identidad) pendiente de endpoint backend.

## Fase 6 — RGPD en el frontend ✅ (2026-06-11)

**Qué se hizo:**
- **6.1** `components/CookieConsent.vue`: aviso de almacenamiento técnico
  (no hay tracking que requiera consentimiento previo; si se añade
  analítica, debe bloquearse hasta opt-in aquí). Preferencia "visto" en
  localStorage (uso legítimo). Montado global en App.vue.
- **6.2** `pages/PrivacyDashboard.vue` (ruta `/privacidad`, autenticada) +
  `services/gdprService.js` contra los endpoints REALES del backend:
  ver mis datos (GET my-data, Art. 15), exportar ZIP (Art. 20, maneja el
  429 del límite 1/24h), eliminar cuenta (DELETE gdpr-delete, Art. 17 —
  explica la anonimización a 30 días y la conservación clínica Ley 41/2002,
  doble confirmación, logout automático tras la solicitud). Información de
  qué datos se tratan, para qué y cuánto se conservan. Enlace en footer.
- **6.3** Register: checkbox de Política de Privacidad **obligatorio y no
  pre-marcado** (submit deshabilitado + validación), checkbox separado
  opcional para comunicaciones (Art. 7: consentimiento granular).
- App.vue: `loadProfile` pasaba de `onMounted` a `watch(isAuthenticated)` —
  con la sesión asíncrona el mounted corría antes del refresh.

**Limitación documentada:** el backend `RegisterRequest` aún no tiene campos
de consentimiento (fecha/hora + opt-in comunicaciones): se aplican
client-side pero no se persisten. Pendiente añadir columnas + DTO en la API.

**Pendiente para Fase 7:** tests (Vitest no está configurado aún).

## Fase 7 — Tests ✅ (2026-06-11)

**Qué se hizo:**
- Vitest + @vue/test-utils + jsdom + coverage-v8. Scripts: `npm test`,
  `npm run test:watch`, `npm run coverage`. Umbral 70% líneas/funciones
  sobre `src/utils/**` + `src/store/auth.js` (el resto de stores son
  fetch+estado sin lógica; ampliar al testearlos).
- **54 tests verdes — 97.7% líneas, 95.4% funciones** en lo incluido:
  - `validators.spec.js` (24): NIF/NIE con dígito de control (válidos,
    letra mala, longitud, basura), password 4 clases, teléfono ES, email
    254, CP provincia, fechas.
  - `sanitize.spec.js` (9): scripts/eventos/foreignObject eliminados,
    paths legítimos conservados, data-attrs fuera, null-safe.
  - `auth.store.spec.js` (10): login guarda SOLO en memoria (asserts
    explícitos de localStorage vacío), logout limpia todo incluso sin red,
    initializeAuth restaura y memoiza, register sin sesión, errores con
    mensaje mostrable.
  - `logger.spec.js` (2).
- `src/tests/setup.js`: Node 22+ trae un `localStorage` experimental roto
  (sin `--localstorage-file`) que eclipsa el de jsdom — stub en memoria.

**Bugs reales cazados por los tests:**
1. `isAuthenticated` era `computed` sobre una variable de módulo no
   reactiva → Vue lo cacheaba para siempre: la UI nunca habría reaccionado
   al login/logout. Arreglado con ref `hasSession` en el store.
2. `sanitizeSvg` devolvía vacío para fragmentos `<path>` (DOMPurify los
   descarta fuera de un `<svg>`) → los iconos habrían desaparecido.
   Arreglado envolviendo en `<svg>` durante la sanitización.

**No hecho:** E2E Playwright (7.3, opcional "si el tiempo lo permite") y
tests de componentes de formularios (7.2) — la lógica de validación que
usarían ya está cubierta unitariamente.

**Pendiente para Fase 8:** documentación (ARCHITECTURE, SECURITY,
GDPR_FRONTEND, TESTING, ENV_VARIABLES, CLAUDE.md, README).

## Fase 8 — Documentación ✅ (2026-06-11)

**Qué se hizo:**
- `docs/SECURITY.md`: modelo de sesión (tabla token↔dónde↔porqué), guards,
  XSS, headers, pendientes.
- `docs/ARCHITECTURE.md`: árbol comentado, patrones, diagrama del flujo de
  sesión, estado del doble chat.
- `docs/GDPR_FRONTEND.md`: derechos implementados, consentimiento,
  inventario completo del almacenamiento cliente.
- `docs/TESTING.md` y `docs/ENV_VARIABLES.md`.
- `CLAUDE.md`: contexto para futuras sesiones con las reglas de seguridad
  no negociables.
- `README.md` reescrito: stack, setup, comandos, arquitectura, seguridad,
  guía de contribución y aviso del rewrite de historial.
- JSDoc: aplicado durante las fases en todo el código nuevo/reescrito
  (api, auth, gdprService, profileService, websocket, utils, guards).

**HARDENING COMPLETO — Fases 0-8 cerradas.** Pendientes fuera de alcance:
TalkJS Identity Verification (V-F14, endpoint backend), persistencia del
consentimiento (API), retirar refresh-en-body legado (API), E2E Playwright,
tests de componentes de formularios.
