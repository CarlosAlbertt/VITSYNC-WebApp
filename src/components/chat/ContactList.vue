<script setup>
import { ref, onMounted } from 'vue';
import { currentUser } from '../../store/auth';
import { getMyMedicos, getMyPacientes } from '../../services/relationships';

const emit = defineEmits(['select', 'close']);
const contacts = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        if (currentUser.value.role === 'PACIENTE') {
            contacts.value = await getMyMedicos(currentUser.value.id);
        } else if (currentUser.value.role === 'MEDICO') {
            contacts.value = await getMyPacientes(currentUser.value.id);
        }
    } catch (error) {
        console.error('Error cargando contactos:', error);
    } finally {
        loading.value = false;
    }
});

const selectContact = (contact) => {
    // If contact doesn't have an ID property, try 'id' or 'nif' depending on your backend
    emit('select', contact);
};
</script>

<template>
    <div class="contact-list">
        <div class="header">
            <span>Contactos</span>
            <button class="close-btn" @click="$emit('close')">✕</button>
        </div>
        <div v-if="loading" class="loading">Cargando...</div>
        <div v-else-if="contacts.length === 0" class="empty">No hay contactos disponibles.</div>
        
        <div v-else class="list">
            <div 
                v-for="contact in contacts" 
                :key="contact.id" 
                class="contact-item"
                @click="selectContact(contact)"
            >
                <div class="avatar">{{ contact.name?.charAt(0) || 'U' }}</div>
                <div class="info">
                    <div class="name">{{ contact.name }} {{ contact.lastName }}</div>
                    <div class="role">{{ contact.specialty || 'Paciente' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.contact-list { display: flex; flex-direction: column; height: 100%; background: white; }
.header { 
    padding: 15px; 
    background: #0d9488; 
    color: white; 
    font-weight: bold; 
    font-size: 1.05em;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.close-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}
.close-btn:hover { background: rgba(255,255,255,0.4); }
.list { flex: 1; overflow-y: auto; }
.contact-item { display: flex; align-items: center; gap: 10px; padding: 12px 15px; cursor: pointer; border-bottom: 1px solid #f0f0f0; transition: background 0.2s; }
.contact-item:hover { background: #f0fdfa; }
.avatar { width: 38px; height:38px; background: #ccfbf1; color: #0d9488; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.95em; }
.name { font-weight: 500; color: #1f2937; }
.role { font-size: 0.8em; color: #6b7280; }
.empty, .loading { padding: 20px; text-align: center; color: #888; } 
</style>
