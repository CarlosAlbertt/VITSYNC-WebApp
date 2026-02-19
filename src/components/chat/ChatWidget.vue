<script setup>
import { ref } from 'vue';
import ContactList from './ContactList.vue';
import ChatWindow from './ChatWindow.vue';

const emit = defineEmits(['close']);
const selectedContact = ref(null);

const selectContact = (contact) => {
    selectedContact.value = contact;
};

const clearSelection = () => {
    selectedContact.value = null;
};
</script>

<template>
    <div class="chat-widget">
        <!-- Si HAY contacto seleccionado, mostramos el Chat -->
        <ChatWindow 
            v-if="selectedContact"
            :isOpen="true"
            :recipientId="selectedContact.id"
            :recipientName="selectedContact.name || selectedContact.nombre"
            :recipientRole="selectedContact.role || ''"
            :recipientPhoto="selectedContact.photo || ''"
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
    border: 1px solid #e5e7eb;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
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
