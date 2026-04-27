import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://vitsync-api-testing.onrender.com',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_API_KEY || ''
    }
});

// Interceptor de REQUEST: añadir token JWT
api.interceptors.request.use(request => {
    const token = localStorage.getItem('token');
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
});

// Interceptor de RESPONSE: manejar token expirado o inválido (401)
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Limpiar sesión y redirigir al login
            localStorage.removeItem('token');
            localStorage.removeItem('nif');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            localStorage.removeItem('id');
            // Redirigir al login solo si no estamos ya ahí
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
