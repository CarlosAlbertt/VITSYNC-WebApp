<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-10">
      <h2 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Configuración</h2>
      <p class="text-slate-500 dark:text-slate-400 mt-1 font-medium">Gestiona tu cuenta, privacidad y preferencias de la aplicación</p>
    </div>

    <!-- Subsección tabs -->
    <div class="flex gap-2 mb-10 overflow-x-auto p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
      <button
        v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        class="flex-1 min-w-[140px] px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
        :class="activeTab === tab.id
          ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-600'
          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/30'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>

    <div v-else class="space-y-8">

      <!-- ── SEGURIDAD ── -->
      <template v-if="activeTab === 'security'">
        <InfoCard title="Cambiar Contraseña">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div class="space-y-4">
              <EditableField label="Contraseña actual" v-model="pwForm.current" type="password" :editing="true" />
              <EditableField label="Nueva contraseña" v-model="pwForm.newPw" type="password" :editing="true" :error="pwErrors.newPw" />
              <EditableField label="Confirmar nueva" v-model="pwForm.confirm" type="password" :editing="true" :error="pwErrors.confirm" />
            </div>
            <div class="flex flex-col justify-between">
              <div class="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Requisitos de seguridad</p>
                <ul class="text-xs space-y-2 text-slate-600 dark:text-slate-400 font-medium">
                  <li class="flex items-center gap-2">✓ Mínimo 8 caracteres</li>
                  <li class="flex items-center gap-2">✓ Una letra mayúscula</li>
                  <li class="flex items-center gap-2">✓ Un número y un símbolo</li>
                </ul>
              </div>
              <button
                @click="handleChangePassword"
                :disabled="changingPw"
                class="mt-4 px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-teal-600 transition-all disabled:opacity-50"
              >
                {{ changingPw ? 'Actualizando...' : 'Actualizar Contraseña' }}
              </button>
            </div>
          </div>
        </InfoCard>

        <!-- Autenticación Avanzada -->
        <InfoCard title="Seguridad de la Cuenta">
          <div class="space-y-6 pt-2">
            <div class="flex items-center justify-between p-2 rounded-2xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <div class="flex-1 pr-4">
                <div class="flex items-center gap-2 mb-1">
                  <p class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Autenticación de dos factores (2FA)</p>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Protege tu cuenta pidiendo un código extra de seguridad generado por tu móvil al iniciar sesión.</p>
              </div>
              <button 
                @click="open2FAModal"
                class="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
                :class="settings.security.twoFactor 
                  ? 'bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/30 dark:text-teal-400' 
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'"
              >
                {{ settings.security.twoFactor ? 'Configurado' : 'Configurar' }}
              </button>
            </div>
            
            <div class="h-px bg-slate-100 dark:bg-slate-800"></div>

            <div class="flex items-center justify-between p-2 rounded-2xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <div class="flex-1 pr-4">
                <div class="flex items-center gap-2 mb-1">
                  <p class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Preguntas de recuperación</p>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Añade o modifica tus preguntas de seguridad para recuperar el acceso si olvidas tu contraseña.</p>
              </div>
              <button @click="openQuestionsModal" class="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm font-black">
                {{ securityQuestions.length > 0 ? 'Modificar' : 'Añadir' }}
              </button>
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Sesiones Activas">
          <LoadingSpinner v-if="loadingSessions" size="sm" class="my-4" />
          <div v-else class="space-y-4">
            <div
              v-for="session in sessions" :key="session.id"
              class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all hover:border-teal-500/30"
            >
              <div class="flex items-center gap-4">
                <div class="text-sm font-black text-slate-800 dark:text-white">
                  {{ session.device }}
                  <span v-if="session.current" class="ml-2 text-[9px] text-teal-600 font-black uppercase bg-teal-50 dark:bg-teal-900/40 px-2 py-0.5 rounded-md tracking-widest">Actual</span>
                </div>
                <div class="hidden sm:block">
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{{ session.location }} · {{ formatDate(session.date) }}</p>
                </div>
              </div>
              <button
                v-if="!session.current"
                @click="doDeleteSession(session.id)"
                class="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
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
          <div class="space-y-2">
            <SettingsToggle label="Recordatorios de citas" description="Recibe un aviso 24h antes de tu consulta" v-model="settings.notifications.emailAppointments" @update:modelValue="saveSettings" />
            <SettingsToggle label="Nuevos informes" v-model="settings.notifications.emailReports" @update:modelValue="saveSettings" />
            <SettingsToggle label="Mensajería directa" v-model="settings.notifications.emailMessages" @update:modelValue="saveSettings" />
          </div>
        </InfoCard>

        <InfoCard title="Ajustes de Tiempo">
          <div class="space-y-2 pt-2">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recordatorio anticipado</label>
            <div class="flex gap-4">
              <label v-for="opt in reminderOptions" :key="opt.value" class="flex-1 cursor-pointer group">
                <input type="radio" v-model="settings.notifications.reminderTime" :value="opt.value" class="hidden" @change="saveSettings" />
                <div 
                  class="p-4 text-center rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest"
                  :class="settings.notifications.reminderTime === opt.value 
                    ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-200 dark:shadow-none' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 group-hover:border-teal-300'"
                >
                  {{ opt.label }}
                </div>
              </label>
            </div>
          </div>
        </InfoCard>
      </template>

       <template v-else-if="activeTab === 'preferences'">
        <InfoCard title="Idioma y Región">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
             <div v-for="(field, key) in prefFields" :key="key">
               <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{{ field.label }}</label>
               <select v-model="settings.preferences[key]" @change="key === 'theme' ? applyTheme() : saveSettings()" class="w-full px-4 py-3 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none shadow-sm">
                 <option v-for="opt in field.options" :key="opt.v" :value="opt.v">{{ opt.t }}</option>
               </select>
             </div>
           </div>
        </InfoCard>
      </template>

      <template v-else-if="activeTab === 'privacy'">
         <InfoCard title="Gestión de Datos">
            <div class="space-y-4 pt-2">
              <div v-for="action in privacyActions" :key="action.title" class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div>
                  <p class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{{ action.title }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{{ action.desc }}</p>
                </div>
                <button @click="action.handler" :class="action.btnClass">
                  {{ action.btnText }}
                </button>
              </div>
            </div>
         </InfoCard>
      </template>

    </div>

    <!-- ── MODAL 2FA ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="show2FAModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" @click="show2FAModal = false"></div>
          <div class="relative bg-white dark:bg-slate-900 rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-white/20 text-center">
            <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-4 tracking-tighter uppercase">Autenticación 2FA</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
              Escanea este código con tu aplicación de autenticación para vincular tu cuenta de forma segura.
            </p>
            
            <div class="bg-white p-4 rounded-3xl inline-block border-8 border-slate-50 mb-10 shadow-sm">
              <img :src="qrCodeUrl" alt="QR Code" class="w-40 h-40" />
            </div>

            <div class="flex flex-col gap-3">
              <button @click="toggle2FA" class="w-full py-4 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-teal-600 transition-all shadow-xl">
                {{ settings.security.twoFactor ? 'Desactivar 2FA' : 'Activar y Finalizar' }}
              </button>
              <button @click="show2FAModal = false" class="w-full py-4 text-slate-400 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-100 transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── MODAL PREGUNTAS SEGURIDAD ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showQuestionsModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" @click="showQuestionsModal = false"></div>
          <div class="relative bg-white dark:bg-slate-900 rounded-[3rem] p-10 max-w-xl w-full shadow-2xl border border-white/20">
            <div class="mb-8">
              <h3 class="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Preguntas de Seguridad</h3>
              <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Configura tu recuperación</p>
            </div>
            
            <div class="space-y-6 mb-10">
              <div v-for="(q, idx) in questionsForm" :key="idx" class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pregunta {{ idx + 1 }}</label>
                <select v-model="q.question" class="w-full px-4 py-3 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500">
                   <option v-for="opt in securityQuestionOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <input v-model="q.answer" type="text" placeholder="Tu respuesta secreta..." class="w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
              </div>
            </div>

            <div class="flex gap-4">
              <button @click="saveQuestions" class="flex-1 py-4 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-amber-600 transition-all shadow-xl shadow-slate-200 dark:shadow-none">
                Guardar Preguntas
              </button>
              <button @click="showQuestionsModal = false" class="px-8 py-4 text-slate-400 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-100 transition-all">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modales de confirmación existentes -->
    <ConfirmModal v-model="showDeleteModal" title="¿Eliminar cuenta?" message="Esta acción es irreversible y borrará todo tu historial médico." confirm-text="Sí, eliminar todo" variant="danger" @confirm="requestDataDeletion" />
    <ConfirmModal v-model="showSuspendModal" title="¿Desactivar cuenta?" message="Tu perfil dejará de ser visible para los médicos temporalmente." confirm-text="Sí, desactivar" variant="danger" @confirm="requestAccountSuspension" />

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import InfoCard from '../InfoCard.vue';
import EditableField from '../EditableField.vue';
import SettingsToggle from '../SettingsToggle.vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import ConfirmModal from '../ConfirmModal.vue';
import { 
  getSettings, updateSettings, changePassword, getSessions, deleteSession, 
  exportUserData, suspendAccount, deleteAccount, setup2FA, getSecurityQuestions, saveSecurityQuestions 
} from '../../../services/profileService';
import { showToast } from '../../../store/profile';
import { logout } from '../../../store/auth';

const loading = ref(false);
const loadingSessions = ref(false);
const activeTab = ref('security');
const changingPw = ref(false);
const showDeleteModal = ref(false);
const showSuspendModal = ref(false);
const show2FAModal = ref(false);
const showQuestionsModal = ref(false);
const sessions = ref([]);
const securityQuestions = ref([]);
const qrCodeUrl = ref('');

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

const securityQuestionOptions = [
  '¿Cuál es el nombre de tu primera mascota?',
  '¿En qué ciudad nacieron tus padres?',
  '¿Cuál era el nombre de tu escuela primaria?',
  '¿Cuál es tu película favorita de la infancia?',
  '¿Cuál fue el primer modelo de coche que tuviste?'
];

const pwForm = reactive({ current: '', newPw: '', confirm: '' });
const pwErrors = reactive({});
const questionsForm = ref([
  { question: securityQuestionOptions[0], answer: '' },
  { question: securityQuestionOptions[1], answer: '' }
]);

const settings = reactive({
  security: { twoFactor: false },
  notifications: { emailAppointments: true, emailReports: true, emailMessages: false, pushReminders: true, pushAlerts: true, reminderTime: '24h' },
  preferences: { language: 'es', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', theme: 'auto', highContrast: false },
  privacy: { profileVisible: true, shareData: false }
});

const prefFields = {
  language: { label: 'Idioma', options: [{v:'es', t:'Español'}, {v:'en', t:'English'}] },
  dateFormat: { label: 'Formato de fecha', options: [{v:'DD/MM/YYYY', t:'DD/MM/YYYY'}, {v:'MM/DD/YYYY', t:'MM/DD/YYYY'}] },
  timeFormat: { label: 'Formato de hora', options: [{v:'24h', t:'24 Horas'}, {v:'12h', t:'12 Horas (AM/PM)'}] },
  theme: { label: 'Apariencia', options: [{v:'auto', t:'Sincronizar sistema'}, {v:'light', t:'Modo Claro'}, {v:'dark', t:'Modo Oscuro'}] }
};

const privacyActions = [
  { title: 'Exportar Datos', desc: 'Descarga toda tu información en formato JSON estándar.', btnText: 'Exportar', btnClass: 'px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-xl transition-all', handler: () => exportData() },
  { title: 'Desactivar Cuenta', desc: 'Oculta tu perfil temporalmente sin borrar tus datos.', btnText: 'Desactivar', btnClass: 'px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-amber-300 text-amber-600 hover:bg-amber-50 rounded-xl transition-all', handler: () => showSuspendModal.value = true },
  { title: 'Eliminar Cuenta', desc: 'Solicita el borrado total de tus datos (Derecho al olvido).', btnText: 'Eliminar', btnClass: 'px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-red-300 text-red-600 hover:bg-red-50 rounded-xl transition-all', handler: () => showDeleteModal.value = true }
];

onMounted(async () => {
  loading.value = true;
  loadingSessions.value = true;
  try {
    const s = await getSettings();
    Object.assign(settings, s);
    securityQuestions.value = await getSecurityQuestions();
    if (securityQuestions.value.length > 0) {
      questionsForm.value = securityQuestions.value.map(q => ({ ...q }));
    }
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
  showToast('Preferencias actualizadas');
};

const open2FAModal = async () => {
  const res = await setup2FA(!settings.security.twoFactor);
  qrCodeUrl.value = res.qrCode;
  show2FAModal.value = true;
};

const toggle2FA = async () => {
  settings.security.twoFactor = !settings.security.twoFactor;
  await saveSettings();
  show2FAModal.value = false;
  showToast(settings.security.twoFactor ? '2FA activado' : '2FA desactivado');
};

const openQuestionsModal = () => {
  showQuestionsModal.value = true;
};

const saveQuestions = async () => {
  if (questionsForm.value.some(q => !q.answer)) {
    showToast('Responde a todas las preguntas', 'error');
    return;
  }
  await saveSecurityQuestions(questionsForm.value);
  securityQuestions.value = questionsForm.value.map(q => ({ ...q }));
  showQuestionsModal.value = false;
  showToast('Preguntas guardadas');
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
    showToast('Contraseña actualizada');
  } catch (err) {
    showToast(err.message || 'Error', 'error');
  } finally {
    changingPw.value = false;
  }
};

const doDeleteSession = async (id) => {
  await deleteSession(id);
  sessions.value = sessions.value.filter(s => s.id !== id);
  showToast('Sesión cerrada');
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

const exportData = async () => {
  try {
    const data = await exportUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitsync_data_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    showToast('Datos exportados');
  } catch (err) {
    showToast('Error', 'error');
  }
};

const requestDataDeletion = async () => {
  try {
    await deleteAccount();
    showDeleteModal.value = false;
    showToast('Cuenta eliminada');
    logout();
    window.location.href = '/login';
  } catch (err) {
    showToast('Error al eliminar cuenta', 'error');
  }
};

const requestAccountSuspension = async () => {
  try {
    await suspendAccount();
    showSuspendModal.value = false;
    showToast('Cuenta desactivada');
    logout();
    window.location.href = '/login';
  } catch (err) {
    showToast('Error al desactivar cuenta', 'error');
  }
};

const formatDate = (d) => d ? new Date(d).toLocaleString('es-ES') : '';
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

/* Animations */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
}
</style>
