import { ref } from 'vue';
import api from '../services/api';

// Estado reactivo de médicos
export const medicos = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// Cargar todos los médicos
export const fetchMedicos = async () => {
    try {
        isLoading.value = true;
        error.value = null;
        const response = await api.get('/api/medicos');
        medicos.value = response.data;
        return response.data;
    } catch (err) {
        console.error('Error cargando médicos:', err);
        error.value = err.message;
        throw err;
    } finally {
        isLoading.value = false;
    }
};

// Crear médico
export const createMedico = async (medicoData) => {
    try {
        const response = await api.post('/api/medicos', medicoData);
        medicos.value.push(response.data);
        return response.data;
    } catch (err) {
        console.error('Error creando médico:', err);
        throw err;
    }
};

// Actualizar médico
export const updateMedico = async (id, medicoData) => {
    try {
        const response = await api.put(`/api/medicos/${id}`, medicoData);
        const index = medicos.value.findIndex(m => m.id === id);
        if (index !== -1) {
            medicos.value[index] = response.data;
        }
        return response.data;
    } catch (err) {
        console.error('Error actualizando médico:', err);
        throw err;
    }
};

// Eliminar médico
export const deleteMedico = async (id) => {
    try {
        await api.delete(`/api/medicos/${id}`);
        medicos.value = medicos.value.filter(m => m.id !== id);
    } catch (err) {
        console.error('Error eliminando médico:', err);
        throw err;
    }
};
