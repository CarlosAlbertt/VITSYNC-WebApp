<script setup>
import { ref, onMounted } from 'vue';
import { currentUser } from '../../store/auth';
import { getMyMedicos, getMyPacientes } from '../../services/relationships';

const emit = defineEmits(['select', 'close']);
const contacts = ref([]);
const loading = ref(true);
const errorMsg = ref(null);

onMounted(async () => {
    try {
        errorMsg.value = null;
        let raw = [];
        const role = currentUser.value.role;
        const id = currentUser.value.id;

        if (!id) {
            console.warn('[Chat] No se encontró ID de usuario');
            loading.value = false;
            return;
        }

        if (role === 'PACIENTE' || role === 'PATIENT') {
            raw = await getMyMedicos(id);
        } else if (role === 'MEDICO' || role === 'DOCTOR') {
            raw = await getMyPacientes(id);
        }
        
        if (!Array.isArray(raw)) {
            console.warn('[Chat] La respuesta no es un array:', raw);
            raw = [];
        }

        const seen = new Set();
        contacts.value = raw
            .filter(c => c !== null && typeof c === 'object')
            .filter(c => {
                const key = c.id ?? c.nif ?? c.email ?? Math.random();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
    } catch (error) {
        console.error('[Chat] Error cargando contactos:', error);
        errorMsg.value = 'No se pudieron cargar los contactos. Inténtalo de nuevo más tarde.';
    } finally {
        loading.value = false;
    }
});

const selectContact = (contact) => {
    emit('select', contact);
};

const getInitials = (contact) => {
    const name = contact.name || contact.nombre || contact.firstName || '';
    return name.charAt(0).toUpperCase() || 'U';
};

const getDisplayName = (contact) => {
    const name = contact.name || contact.nombre || '';
    const first = contact.firstName || '';
    const second = contact.secondName || '';
    const full = `${name} ${first} ${second}`.trim();
    return full || 'Usuario sin nombre';
};

const getDisplayRole = (contact) => {
    return contact.especialidad?.nombre || contact.specialty || 'Contacto';
};
</script>

<template>
    <div class="contact-list">
        <div class="header">
            <span>Mensajes</span>
            <button class="close-btn" @click="$emit('close')">✕</button>
        </div>
        
        <div v-if="loading" class="state-container">
            <div class="spinner"></div>
            <p>Buscando contactos...</p>
        </div>
        
        <div v-else-if="errorMsg" class="state-container error">
            <p>{{ errorMsg }}</p>
        </div>
        
        <div v-else-if="contacts.length === 0" class="state-container empty">
            <div class="empty-icon">👥</div>
            <p>No tienes contactos asignados todavía.</p>
        </div>
        
        <div v-else class="list">
            <div 
                v-for="(contact, index) in contacts" 
                :key="contact.id ?? contact.nif ?? index" 
                class="contact-item"
                @click="selectContact(contact)"
            >
                <div class="avatar">{{ getInitials(contact) }}</div>
                <div class="info">
                    <div class="name">{{ getDisplayName(contact) }}</div>
                    <div class="role">{{ getDisplayRole(contact) }}</div>
                </div>
                <div class="chevron">›</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.contact-list { display: flex; flex-direction: column; height: 100%; background: #ffffff; color: #1f2937; border-radius: 12px; overflow: hidden; }
.header { 
    padding: 18px 20px; 
    background: linear-gradient(135deg, #0d9488, #0f766e);
    color: white; 
    font-weight: 600; 
    font-size: 1.1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.close-btn {
    background: rgba(255,255,255,0.15);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}
.close-btn:hover { background: rgba(255,255,255,0.3); transform: rotate(90deg); }

.list { flex: 1; overflow-y: auto; padding: 5px 0; }
.contact-item { 
    display: flex; 
    align-items: center; 
    gap: 14px; 
    padding: 12px 20px; 
    cursor: pointer; 
    border-bottom: 1px solid #f3f4f6; 
    transition: background 0.2s;
}
.contact-item:last-child { border-bottom: none; }
.contact-item:hover { background: #f0fdfa; }

.avatar { 
    width: 44px; 
    height: 44px; 
    background: #ccfbf1; 
    color: #0d9488; 
    border-radius: 12px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-weight: 700; 
    font-size: 1.1em;
    flex-shrink: 0;
}
.info { flex: 1; min-width: 0; }
.name { font-weight: 600; color: #111827; font-size: 0.95em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.role { font-size: 0.8em; color: #6b7280; margin-top: 1px; }
.chevron { color: #d1d5db; font-size: 1.5em; font-weight: 300; }

.state-container { 
    flex: 1; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    padding: 40px 20px; 
    text-align: center; 
    color: #6b7280;
}
.empty-icon { font-size: 3em; margin-bottom: 15px; opacity: 0.3; }
.error { color: #ef4444; }

.spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #0d9488;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>

