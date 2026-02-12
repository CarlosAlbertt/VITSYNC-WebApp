<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <div class="max-w-7xl mx-auto">
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
                        placeholder="Buscar especialidad..." />
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="specialty in filteredSpecialties" :key="specialty.id"
                    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative result-card group">
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

                    <div class="flex items-center space-x-4 mb-4">
                        <div class="p-3 bg-purple-100 rounded-lg text-purple-600">
                            <span class="text-xl font-bold">{{ specialty.name.charAt(0).toUpperCase() }}</span>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900">{{ specialty.name }}</h3>
                    </div>
                    <p class="text-gray-500 text-sm line-clamp-3">
                        {{ specialty.description || 'Sin descripción disponible.' }}
                    </p>
                </div>
            </div>

            <div v-if="filteredSpecialties.length === 0"
                class="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100 mt-6">
                No se encontraron especialidades.
            </div>

        </div>

        <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
            aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                    @click="closeModal"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {{ isEditing ? 'Editar Especialidad' : 'Añadir Especialidad' }}
                        </h3>
                        <div class="mt-4 space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
                                <input v-model="form.name" type="text" id="name"
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2 border"
                                    placeholder="Cardiología">
                            </div>
                            <div>
                                <label for="description"
                                    class="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea v-model="form.description" id="description" rows="3"
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2 border"
                                    placeholder="Descripción breve de la especialidad..."></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button @click="saveSpecialty" type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Guardar
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
import { especialidades, isLoading, error, fetchEspecialidades, createEspecialidad, updateEspecialidad, deleteEspecialidad } from '@/store/especialidades';

const searchQuery = ref('');
const isModalOpen = ref(false);
const isEditing = ref(false);
const form = ref({ id: null, name: '', description: '' });

onMounted(async () => {
    try {
        await fetchEspecialidades();
    } catch (err) {
        // Error handled in store
    }
});

const filteredSpecialties = computed(() => {
    return especialidades.value.filter(item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const openModal = (item = null) => {
    if (item) {
        isEditing.value = true;
        form.value = { ...item };
    } else {
        isEditing.value = false;
        form.value = { id: null, name: '', description: '' };
    }
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    form.value = { id: null, name: '', description: '' };
};

const saveSpecialty = async () => {
    try {
        if (isEditing.value) {
            await updateEspecialidad(form.value.id, { ...form.value });
        } else {
            await createEspecialidad({ ...form.value });
        }
        closeModal();
    } catch (err) {
        alert('Error al guardar la especialidad: ' + err.message);
    }
};

const confirmDelete = async (item) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la especialidad ${item.name}?`)) {
        try {
            await deleteEspecialidad(item.id);
        } catch (err) {
            alert('Error al eliminar la especialidad: ' + err.message);
        }
    }
};
</script>
