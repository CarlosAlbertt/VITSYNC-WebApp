import { ref } from 'vue';
import api from '../services/api';

// ── Estado reactivo ──────────────────────────────────────────────────────────
export const medicos = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// ── Lectura ──────────────────────────────────────────────────────────────────

// Cargar todos los médicos activos (vista pública)
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

// Cargar TODOS los médicos incluyendo inactivos (panel admin)
export const fetchAllMedicos = async () => {
    try {
        isLoading.value = true;
        error.value = null;
        const response = await api.get('/api/medicos/admin');
        medicos.value = response.data;
        return response.data;
    } catch (err) {
        console.error('Error cargando todos los médicos (admin):', err);
        error.value = err.message;
        throw err;
    } finally {
        isLoading.value = false;
    }
};

// ── Escritura ─────────────────────────────────────────────────────────────────

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
        if (index !== -1) medicos.value[index] = response.data;
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

// Activar / desactivar médico
export const toggleActivoMedico = async (id) => {
    try {
        const response = await api.patch(`/api/medicos/${id}/toggle-activo`);
        const index = medicos.value.findIndex(m => m.id === id);
        if (index !== -1) medicos.value[index] = response.data;
        return response.data;
    } catch (err) {
        console.error('Error toggling activo del médico:', err);
        throw err;
    }
};
