import { ref } from 'vue';
import api from '../services/api';

// Ya no necesitamos la ruta de hospitales aquí, está en hospitales.js

// Obtener Médicos por Especialidad
export const getMedicosByEspecialidad = async (especialidad) => {
  try {
    const response = await api.get('/api/medicos', { params: { especialidad } });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los médicos:", error);
    return []; // Devolvemos un array vacío en caso de error
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
    return { success: true, message: 'Cita reservada con éxito', data: response.data };
  } catch (error) {
    console.error("Error al agendar la cita:", error);
    throw new Error('No se puede procesar la cita');
  }
};