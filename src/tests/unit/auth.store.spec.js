import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock del módulo api: simula el token holder en memoria y las llamadas HTTP
vi.mock('../../services/api', () => {
    let token = null;
    return {
        default: { post: vi.fn() },
        setAccessToken: vi.fn((t) => { token = t || null; }),
        getAccessToken: vi.fn(() => token),
        refreshAccessToken: vi.fn()
    };
});

vi.mock('../../store/profile', () => ({
    resetProfile: vi.fn()
}));

import api, { setAccessToken, getAccessToken, refreshAccessToken } from '../../services/api';
import { resetProfile } from '../../store/profile';
import { login, logout, register, currentUser, isAuthenticated, initializeAuth, getAuthHeader } from '../../store/auth';

const AUTH_PAYLOAD = {
    token: 'jwt-access', nif: '12345678Z', email: 'ana@vitsync.es', role: 'PACIENTE', id: 7
};

beforeEach(async () => {
    // El estado del store es de módulo (persiste entre tests): logout() lo
    // resetea por la vía pública antes de cada caso
    api.post.mockResolvedValue({ data: {} });
    await logout();
    vi.clearAllMocks();
    setAccessToken(null);
    localStorage.clear();
});

describe('login', () => {
    it('guarda el token SOLO en memoria, nunca en localStorage', async () => {
        api.post.mockResolvedValue({ data: AUTH_PAYLOAD });

        await login('12345678Z', 'Password123!Abc');

        expect(setAccessToken).toHaveBeenCalledWith('jwt-access');
        // Regla de oro V-F01: nada de identidad ni tokens persistidos
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('nif')).toBeNull();
        expect(localStorage.getItem('role')).toBeNull();
    });

    it('puebla currentUser e isAuthenticated', async () => {
        api.post.mockResolvedValue({ data: AUTH_PAYLOAD });

        await login('12345678Z', 'Password123!Abc');

        expect(currentUser.value).toEqual({ nif: '12345678Z', email: 'ana@vitsync.es', role: 'PACIENTE', id: 7 });
        expect(isAuthenticated.value).toBe(true);
    });

    it('credenciales malas → Error con mensaje del servidor', async () => {
        api.post.mockRejectedValue({ response: { data: { message: 'Credenciales inválidas' } } });

        await expect(login('12345678Z', 'mala')).rejects.toThrow('Credenciales inválidas');
        expect(isAuthenticated.value).toBe(false);
    });

    it('error de red → mensaje genérico (no raw)', async () => {
        api.post.mockRejectedValue(new Error('ECONNREFUSED'));
        await expect(login('12345678Z', 'x')).rejects.toThrow('Error en el inicio de sesión');
    });
});

describe('logout', () => {
    it('revoca en servidor y limpia memoria + perfil', async () => {
        api.post.mockResolvedValue({ data: AUTH_PAYLOAD });
        await login('12345678Z', 'Password123!Abc');

        api.post.mockResolvedValue({ data: {} });
        await logout();

        expect(api.post).toHaveBeenCalledWith('/api/auth/logout');
        expect(setAccessToken).toHaveBeenLastCalledWith(null);
        expect(currentUser.value).toEqual({ nif: null, email: null, role: null, id: null });
        expect(isAuthenticated.value).toBe(false);
        expect(resetProfile).toHaveBeenCalled();
    });

    it('limpia la sesión local aunque la red falle', async () => {
        api.post.mockResolvedValue({ data: AUTH_PAYLOAD });
        await login('12345678Z', 'Password123!Abc');

        api.post.mockRejectedValue(new Error('offline'));
        await logout();

        expect(isAuthenticated.value).toBe(false);
    });
});

describe('initializeAuth', () => {
    it('restaura la sesión vía refresh silencioso', async () => {
        refreshAccessToken.mockImplementation(async () => {
            setAccessToken(AUTH_PAYLOAD.token);
            return AUTH_PAYLOAD;
        });

        await initializeAuth();

        expect(refreshAccessToken).toHaveBeenCalled();
        expect(currentUser.value.nif).toBe('12345678Z');
        expect(isAuthenticated.value).toBe(true);
    });

    it('memoiza: múltiples llamadas → un solo refresh', async () => {
        // initializeAuth ya corrió en el test anterior (promesa cacheada):
        // llamadas repetidas no disparan más refresh
        const callsBefore = refreshAccessToken.mock.calls.length;
        await initializeAuth();
        await initializeAuth();
        expect(refreshAccessToken.mock.calls.length).toBe(callsBefore);
    });
});

describe('register', () => {
    it('no aplica sesión (sin tokens hasta verificar email)', async () => {
        api.post.mockResolvedValue({ data: { message: 'ok' } });

        await register({ nif: '12345678Z' });

        expect(api.post).toHaveBeenCalledWith('/api/auth/register', { nif: '12345678Z' });
    });
});

describe('getAuthHeader (legado)', () => {
    it('con token → header Bearer; sin token → objeto vacío', () => {
        setAccessToken('abc');
        expect(getAuthHeader()).toEqual({ Authorization: 'Bearer abc' });
        setAccessToken(null);
        expect(getAuthHeader()).toEqual({});
    });
});
