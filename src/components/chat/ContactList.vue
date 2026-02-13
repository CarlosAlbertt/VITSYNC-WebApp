<script setup>
import { ref, onMounted } from 'vue';
import { currentUser } from '../../store/auth';
import { getMyMedicos, getMyPacientes } from '../../services/relationships';

const emit = defineEmits(['select']);
const contacts = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        if (currentUser.value.role === 'PATIENT') {
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
        <div class="header">Contactos</div>
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
.contact-list { display: flex; flex-direction: column; height: 100%; }
.header { padding: 15px; background: #007bff; color: white; font-weight: bold; }
.list { flex: 1; overflow-y: auto; }
.contact-item { display: flex; align-items: center; gap: 10px; padding: 10px; cursor: pointer; border-bottom: 1px solid #f0f0f0; transition: background 0.2s; }
.contact-item:hover { background: #f9f9f9; }
.avatar { width: 35px; height: 35px; background: #e0e0e0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #555; }
.name { font-weight: 500; }
.role { font-size: 0.8em; color: #888; }
.empty, .loading { padding: 20px; text-align: center; color: #888; }
</style>
