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
