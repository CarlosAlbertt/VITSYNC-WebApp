import { ref } from 'vue';

export const isChatOpen = ref(false);
export const globalSelectedContact = ref(null);

export const openChatWith = (contact) => {
    globalSelectedContact.value = contact;
    isChatOpen.value = true;
};

export const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value;
};
