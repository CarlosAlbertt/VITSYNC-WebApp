# VARIABLES DE ENTORNO — VITSYNC-WebApp

> ⚠️ **Regla de oro:** todo lo que empiece por `VITE_` se incrusta en el
> bundle JS público durante el build. **Nunca** pongas secretos (API keys
> privadas, tokens, contraseñas) en variables del frontend — cualquier
> visitante puede leerlas con "ver código fuente".

## Variables

| Variable | Obligatoria | Propósito | Ejemplo |
|---|---|---|---|
| `VITE_API_URL` | **Sí** (la app falla en arranque con error claro si falta) | URL base de VITSYNC-API. También deriva la del WebSocket (`{VITE_API_URL}/ws`) | `http://localhost:8080` (dev) · `https://vitsync-api-testing.onrender.com` (testing) |
| `VITE_TALKJS_APP_ID` | Para el chat | App ID de TalkJS. Es un identificador público de cliente, NO un secreto (la Secret Key de TalkJS solo debe existir en el backend) | `tcyeReLZ` |

## Dónde configurarlas

- **Desarrollo local:** copia `.env.example` → `.env` y rellena.
  `.env` está gitignorado y **purgado del historial** (no lo comitees jamás;
  incidente 2026-06-11, ver `AUDITORIA_FRONTEND.md` §0).
- **Vercel:** Project → Settings → Environment Variables (por entorno:
  Preview = testing, Production = prod).
- **Docker:** `docker-compose*.yml` las inyecta en build (`ARG`/`ENV`).

## Al añadir una variable nueva

1. Documéntala aquí y en `.env.example` (con valor ficticio).
2. Pregúntate: ¿es un secreto? → entonces NO va al frontend; expón un
   endpoint en el backend que haga el trabajo.
3. Si afecta a dominios de red, actualiza la CSP (`vercel.json` y
   `nginx.conf`, en paridad).
