import { ref } from 'vue';
import api from '../services/api';

export const enfermedades = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// ── Lectura pública ──────────────────────────────────────────────────────────

export const fetchEnfermedades = async () => {
    try {
        isLoading.value = true;
        error.value = null;
        const response = await api.get('/api/enfermedades');
        enfermedades.value = response.data;
        return response.data;
    } catch (err) {
        console.error('Error cargando enfermedades:', err);
        error.value = err.message;
        throw err;
    } finally {
        isLoading.value = false;
    }
};

export const fetchEnfermedadById = async (id) => {
    try {
        const response = await api.get(`/api/enfermedades/${id}`);
        return response.data;
    } catch (err) {
        console.error('Error buscando enfermedad:', err);
        throw err;
    }
};

// ── Admin ────────────────────────────────────────────────────────────────────

export const fetchAllEnfermedades = async () => {
    try {
        isLoading.value = true;
        error.value = null;
        const response = await api.get('/api/enfermedades/admin');
        enfermedades.value = response.data;
        return response.data;
    } catch (err) {
        console.error('Error cargando todas las enfermedades:', err);
        error.value = err.message;
        throw err;
    } finally {
        isLoading.value = false;
    }
};

export const createEnfermedad = async (data) => {
    try {
        const response = await api.post('/api/enfermedades', data);
        enfermedades.value.push(response.data);
        return response.data;
    } catch (err) {
        console.error('Error creando enfermedad:', err);
        throw err;
    }
};

export const updateEnfermedad = async (id, data) => {
    try {
        const response = await api.put(`/api/enfermedades/${id}`, data);
        const index = enfermedades.value.findIndex(e => e.id === id);
        if (index !== -1) enfermedades.value[index] = response.data;
        return response.data;
    } catch (err) {
        console.error('Error actualizando enfermedad:', err);
        throw err;
    }
};

export const deleteEnfermedad = async (id) => {
    try {
        await api.delete(`/api/enfermedades/${id}`);
        enfermedades.value = enfermedades.value.filter(e => e.id !== id);
    } catch (err) {
        console.error('Error eliminando enfermedad:', err);
        throw err;
    }
};

export const toggleActivo = async (id) => {
    try {
        const response = await api.patch(`/api/enfermedades/${id}/toggle-activo`);
        const index = enfermedades.value.findIndex(e => e.id === id);
        if (index !== -1) enfermedades.value[index] = response.data;
        return response.data;
    } catch (err) {
        console.error('Error toggling activo:', err);
        throw err;
    }
};
