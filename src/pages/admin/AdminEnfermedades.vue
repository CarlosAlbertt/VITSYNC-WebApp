<template>
    <div class="min-h-screen bg-[var(--bg-base)] p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-[var(--text-primary)]">Gestión de Enfermedades</h1>
                    <p class="mt-2 text-[var(--text-secondary)]">Administra el catálogo de enfermedades y tratamientos disponibles.</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <button @click="openModal()"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Añadir Enfermedad
                    </button>
                </div>
            </div>

            <!-- Search -->
            <div class="bg-[var(--bg-surface)] rounded-xl shadow-sm border border-[var(--border)] p-4 mb-6">
                <div class="relative max-w-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input v-model="searchQuery" type="text"
                        class="block w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-lg leading-5 bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:placeholder-[var(--text-muted)] focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="Buscar por nombre o especialidad relacionada..." />
                </div>
            </div>

            <!-- Loading state -->
            <div v-if="isLoading" class="p-12 text-center text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                <svg class="animate-spin h-8 w-8 text-orange-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cargando enfermedades...
            </div>

            <!-- Error banner -->
            <div v-if="error && !isLoading"
                class="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <svg class="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-red-700">{{ error }}</span>
                <button @click="loadData" class="ml-auto text-sm text-red-600 hover:text-red-800 font-medium">
                    Reintentar
                </button>
            </div>

            <!-- Disease Cards Grid -->
            <div v-if="!isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="enfermedad in filteredEnfermedades" :key="enfermedad.id"
                    class="bg-[var(--bg-surface)] rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-md transition-shadow relative result-card group">

                    <!-- Action buttons (hover) -->
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <button @click="openModal(enfermedad)"
                            class="p-1 text-[var(--text-muted)] hover:text-orange-600 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                            title="Editar">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button @click="openDeleteModal(enfermedad)"
                            class="p-1 text-[var(--text-muted)] hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            title="Eliminar">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <!-- Card content -->
                    <div class="flex items-center space-x-4 mb-3">
                        <div class="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-lg text-orange-600 dark:text-orange-400 flex-shrink-0">
                            <span class="text-xl font-bold">{{ enfermedad.nombre?.charAt(0)?.toUpperCase() || '?' }}</span>
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="text-lg font-bold text-[var(--text-primary)] truncate">{{ enfermedad.nombre }}</h3>
                            <p class="text-xs text-[var(--text-muted)] truncate">{{ enfermedad.especialidadRelacionada }}</p>
                        </div>
                    </div>

                    <!-- Badges -->
                    <div class="flex items-center space-x-2 mb-3">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 truncate max-w-[140px]">
                            {{ enfermedad.especialidadRelacionada }}
                        </span>
                        <span :class="enfermedad.activo
                            ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'"
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                            {{ enfermedad.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                    </div>

                    <p class="text-[var(--text-secondary)] text-sm line-clamp-2 mb-3">
                        {{ enfermedad.descripcion || 'Sin descripción disponible.' }}
                    </p>

                    <!-- Treatments preview -->
                    <div v-if="enfermedad.tratamientos?.length" class="flex flex-wrap gap-1 mb-4">
                        <span v-for="(t, i) in enfermedad.tratamientos.slice(0, 2)" :key="i"
                            class="inline-block px-2 py-0.5 rounded text-xs bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">
                            {{ t }}
                        </span>
                        <span v-if="enfermedad.tratamientos.length > 2"
                            class="inline-block px-2 py-0.5 rounded text-xs bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)]">
                            +{{ enfermedad.tratamientos.length - 2 }} más
                        </span>
                    </div>

                    <!-- Toggle button -->
                    <div class="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                        <span class="text-xs text-[var(--text-muted)]">{{ enfermedad.tratamientos?.length ?? 0 }} tratamiento(s)</span>
                        <button @click="handleToggle(enfermedad.id)" :class="enfermedad.activo
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-300 hover:bg-gray-400'"
                            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            :title="enfermedad.activo ? 'Desactivar' : 'Activar'">
                            <span :class="enfermedad.activo ? 'translate-x-5' : 'translate-x-0'"
                                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="!isLoading && filteredEnfermedades.length === 0"
                class="p-12 text-center text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] mt-6">
                No se encontraron enfermedades.
            </div>
        </div>

        <!-- ===== FORM MODAL (Crear / Editar) ===== -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog"
            aria-labelledby="modal-title" aria-modal="true">
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" @click="closeModal"></div>

            <div class="relative z-10 bg-[var(--bg-surface)] rounded-lg text-left overflow-hidden shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div class="bg-[var(--bg-surface)] px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto flex-1">
                    <h3 class="text-lg leading-6 font-medium text-[var(--text-primary)]" id="modal-title">
                        {{ isEditing ? 'Editar Enfermedad' : 'Añadir Enfermedad' }}
                    </h3>

                    <!-- Modal error banner -->
                    <div v-if="formError"
                        class="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                        <svg class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-sm text-red-700">{{ formError }}</span>
                    </div>

                    <div class="mt-4 space-y-4">
                        <!-- Nombre -->
                        <div>
                            <label for="nombre" class="block text-sm font-medium text-[var(--text-secondary)]">Nombre <span class="text-red-500">*</span></label>
                            <input v-model="form.nombre" type="text" id="nombre"
                                class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                placeholder="Hipertensión Arterial">
                        </div>

                        <!-- Especialidad relacionada -->
                        <div>
                            <label for="especialidad" class="block text-sm font-medium text-[var(--text-secondary)]">Especialidad relacionada <span class="text-red-500">*</span></label>
                            <input v-model="form.especialidadRelacionada" type="text" id="especialidad"
                                class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                placeholder="Cardiología">
                        </div>

                        <!-- Descripción -->
                        <div>
                            <label for="descripcion" class="block text-sm font-medium text-[var(--text-secondary)]">Descripción</label>
                            <textarea v-model="form.descripcion" id="descripcion" rows="3"
                                class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                placeholder="Descripción breve de la enfermedad..."></textarea>
                        </div>

                        <!-- Tratamientos -->
                        <div>
                            <label class="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                Tratamientos <span class="text-red-500">*</span>
                            </label>

                            <!-- Lista de tratamientos -->
                            <div v-if="form.tratamientos.length" class="mb-2 space-y-1">
                                <div v-for="(t, i) in form.tratamientos" :key="i"
                                    class="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md px-3 py-1.5">
                                    <span class="flex-1 text-sm text-[var(--text-primary)]">{{ t }}</span>
                                    <button type="button" @click="removeTratamiento(i)"
                                        class="text-[var(--text-muted)] hover:text-red-500 transition-colors">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Input para añadir tratamiento -->
                            <div class="flex gap-2">
                                <input v-model="nuevoTratamiento" type="text"
                                    @keydown.enter.prevent="addTratamiento"
                                    class="flex-1 border-[var(--border)] rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                    placeholder="Ej: Medicación antihipertensiva">
                                <button type="button" @click="addTratamiento"
                                    class="px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-md text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                                    Añadir
                                </button>
                            </div>
                            <p class="mt-1 text-xs text-[var(--text-muted)]">Pulsa Enter o el botón para añadir cada tratamiento.</p>
                        </div>

                        <!-- Activo checkbox -->
                        <div class="flex items-center space-x-3">
                            <input v-model="form.activo" type="checkbox" id="activo"
                                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                            <label for="activo" class="text-sm font-medium text-gray-700 dark:text-gray-300">Enfermedad activa</label>
                        </div>
                    </div>
                </div>

                <div class="bg-[var(--bg-elevated)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse flex-shrink-0">
                    <button @click="saveEnfermedad" type="button" :disabled="isSaving"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {{ isSaving ? 'Guardando...' : 'Guardar' }}
                    </button>
                    <button @click="closeModal" type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border)] shadow-sm px-4 py-2 bg-[var(--bg-surface)] text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>

        <!-- ===== DELETE CONFIRMATION MODAL ===== -->
        <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog"
            aria-modal="true">
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" @click="closeDeleteModal"></div>

            <div class="relative z-10 bg-[var(--bg-surface)] rounded-lg text-left overflow-hidden shadow-xl w-full max-w-sm">
                <div class="bg-[var(--bg-surface)] px-4 pt-5 pb-4 sm:p-6">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0 p-2 bg-red-100 rounded-full">
                            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-medium text-[var(--text-primary)]">Eliminar enfermedad</h3>
                            <p class="mt-1 text-sm text-[var(--text-secondary)]">
                                ¿Estás seguro de que quieres eliminar
                                <strong>{{ enfermedadToDelete?.nombre }}</strong>?
                                Esta acción es irreversible.
                            </p>
                            <p class="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                                Considera desactivarla en lugar de eliminarla para conservar el historial.
                            </p>

                            <div v-if="deleteError" class="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">
                                {{ deleteError }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-[var(--bg-elevated)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <button @click="confirmDelete" :disabled="isDeleting"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
                    </button>
                    <button @click="closeDeleteModal" type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border)] shadow-sm px-4 py-2 bg-[var(--bg-surface)] text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] sm:mt-0 sm:w-auto sm:text-sm">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>

        <!-- ===== TOAST NOTIFICATION ===== -->
        <transition name="toast">
            <div v-if="toast.show"
                :class="toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'"
                class="fixed bottom-6 right-6 z-[60] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center space-x-2">
                <svg v-if="toast.type === 'error'" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <svg v-else class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ toast.message }}</span>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
    enfermedades,
    isLoading,
    error,
    fetchAllEnfermedades,
    createEnfermedad,
    updateEnfermedad,
    deleteEnfermedad,
    toggleActivo
} from '@/store/enfermedades';

const router = useRouter();

const searchQuery = ref('');
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const formError = ref(null);
const nuevoTratamiento = ref('');

const isDeleteModalOpen = ref(false);
const enfermedadToDelete = ref(null);
const isDeleting = ref(false);
const deleteError = ref(null);

const toast = ref({ show: false, message: '', type: 'success' });

const emptyForm = () => ({
    id: null,
    nombre: '',
    descripcion: '',
    tratamientos: [],
    especialidadRelacionada: '',
    activo: true
});

const form = ref(emptyForm());

// ─── Helpers ────────────────────────────────────────────────
const showToast = (message, type = 'success') => {
    toast.value = { show: true, message, type };
    setTimeout(() => { toast.value.show = false; }, 3500);
};

const extractApiError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
        return 'Sin permisos de administrador. Por favor inicia sesión con una cuenta ADMIN.';
    }
    return err.response?.data?.error || err.response?.data?.message || err.message || 'Error desconocido.';
};

// ─── Data loading ────────────────────────────────────────────
const loadData = async () => {
    try {
        await fetchAllEnfermedades();
    } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
            router.push({ name: 'login' });
        }
    }
};

onMounted(loadData);

// ─── Filtering ───────────────────────────────────────────────
const filteredEnfermedades = computed(() => {
    const q = searchQuery.value.toLowerCase();
    return enfermedades.value.filter(item =>
        item.nombre?.toLowerCase().includes(q) ||
        item.especialidadRelacionada?.toLowerCase().includes(q)
    );
});

// ─── Tratamientos helpers ────────────────────────────────────
const addTratamiento = () => {
    const t = nuevoTratamiento.value.trim();
    if (t && !form.value.tratamientos.includes(t)) {
        form.value.tratamientos.push(t);
    }
    nuevoTratamiento.value = '';
};

const removeTratamiento = (index) => {
    form.value.tratamientos.splice(index, 1);
};

// ─── Form modal ──────────────────────────────────────────────
const openModal = (item = null) => {
    formError.value = null;
    nuevoTratamiento.value = '';
    if (item) {
        isEditing.value = true;
        form.value = {
            id: item.id,
            nombre: item.nombre || '',
            descripcion: item.descripcion ?? '',
            tratamientos: item.tratamientos ? [...item.tratamientos] : [],
            especialidadRelacionada: item.especialidadRelacionada || '',
            activo: item.activo !== undefined ? item.activo : true
        };
    } else {
        isEditing.value = false;
        form.value = emptyForm();
    }
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    formError.value = null;
    nuevoTratamiento.value = '';
    form.value = emptyForm();
};

const saveEnfermedad = async () => {
    formError.value = null;

    if (!form.value.nombre.trim()) { formError.value = 'El nombre es obligatorio.'; return; }
    if (!form.value.especialidadRelacionada.trim()) { formError.value = 'La especialidad relacionada es obligatoria.'; return; }
    if (!form.value.tratamientos.length) { formError.value = 'Añade al menos un tratamiento.'; return; }

    const payload = {
        nombre: form.value.nombre.trim(),
        descripcion: form.value.descripcion?.trim() || null,
        tratamientos: form.value.tratamientos,
        especialidadRelacionada: form.value.especialidadRelacionada.trim(),
        activo: form.value.activo
    };

    try {
        isSaving.value = true;
        if (isEditing.value) {
            await updateEnfermedad(form.value.id, payload);
            showToast('Enfermedad actualizada correctamente.');
        } else {
            await createEnfermedad(payload);
            showToast('Enfermedad creada correctamente.');
        }
        closeModal();
        await loadData();
    } catch (err) {
        formError.value = extractApiError(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
            router.push({ name: 'login' });
        }
    } finally {
        isSaving.value = false;
    }
};

// ─── Toggle activo ──────────────────────────────────────────
const handleToggle = async (id) => {
    try {
        await toggleActivo(id);
    } catch (err) {
        showToast(extractApiError(err), 'error');
        if (err.response?.status === 401 || err.response?.status === 403) {
            router.push({ name: 'login' });
        }
    }
};

// ─── Delete modal ────────────────────────────────────────────
const openDeleteModal = (item) => {
    enfermedadToDelete.value = item;
    deleteError.value = null;
    isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    enfermedadToDelete.value = null;
    deleteError.value = null;
};

const confirmDelete = async () => {
    if (!enfermedadToDelete.value) return;
    deleteError.value = null;
    try {
        isDeleting.value = true;
        await deleteEnfermedad(enfermedadToDelete.value.id);
        showToast(`"${enfermedadToDelete.value.nombre}" eliminada correctamente.`);
        closeDeleteModal();
        await loadData();
    } catch (err) {
        deleteError.value = extractApiError(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
            router.push({ name: 'login' });
        }
    } finally {
        isDeleting.value = false;
    }
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.35s ease;
}
.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(12px);
}
</style>
