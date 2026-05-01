import { ref } from 'vue';
import api from '../services/api';

// Ya no necesitamos la ruta de hospitales aquí, está en hospitales.js

// ─── Estado reactivo compartido de citas del usuario ──────────────────────────
// Este array es la fuente de verdad para las citas del usuario en toda la app.
// Se usa tanto en el booking como en el perfil (CitasSection).
const MOCK_SEED = [
    {
        id: 1,
        date: '2026-06-25',
        time: '10:30',
        doctor: 'Dr. Javier Crespo',
        medicoId: 6,
        specialty: 'Cardiología',
        type: 'Presencial',
        location: 'Consulta 3, Planta 1',
        status: 'Confirmada',
        reason: 'Revisión anual',
        notes: ''
    },
    {
        id: 2,
        date: '2026-07-10',
        time: '16:00',
        doctor: 'Dr. Carlos Albert',
        medicoId: 3,
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
        medicoId: 10,
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
        medicoId: 6,
        specialty: 'Cardiología',
        type: 'Presencial',
        location: 'Consulta 3, Planta 1',
        status: 'Cancelada',
        reason: 'Chequeo',
        notes: ''
    }
];

export const citasUsuario = ref([...MOCK_SEED]);
export const citasLoading = ref(false);

/**
 * Carga las citas del usuario desde el backend.
 * Si falla (endpoint no implementado), mantiene los datos locales/mock.
 */
export const loadCitasUsuario = async () => {
    citasLoading.value = true;
    try {
        const response = await api.get('/api/citas');
        citasUsuario.value = response.data;
    } catch (error) {
        console.warn('No se pudieron cargar citas del backend, usando datos locales:', error.message);
        // Mantener datos locales/mock
    } finally {
        citasLoading.value = false;
    }
};

/**
 * Transforma los datos del booking al formato que espera AppointmentCard
 * y lo añade al array reactivo compartido.
 */
export const addCitaLocal = (bookingData) => {
    const nuevaCita = {
        id: Date.now(), // ID temporal hasta que el backend devuelva uno real
        date: bookingData.date instanceof Date
            ? bookingData.date.toISOString().split('T')[0]
            : bookingData.date,
        time: bookingData.time,
        doctor: bookingData.doctor?.name
            ? (bookingData.doctor.id === 'any' ? bookingData.doctor.name : `Dr. ${bookingData.doctor.name}`)
            : 'Sin asignar',
        medicoId: bookingData.doctor?.id !== 'any' ? bookingData.doctor?.id : null,
        specialty: typeof bookingData.specialty === 'string'
            ? bookingData.specialty
            : bookingData.specialty?.nombre || bookingData.specialty?.name || 'Sin especialidad',
        type: 'Presencial',
        location: bookingData.location?.name || null,
        status: 'Programada',
        reason: bookingData.reason || '',
        notes: ''
    };
    citasUsuario.value.unshift(nuevaCita);
    return nuevaCita;
};

// ─── Funciones de API ─────────────────────────────────────────────────────────

// Obtener Médicos por Especialidad (usa el ID si disponible, si no el nombre)
export const getMedicosByEspecialidad = async (especialidad) => {
  try {
    // Si recibimos un objeto con ID, usar el endpoint por ID (ya existe en producción)
    if (especialidad && typeof especialidad === 'object' && especialidad.id) {
      const response = await api.get(`/api/medicos/especialidad/${especialidad.id}`);
      return response.data;
    }
    // Fallback: buscar por nombre via query param
    const response = await api.get('/api/medicos', { params: { especialidad } });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los médicos:", error);
    return [];
  }
};

// Obtener Horarios Disponibles
export const fetchHorariosDisponibles = async (medicoId, fecha) => {
  try {
    const response = await api.get('/api/horarios', { params: { medicoId, fecha } });
    return response.data;
  } catch (error) {
    console.error("Error al obtener horarios:", error);
    return []; // Devolvemos un array vacío en caso de error
  }
};

export const crearCita = async (datosCita) => {
  try {
    // El token ya se inyecta automáticamente gracias a tu interceptor en api.js
    const response = await api.post('/api/citas', datosCita);
    // Tras POST exitoso, añadir la cita al store compartido
    addCitaLocal(datosCita);
    return { success: true, message: 'Cita reservada con éxito', data: response.data };
  } catch (error) {
    console.error("Error al agendar la cita:", error);
    // Aun si falla el backend, guardamos localmente para demo/mock
    addCitaLocal(datosCita);
    return { success: true, message: 'Cita guardada localmente' };
  }
};