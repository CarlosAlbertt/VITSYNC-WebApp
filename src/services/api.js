import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para debugging (opcional)
api.interceptors.request.use(request => {
    // console.log('Starting Request', request)
    return request
})

export default api;
