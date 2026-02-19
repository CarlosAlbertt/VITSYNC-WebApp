<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col items-center sm:flex-row sm:items-start gap-5 mb-6 transition-colors">
    <!-- Avatar -->
    <div class="relative group flex-shrink-0">
      <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-teal-100 dark:border-teal-800 bg-teal-50 dark:bg-teal-900">
        <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-3xl font-bold text-teal-600 dark:text-teal-400 select-none">
          {{ initials }}
        </div>
      </div>
      <!-- Overlay editar foto -->
      <button
        v-if="editMode"
        @click="triggerFileInput"
        class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        title="Cambiar foto"
      >
        <span class="text-white text-sm">📷</span>
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png"
        class="hidden"
        @change="handleFileChange"
      />
    </div>

    <!-- Info -->
    <div class="flex-1 text-center sm:text-left">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">{{ fullName }}</h2>
      <p class="text-sm text-teal-600 dark:text-teal-400 font-medium mt-0.5">{{ roleLabel }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ email }}</p>
      <div v-if="isVerified" class="inline-flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
        ✓ Cuenta verificada
      </div>
    </div>

    <!-- Botón editar (derecha) -->
    <div class="flex-shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  name: String,
  firstName: String,
  secondName: String,
  email: String,
  role: String,
  avatarUrl: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  editMode: { type: Boolean, default: false }
});
const emit = defineEmits(['avatar-change']);

const fileInput = ref(null);

const fullName = computed(() => [props.name, props.firstName, props.secondName].filter(Boolean).join(' ') || 'Usuario');

const initials = computed(() => {
  const parts = [props.name, props.firstName].filter(Boolean);
  return parts.map(p => p[0].toUpperCase()).join('').slice(0, 2) || 'U';
});

const roleLabel = computed(() => ({
  PATIENT: '🏥 Paciente',
  DOCTOR: '👨‍⚕️ Médico',
  ADMIN: '🔧 Administrador'
}[props.role] || props.role || 'Paciente'));

const triggerFileInput = () => fileInput.value?.click();

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { alert('La foto no puede superar 5 MB'); return; }
  emit('avatar-change', file);
};
</script>
