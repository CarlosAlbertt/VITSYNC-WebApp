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

// Resuelve la URL del avatar. /uploads está protegido y un <img> no envía el
// token Bearer, así que descargamos el recurso con `api` (que sí lo adjunta) y
// lo servimos como blob URL. Una URL absoluta (almacenamiento externo) se usa
// tal cual. Si falla (404 por almacenamiento efímero, etc.) devolvemos null y
// el componente muestra las iniciales.
let lastAvatarBlobUrl = null;
const resolveAvatar = async (rawPath) => {
    if (lastAvatarBlobUrl) { URL.revokeObjectURL(lastAvatarBlobUrl); lastAvatarBlobUrl = null; }
    if (!rawPath) return null;
    if (/^https?:\/\//i.test(rawPath)) return rawPath;
    try {
        const res = await api.get(rawPath, { responseType: 'blob' });
        lastAvatarBlobUrl = URL.createObjectURL(res.data);
        return lastAvatarBlobUrl;
    } catch (err) {
        console.warn('No se pudo cargar el avatar:', err.response?.status);
        return null;
    }
};

// ─── Cargar perfil desde el backend ───────────────────────────────────────────
export const loadProfile = async () => {
    isLoading.value = true;
    try {
        const data = await getProfile();
        Object.assign(profileData, data);
        avatarUrl.value = await resolveAvatar(data.avatarUrl);
    } catch (err) {
        // Los 401 los gestiona el interceptor de api.js (refresh + retry o
        // redirect a login): aquí solo informamos del resto de errores
        if (err.response?.status !== 401) {
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
        showToast(extractError(err) || 'Error al actualizar el perfil', 'error');
        throw err;
    } finally {
        isLoading.value = false;
    }
};

// ─── Subir avatar ──────────────────────────────────────────────────────────────
export const uploadAvatar = async (file) => {
    try {
        const result = await apiUploadAvatar(file);
        avatarUrl.value = await resolveAvatar(result.avatarUrl);
        showToast('Foto de perfil actualizada');
    } catch (err) {
        showToast(extractError(err) || 'Error al subir la foto', 'error');
        throw err;
    }
};

// Extrae un mensaje útil de un error de axios (message o primer fieldError),
// para no ocultar la causa real (p. ej. validación 400 del backend) tras un
// "Error" genérico.
function extractError(err) {
    const data = err?.response?.data;
    if (!data) return null;
    if (data.message) return data.message;
    if (data.fieldErrors) {
        const first = Object.values(data.fieldErrors)[0];
        if (first) return first;
    }
    return null;
}
