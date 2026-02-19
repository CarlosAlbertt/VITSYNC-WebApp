import { ref, reactive } from 'vue';
import { getProfile, updateProfile as apiUpdateProfile, uploadAvatar as apiUploadAvatar } from '../services/profileService';

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

// ─── Cargar perfil desde el backend ───────────────────────────────────────────
export const loadProfile = async () => {
    isLoading.value = true;
    try {
        const data = await getProfile();
        Object.assign(profileData, data);
    } catch (err) {
        console.error('Error cargando perfil:', err);
        showToast('Error al cargar el perfil', 'error');
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
        avatarUrl.value = result.avatarUrl;
        showToast('Foto de perfil actualizada');
    } catch (err) {
        showToast('Error al subir la foto', 'error');
    }
};
