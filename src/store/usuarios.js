import { ref } from 'vue';
import api from '../services/api';

// Estado reactivo de usuarios
export const usuarios = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// Cargar todos los usuarios
export const fetchUsuarios = async () => {
    try {
        isLoading.value = true;
        error.value = null;
        const response = await api.get('/api/usuarios');
        usuarios.value = response.data;
        return response.data;
    } catch (err) {
        console.error('Error cargando usuarios:', err);
        error.value = err.message;
        throw err;
    } finally {
        isLoading.value = false;
    }
};

// Crear usuario
export const createUsuario = async (userData) => {
    try {
        const response = await api.post('/api/usuarios', userData);
        usuarios.value.push(response.data);
        return response.data;
    } catch (err) {
        console.error('Error creando usuario:', err);
        throw err;
    }
};

// Actualizar usuario
export const updateUsuario = async (id, userData) => {
    try {
        const response = await api.put(`/api/usuarios/${id}`, userData);
        const index = usuarios.value.findIndex(u => u.id === id);
        if (index !== -1) {
            usuarios.value[index] = response.data;
        }
        return response.data;
    } catch (err) {
        console.error('Error actualizando usuario:', err);
        throw err;
    }
};

// Eliminar usuario
export const deleteUsuario = async (id) => {
    try {
        await api.delete(`/api/usuarios/${id}`);
        usuarios.value = usuarios.value.filter(u => u.id !== id);
    } catch (err) {
        console.error('Error eliminando usuario:', err);
        throw err;
    }
};
