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
    const response = await api.get(`/VitSync-app/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

/**
 * Actualiza el perfil. PENDIENTE de endpoint backend (PUT /api/user/profile).
 * Por ahora simula éxito después de 600ms.
 */
export const updateProfile = async (data) => {
    // TODO: cuando el backend implemente PUT /api/user/me, reemplazar esto:
    // const response = await api.put('/api/user/profile', data, { headers: getAuthHeader() });
    // return response.data;
    await delay(600);
    return { success: true, message: 'Perfil actualizado correctamente (mock)' };
};

/**
 * Subir avatar. PENDIENTE de endpoint backend (POST /api/user/avatar).
 */
export const uploadAvatar = async (file) => {
    // TODO: descomentar cuando el backend lo implemente:
    // const formData = new FormData();
    // formData.append('avatar', file);
    // const response = await api.post('/api/user/avatar', formData, {
    //   headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
    // });
    // return response.data;
    await delay(800);
    const previewUrl = URL.createObjectURL(file);
    return { avatarUrl: previewUrl };
};

// ─── INFORMES (MOCK) ──────────────────────────────────────────────────────────

const MOCK_REPORTS = [
    {
        id: 1,
        title: 'Análisis de sangre completo',
        date: '2025-11-15',
        type: 'Laboratorio',
        specialty: 'Medicina General',
        doctor: 'Dr. Javier Crespo',
        status: 'Disponible',
        favorite: false
    },
    {
        id: 2,
        title: 'Electrocardiograma',
        date: '2025-10-03',
        type: 'Diagnóstico',
        specialty: 'Cardiología',
        doctor: 'Dr. Javier Crespo',
        status: 'Revisado',
        favorite: true
    },
    {
        id: 3,
        title: 'Radiografía de tórax',
        date: '2025-08-22',
        type: 'Imagen',
        specialty: 'Traumatología',
        doctor: 'Dr. Pablo Escolano',
        status: 'Disponible',
        favorite: false
    },
    {
        id: 4,
        title: 'Receta - Amoxicilina 500mg',
        date: '2025-07-10',
        type: 'Receta electrónica',
        specialty: 'Pediatría',
        doctor: 'Dr. Carlos Albert',
        status: 'Archivado',
        favorite: false
    }
];

export const getReports = async (filters = {}) => {
    // TODO: reemplazar con llamada real cuando el backend implemente GET /api/user/reports
    await delay(400);
    let reports = [...MOCK_REPORTS];
    if (filters.type) reports = reports.filter(r => r.type === filters.type);
    if (filters.status) reports = reports.filter(r => r.status === filters.status);
    if (filters.search) {
        const q = filters.search.toLowerCase();
        reports = reports.filter(r =>
            r.title.toLowerCase().includes(q) ||
            r.doctor.toLowerCase().includes(q) ||
            r.specialty.toLowerCase().includes(q)
        );
    }
    return reports;
};

export const getReportById = async (id) => {
    await delay(300);
    return MOCK_REPORTS.find(r => r.id === id) || null;
};

// ─── CITAS (MOCK) ─────────────────────────────────────────────────────────────

const MOCK_APPOINTMENTS = [
    {
        id: 1,
        date: '2026-02-25',
        time: '10:30',
        doctor: 'Dr. Javier Crespo',
        specialty: 'Cardiología',
        type: 'Presencial',
        location: 'Consulta 3, Planta 1',
        status: 'Confirmada',
        reason: 'Revisión anual',
        notes: ''
    },
    {
        id: 2,
        date: '2026-03-10',
        time: '16:00',
        doctor: 'Dr. Carlos Albert',
        specialty: 'Pediatría',
        type: 'Telemedicina',
        location: null,
        status: 'Programada',
        reason: 'Consulta seguimiento',
        notes: 'Traer informes anteriores'
    },
    {
        id: 3,
        date: '2025-12-05',
        time: '09:00',
        doctor: 'Dr. Pablo Escolano',
        specialty: 'Traumatología',
        type: 'Presencial',
        location: 'Consulta 7, Planta 2',
        status: 'Completada',
        reason: 'Dolor rodilla',
        notes: 'Se recetó fisioterapia'
    },
    {
        id: 4,
        date: '2025-10-15',
        time: '11:00',
        doctor: 'Dr. Javier Crespo',
        specialty: 'Cardiología',
        type: 'Presencial',
        location: 'Consulta 3, Planta 1',
        status: 'Cancelada',
        reason: 'Chequeo',
        notes: ''
    }
];

export const getAppointments = async (filters = {}) => {
    // TODO: reemplazar con GET /api/user/appointments cuando exista
    await delay(400);
    let appts = [...MOCK_APPOINTMENTS];
    if (filters.status) appts = appts.filter(a => a.status === filters.status);
    if (filters.specialty) appts = appts.filter(a => a.specialty === filters.specialty);
    return appts;
};

export const cancelAppointment = async (id, reason = '') => {
    // TODO: reemplazar con DELETE /api/user/appointments/:id
    await delay(500);
    const appt = MOCK_APPOINTMENTS.find(a => a.id === id);
    if (appt) appt.status = 'Cancelada';
    return { success: true };
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
    // TODO: reemplazar con POST /api/user/change-password
    // Por ahora, simular validación básica
    await delay(700);
    if (!currentPassword || !newPassword) throw new Error('Faltan campos obligatorios');
    return { success: true, message: 'Contraseña actualizada correctamente (mock)' };
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
