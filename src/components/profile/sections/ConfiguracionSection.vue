<template>
  <div>
    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5">Configuración</h2>

    <!-- Subsección tabs -->
    <div class="flex gap-1 mb-6 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
      <button
        v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap"
        :class="activeTab === tab.id
          ? 'border-teal-600 text-teal-700 dark:text-teal-400'
          : 'border-transparent text-gray-500 hover:text-teal-600 dark:text-gray-400'"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <LoadingSpinner v-if="loading" size="lg" class="my-10" />

    <div v-else>

      <!-- ── SEGURIDAD ── -->
      <template v-if="activeTab === 'security'">
        <InfoCard title="Cambiar Contraseña">
          <div class="space-y-3 max-w-sm">
            <EditableField label="Contraseña actual" v-model="pwForm.current" type="password" :editing="true" />
            <EditableField label="Nueva contraseña" v-model="pwForm.newPw" type="password" :editing="true" :error="pwErrors.newPw" />
            <EditableField label="Confirmar nueva contraseña" v-model="pwForm.confirm" type="password" :editing="true" :error="pwErrors.confirm" />
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Mínimo 8 caracteres, una mayúscula, un número y un símbolo.
            </div>
            <button
              @click="handleChangePassword"
              :disabled="changingPw"
              class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              <span v-if="changingPw">Actualizando...</span>
              <span v-else>Actualizar contraseña</span>
            </button>
          </div>
        </InfoCard>

        <InfoCard title="Sesiones Activas">
          <LoadingSpinner v-if="loadingSessions" size="sm" class="my-4" />
          <div v-else class="space-y-3">
            <div
              v-for="session in sessions" :key="session.id"
              class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {{ session.device }}
                  <span v-if="session.current" class="ml-2 text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-1.5 py-0.5 rounded-full">Actual</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ session.location }} · {{ formatDate(session.date) }}</p>
              </div>
              <button
                v-if="!session.current"
                @click="doDeleteSession(session.id)"
                class="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Cerrar
              </button>
            </div>
          </div>
        </InfoCard>
      </template>

      <!-- ── NOTIFICACIONES ── -->
      <template v-else-if="activeTab === 'notifications'">
        <InfoCard title="Notificaciones por Email">
          <SettingsToggle label="Recordatorios de citas" description="Recibe un email antes de cada cita" v-model="settings.notifications.emailAppointments" @update:modelValue="saveSettings" />
          <SettingsToggle label="Nuevos informes disponibles" v-model="settings.notifications.emailReports" @update:modelValue="saveSettings" />
          <SettingsToggle label="Mensajes de médicos" v-model="settings.notifications.emailMessages" @update:modelValue="saveSettings" />
        </InfoCard>

        <InfoCard title="Notificaciones Push">
          <SettingsToggle label="Recordatorios de próximas citas" v-model="settings.notifications.pushReminders" @update:modelValue="saveSettings" />
          <SettingsToggle label="Alertas importantes" v-model="settings.notifications.pushAlerts" @update:modelValue="saveSettings" />
        </InfoCard>

        <InfoCard title="Frecuencia de recordatorios">
          <div class="space-y-2 pt-1">
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Recordatorio antes de la cita</label>
            <div class="flex gap-3 flex-wrap">
              <label v-for="opt in reminderOptions" :key="opt.value" class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="settings.notifications.reminderTime" :value="opt.value" class="text-teal-600" @change="saveSettings" />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ opt.label }}</span>
              </label>
            </div>
          </div>
        </InfoCard>
      </template>

      <!-- ── PREFERENCIAS ── -->
      <template v-else-if="activeTab === 'preferences'">
        <InfoCard title="Interfaz"  >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Idioma</label>
              <select v-model="settings.preferences.language" @change="saveSettings" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Formato de fecha</label>
              <select v-model="settings.preferences.dateFormat" @change="saveSettings" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Formato de hora</label>
              <select v-model="settings.preferences.timeFormat" @change="saveSettings" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="24h">24 horas</option>
                <option value="12h">12 horas (AM/PM)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Tema</label>
              <select v-model="settings.preferences.theme" @change="applyTheme" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="auto">Automático (sistema)</option>
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>
          </div>
          <div class="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
            <SettingsToggle label="Modo de alto contraste" description="Mejora la visibilidad de los elementos" v-model="settings.preferences.highContrast" @update:modelValue="saveSettings" />
          </div>
        </InfoCard>
      </template>

      <!-- ── PRIVACIDAD ── -->
      <template v-else-if="activeTab === 'privacy'">
        <InfoCard title="Visibilidad y privacidad">
          <SettingsToggle label="Perfil visible para médicos" description="Los profesionales pueden ver tu información básica" v-model="settings.privacy.profileVisible" @update:modelValue="saveSettings" />
          <SettingsToggle label="Compartir datos con especialistas" description="Permite el acceso anónimo a datos para investigación" v-model="settings.privacy.shareData" @update:modelValue="saveSettings" />
        </InfoCard>

        <InfoCard title="Gestión de datos">
          <div class="space-y-3 pt-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Descargar mis datos</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Exporta toda tu información en formato JSON</p>
              </div>
              <button @click="exportData" class="px-4 py-2 text-sm border border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors font-medium">
                Exportar
              </button>
            </div>
            <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
              <div>
                <p class="text-sm font-medium text-red-600 dark:text-red-400">Solicitar eliminación de datos (RGPD)</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Se procesará en un plazo de 30 días</p>
              </div>
              <button @click="showDeleteModal = true" class="px-4 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium">
                Solicitar
              </button>
            </div>
          </div>
        </InfoCard>

        <ConfirmModal
          v-model="showDeleteModal"
          title="Solicitar eliminación de datos"
          message="Esta acción enviará una solicitud RGPD para eliminar todos tus datos. Se procesará en un plazo máximo de 30 días. ¿Deseas continuar?"
          confirm-text="Enviar solicitud"
          variant="danger"
          @confirm="requestDataDeletion"
        />
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import InfoCard from '../InfoCard.vue';
import EditableField from '../EditableField.vue';
import SettingsToggle from '../SettingsToggle.vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import ConfirmModal from '../ConfirmModal.vue';
import { getSettings, updateSettings, changePassword, getSessions, deleteSession } from '../../../services/profileService';
import { showToast } from '../../../store/profile';

const loading = ref(false);
const loadingSessions = ref(false);
const activeTab = ref('security');
const changingPw = ref(false);
const showDeleteModal = ref(false);
const sessions = ref([]);

const tabs = [
  { id: 'security',      label: 'Seguridad' },
  { id: 'notifications', label: 'Notificaciones' },
  { id: 'preferences',   label: 'Preferencias' },
  { id: 'privacy',       label: 'Privacidad' }
];

const reminderOptions = [
  { value: '24h', label: '24 horas antes' },
  { value: '1h',  label: '1 hora antes' }
];

const pwForm = reactive({ current: '', newPw: '', confirm: '' });
const pwErrors = reactive({});

const settings = reactive({
  notifications: { emailAppointments: true, emailReports: true, emailMessages: false, pushReminders: true, pushAlerts: true, reminderTime: '24h' },
  preferences: { language: 'es', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', theme: 'auto', highContrast: false },
  privacy: { profileVisible: true, shareData: false }
});

onMounted(async () => {
  loading.value = true;
  loadingSessions.value = true;
  try {
    const s = await getSettings();
    Object.assign(settings, s);
  } finally {
    loading.value = false;
  }
  try {
    sessions.value = await getSessions();
  } finally {
    loadingSessions.value = false;
  }
});

const saveSettings = async () => {
  await updateSettings({ ...settings });
  showToast('Preferencias guardadas');
};

const validatePw = () => {
  Object.keys(pwErrors).forEach(k => delete pwErrors[k]);
  if (!pwForm.newPw) { pwErrors.newPw = 'Requerida'; return false; }
  if (pwForm.newPw.length < 8) { pwErrors.newPw = 'Mínimo 8 caracteres'; return false; }
  if (!/[A-Z]/.test(pwForm.newPw)) { pwErrors.newPw = 'Debe contener una mayúscula'; return false; }
  if (!/[0-9]/.test(pwForm.newPw)) { pwErrors.newPw = 'Debe contener un número'; return false; }
  if (!/[^A-Za-z0-9]/.test(pwForm.newPw)) { pwErrors.newPw = 'Debe contener un símbolo'; return false; }
  if (pwForm.newPw !== pwForm.confirm) { pwErrors.confirm = 'Las contraseñas no coinciden'; return false; }
  return true;
};

const handleChangePassword = async () => {
  if (!validatePw()) return;
  changingPw.value = true;
  try {
    await changePassword(pwForm.current, pwForm.newPw);
    pwForm.current = ''; pwForm.newPw = ''; pwForm.confirm = '';
    showToast('Contraseña actualizada correctamente');
  } catch (err) {
    showToast(err.message || 'Error al actualizar la contraseña', 'error');
  } finally {
    changingPw.value = false;
  }
};

const doDeleteSession = async (id) => {
  await deleteSession(id);
  sessions.value = sessions.value.filter(s => s.id !== id);
  showToast('Sesión cerrada correctamente');
};

const applyTheme = () => {
  const html = document.documentElement;
  if (settings.preferences.theme === 'dark') html.classList.add('dark');
  else if (settings.preferences.theme === 'light') html.classList.remove('dark');
  else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    prefersDark ? html.classList.add('dark') : html.classList.remove('dark');
  }
  saveSettings();
};

const exportData = () => {
  const data = JSON.stringify({ settings }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'mis_datos_vitsync.json'; a.click();
  URL.revokeObjectURL(url);
  showToast('Datos exportados correctamente');
};

const requestDataDeletion = () => {
  showDeleteModal.value = false;
  showToast('Solicitud de eliminación enviada. Te contactaremos en 30 días.', 'info');
};

const formatDate = (d) => d ? new Date(d).toLocaleString('es-ES') : '';
</script>
