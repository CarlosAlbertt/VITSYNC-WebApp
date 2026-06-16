# RGPD EN EL FRONTEND — VITSYNC-WebApp

> Implementación frontend de los derechos del interesado. El detalle del
> tratamiento (cifrado, anonimización, auditoría) está en los docs de
> VITSYNC-API (`GDPR_COMPLIANCE.md`, `GDPR_PROCEDURES.md`).

## Principio rector

El frontend **no almacena datos personales en el cliente**: la identidad
vive en memoria y muere con la pestaña; los datos médicos se piden a la API
bajo demanda y no se cachean. Lo único persistido localmente son
preferencias de UI no personales (tema, aviso de cookies visto, ajustes).

## Derechos implementados (`/privacidad`, `PrivacyDashboard.vue`)

| Derecho | UI | Endpoint backend |
|---|---|---|
| Acceso (Art. 15) | "Ver mis datos": resumen de citas/informes/mensajes | `GET /api/users/{id}/my-data` |
| Portabilidad (Art. 20) | "Descargar ZIP" (JSON + TXT legible); informa del límite 1/24h al recibir 429 | `GET /api/users/{id}/my-data/export` |
| Olvido (Art. 17) | "Eliminar mi cuenta" con doble confirmación; muestra la fecha de anonimización (+30 días) y cierra sesión | `DELETE /api/users/{id}/gdpr-delete` |

La pantalla informa además de qué datos se tratan, con qué fin y plazos de
conservación (documentación clínica: Ley 41/2002).

## Consentimiento (registro)

- Checkbox de Política de Privacidad **obligatorio y no pre-marcado**
  (Art. 7: el submit queda deshabilitado sin él).
- Checkbox **separado y opcional** para comunicaciones por email
  (granularidad del consentimiento).
- **Limitación actual:** el backend aún no persiste fecha/hora del
  consentimiento ni el opt-in de comunicaciones (faltan campos en
  `RegisterRequest` + entidad). Pendiente en la API.

## Cookies y almacenamiento (`CookieConsent.vue`)

- Solo almacenamiento **técnico imprescindible**: cookie httpOnly de sesión
  (la pone el backend) y preferencias de UI. No hay analítica ni tracking.
- Por eso el banner es informativo (no requiere opt-in previo). **Si algún
  día se añade analítica** (p. ej. Vercel Analytics), ese script debe
  bloquearse hasta consentimiento explícito gestionado en este componente.
- La preferencia "aviso visto" se guarda en localStorage: es el lugar
  correcto para un flag de UI sin datos personales.

## Inventario de almacenamiento cliente

| Clave | Tipo | Contenido | ¿Personal? |
|---|---|---|---|
| `refresh_token` | Cookie httpOnly (la gestiona el navegador/backend) | Token opaco | No legible por JS |
| `vueuse-color-scheme` | localStorage | "dark"/"light" | No |
| `vitsync_cookie_notice_ack` | localStorage | "1" | No |
| `vitsync_settings` | localStorage | Preferencias de UI (idioma, formato fecha…) | No |

Nada más. Cualquier adición que incluya datos personales requiere revisión.
