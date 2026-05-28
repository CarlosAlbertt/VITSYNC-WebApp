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
    const response = await api.post('/api/upload/avatar', formData, {
        headers: { 'Content-Type': undefined }
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
    const response = await api.get('/api/informes/me', { headers: getAuthHeader() });
    const raw = response.data;
    let reports = Array.isArray(raw) ? raw : (raw?.content ?? raw?.data ?? raw?.informes ?? []);
    
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
    /*
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/avatar', formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
    });
    const baseUrl = api.defaults.baseURL || 'https://vitsync-api-testing.onrender.com';
    const docUrl = `${baseUrl}${response.data.url}`;
    */
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
    await delay(300);
