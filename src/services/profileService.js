import api from './api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── PERFIL GENERAL ───────────────────────────────────────────────────────────

/**
 * Obtiene el perfil del usuario autenticado desde el backend real.
 * Usa GET /VitSync-app/{id} con el id almacenado en localStorage.
 */
export const getProfile = async () => {
    const id = localStorage.getItem('id');
    try {
        const response = await api.get(`/VitSync-app/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (err) {
        // Mejor manejo de error para 401/403
        console.error('[getProfile] Error obteniendo perfil:', err.response?.status, err.response?.data);
        throw err;
    }
};

/**
 * Actualiza el perfil via PUT /VitSync-app/api/users/{id}/profile.
 */
export const updateProfile = async (data) => {
    const id = localStorage.getItem('id');
    try {
        const response = await api.put(`/VitSync-app/api/users/${id}/profile`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (err) {
        console.error('[updateProfile] status:', err.response?.status, '| data:', err.response?.data);
        throw err;
    }
};

/**
 * Sube el avatar a POST /api/upload/avatar y actualiza la URL en el perfil
 * via PATCH /VitSync-app/api/users/{id}/avatar.
 */
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Para multipart/form-data NO debemos enviar Content-Type manualmente;
    // axios lo genera automáticamente con el boundary correcto.
    const response = await api.post('/api/upload/avatar', formData, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
        }
    });
    const avatarUrl = response.data.url;
    const id = localStorage.getItem('id');
    if (id) {
        await api.patch(`/VitSync-app/api/users/${id}/avatar`, { avatarUrl }, { headers: getAuthHeader() });
    }
    return { avatarUrl };
};

// ─── INFORMES ──────────────────────────────────────────────────────────

export const getReports = async (filters = {}) => {
    // Usamos el nuevo endpoint /api/informes/me que ya devuelve los datos correctos del usuario autenticado
    const response = await api.get('/api/informes/me', { headers: getAuthHeader() });
    const raw = response.data;
    let reports = Array.isArray(raw) ? raw : (raw?.content ?? raw?.data ?? raw?.informes ?? []);
    
    // Aplicamos filtros locales
    if (filters.type) reports = reports.filter(r => r.type === filters.type);
    if (filters.status) reports = reports.filter(r => r.status === filters.status);
    if (filters.search) {
        const q = filters.search.toLowerCase();
        reports = reports.filter(r =>
            r.title?.toLowerCase().includes(q) ||
            r.doctor?.toLowerCase().includes(q) ||
            r.specialty?.toLowerCase().includes(q)
        );
    }
    return reports;
};

export const getReportById = async (id) => {
    const reports = await getReports();
    return reports.find(r => r.id === id) || null;
};

export const downloadReportPdf = async (id) => {
    const response = await api.get(`/api/informes/${id}/pdf`, {
        headers: getAuthHeader(),
        responseType: 'blob'
    });
    return response.data;
};

// ─── CITAS ─────────────────────────────────────────────────────────────

export const getAppointments = async (filters = {}) => {
    // Usamos el nuevo endpoint /api/citas/me que devuelve CitaResponse
    const response = await api.get('/api/citas/me', { headers: getAuthHeader() });
    const raw = response.data;
    let appts = Array.isArray(raw) ? raw : (raw?.content ?? raw?.data ?? raw?.citas ?? []);
    
    if (filters.status) appts = appts.filter(a => a.status === filters.status);
    if (filters.specialty) appts = appts.filter(a => a.specialty === filters.specialty);
    
    return appts;
};

export const cancelAppointment = async (id, reason = '') => {
    await api.put(`/api/citas/${id}/cancel`, {}, { headers: getAuthHeader() });
    return { success: true };
};

export const uploadAppointmentDoc = async (appointmentId, file) => {
    // TODO: Descomentar cuando Backend esté desplegado
    /*
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/avatar', formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
    });
    const baseUrl = api.defaults.baseURL || 'https://vitsync-api-testing.onrender.com';
    const docUrl = `${baseUrl}${response.data.url}`;
    */

    // Mock provisional para Producción:
    await delay(500);
    const docUrl = URL.createObjectURL(file);
    return { success: true, url: docUrl };
};

// ─── CONFIGURACIÓN (MOCK) ─────────────────────────────────────────────────────

const MOCK_SETTINGS = {
    notifications: {
        emailAppointments: true,
        emailReports: true,
        emailMessages: false,
        pushReminders: true,
        pushAlerts: true,
        reminderTime: '24h'
    },
    preferences: {
        language: 'es',
        timezone: 'Europe/Madrid',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        theme: 'auto',
        fontSize: 'medium',
        highContrast: false
    },
    privacy: {
        profileVisible: true,
        shareData: false
    }
};

export const getSettings = async () => {
    // TODO: reemplazar con GET /api/user/settings
    await delay(300);
    // Mezclar con lo que haya en localStorage (preferencias de interfaz)
    const stored = JSON.parse(localStorage.getItem('vitsync_settings') || 'null');
    return stored || MOCK_SETTINGS;
};

export const updateSettings = async (data) => {
    // TODO: reemplazar con PUT /api/user/settings
    await delay(400);
    localStorage.setItem('vitsync_settings', JSON.stringify(data));
    return { success: true };
};

export const changePassword = async (currentPassword, newPassword) => {
    const id = localStorage.getItem('id');
    const response = await api.patch(`/VitSync-app/api/users/${id}/password`, {
        currentPassword,
        newPassword
    }, { headers: getAuthHeader() });
    return response.data;
};

export const getSessions = async () => {
    // TODO: reemplazar con GET /api/user/sessions
    await delay(300);
    return [
        { id: 1, device: 'Chrome · Windows', location: 'Madrid, ES', date: '2026-02-19T10:00:00', current: true },
        { id: 2, device: 'Safari · iPhone', location: 'Valencia, ES', date: '2026-02-18T18:30:00', current: false }
    ];
};

export const deleteSession = async (id) => {
    // TODO: reemplazar con DELETE /api/user/sessions/:id
    await delay(400);
    return { success: true };
};

// ─── GESTIÓN DE DATOS (RGPD) ────────────────────────────────────────────────

export const exportUserData = async () => {
    const response = await api.get('/VitSync-app/api/users/me/export', { headers: getAuthHeader() });
    return response.data;
};

export const suspendAccount = async () => {
    await api.put('/VitSync-app/api/users/status', {}, { headers: getAuthHeader() });
    return { success: true };
};

export const deleteAccount = async () => {
    const id = localStorage.getItem('id');
    await api.delete(`/VitSync-app/${id}`, { headers: getAuthHeader() });
    return { success: true };
};

// ─── SALUD (INDICADORES) ─────────────────────────────────────────────────────

export const getSaludResumen = async () => {
    const response = await api.get('/api/salud/resumen', { headers: getAuthHeader() });
    return response.data;
};

export const getSaludDetalle = async (categoria) => {
    const response = await api.get(`/api/salud/${categoria}`, { headers: getAuthHeader() });
    return response.data;
};
// ─── SEGURIDAD AVANZADA (REAL) ──────────────────────────────────────────────
export const setup2FA = async (enabled) => {
    const id = localStorage.getItem('id');
    await api.put(`/VitSync-app/api/users/${id}/security/2fa`, { enabled }, { headers: getAuthHeader() });
    return { success: true, qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VITSYNC-AUTH' };
};

export const getSecurityQuestions = async () => {
    // Los datos de seguridad se cargan con el perfil
    const profile = await getProfile();
    if (!profile.securityQuestion1) return [];
    return [
        { question: profile.securityQuestion1, answer: profile.securityAnswer1 },
        { question: profile.securityQuestion2, answer: profile.securityAnswer2 }
    ];
};

export const saveSecurityQuestions = async (questions) => {
    const id = localStorage.getItem('id');
    const payload = {
        q1: questions[0].question,
        a1: questions[0].answer,
        q2: questions[1].question,
        a2: questions[1].answer
    };
    await api.post(`/VitSync-app/api/users/${id}/security/questions`, payload, { headers: getAuthHeader() });
    return { success: true };
};
