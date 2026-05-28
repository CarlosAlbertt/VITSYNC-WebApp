import api from './api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── PERFIL GENERAL ───────────────────────────────────────────────────────────

export const getProfile = async () => {
    const id = localStorage.getItem('id');
    try {
        const response = await api.get(`/VitSync-app/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (err) {
        console.error('[getProfile] Error obteniendo perfil:', err.response?.status, err.response?.data);
        throw err;
    }
};

export const updateProfile = async (data) => {
    const id = localStorage.getItem('id');
    try {
        const response = await api.put(`/VitSync-app/api/users/${id}/profile`, data, { headers: getAuthHeader() });
        return response.data;
    } catch (err) {
        console.error('[updateProfile] status:', err.response?.status, '| data:', err.response?.data);
        throw err;
    }
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/avatar', formData, { headers: { 'Content-Type': undefined } });
    const avatarUrl = response.data.url;
    const id = localStorage.getItem('id');
    if (id) {
        await api.patch(`/VitSync-app/api/users/${id}/avatar`, { avatarUrl }, { headers: getAuthHeader() });
    }
    return { avatarUrl };
};

// ─── INFORMES ──────────────────────────────────────────────────────────

const MOCK_REPORTS = [
    { id: 1, title: 'Analítica General', type: 'Laboratorio', specialty: 'Medicina Interna', doctor: 'Dr. Javier Crespo', date: '2026-04-10', status: 'Disponible', notes: '', favorite: false },
    { id: 2, title: 'Electrocardiograma en reposo', type: 'Diagnóstico', specialty: 'Cardiología', doctor: 'Dr. Javier Crespo', date: '2026-03-22', status: 'Disponible', notes: '', favorite: true },
    { id: 3, title: 'Radiografía de tórax', type: 'Imagen', specialty: 'Neumología', doctor: 'Dr. Pablo Escolano', date: '2026-02-15', status: 'Disponible', notes: '', favorite: false },
    { id: 4, title: 'Consulta seguimiento tensión', type: 'Consulta', specialty: 'Cardiología', doctor: 'Dr. Javier Crespo', date: '2026-01-08', status: 'Disponible', notes: 'Revisión en 3 meses', favorite: false },
    { id: 5, title: 'Receta antihipertensivos', type: 'Receta electrónica', specialty: 'Medicina Interna', doctor: 'Dr. Carlos Albert', date: '2025-12-20', status: 'Disponible', notes: '', favorite: false },
];

export const getReports = async (filters = {}) => {
    let reports = [];
    try {
        const response = await api.get('/api/informes/me', { headers: getAuthHeader() });
        const raw = response.data;
        reports = Array.isArray(raw) ? raw : (raw?.content ?? raw?.data ?? raw?.informes ?? []);
        if (!reports.length) reports = [...MOCK_REPORTS];
    } catch {
        reports = [...MOCK_REPORTS];
    }
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
    const response = await api.get(`/api/informes/${id}/pdf`, { headers: getAuthHeader(), responseType: 'blob' });
    return response.data;
};

// ─── CITAS ─────────────────────────────────────────────────────────────

const MOCK_APPOINTMENTS = [
    { id: 1, date: '2026-06-25', time: '10:30', doctor: 'Dr. Javier Crespo', medicoId: 6, specialty: 'Cardiología', type: 'Presencial', location: 'Consulta 3, Planta 1', status: 'Confirmada', reason: 'Revisión anual', notes: '' },
    { id: 2, date: '2026-07-10', time: '16:00', doctor: 'Dr. Carlos Albert', medicoId: 3, specialty: 'Pediatría', type: 'Telemedicina', location: null, status: 'Programada', reason: 'Consulta seguimiento', notes: 'Traer informes anteriores' },
    { id: 3, date: '2025-12-05', time: '09:00', doctor: 'Dr. Pablo Escolano', medicoId: 2, specialty: 'Neumología', type: 'Presencial', location: 'Consulta 1, Planta 2', status: 'Completada', reason: 'Espirometría', notes: '' },
    { id: 4, date: '2025-10-18', time: '11:15', doctor: 'Dr. Javier Crespo', medicoId: 6, specialty: 'Cardiología', type: 'Presencial', location: 'Consulta 3, Planta 1', status: 'Completada', reason: 'Control tensión arterial', notes: '' },
];

export const getAppointments = async (filters = {}) => {
    let appts = [];
    try {
        const response = await api.get('/api/citas/me', { headers: getAuthHeader() });
        const raw = response.data;
        appts = Array.isArray(raw) ? raw : (raw?.content ?? raw?.data ?? raw?.citas ?? []);
        if (!appts.length) appts = [...MOCK_APPOINTMENTS];
    } catch {
        appts = [...MOCK_APPOINTMENTS];
    }
    if (filters.status) appts = appts.filter(a => a.status === filters.status);
    if (filters.specialty) appts = appts.filter(a => a.specialty === filters.specialty);
    return appts;
};

export const cancelAppointment = async (id, reason = '') => {
    await api.put(`/api/citas/${id}/cancel`, {}, { headers: getAuthHeader() });
    return { success: true };
};

export const uploadAppointmentDoc = async (appointmentId, file) => {
    await delay(500);
    const docUrl = URL.createObjectURL(file);
    return { success: true, url: docUrl };
};

// ─── CONFIGURACIÓN (MOCK) ─────────────────────────────────────────────────────

const MOCK_SETTINGS = {
    notifications: { emailAppointments: true, emailReports: true, emailMessages: false, pushReminders: true, pushAlerts: true, reminderTime: '24h' },
    preferences: { language: 'es', timezone: 'Europe/Madrid', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', theme: 'auto', fontSize: 'medium', highContrast: false },
    privacy: { profileVisible: true, shareData: false }
};

export const getSettings = async () => {
    await delay(300);
    const stored = JSON.parse(localStorage.getItem('vitsync_settings') || 'null');
    return stored || MOCK_SETTINGS;
};

export const updateSettings = async (data) => {
    await delay(400);
    localStorage.setItem('vitsync_settings', JSON.stringify(data));
    return { success: true };
};

export const changePassword = async (currentPassword, newPassword) => {
    const id = localStorage.getItem('id');
    const response = await api.patch(`/VitSync-app/api/users/${id}/password`, { currentPassword, newPassword }, { headers: getAuthHeader() });
    return response.data;
};

export const getSessions = async () => {
    await delay(300);
    return [
        { id: 1, device: 'Chrome · Windows', location: 'Madrid, ES', date: '2026-02-19T10:00:00', current: true },
        { id: 2, device: 'Safari · iPhone', location: 'Valencia, ES', date: '2026-02-18T18:30:00', current: false }
    ];
};

export const deleteSession = async (id) => {
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
    const profile = await getProfile();
    if (!profile.securityQuestion1) return [];
    return [
        { question: profile.securityQuestion1, answer: profile.securityAnswer1 },
        { question: profile.securityQuestion2, answer: profile.securityAnswer2 }
    ];
};

export const saveSecurityQuestions = async (questions) => {
    const id = localStorage.getItem('id');
    const payload = { q1: questions[0].question, a1: questions[0].answer, q2: questions[1].question, a2: questions[1].answer };
    await api.post(`/VitSync-app/api/users/${id}/security/questions`, payload, { headers: getAuthHeader() });
    return { success: true };
};
