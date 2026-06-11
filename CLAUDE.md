# CLAUDE.md — Contexto para Claude Code

SPA frontend de VitSync (SaaS sanitaria española). Maneja **datos de salud
(Art. 9 RGPD)** → máximas garantías también en el cliente. Backend gemelo:
`~/VITSYNC-API` (Spring Boot, tiene su propio CLAUDE.md).

## Stack
- Vue 3 Composition API (`<script setup>`) + Vite 7 + Tailwind CSS 4.
- Vue Router 4 (guard global por `meta`), stores = módulos reactivos planos
  (sin Pinia). Axios central. TalkJS (chat) + STOMP/SockJS (cliente listo).
- Vitest + jsdom (tests). Deploy: Vercel (develop→testing, main→prod) y
  Docker/nginx.

## Build / test
- `npm run dev` · `npm run build` · `npm test` · `npm run coverage`
  (umbral 70% líneas/funciones en `src/utils/**` + `src/store/auth.js`).
- Requiere `.env` (copiar de `.env.example`); sin `VITE_API_URL` la app
  lanza error en arranque a propósito.

## Reglas de seguridad NO negociables
- **Nunca** tokens/identidad/datos médicos en localStorage/sessionStorage.
  Access token = memoria (`services/api.js`); refresh = cookie httpOnly del
  backend. La sesión se restaura con `initializeAuth()` (refresh silencioso).
- **Toda** llamada HTTP pasa por `services/api.js` (interceptores auth).
- **Nunca** `v-html` directo: usar `utils/sanitize.js` (DOMPurify).
- **Nunca** URLs hardcodeadas: `import.meta.env.VITE_API_URL`.
- **Nunca** secretos en variables `VITE_*` (van al bundle público).
- `console.*` se elimina en build; en dev usar `utils/logger.js` y jamás
  loguear tokens, NIF ni contenido clínico.
- Guards de rutas son UX; la autorización real es del backend.
- CSP sin inline scripts: bootstrap pre-Vue en `public/boot.js`. Al tocar
  dominios, actualizar CSP en `vercel.json` Y `nginx.conf` (paridad).

## Convenciones
- Componentes con `<script setup>`; JSDoc en inglés en código crítico;
  comentarios inline en español (dominio sanitario).
- Validación de formularios con `utils/validators.js` (espejo del backend:
  NIF con letra de control mod-23, password ≥12 con 4 clases).
- Commits en español, conventional commits.

## Estado / pendientes
- `docs/PROGRESS_FRONTEND.md` = cronología del hardening (Fases 0-8, 2026-06).
- Pendientes: TalkJS Identity Verification (V-F14, necesita endpoint backend
  con la Secret Key), persistir consentimiento del registro en la API,
  retirar fallback de refresh-en-body del backend, E2E Playwright.
- El historial git fue REESCRITO el 2026-06-11 (purga de .env). No pushear
  desde clones antiguos.

## Documentación
`docs/`: AUDITORIA_FRONTEND, SECURITY, ARCHITECTURE, GDPR_FRONTEND,
TESTING, ENV_VARIABLES, PROGRESS_FRONTEND.
