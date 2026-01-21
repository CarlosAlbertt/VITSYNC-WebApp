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
