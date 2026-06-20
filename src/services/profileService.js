import api from './api';
import { currentUser } from '../store/auth';

/**
 * Profile-domain API calls.
 *
 * Auth notes (Fase 2 del hardening):
 * - The shared `api` instance injects the Bearer token on every request:
 *   no manual Authorization headers here.
 * - The user id comes from the in-memory auth store, never localStorage.
 */

/** Returns the authenticated user's id from the in-memory session. */
const userId = () => currentUser.value.id;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── PERFIL GENERAL ───────────────────────────────────────────────────────────

/**
 * Fetches the authenticated user's profile via GET /VitSync-app/{id}.
 */
export const getProfile = async () => {
    const response = await api.get(`/VitSync-app/${userId()}`);
    return response.data;
};

/**
 * Updates the profile via PUT /VitSync-app/api/users/{id}/profile.
 */
export const updateProfile = async (data) => {
    const response = await api.put(`/VitSync-app/api/users/${userId()}/profile`, data);
    return response.data;
};

/**
 * Uploads the avatar (POST /api/upload/avatar) and persists its URL via
 * PATCH /VitSync-app/api/users/{id}/avatar.
 */
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/avatar', formData, {
        // Dejar que el navegador ponga multipart/form-data con boundary
        headers: { 'Content-Type': undefined }
    });
    const avatarUrl = response.data.url;
    const id = userId();
    if (id) {
        await api.patch(`/VitSync-app/api/users/${id}/avatar`, { avatarUrl });
    }
    return { avatarUrl };
};

// ─── INFORMES ──────────────────────────────────────────────────────────

export const getReports = async (filters = {}) => {
    const response = await api.get('/api/informes/me');
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
    const response = await api.get(`/api/informes/${id}/pdf`, { responseType: 'blob' });
    return response.data;
};

// ─── CITAS ─────────────────────────────────────────────────────────────

// Normaliza el estado del backend (p. ej. "PROGRAMADA") al formato del frontend
// ("Programada"), que es el que usan los filtros y las tarjetas.
const STATUS_LABELS = { PROGRAMADA: 'Programada', CONFIRMADA: 'Confirmada', CANCELADA: 'Cancelada', COMPLETADA: 'Completada' };
const normalizeStatus = (e) => {
    if (!e) return 'Programada';
    return STATUS_LABELS[e.toUpperCase()] || (e.charAt(0).toUpperCase() + e.slice(1).toLowerCase());
};

// Mapea la entidad Cita del backend (fechaHora/estado/tipo/medico) al modelo
// que esperan los componentes (date/time/status/specialty/doctor).
const mapCita = (c) => {
    const fh = c.fechaHora || '';
    return {
        id: c.id,
        date: fh ? fh.substring(0, 10) : '',
        time: fh.length >= 16 ? fh.substring(11, 16) : '',
        status: normalizeStatus(c.estado),
        specialty: c.tipo || 'General',
        type: 'Presencial',
        doctor: c.medico?.name || 'Sin asignar',
        medicoId: c.medico?.id ?? null,
    };
};

export const getAppointments = async (filters = {}) => {
    const response = await api.get('/api/citas/me');
    const raw = response.data;
    const citas = Array.isArray(raw) ? raw : (raw?.content ?? raw?.data ?? raw?.citas ?? []);
    let appts = citas.map(mapCita);

    if (filters.status) appts = appts.filter(a => a.status === filters.status);
    if (filters.specialty) appts = appts.filter(a => a.specialty === filters.specialty);

    return appts;
};

export const cancelAppointment = async (id) => {
    await api.put(`/api/citas/${id}/cancel`, {});
    return { success: true };
};

export const uploadAppointmentDoc = async (appointmentId, file) => {
    // Pendiente de endpoint propio en el backend; de momento solo previsualiza
    await delay(500);
    const docUrl = URL.createObjectURL(file);
    return { success: true, url: docUrl };
};

// ─── CONFIGURACIÓN (MOCK hasta endpoint real) ─────────────────────────────────

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
    // Preferencias de UI (no sensibles): localStorage es aceptable aquí
    const stored = JSON.parse(localStorage.getItem('vitsync_settings') || 'null');
    return stored || MOCK_SETTINGS;
};

export const updateSettings = async (data) => {
    await delay(400);
    localStorage.setItem('vitsync_settings', JSON.stringify(data));
    return { success: true };
};

export const changePassword = async (currentPassword, newPassword) => {
    const response = await api.patch(
        `/VitSync-app/api/users/${userId()}/password`, { currentPassword, newPassword });
    return response.data;
};

export const getSessions = async () => {
    const response = await api.get('/api/auth/sessions');
    const list = Array.isArray(response.data) ? response.data : [];
    return list.map(s => ({
        id: s.id,
        device: s.device,
        location: s.ipAddress || '—',
        date: s.lastUsedAt || s.createdAt,
        current: s.current
    }));
};

export const deleteSession = async (id) => {
    await api.delete(`/api/auth/sessions/${id}`);
    return { success: true };
};

/** Cierra todas las sesiones excepto la actual. */
export const closeOtherSessions = async () => {
    const response = await api.post('/api/auth/sessions/revoke-others');
    return response.data;
};

// ─── GESTIÓN DE DATOS (RGPD) ────────────────────────────────────────────────

export const exportUserData = async () => {
    const response = await api.get('/VitSync-app/api/users/me/export');
    return response.data;
};

export const suspendAccount = async () => {
    await api.put('/VitSync-app/api/users/status', {});
    return { success: true };
};

export const deleteAccount = async () => {
    await api.delete(`/VitSync-app/${userId()}`);
    return { success: true };
};

// ─── SALUD (INDICADORES) ─────────────────────────────────────────────────────

export const getSaludResumen = async () => {
    const response = await api.get('/api/salud/resumen');
    return response.data;
};

export const getSaludDetalle = async (categoria) => {
    const response = await api.get(`/api/salud/${categoria}`);
    return response.data;
};

// ─── SEGURIDAD AVANZADA ──────────────────────────────────────────────────────

export const setup2FA = async (enabled) => {
    await api.put(`/VitSync-app/api/users/${userId()}/security/2fa`, { enabled });
    return { success: true, qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VITSYNC-AUTH' };
};

export const getSecurityQuestions = async () => {
    const profile = await getProfile();
    if (!profile.securityQuestion1) return [];
    return [
        { question: profile.securityQuestion1, answer: profile.securityAnswer1 },
        { question: profile.securityQuestion2, answer: profile.securityAnswer2 }
    ];
};

export const saveSecurityQuestions = async (questions) => {
    const payload = {
        q1: questions[0].question, a1: questions[0].answer,
        q2: questions[1].question, a2: questions[1].answer
    };
    await api.post(`/VitSync-app/api/users/${userId()}/security/questions`, payload);
    return { success: true };
};
