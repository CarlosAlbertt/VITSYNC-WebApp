import { ref } from 'vue';

// Estado reactivo global para controlar el modal de reserva de citas
export const isBookingOpen = ref(false);
export const initialBookingData = ref(null);

export const openBooking = (initialData = null) => {
    initialBookingData.value = initialData;
    isBookingOpen.value = true;
    // Bloquear scroll del body mientras el modal está abierto
    document.body.style.overflow = 'hidden';
};

export const closeBooking = () => {
    isBookingOpen.value = false;
    initialBookingData.value = null;
    document.body.style.overflow = '';
};
