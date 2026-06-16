<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ContactList from './ContactList.vue';
import ChatWindow from './ChatWindow.vue';
import { globalSelectedContact } from '../../store/chat';

const emit = defineEmits(['close']);
const selectedContact = ref(null);

onMounted(() => {
    if (globalSelectedContact.value) {
        selectedContact.value = globalSelectedContact.value;
    }
});

onUnmounted(() => {
    globalSelectedContact.value = null; // Limpiar al cerrar el widget
});

const selectContact = (contact) => {
    selectedContact.value = contact;
};

const clearSelection = () => {
    selectedContact.value = null;
    globalSelectedContact.value = null;
};
</script>

<template>
    <div class="chat-widget">
        <!-- Si HAY contacto seleccionado, mostramos el Chat -->
        <ChatWindow 
            v-if="selectedContact"
            :isOpen="true"
            :recipientId="selectedContact.id || selectedContact.nif || selectedContact.email || selectedContact.idUsuario || selectedContact.codigo"
            :recipientName="(selectedContact.name || selectedContact.nombre || '') + ' ' + (selectedContact.firstName || '')"
            :recipientRole="selectedContact.role || ''"
            :recipientPhoto="selectedContact.photo || selectedContact.avatarUrl || ''"
            @close="$emit('close')"
            @back="clearSelection"
            />

        <!-- Si NO hay contacto, mostramos la Lista -->
        <ContactList 
            v-else 
            @select="selectContact" 
            @close="$emit('close')"
        />
    </div>
</template>

<style scoped>
.chat-widget {
    width: 360px;
    height: 480px;
    border: 1px solid var(--border);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--bg-surface);
}

/* Forzamos que los hijos llenen el espacio */
.chat-widget > :first-child { flex: 1; min-height: 0; }
.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.2);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    z-index: 10;
}
.close-btn:hover { background: rgba(0,0,0,0.4); }
</style>
