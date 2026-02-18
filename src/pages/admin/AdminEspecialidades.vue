<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Gestión de Especialidades</h1>
                    <p class="mt-2 text-gray-500">Administra las especialidades médicas disponibles en la clínica.</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <button @click="openModal()"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
                        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Añadir Especialidad
                    </button>
                </div>
            </div>

            <!-- Search -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div class="relative max-w-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input v-model="searchQuery" type="text"
                        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Buscar por nombre, código o tipo..." />
                </div>
            </div>

            <!-- Loading state -->
            <div v-if="isLoading" class="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                <svg class="animate-spin h-8 w-8 text-purple-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cargando especialidades...
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

            <!-- Specialty Cards Grid -->
            <div v-if="!isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="specialty in filteredSpecialties" :key="specialty.id"
                    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative result-card group">

                    <!-- Action buttons (hover) -->
                    <div
                        class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <button @click="openModal(specialty)"
                            class="p-1 text-gray-400 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                            title="Editar">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button @click="confirmDelete(specialty)"
                            class="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                            title="Eliminar">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <!-- Card content -->
                    <div class="flex items-center space-x-4 mb-3">
                        <div class="p-3 bg-purple-100 rounded-lg text-purple-600">
                            <span class="text-xl font-bold">{{ specialty.nombre?.charAt(0)?.toUpperCase() || '?'
                                }}</span>
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="text-lg font-bold text-gray-900 truncate">{{ specialty.nombre }}</h3>
                            <p class="text-xs text-gray-400 font-mono">{{ specialty.codigo }}</p>
                        </div>
                    </div>

                    <!-- Tipo badge -->
                    <div class="flex items-center space-x-2 mb-3">
                        <span
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {{ specialty.tipo }}
                        </span>
                        <!-- Activo badge -->
                        <span :class="specialty.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'"
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                            {{ specialty.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                    </div>

                    <p class="text-gray-500 text-sm line-clamp-2 mb-4">
                        {{ specialty.descripcion || 'Sin descripción disponible.' }}
                    </p>

                    <!-- Toggle button -->
                    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span class="text-xs text-gray-400">{{ specialty.slug }}</span>
                        <button @click="handleToggle(specialty.id)" :class="specialty.activo
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-300 hover:bg-gray-400'"
                            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            :title="specialty.activo ? 'Desactivar' : 'Activar'">
                            <span :class="specialty.activo ? 'translate-x-5' : 'translate-x-0'"
                                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="!isLoading && filteredSpecialties.length === 0"
                class="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100 mt-6">
                No se encontraron especialidades.
            </div>
        </div>

        <!-- Modal Form -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
            aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                    @click="closeModal"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {{ isEditing ? 'Editar Especialidad' : 'Añadir Especialidad' }}
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
                                <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre <span
                                        class="text-red-500">*</span></label>
                                <input v-model="form.nombre" type="text" id="nombre"
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2 border"
                                    placeholder="Cardiología">
                            </div>

                            <!-- Código + Tipo (row) -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="codigo" class="block text-sm font-medium text-gray-700">Código <span
                                            class="text-red-500">*</span></label>
                                    <input v-model="form.codigo" type="text" id="codigo"
                                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2 border uppercase"
                                        placeholder="CARD">
                                </div>
                                <div>
                                    <label for="tipo" class="block text-sm font-medium text-gray-700">Tipo <span
                                            class="text-red-500">*</span></label>
                                    <select v-model="form.tipo" id="tipo"
                                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2 border bg-white">
                                        <option v-for="tipo in tiposDisponibles" :key="tipo" :value="tipo">{{ tipo
                                            }}</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Descripción -->
                            <div>
                                <label for="descripcion"
                                    class="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea v-model="form.descripcion" id="descripcion" rows="3"
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2 border"
                                    placeholder="Descripción breve de la especialidad..."></textarea>
                            </div>

                            <!-- Slug + Icono (row) -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="slug" class="block text-sm font-medium text-gray-700">Slug</label>
                                    <input v-model="form.slug" type="text" id="slug"
                                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2 border"
                                        placeholder="Se genera automáticamente">
                                </div>
                                <div>
                                    <label for="icono" class="block text-sm font-medium text-gray-700">Icono</label>
                                    <input v-model="form.icono" type="text" id="icono"
                                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2 border"
                                        placeholder="heart">
                                </div>
                            </div>

                            <!-- Activo checkbox -->
                            <div class="flex items-center space-x-3">
                                <input v-model="form.activo" type="checkbox" id="activo"
                                    class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded">
                                <label for="activo" class="text-sm font-medium text-gray-700">Especialidad
                                    activa</label>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button @click="saveSpecialty" type="button" :disabled="isSaving"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {{ isSaving ? 'Guardando...' : 'Guardar' }}
                        </button>
                        <button @click="closeModal" type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
    especialidades,
    isLoading,
    error,
    fetchAllEspecialidades,
    createEspecialidad,
    updateEspecialidad,
    deleteEspecialidad,
    toggleActivo
} from '@/store/especialidades';

const searchQuery = ref('');
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const formError = ref(null);

const tiposDisponibles = ['MEDICA', 'QUIRURGICA', 'DIAGNOSTICO', 'GENERAL', 'UNIDAD'];

const emptyForm = () => ({
    id: null,
    nombre: '',
    codigo: '',
    descripcion: '',
    tipo: 'MEDICA',
    slug: '',
    icono: '',
    activo: true
});

const form = ref(emptyForm());

// Load all specialties (including inactive) for admin view
const loadData = async () => {
    try {
        await fetchAllEspecialidades();
    } catch (err) {
        // Error handled in store
    }
};

onMounted(loadData);

const filteredSpecialties = computed(() => {
    const q = searchQuery.value.toLowerCase();
    return especialidades.value.filter(item =>
        item.nombre?.toLowerCase().includes(q) ||
        item.codigo?.toLowerCase().includes(q) ||
        item.tipo?.toLowerCase().includes(q)
    );
});

const openModal = (item = null) => {
    formError.value = null;
    if (item) {
        isEditing.value = true;
        form.value = {
            id: item.id,
            nombre: item.nombre || '',
            codigo: item.codigo || '',
            descripcion: item.descripcion || '',
            tipo: item.tipo || 'MEDICA',
            slug: item.slug || '',
            icono: item.icono || '',
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
    form.value = emptyForm();
};

const saveSpecialty = async () => {
    formError.value = null;

    // Basic client-side validation
    if (!form.value.nombre.trim()) {
        formError.value = 'El nombre es obligatorio.';
        return;
    }
    if (!form.value.codigo.trim()) {
        formError.value = 'El código es obligatorio.';
        return;
    }
    if (!form.value.tipo) {
        formError.value = 'El tipo es obligatorio.';
        return;
    }

    const payload = {
        nombre: form.value.nombre.trim(),
        codigo: form.value.codigo.trim().toUpperCase(),
        descripcion: form.value.descripcion?.trim() || null,
        tipo: form.value.tipo,
        slug: form.value.slug?.trim() || null,
        icono: form.value.icono?.trim() || null,
        activo: form.value.activo
    };

    try {
        isSaving.value = true;
        if (isEditing.value) {
            await updateEspecialidad(form.value.id, payload);
        } else {
            await createEspecialidad(payload);
        }
        closeModal();
        // Reload to get fresh data from server
        await loadData();
    } catch (err) {
        // Try to extract the API error message
        const apiError = err.response?.data?.error || err.response?.data?.message || err.message;
        formError.value = apiError || 'Error al guardar la especialidad.';
    } finally {
        isSaving.value = false;
    }
};

const handleToggle = async (id) => {
    try {
        await toggleActivo(id);
    } catch (err) {
        const apiError = err.response?.data?.error || err.response?.data?.message || err.message;
        alert('Error al cambiar el estado: ' + apiError);
    }
};

const confirmDelete = async (item) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la especialidad "${item.nombre}"?`)) {
        try {
            await deleteEspecialidad(item.id);
        } catch (err) {
            const apiError = err.response?.data?.error || err.response?.data?.message || err.message;
            alert('Error al eliminar la especialidad: ' + apiError);
        }
    }
};
</script>
