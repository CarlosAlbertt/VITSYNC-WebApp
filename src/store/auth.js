import { ref } from 'vue';

export const isAuthenticated = ref(localStorage.getItem('token') !== null);

export const login = (token) => {
    localStorage.setItem('token', token);
    isAuthenticated.value = true;
};

export const logout = () => {
    localStorage.removeItem('token');
    isAuthenticated.value = false;
};
