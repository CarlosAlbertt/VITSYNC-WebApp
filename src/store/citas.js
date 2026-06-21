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
        id: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
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
  // Normaliza el payload al contrato del backend (CitaRequest): specialty es un
  // String, no un objeto. Enviar el objeto especialidad provocaba un 400 (Jackson
  // no puede mapear objeto → String) y la cita NO se guardaba, por lo que nunca
  // aparecía en "Mis Citas".
  const especialidadNombre = datosCita.specialtyName
    || (typeof datosCita.specialty === 'string'
      ? datosCita.specialty
      : (datosCita.specialty?.nombre || datosCita.specialty?.name || ''));

  const fecha = datosCita.date instanceof Date
    ? datosCita.date.toISOString().split('T')[0]
    : (typeof datosCita.date === 'string' ? datosCita.date.substring(0, 10) : datosCita.date);

  const payload = {
    specialty: especialidadNombre,
    doctor: datosCita.doctor
      ? { id: datosCita.doctor.id ?? 'any', name: datosCita.doctor.name ?? '' }
      : null,
    location: datosCita.location ? { name: datosCita.location.name ?? '' } : null,
    date: fecha,
    time: datosCita.time,
    reason: datosCita.reason || ''
  };

  try {
    const response = await api.post('/api/citas', payload);
    addCitaLocal(datosCita);
    return { success: true, message: 'Cita reservada con éxito', data: response.data };
  } catch (error) {
    console.error("Error al agendar la cita:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'No se pudo agendar la cita. Intenta de nuevo.',
      error
    };
  }
};