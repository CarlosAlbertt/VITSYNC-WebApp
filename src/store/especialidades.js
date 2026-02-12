import { ref } from 'vue';
import api from '../services/api';

// Estado reactivo de especialidades
export const especialidades = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// Cargar todas las especialidades
export const fetchEspecialidades = async () => {
    try {
        isLoading.value = true;
        error.value = null;

        const response = await api.get('/api/especialidades');
        const data = response.data;
        especialidades.value = data;
        return data;

    } catch (err) {
        console.error('Error cargando especialidades:', err);
        error.value = err.message;
        throw err;
    } finally {
        isLoading.value = false;
    }
};

// Buscar especialidad por ID
export const fetchEspecialidadById = async (id) => {
    try {
        const response = await api.get(`/api/especialidades/${id}`);
        return response.data;

    } catch (err) {
        console.error('Error buscando especialidad:', err);
        throw err;
    }
};

// Buscar especialidad por slug
export const fetchEspecialidadBySlug = async (slug) => {
    try {
        const response = await api.get(`/api/especialidades/slug/${slug}`);
        return response.data;

    } catch (err) {
        console.error('Error buscando especialidad:', err);
        throw err;
    }
};

// Filtrar por tipo
export const fetchEspecialidadesByTipo = async (tipo) => {
    try {
        const response = await api.get(`/api/especialidades/tipo/${tipo}`);
        return response.data;

    } catch (err) {
        console.error('Error filtrando especialidades:', err);
        throw err;
    }
};
// Crear especialidad
export const createEspecialidad = async (data) => {
    try {
        const response = await api.post('/api/especialidades', data);
        especialidades.value.push(response.data);
        return response.data;
    } catch (err) {
        console.error('Error creando especialidad:', err);
        throw err;
    }
};

// Actualizar especialidad
export const updateEspecialidad = async (id, data) => {
    try {
        const response = await api.put(`/api/especialidades/${id}`, data);
        const index = especialidades.value.findIndex(s => s.id === id);
        if (index !== -1) {
            especialidades.value[index] = response.data;
        }
        return response.data;
    } catch (err) {
        console.error('Error actualizando especialidad:', err);
        throw err;
    }
};

// Eliminar especialidad
export const deleteEspecialidad = async (id) => {
    try {
        await api.delete(`/api/especialidades/${id}`);
        especialidades.value = especialidades.value.filter(s => s.id !== id);
    } catch (err) {
        console.error('Error eliminando especialidad:', err);
        throw err;
    }
};
