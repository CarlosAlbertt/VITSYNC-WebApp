# TESTING — VITSYNC-WebApp

Stack: **Vitest** + jsdom + @vue/test-utils + coverage-v8.

## Comandos

```bash
npm test            # toda la suite, una pasada
npm run test:watch  # modo watch durante desarrollo
npm run coverage    # suite + cobertura (texto + HTML en coverage/)
```

## Umbral de cobertura

El build de tests **falla** bajo el 70% de líneas/funciones en:
`src/utils/**` y `src/store/auth.js` (config en `vite.config.js → test.coverage`).
Estado actual: ~97% líneas. Al añadir tests de más stores, ampliar el
`include` para que el umbral los proteja también.

## Estructura

```
src/tests/
├── setup.js              Stub de localStorage/sessionStorage.
│                         (El localStorage experimental de Node 22+ eclipsa
│                         el de jsdom y no funciona sin --localstorage-file.)
└── unit/
    ├── validators.spec.js   NIF/NIE dígito de control, password, teléfono…
    ├── sanitize.spec.js     DOMPurify: scripts/eventos fuera, iconos intactos
    ├── auth.store.spec.js   Sesión en memoria: login/logout/initializeAuth
    └── logger.spec.js       Logger condicional
```

## Convenciones

- Un spec por módulo; `describe` por función; nombres en español describiendo
  el comportamiento (`'letra de control incorrecta → error'`).
- Mockear módulos con `vi.mock` en la cabecera (se hoistea); resetear estado
  de módulos del store por su API pública (p. ej. `await logout()`), no
  tocando internos.
- Los tests de auth afirman explícitamente que `localStorage` queda vacío:
  es la invariante de seguridad V-F01, no la rompas.

## Pendiente

- Tests de componentes (formularios Login/Register con @vue/test-utils).
- E2E con Playwright (flujo register→verify→login→perfil→logout, guards).
