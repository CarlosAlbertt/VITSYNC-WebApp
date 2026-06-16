import axios from 'axios';

/**
 * Centralised HTTP client for the VitSync API.
 *
 * Security model:
 * - The ACCESS token lives ONLY in module memory (never localStorage /
 *   sessionStorage): an injected script cannot exfiltrate it from storage.
 * - The REFRESH token lives in an httpOnly cookie set by the backend
 *   (`Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=None`),
 *   invisible to JavaScript. `withCredentials: true` makes the browser
 *   attach it automatically on `/api/auth/*` calls.
 * - On 401 the response interceptor silently refreshes once and retries;
 *   if the refresh itself fails the session is over → redirect to /login.
 */

// La URL SIEMPRE viene del entorno (V-F04): sin fallbacks hardcodeados.
const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
    // Falla alto y claro en build/arranque, no con errores de red crípticos
    throw new Error('VITE_API_URL no está definida. Copia .env.example a .env');
}

// ─── Access token en memoria ───────────────────────────────────────────────────
// Vive aquí (y no en el store) para evitar el ciclo de imports api ⇄ auth.
let accessToken = null;

/** Sets/clears the in-memory access token (called by the auth store). */
export const setAccessToken = (token) => { accessToken = token || null; };

/** Returns the current in-memory access token (or null). */
export const getAccessToken = () => accessToken;

const api = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true, // imprescindible para la cookie httpOnly del refresh
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// ─── REQUEST: adjuntar access token ────────────────────────────────────────────
api.interceptors.request.use(request => {
    if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
});

// ─── Refresh single-flight ─────────────────────────────────────────────────────
// Si N peticiones reciben 401 a la vez, solo UNA llama a /refresh (el backend
// rota el token: una segunda llamada con la cookie vieja sería rechazada como
// replay). Las demás esperan la misma promesa.
let refreshPromise = null;

/**
 * Exchanges the httpOnly refresh cookie for a new access token.
 * Uses a bare axios call (not `api`) so interceptors don't recurse.
 *
 * @returns {Promise<object>} the auth payload (token, id, nif, email, role)
 * @throws when the refresh token is missing/expired/revoked
 */
export const refreshAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = axios.post(`${baseURL}/api/auth/refresh`, null, {
            withCredentials: true,
            timeout: 10000
        }).then(({ data }) => {
            setAccessToken(data.token);
            return data;
        }).finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
};

// ─── RESPONSE: 401 → refresh → reintento (una sola vez) ───────────────────────
api.interceptors.response.use(
    response => response,
    async error => {
        const original = error.config;
        const status = error.response?.status;

        // No reintentar: errores que no son 401, peticiones ya reintentadas,
        // o los propios endpoints de auth (un 401 en /login son credenciales
        // malas, no un token caducado)
        const isAuthEndpoint = original?.url?.includes('/api/auth/');
        if (status !== 401 || original?._retried || isAuthEndpoint) {
            return Promise.reject(error);
        }

        try {
            await refreshAccessToken();
            original._retried = true;
            return api(original);
        } catch {
            // Refresh caducado/revocado: sesión terminada de verdad
            setAccessToken(null);
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    }
);

export default api;
