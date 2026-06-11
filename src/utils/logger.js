/**
 * Conditional logger: prints only in development.
 *
 * In production builds `console.*` is additionally stripped by esbuild
 * (`vite.config.js` → `esbuild.drop`), so this is a second barrier.
 *
 * REGLA (datos sanitarios): aunque sea en desarrollo, NUNCA loguear tokens,
 * contraseñas, NIF, ni contenido clínico (mensajes de chat, informes,
 * alergias…). Loguea ids y estados, no payloads.
 */
const isDev = import.meta.env.DEV;

export const logger = {
    /** Dev-only console.log with app prefix. */
    log: (...args) => { if (isDev) console.log('[VitSync]', ...args); },
    /** Dev-only console.warn with app prefix. */
    warn: (...args) => { if (isDev) console.warn('[VitSync]', ...args); },
    /** Dev-only console.error with app prefix. */
    error: (...args) => { if (isDev) console.error('[VitSync]', ...args); }
};
