<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Breadcrumb / Header -->
            <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                    <p class="mt-2 text-gray-500">Administra los usuarios registrados en la plataforma.</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <button @click="openModal()"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Añadir Usuario
                    </button>
                </div>
            </div>

            <!-- Filters & Search -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div class="relative max-w-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input v-model="searchQuery" type="text"
                        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Buscar por nombre o email..." />
                </div>
            </div>

            <!-- Users Table -->
            <div class="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <ul role="list" class="divide-y divide-gray-200">
                    <li v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
                        <div class="px-6 py-4 flex items-center justify-between">
                            <div class="flex items-center min-w-0">
                                <div
                                    class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                    {{ user.name.charAt(0).toUpperCase() }}
                                </div>
                                <div class="ml-4 truncate">
                                    <p class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</p>
                                    <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                                    {{ user.role }}
                                </span>
                                <div class="flex space-x-2">
                                    <button @click="openModal(user)"
                                        class="text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button @click="confirmDelete(user)"
                                        class="text-gray-400 hover:text-red-600 transition-colors" title="Eliminar">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-if="filteredUsers.length === 0" class="p-8 text-center text-gray-500">
                    No se encontraron usuarios.
                </div>
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
                            {{ isEditing ? 'Editar Usuario' : 'Añadir Usuario' }}
                        </h3>
                        <div class="mt-4 space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
                                <input v-model="form.name" type="text" id="name"
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    placeholder="Nombre completo">
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                                <input v-model="form.email" type="email" id="email"
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    placeholder="correo@ejemplo.com">
                            </div>
                            <div>
                                <label for="role" class="block text-sm font-medium text-gray-700">Rol</label>
                                <select v-model="form.role" id="role"
                                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                                    <option value="USER">Usuario</option>
                                    <option value="ADMIN">Administrador</option>
                                    <option value="DOCTOR">Médico</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button @click="saveUser" type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Guardar
                        </button>
                        <button @click="closeModal" type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
import { usuarios, isLoading, error, fetchUsuarios, createUsuario, updateUsuario, deleteUsuario } from '@/store/usuarios';

const searchQuery = ref('');
const isModalOpen = ref(false);
const isEditing = ref(false);
const form = ref({ id: null, name: '', email: '', role: 'USER' });

onMounted(async () => {
    try {
        await fetchUsuarios();
    } catch (err) {
        // Error handling is managed in the store but we could add local alerts here
    }
});

const filteredUsers = computed(() => {
    return usuarios.value.filter(user =>
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const openModal = (user = null) => {
    if (user) {
        isEditing.value = true;
        form.value = { ...user };
    } else {
        isEditing.value = false;
        form.value = { id: null, name: '', email: '', role: 'USER' };
    }
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    form.value = { id: null, name: '', email: '', role: 'USER' };
};

const saveUser = async () => {
    try {
        if (isEditing.value) {
            await updateUsuario(form.value.id, { ...form.value });
        } else {
            await createUsuario({ ...form.value });
        }
        closeModal();
    } catch (err) {
        alert('Error al guardar el usuario: ' + err.message);
    }
};

const confirmDelete = async (user) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${user.name}?`)) {
        try {
            await deleteUsuario(user.id);
        } catch (err) {
            alert('Error al eliminar el usuario: ' + err.message);
        }
    }
};
</script>
