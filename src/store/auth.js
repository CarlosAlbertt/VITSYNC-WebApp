import { ref } from 'vue';

// URL base de la API
export const API_URL = 'https://vitsync-api.vercel.app';

// Estado reactivo de autenticación
export const isAuthenticated = ref(localStorage.getItem('token') !== null);
export const currentUser = ref({
    username: localStorage.getItem('username') || null,
    email: localStorage.getItem('email') || null,
    role: localStorage.getItem('role') || null
});

// Función de login
export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
    }

    // Guardar datos en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);

    // Actualizar estado reactivo
    isAuthenticated.value = true;
    currentUser.value = {
        username: data.username,
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

    // Guardar datos en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);

    // Actualizar estado reactivo
    isAuthenticated.value = true;
    currentUser.value = {
        username: data.username,
        email: data.email,
        role: data.role
    };

    return data;
};

// Función de logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');

    isAuthenticated.value = false;
    currentUser.value = {
        username: null,
        email: null,
        role: null
    };
};

// Obtener token para peticiones autenticadas
export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
