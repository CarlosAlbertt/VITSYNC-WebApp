import { ref, reactive } from 'vue';
import { getProfile, updateProfile as apiUpdateProfile, uploadAvatar as apiUploadAvatar } from '../services/profileService';
import api from '../services/api';

// ─── Estado ────────────────────────────────────────────────────────────────────
export const activeSection = ref('general'); // general | informes | citas | configuracion
export const profileData = reactive({});
export const isLoading = ref(false);
export const avatarUrl = ref(null);

// Toast
export const toast = reactive({ visible: false, message: '', type: 'success' });

// ─── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer = null;
export const showToast = (message, type = 'success') => {
    if (toastTimer) clearTimeout(toastTimer);
    toast.visible = true;
    toast.message = message;
    toast.type = type;
    toastTimer = setTimeout(() => { toast.visible = false; }, 4000);
};

// ─── Navegación ────────────────────────────────────────────────────────────────
export const setSection = (section) => {
    activeSection.value = section;
};

// ─── Resetear store al hacer logout ───────────────────────────────────────────
export const resetProfile = () => {
    Object.keys(profileData).forEach(k => delete profileData[k]);
    avatarUrl.value = null;
    activeSection.value = 'general';
};

// ─── Cargar perfil desde el backend ───────────────────────────────────────────
export const loadProfile = async () => {
    isLoading.value = true;
    try {
        const data = await getProfile();
        Object.assign(profileData, data);
        let avatar = data.avatarUrl || null;
        if (avatar && avatar.startsWith('/')) {
            const url = new URL(api.defaults.baseURL);
            avatar = url.origin + avatar;
        }
        avatarUrl.value = avatar;
    } catch (err) {
        console.error('Error cargando perfil:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
            // Si el token es inválido o no hay permisos, hacer logout y redirigir
            localStorage.removeItem('token');
            localStorage.removeItem('nif');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            localStorage.removeItem('id');
            window.location.href = '/login';
        } else {
            showToast('Error al cargar el perfil', 'error');
        }
    } finally {
        isLoading.value = false;
    }
};

// ─── Guardar perfil ────────────────────────────────────────────────────────────
export const saveProfile = async (updatedData) => {
    isLoading.value = true;
    try {
        await apiUpdateProfile(updatedData);
        Object.assign(profileData, updatedData);
        showToast('Perfil actualizado correctamente');
    } catch (err) {
        showToast('Error al actualizar el perfil', 'error');
        throw err;
    } finally {
        isLoading.value = false;
    }
};

// ─── Subir avatar ──────────────────────────────────────────────────────────────
export const uploadAvatar = async (file) => {
    try {
        const result = await apiUploadAvatar(file);
        let avatar = result.avatarUrl;
        if (avatar && avatar.startsWith('/')) {
            const url = new URL(api.defaults.baseURL);
            avatar = url.origin + avatar;
        }
        avatarUrl.value = avatar;
        showToast('Foto de perfil actualizada');
    } catch (err) {
        showToast('Error al subir la foto', 'error');
    }
};
