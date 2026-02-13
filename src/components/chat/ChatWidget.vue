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
            :recipient="selectedContact" 
            @back="clearSelection" 
        />
        
        <!-- Si NO hay contacto, mostramos la Lista -->
        <ContactList 
            v-else 
            @select="selectContact" 
        />
        
        <button class="close-btn" @click="$emit('close')">X</button>
    </div>
</template>

<style scoped>
.chat-widget {
    width: 300px; 
    height: 400px; 
    border: 1px solid #ccc; 
    background: white; 
    box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
    border-radius: 8px; 
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
}
/* Forzamos que los hijos llenen el espacio */
.chat-widget > * { flex: 1; }
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
