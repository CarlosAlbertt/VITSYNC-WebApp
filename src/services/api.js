import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://vitsync-api-testing.onrender.com',
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
