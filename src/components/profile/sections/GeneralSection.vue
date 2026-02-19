<template>
  <div>
    <ProfileHeader
      :name="form.name"
      :firstName="form.firstName"
      :secondName="form.secondName"
      :email="form.email"
      :role="form.role"
      :avatarUrl="avatarUrl"
      :isVerified="profileData.isVerified"
      :editMode="editing"
      @avatar-change="handleAvatarChange"
    >
      <template #actions>
        <div class="flex gap-2">
          <button
            v-if="!editing"
            @click="startEdit"
            class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
          Editar perfil
          </button>
          <template v-else>
            <button
              @click="cancelEdit"
              class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="handleSave"
              :disabled="isSaving"
              class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              <span v-if="isSaving">Guardando...</span>
            </button>
          </template>
        </div>
      </template>
    </ProfileHeader>

    <LoadingSpinner v-if="isLoading" size="lg" class="my-10" />

    <div v-else>
      <!-- Información Básica -->
      <InfoCard title="Información Básica">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EditableField label="Nombre" v-model="form.name" :editing="editing" required :error="errors.name" />
          <EditableField label="Primer apellido" v-model="form.firstName" :editing="editing" required :error="errors.firstName" />
          <EditableField label="Segundo apellido" v-model="form.secondName" :editing="editing" :error="errors.secondName" />
          <EditableField
            label="Género"
            v-model="form.gender"
            :editing="editing"
            type="select"
            :options="genderOptions"
          />
          <EditableField label="NIF / CIF" v-model="form.nif" :editing="false" readonly />
          <EditableField label="Fecha de nacimiento" v-model="form.birthDate" :editing="false" readonly />
        </div>
      </InfoCard>

      <!-- Datos de Contacto -->
      <InfoCard title="Datos de Contacto">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EditableField label="Correo electrónico" v-model="form.email" :editing="editing" type="email" required :error="errors.email" />
          <EditableField label="Teléfono móvil" v-model="form.phone" :editing="editing" type="tel" required :error="errors.phone" />
        </div>
      </InfoCard>

      <!-- Dirección -->
      <InfoCard title="Dirección">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <EditableField label="Dirección completa" v-model="form.address" :editing="editing" />
          </div>
          <EditableField label="Código Postal" v-model="form.postCode" :editing="editing" />
          <EditableField label="País" v-model="form.country" :editing="editing" />
        </div>
      </InfoCard>

      <!-- Rol / Cuenta -->
      <InfoCard title="Información de Cuenta">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EditableField
            label="Tipo de cuenta"
            v-model="form.role"
            :editing="false"
            type="select"
            :options="roleOptions"
          />
          <div>
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Estado de verificación</label>
            <span class="text-sm" :class="profileData.isVerified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'">
              {{ profileData.isVerified ? '✓ Verificado' : 'Pendiente de verificación' }}
            </span>
          </div>
        </div>
      </InfoCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import ProfileHeader from '../ProfileHeader.vue';
import InfoCard from '../InfoCard.vue';
import EditableField from '../EditableField.vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import { profileData, isLoading, avatarUrl, saveProfile, uploadAvatar } from '../../../store/profile';

const editing = ref(false);
const isSaving = ref(false);
const errors = reactive({});

const form = reactive({
  name: '', firstName: '', secondName: '',
  nif: '', email: '', gender: 'MALE',
  role: 'PATIENT', birthDate: '', phone: '',
  address: '', postCode: '', country: ''
});

const originalForm = reactive({});

const genderOptions = [
  { value: 'MALE', label: 'Masculino' },
  { value: 'FEMALE', label: 'Femenino' },
  { value: 'OTHER', label: 'Otro' }
];
const roleOptions = [
  { value: 'PATIENT', label: 'Paciente' },
  { value: 'DOCTOR', label: 'Médico' },
  { value: 'ADMIN', label: 'Administrador' }
];

const syncForm = () => {
  const fields = ['name','firstName','secondName','nif','email','gender','role','birthDate','phone','address','postCode','country'];
  fields.forEach(f => { form[f] = profileData[f] || ''; });
};

// Sync when profileData changes
watch(profileData, syncForm, { immediate: true });

const startEdit = () => {
  Object.assign(originalForm, { ...form });
  Object.keys(errors).forEach(k => delete errors[k]);
  editing.value = true;
};

const cancelEdit = () => {
  Object.assign(form, originalForm);
  Object.keys(errors).forEach(k => delete errors[k]);
  editing.value = false;
};

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k]);
  if (!form.name.trim()) errors.name = 'El nombre es obligatorio';
  if (!form.firstName.trim()) errors.firstName = 'El apellido es obligatorio';
  if (!form.email.trim()) errors.email = 'El email es obligatorio';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Formato de email inválido';
  if (!form.phone.trim()) errors.phone = 'El teléfono es obligatorio';
  return Object.keys(errors).length === 0;
};

const handleSave = async () => {
  if (!validate()) return;
  isSaving.value = true;
  try {
    await saveProfile({ ...form });
    editing.value = false;
  } finally {
    isSaving.value = false;
  }
};

const handleAvatarChange = async (file) => {
  await uploadAvatar(file);
};
</script>
