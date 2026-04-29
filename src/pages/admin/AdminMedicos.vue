<template>
    <div class="min-h-screen bg-[var(--bg-base)] p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-[var(--text-primary)]">Gestión de Médicos</h1>
                    <p class="mt-2 text-[var(--text-secondary)]">Administra el personal médico y sus especialidades.</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <button @click="openModal()"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Añadir Médico
                    </button>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-[var(--bg-surface)] rounded-xl shadow-sm border border-[var(--border)] p-4 mb-6 flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1 max-w-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input v-model="searchQuery" type="text"
                        class="block w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Buscar por nombre, colegiado o especialidad..." />
                </div>
                <select v-model="filterActivo"
                    class="border border-[var(--border)] rounded-lg text-sm px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-primary)] focus:ring-1 focus:ring-teal-500 focus:border-teal-500">
                    <option value="all">Todos</option>
                    <option value="true">Activos</option>
                    <option value="false">Inactivos</option>
                </select>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="p-12 text-center text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                <svg class="animate-spin h-8 w-8 text-teal-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cargando médicos...
            </div>

            <!-- Error -->
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

            <!-- Cards Grid -->
            <div v-if="!isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="doctor in filteredDoctors" :key="doctor.id"
                    class="bg-[var(--bg-surface)] rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-md transition-shadow relative result-card group">

                    <!-- Action buttons (hover) -->
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <button @click="openModal(doctor)"
                            class="p-1 text-[var(--text-muted)] hover:text-teal-600 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="Editar">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button @click="openDeleteModal(doctor)"
                            class="p-1 text-[var(--text-muted)] hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Eliminar">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <!-- Card content -->
                    <div class="flex items-center space-x-4 mb-3">
                        <div class="flex-shrink-0 h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-xl">
                            {{ doctor.name?.charAt(0)?.toUpperCase() || '?' }}
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="text-lg font-bold text-[var(--text-primary)] truncate">{{ fullName(doctor) }}</h3>
                            <p class="text-xs text-[var(--text-secondary)] truncate">{{ doctor.email }}</p>
                        </div>
                    </div>

                    <!-- Badges -->
                    <div class="flex items-center space-x-2 mb-4">
                        <span v-if="doctor.especialidad"
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 truncate max-w-[150px]">
                            {{ doctor.especialidad.nombre }}
                        </span>
                        <span v-else class="text-xs text-[var(--text-muted)] italic">Sin especialidad</span>

                        <span :class="doctor.activo ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'"
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                            {{ doctor.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                    </div>

                    <!-- Toggle button & Colegiado -->
                    <div class="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                        <span class="text-xs text-[var(--text-secondary)] font-mono" title="Número de colegiado">
                            Col: {{ doctor.numeroColegiado || '—' }}
                        </span>
                        <button @click="handleToggle(doctor.id)" :class="doctor.activo
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-300 hover:bg-gray-400'"
                            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            :title="doctor.activo ? 'Desactivar' : 'Activar'">
                            <span :class="doctor.activo ? 'translate-x-5' : 'translate-x-0'"
                                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="!isLoading && filteredDoctors.length === 0" class="p-12 text-center text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] mt-6">
                No se encontraron médicos.
            </div>
        </div>

        <!-- ===== FORM MODAL (Crear / Editar) ===== -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            role="dialog" aria-labelledby="modal-title" aria-modal="true">
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" @click="closeModal"></div>
            <div class="relative z-10 bg-[var(--bg-surface)] rounded-lg text-left shadow-xl w-full max-w-2xl my-8">
                <div class="bg-[var(--bg-surface)] px-6 pt-6 pb-4 rounded-t-lg">
                    <h3 class="text-lg font-medium text-[var(--text-primary)] mb-1" id="modal-title">
                        {{ isEditing ? 'Editar Médico' : 'Añadir Médico' }}
                    </h3>
                    <p class="text-sm text-[var(--text-secondary)] mb-4">Los campos marcados con <span class="text-red-500">*</span> son obligatorios.</p>

                    <!-- Error modal -->
                    <div v-if="formError"
                        class="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                        <svg class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-sm text-red-700">{{ formError }}</span>
                    </div>

                    <div class="space-y-4">
                        <!-- Sección datos personales -->
                        <p class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Datos personales</p>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Nombre <span class="text-red-500">*</span></label>
                                <input v-model="form.name" type="text"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                    placeholder="Juan">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Primer apellido <span class="text-red-500">*</span></label>
                                <input v-model="form.firstName" type="text"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                    placeholder="García">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Segundo apellido <span class="text-red-500">*</span></label>
                                <input v-model="form.secondName" type="text"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                    placeholder="López">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">NIF <span class="text-red-500">*</span></label>
                                <input v-model="form.nif" type="text"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                    placeholder="12345678A">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Email <span class="text-red-500">*</span></label>
                                <input v-model="form.email" type="email"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                    placeholder="juan@vitsync.es">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Género <span class="text-red-500">*</span></label>
                                <select v-model="form.gender"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]">
                                    <option value="HOMBRE">Masculino</option>
                                    <option value="MUJER">Femenino</option>
                                    <option value="OTRO">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Fecha nacimiento <span class="text-red-500">*</span></label>
                                <input v-model="form.birthDate" type="date"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Teléfono <span class="text-red-500">*</span></label>
                                <input v-model="form.phone" type="tel"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                    placeholder="600123456">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div class="sm:col-span-2">
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Dirección <span class="text-red-500">*</span></label>
                                <input v-model="form.address" type="text"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                    placeholder="Calle Mayor 1">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Código postal <span class="text-red-500">*</span></label>
                                <input v-model="form.postCode" type="text"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                    placeholder="28001">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-[var(--text-secondary)]">País <span class="text-red-500">*</span></label>
                            <input v-model="form.country" type="text"
                                class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                placeholder="España">
                        </div>

                        <!-- Contraseña -->
                        <div>
                            <label class="block text-sm font-medium text-[var(--text-secondary)]">
                                Contraseña{{ isEditing ? ' (dejar vacío para no cambiar)' : '' }}
                                <span v-if="!isEditing" class="text-red-500">*</span>
                            </label>
                            <input v-model="form.password" type="password"
                                class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                placeholder="••••••••">
                        </div>

                        <!-- Sección datos médicos -->
                        <p class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider pt-2">Datos médicos</p>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Nº Colegiado <span class="text-red-500">*</span></label>
                                <input v-model="form.numeroColegiado" type="text"
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border font-mono"
                                    placeholder="28-12345">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-secondary)]">Especialidad</label>
                                <select v-model="form.especialidadId"
                                    class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]">
                                    <option :value="null">— Sin asignar —</option>
                                    <option v-for="esp in especialidadesOptions" :key="esp.id" :value="esp.id">
                                        {{ esp.nombre }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-[var(--text-secondary)]">Foto URL</label>
                            <input v-model="form.fotoUrl" type="url"
                                class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                placeholder="https://...">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-[var(--text-secondary)]">Biografía</label>
                            <textarea v-model="form.bio" rows="3"
                                class="mt-1 block w-full border-[var(--border)] rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm p-2 border bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                placeholder="Breve descripción del médico y su experiencia..."></textarea>
                        </div>

                        <div class="flex items-center space-x-3">
                            <input v-model="form.activo" type="checkbox" id="activo-medico"
                                class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded">
                            <label for="activo-medico" class="text-sm font-medium text-[var(--text-secondary)]">Médico activo</label>
                        </div>
                    </div>
                </div>

                <div class="bg-[var(--bg-elevated)] px-6 py-4 flex flex-row-reverse gap-3 rounded-b-lg">
                    <button @click="saveMedico" type="button" :disabled="isSaving"
                        class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {{ isSaving ? 'Guardando...' : 'Guardar' }}
                    </button>
                    <button @click="closeModal" type="button"
                        class="inline-flex justify-center rounded-md border border-[var(--border)] shadow-sm px-4 py-2 bg-[var(--bg-surface)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>

        <!-- ===== DELETE CONFIRMATION MODAL ===== -->
        <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" @click="closeDeleteModal"></div>
            <div class="relative z-10 bg-[var(--bg-surface)] rounded-lg text-left shadow-xl w-full max-w-sm">
                <div class="bg-[var(--bg-surface)] px-4 pt-5 pb-4 sm:p-6 rounded-t-lg">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0 p-2 bg-red-100 rounded-full">
                            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-medium text-[var(--text-primary)]">Eliminar médico</h3>
                            <p class="mt-1 text-sm text-[var(--text-secondary)]">
                                ¿Estás seguro de que quieres eliminar a
                                <strong>{{ doctorToDelete ? fullName(doctorToDelete) : '' }}</strong>?
                                Esta acción es irreversible.
                            </p>
                            <p class="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                                Considera desactivar al médico en lugar de eliminarlo para conservar el historial.
                            </p>
                            <div v-if="deleteError" class="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">
                                {{ deleteError }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-[var(--bg-elevated)] px-4 py-3 flex flex-row-reverse gap-2 rounded-b-lg">
                    <button @click="confirmDelete" :disabled="isDeleting"
                        class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
                    </button>
                    <button @click="closeDeleteModal" type="button"
                        class="inline-flex justify-center rounded-md border border-[var(--border)] shadow-sm px-4 py-2 bg-[var(--bg-surface)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] focus:outline-none">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>

        <!-- ===== TOAST ===== -->
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
    medicos,
    isLoading,
    error,
    fetchAllMedicos,
    createMedico,
    updateMedico,
    deleteMedico,
    toggleActivoMedico
} from '@/store/medicos';
import { fetchAllEspecialidades } from '@/store/especialidades';

const router = useRouter();

// ── UI State ──────────────────────────────────────────────────────────────────
const searchQuery = ref('');
const filterActivo = ref('all');
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const formError = ref(null);
const isDeleteModalOpen = ref(false);
const doctorToDelete = ref(null);
const isDeleting = ref(false);
const deleteError = ref(null);
const toast = ref({ show: false, message: '', type: 'success' });
const especialidadesOptions = ref([]);

// ── Form ──────────────────────────────────────────────────────────────────────
const emptyForm = () => ({
    id: null,
    name: '',
    firstName: '',
    secondName: '',
    nif: '',
    email: '',
    password: '',
    gender: 'HOMBRE',
    birthDate: '',
    phone: '',
    address: '',
    postCode: '',
    country: 'España',
    numeroColegiado: '',
    fotoUrl: '',
    bio: '',
    especialidadId: null,
    activo: true
});

const form = ref(emptyForm());

// ── Helpers ───────────────────────────────────────────────────────────────────
const fullName = (d) => [d.name, d.firstName, d.secondName].filter(Boolean).join(' ');

const showToast = (message, type = 'success') => {
    toast.value = { show: true, message, type };
    setTimeout(() => { toast.value.show = false; }, 3500);
};

const extractApiError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
        return 'Sin permisos de administrador.';
    }
    return err.response?.data?.error || err.response?.data?.message || err.message || 'Error desconocido.';
};

// ── Data loading ──────────────────────────────────────────────────────────────
const loadData = async () => {
    try {
        await fetchAllMedicos();
        const esps = await fetchAllEspecialidades();
        especialidadesOptions.value = esps;
    } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
            router.push({ name: 'login' });
        }
    }
};

onMounted(loadData);

// ── Filtering ─────────────────────────────────────────────────────────────────
const filteredDoctors = computed(() => {
    const q = searchQuery.value.toLowerCase();
    return medicos.value.filter(d => {
        const matchSearch =
            fullName(d).toLowerCase().includes(q) ||
            d.numeroColegiado?.toLowerCase().includes(q) ||
            d.especialidad?.nombre?.toLowerCase().includes(q) ||
            d.email?.toLowerCase().includes(q);
        const matchActivo = filterActivo.value === 'all'
            ? true
            : String(d.activo) === filterActivo.value;
        return matchSearch && matchActivo;
    });
});

// ── Form modal ────────────────────────────────────────────────────────────────
const openModal = (item = null) => {
    formError.value = null;
    if (item) {
        isEditing.value = true;
        form.value = {
            id: item.id,
            name: item.name || '',
            firstName: item.firstName || '',
            secondName: item.secondName || '',
            nif: item.nif || '',
            email: item.email || '',
            password: '',
            gender: item.gender || 'HOMBRE',
            birthDate: item.birthDate || '',
            phone: item.phone || '',
            address: item.address || '',
            postCode: item.postCode || '',
            country: item.country || 'España',
            numeroColegiado: item.numeroColegiado || '',
            fotoUrl: item.fotoUrl || '',
            bio: item.bio || '',
            especialidadId: item.especialidad?.id ?? null,
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

const saveMedico = async () => {
    formError.value = null;

    // Validación cliente
    if (!form.value.name.trim()) { formError.value = 'El nombre es obligatorio.'; return; }
    if (!form.value.firstName.trim()) { formError.value = 'El primer apellido es obligatorio.'; return; }
    if (!form.value.secondName.trim()) { formError.value = 'El segundo apellido es obligatorio.'; return; }
    if (!form.value.nif.trim()) { formError.value = 'El NIF es obligatorio.'; return; }
    if (!form.value.email.trim()) { formError.value = 'El email es obligatorio.'; return; }
    if (!isEditing.value && !form.value.password.trim()) { formError.value = 'La contraseña es obligatoria.'; return; }
    if (!form.value.birthDate) { formError.value = 'La fecha de nacimiento es obligatoria.'; return; }
    if (!form.value.phone.trim()) { formError.value = 'El teléfono es obligatorio.'; return; }
    if (!form.value.address.trim()) { formError.value = 'La dirección es obligatoria.'; return; }
    if (!form.value.postCode.trim()) { formError.value = 'El código postal es obligatorio.'; return; }
    if (!form.value.country.trim()) { formError.value = 'El país es obligatorio.'; return; }
    if (!form.value.numeroColegiado.trim()) { formError.value = 'El número de colegiado es obligatorio.'; return; }

    const payload = {
        name: form.value.name.trim(),
        firstName: form.value.firstName.trim(),
        secondName: form.value.secondName.trim(),
        nif: form.value.nif.trim(),
        email: form.value.email.trim(),
        gender: form.value.gender,
        birthDate: form.value.birthDate,
        phone: form.value.phone.trim(),
        address: form.value.address.trim(),
        postCode: form.value.postCode.trim(),
        country: form.value.country.trim(),
        numeroColegiado: form.value.numeroColegiado.trim(),
        fotoUrl: form.value.fotoUrl?.trim() || null,
        bio: form.value.bio?.trim() || null,
        especialidadId: form.value.especialidadId || null,
        activo: form.value.activo
    };
    // Solo añadir contraseña si se ha rellenado
    if (form.value.password?.trim()) {
        payload.password = form.value.password.trim();
    }

    try {
        isSaving.value = true;
        if (isEditing.value) {
            await updateMedico(form.value.id, payload);
            showToast('Médico actualizado correctamente.');
        } else {
            await createMedico(payload);
            showToast('Médico creado correctamente.');
        }
        closeModal();
        await loadData();
    } catch (err) {
        const msg = extractApiError(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
            formError.value = msg;
        } else {
            formError.value = msg || 'Error al guardar el médico.';
        }
    } finally {
        isSaving.value = false;
    }
};

// ── Toggle activo ─────────────────────────────────────────────────────────────
const handleToggle = async (id) => {
    try {
        await toggleActivoMedico(id);
    } catch (err) {
        showToast(extractApiError(err), 'error');
    }
};

// ── Delete modal ──────────────────────────────────────────────────────────────
const openDeleteModal = (item) => {
    doctorToDelete.value = item;
    deleteError.value = null;
    isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    doctorToDelete.value = null;
    deleteError.value = null;
};

const confirmDelete = async () => {
    if (!doctorToDelete.value) return;
    deleteError.value = null;
    try {
        isDeleting.value = true;
        await deleteMedico(doctorToDelete.value.id);
        showToast(`"${fullName(doctorToDelete.value)}" eliminado correctamente.`);
        closeDeleteModal();
        await loadData();
    } catch (err) {
        deleteError.value = extractApiError(err);
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
