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
