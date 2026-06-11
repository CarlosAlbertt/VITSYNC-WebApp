import { ref, computed } from 'vue';
import api, { setAccessToken, getAccessToken, refreshAccessToken } from '../services/api';
import { resetProfile } from './profile';

/**
 * Authentication store (plain reactive module).
 *
 * Security model (V-F01/V-F02/V-F03 of the audit):
 * - NOTHING is persisted client-side: access token and user identity live
 *   only in memory and vanish on reload — by design.
 * - Session survival across reloads comes from the httpOnly refresh cookie:
 *   `initializeAuth()` calls `/api/auth/refresh` at startup and rebuilds the
 *   in-memory state. JS never sees the refresh token.
 */

// Identidad mínima en memoria: nunca datos médicos, nunca persistida
export const currentUser = ref({ nif: null, email: null, role: null, id: null });

export const isAuthenticated = computed(() => !!getAccessToken());

// Señal para que el router espere a que initializeAuth() termine antes de
// resolver la primera navegación (si no, recarga en ruta protegida → /login)
let initPromise = null;

/** Applies an auth payload (login/refresh response) to the in-memory state. */
const applySession = (data) => {
    setAccessToken(data.token);
    currentUser.value = {
        nif: data.nif ?? null,
        email: data.email ?? null,
        role: data.role ?? null,
        id: data.id ?? null
    };
};

/** Wipes every trace of the session from memory. */
const clearSession = () => {
    setAccessToken(null);
    currentUser.value = { nif: null, email: null, role: null, id: null };
    resetProfile();
};

// Migración: purgar restos de la implementación antigua basada en localStorage.
// Sin esto, usuarios con sesión previa conservarían token+NIF expuestos.
['token', 'nif', 'email', 'role', 'id'].forEach(k => localStorage.removeItem(k));

/**
 * Restores the session on app startup via the httpOnly refresh cookie.
 * Resolves always (no throw): without a valid cookie the user simply
 * stays logged out.
 *
 * @returns {Promise<void>}
 */
export const initializeAuth = () => {
    if (!initPromise) {
        initPromise = refreshAccessToken()
            .then(applySession)
            .catch(() => { clearSession(); });
    }
    return initPromise;
};

/**
 * Authenticates against the API. The backend sets the refresh cookie;
 * the access token is kept in memory only.
 *
 * @param {string} nif user NIF
 * @param {string} password plain password (only travels over TLS)
 * @returns {Promise<object>} the auth payload
 * @throws {Error} with a user-displayable message
 */
export const login = async (nif, password) => {
    try {
        const response = await api.post('/api/auth/login', { nif, password });
        applySession(response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
    }
};

/**
 * Registers a new account (no tokens are issued until email verification).
 *
 * @param {object} userData validated registration data
 * @returns {Promise<object>}
 * @throws {Error} with a user-displayable message
 */
export const register = async (userData) => {
    try {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en el registro');
    }
};

/**
 * Logs out: asks the backend to revoke the refresh token and clear its
 * cookie, then wipes the in-memory state. Local cleanup happens even if
 * the network call fails.
 */
export const logout = async () => {
    try {
        await api.post('/api/auth/logout');
    } catch {
        // Logout es best-effort: la sesión local muere igualmente
    } finally {
        clearSession();
    }
};

/**
 * Legacy helper kept for callers that still build headers manually.
 * The axios interceptor already injects the token on every `api` call.
 *
 * @deprecated use the shared `api` instance instead
 */
export const getAuthHeader = () => {
    const token = getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
