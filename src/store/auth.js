import { ref } from 'vue';
import api from '../services/api';

// Estado reactivo de autenticación
export const isAuthenticated = ref(localStorage.getItem('token') !== null);
export const currentUser = ref({
    username: localStorage.getItem('username') || null,
    email: localStorage.getItem('email') || null,
    role: localStorage.getItem('role') || null,
    id: localStorage.getItem('id') || null
});

// Función de login
export const login = async (nif, password) => {
    try {
        const response = await api.post('/api/auth/login', { nif, password });
        const data = response.data;

        // Guardar datos en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.nif);
        localStorage.setItem('email', data.email);
        localStorage.setItem('role', data.role);
        localStorage.setItem('id', data.id);

        // Actualizar estado reactivo
        isAuthenticated.value = true;
        currentUser.value = {
            nif: data.nif,
            email: data.email,
            role: data.role,
            id: data.id
        };

        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
    }
};

// Función de registro
export const register = async (userData) => {
    try {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en el registro');
    }
};



// Función de logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nif');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('id');

    isAuthenticated.value = false;
    currentUser.value = {
        nif: null,
        email: null,
        role: null,
        id: null
    };
};

// Obtener token para peticiones autenticadas
export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
