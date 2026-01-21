import { ref } from 'vue';

// URL base de la API (cambiar según entorno)
//export const API_URL = 'https://vitsync-api-production.up.railway.app';
export const API_URL = 'https://vitsync-api-testing.up.railway.app';

// Estado reactivo de autenticación
export const isAuthenticated = ref(localStorage.getItem('token') !== null);
export const currentUser = ref({
    username: localStorage.getItem('username') || null,
    email: localStorage.getItem('email') || null,
    role: localStorage.getItem('role') || null
});

// Función de login
export const login = async (nif, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nif, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
    }

    // Guardar datos en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.nif);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);

    // Actualizar estado reactivo
    isAuthenticated.value = true;
    currentUser.value = {
        nif: data.nif,
        email: data.email,
        role: data.role
    };

    return data;
};

// Función de registro
export const register = async (userData) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
    }

    /* 
    // Comentado para evitar auto-login y forzar verificación
    // Guardar datos en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('nif', data.nif);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);

    // Actualizar estado reactivo
    isAuthenticated.value = true;
    currentUser.value = {
        nif: data.nif,
        email: data.email,
        role: data.role
    };
    */

    return data;
};

// Función de logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nif');
    localStorage.removeItem('email');
    localStorage.removeItem('role');

    isAuthenticated.value = false;
    currentUser.value = {
        nif: null,
        email: null,
        role: null
    };
};

// Obtener token para peticiones autenticadas
export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
