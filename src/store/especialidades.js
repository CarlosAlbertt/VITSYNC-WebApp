import { ref } from 'vue';
import { API_URL } from './auth';

// Estado reactivo de especialidades
export const especialidades = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// Cargar todas las especialidades
export const fetchEspecialidades = async () => {
    try {
        isLoading.value = true;
        error.value = null;

        const response = await fetch(`${API_URL}/api/especialidades`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar las especialidades');
        }

        const data = await response.json();
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
        const response = await fetch(`${API_URL}/api/especialidades/${id}`);

        if (!response.ok) {
            throw new Error('Especialidad no encontrada');
        }

        return await response.json();

    } catch (err) {
        console.error('Error buscando especialidad:', err);
        throw err;
    }
};

// Buscar especialidad por slug
export const fetchEspecialidadBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_URL}/api/especialidades/slug/${slug}`);

        if (!response.ok) {
            throw new Error('Especialidad no encontrada');
        }

        return await response.json();

    } catch (err) {
        console.error('Error buscando especialidad:', err);
        throw err;
    }
};

// Filtrar por tipo
export const fetchEspecialidadesByTipo = async (tipo) => {
    try {
        const response = await fetch(`${API_URL}/api/especialidades/tipo/${tipo}`);

        if (!response.ok) {
            throw new Error('Error al filtrar especialidades');
        }

        return await response.json();

    } catch (err) {
        console.error('Error filtrando especialidades:', err);
        throw err;
    }
};
