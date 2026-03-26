import { ref } from 'vue';
import api from '../services/api';

// ── Estado reactivo ──────────────────────────────────────────────────────────
export const usuarios = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// ── Lectura ──────────────────────────────────────────────────────────────────

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

// ── Escritura ─────────────────────────────────────────────────────────────────

// Actualizar usuario
// Nota: los usuarios se crean mediante POST /api/auth/register, no desde este panel
export const updateUsuario = async (id, userData) => {
    try {
        const response = await api.put(`/api/usuarios/${id}`, userData);
        const index = usuarios.value.findIndex(u => u.id === id);
        if (index !== -1) usuarios.value[index] = response.data;
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

// Marcar usuario como verificado / no verificado
export const setVerificado = async (id, verified) => {
    try {
        const response = await api.patch(`/api/usuarios/${id}/verificar`, null, {
            params: { verified }
        });
        const index = usuarios.value.findIndex(u => u.id === id);
        if (index !== -1) usuarios.value[index] = response.data;
        return response.data;
    } catch (err) {
        console.error('Error verificando usuario:', err);
        throw err;
    }
};
