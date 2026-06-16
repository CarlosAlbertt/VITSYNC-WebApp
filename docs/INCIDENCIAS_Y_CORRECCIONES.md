# Incidencias y correcciones — VITSYNC-WebApp

> Fecha: 2026-06-16 · Autor: revisión asistida (Claude Code)
> Documento complementario a [AUDITORIA_FRONTEND.md](AUDITORIA_FRONTEND.md) y
> [SECURITY.md](SECURITY.md).

---

## 1. Cierre inesperado de Claude Code

La causa raíz estaba en el repositorio **VITSYNC-API** (un volcado de sesión de
~398 KB versionado dentro del árbol de fuentes). Ver
`VITSYNC-API/docs/INCIDENCIAS_Y_CORRECCIONES.md §1`. En el frontend no se
detectó un fichero equivalente; los ficheros más pesados son imágenes en
`public/` y `src/assets/` (esperado).

---

## 2. Errores corregidos en el frontend

Correcciones aplicadas y verificadas (`npm run build` ✅, `vitest` 54/54 ✅):

### 2.1 `console.log` dentro de un template Vue — `chat/ChatWidget.vue`
Había un bloque de "debug" que ejecutaba `{{ console.log(...) }}` en el
template. `console` no está garantizado en el scope de render de Vue y ensucia
la consola en producción. **Eliminado.**

### 2.2 Fallback engañoso al crear cita — `store/citas.js`
`crearCita` devolvía `{ success: true, message: 'Cita guardada localmente' }`
**aunque el backend fallara**, ocultando el error al usuario y guardando datos
solo en local. **Fix**: ante un fallo se devuelve `{ success: false, ... }` con
el mensaje real del backend.

### 2.3 IDs temporales colisionables — `store/citas.js`
`addCitaLocal` usaba `id: Date.now()`, que colisiona si se crean dos citas en el
mismo milisegundo. **Fix**: `id: \`temp_${Date.now()}_${random}\``.

### 2.4 Contrato del endpoint de asignación — `services/relationships.js`
`assignPatientToProfessional` pasó de query string a **body JSON**
`{ patientId, medicoId }`. Esto requiere el cambio correspondiente en el backend
(aplicado: ver `VITSYNC-API/docs/INCIDENCIAS_Y_CORRECCIONES.md §2.1`).

### 2.5 URL mal formada — `store/hospitales.js`
`getLocationById` pedía `api/hospitales/${id}` (sin `/` inicial) → ruta relativa
incorrecta según baseURL. **Fix**: `/api/hospitales/${id}`.

### 2.6 Política de contraseña — `pages/Register.vue`
`minlength` subido de **6 a 12** en contraseña y confirmación, acorde a una app
que maneja datos de salud.

### 2.7 Manejo de errores y guardas faltantes
- `booking/StepCalendar.vue`, `booking/StepDoctor.vue`,
  `profile/sections/CitasSection.vue`: llamadas async envueltas en
  `try/catch/finally` (antes un fallo dejaba spinners colgados o rompía la vista).
- `booking/StepDoctor.vue`: si no hay especialidad seleccionada, vuelve atrás en
  lugar de llamar al backend con `undefined`.
- `profile/sections/CitasSection.vue`: validación de cancelación reforzada (solo
  citas Programadas/Confirmadas y no pasadas; `appt.time` con valor por defecto).
- `booking/StepConfirmation.vue`: el `submit` resetea `isSubmitting` si el emit
  falla.

### 2.8 Accesibilidad y limpieza
- `HeaderComponent.vue`: `aria-label`/`aria-expanded`/`aria-controls` en botones.
- `pages/HomeView.vue`: eliminado código muerto comentado de guardado de token.

---

## 3. Verificación

| Comprobación | Resultado |
|--------------|-----------|
| `npm run build` | ✅ OK |
| `npm run test` (vitest) | ✅ 54/54 |
