<script setup>
/**
 * Privacy dashboard (RGPD Arts. 15, 17 y 20).
 *
 * Da acceso directo a los derechos del usuario contra los endpoints reales
 * del backend. El borrado es ANONIMIZACIÓN diferida 30 días (Ley 41/2002
 * obliga a conservar documentación clínica; ver docs del backend).
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getMyData, exportMyData, requestAccountDeletion } from '../services/gdprService';
import { logout } from '../store/auth';
import Header from '../components/HeaderComponent.vue';

const router = useRouter();

const myData = ref(null);
const loadingData = ref(false);
const exporting = ref(false);
const deleting = ref(false);
const showDeleteConfirm = ref(false);
const deletionDate = ref(null);
const error = ref(null);

const loadMyData = async () => {
    error.value = null;
    loadingData.value = true;
    try {
        myData.value = await getMyData();
    } catch {
        error.value = 'No se pudieron cargar tus datos. Inténtalo de nuevo.';
    } finally {
        loadingData.value = false;
    }
};

const downloadExport = async () => {
    error.value = null;
    exporting.value = true;
    try {
        const blob = await exportMyData();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'vitsync-datos.zip';
        link.click();
        URL.revokeObjectURL(url);
    } catch (err) {
        error.value = err.response?.status === 429
            ? 'Solo se permite una exportación cada 24 horas.'
            : 'No se pudo generar la exportación.';
    } finally {
        exporting.value = false;
    }
};

const confirmDeletion = async () => {
    error.value = null;
    deleting.value = true;
    try {
        const result = await requestAccountDeletion();
        deletionDate.value = result.scheduledAnonymizationDate;
        showDeleteConfirm.value = false;
        // La cuenta queda suspendida: cerrar sesión tras mostrar la fecha
        setTimeout(async () => {
            await logout();
            router.push('/login');
        }, 6000);
    } catch {
        error.value = 'No se pudo registrar la solicitud de eliminación.';
    } finally {
        deleting.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-[var(--bg-base)]">
        <Header />
        <div class="max-w-3xl mx-auto px-4 py-10">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Privacidad y tus datos</h1>
            <p class="text-slate-600 dark:text-slate-400 mb-8">
                Ejercicio de tus derechos según el RGPD (UE 2016/679) y la LOPDGDD.
            </p>

            <div v-if="error"
                class="mb-6 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-red-700 dark:text-red-300 text-sm">
                {{ error }}
            </div>

            <div v-if="deletionDate"
                class="mb-6 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-4 py-3 text-amber-800 dark:text-amber-300 text-sm">
                Solicitud registrada. Tu cuenta queda suspendida y tus datos se anonimizarán el
                <strong>{{ deletionDate }}</strong>. Recibirás un email de confirmación.
                Se cerrará tu sesión automáticamente.
            </div>

            <!-- Qué datos tratamos -->
            <section class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">¿Qué datos tratamos?</h2>
                <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                    <li><strong>Identificativos:</strong> nombre, NIF, email, teléfono, dirección — para gestionar tu cuenta.</li>
                    <li><strong>De salud (categoría especial):</strong> citas, informes y mensajes clínicos — para prestarte asistencia. Se almacenan cifrados.</li>
                    <li><strong>Conservación:</strong> la documentación clínica se conserva los plazos que exige la Ley 41/2002; el resto, mientras tu cuenta exista.</li>
                </ul>
            </section>

            <!-- Art. 15: acceso -->
            <section class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Mis datos (Art. 15)</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Consulta todo lo que VitSync almacena sobre ti.
                </p>
                <button @click="loadMyData" :disabled="loadingData"
                    class="rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 text-sm transition-colors">
                    {{ loadingData ? 'Cargando…' : 'Ver mis datos' }}
                </button>
                <div v-if="myData" class="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div class="rounded-xl bg-slate-50 dark:bg-slate-900 p-3">
                        <p class="text-2xl font-black text-teal-600">{{ myData.citas?.length ?? 0 }}</p>
                        <p class="text-xs text-slate-500 uppercase tracking-wide">Citas</p>
                    </div>
                    <div class="rounded-xl bg-slate-50 dark:bg-slate-900 p-3">
                        <p class="text-2xl font-black text-teal-600">{{ myData.informes?.length ?? 0 }}</p>
                        <p class="text-xs text-slate-500 uppercase tracking-wide">Informes</p>
                    </div>
                    <div class="rounded-xl bg-slate-50 dark:bg-slate-900 p-3">
                        <p class="text-2xl font-black text-teal-600">{{ myData.mensajes?.length ?? 0 }}</p>
                        <p class="text-xs text-slate-500 uppercase tracking-wide">Mensajes</p>
                    </div>
                </div>
            </section>

            <!-- Art. 20: portabilidad -->
            <section class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Exportar mis datos (Art. 20)</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Descarga un ZIP con tus datos en formato legible y reutilizable (máximo una vez cada 24 h).
                </p>
                <button @click="downloadExport" :disabled="exporting"
                    class="rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 text-sm transition-colors">
                    {{ exporting ? 'Generando…' : 'Descargar ZIP' }}
                </button>
            </section>

            <!-- Art. 17: olvido -->
            <section class="rounded-2xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 p-6">
                <h2 class="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Eliminar mi cuenta (Art. 17)</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Tu cuenta se suspende de inmediato y tus datos identificativos se anonimizan de forma
                    irreversible tras 30 días. Las citas futuras se cancelan. La documentación clínica se
                    conserva disociada de tu identidad por obligación legal (Ley 41/2002).
                </p>
                <button v-if="!showDeleteConfirm" @click="showDeleteConfirm = true"
                    class="rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 text-sm transition-colors">
                    Solicitar eliminación
                </button>
                <div v-else class="flex flex-wrap items-center gap-3">
                    <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">¿Seguro? Esta acción no se puede deshacer.</span>
                    <button @click="confirmDeletion" :disabled="deleting"
                        class="rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-4 py-2 text-sm">
                        {{ deleting ? 'Enviando…' : 'Sí, eliminar' }}
                    </button>
                    <button @click="showDeleteConfirm = false"
                        class="rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2 text-sm">
                        Cancelar
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>
