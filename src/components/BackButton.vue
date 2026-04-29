<script setup>
import { useRouter } from 'vue-router';

// Props: permite configurar el destino desde fuera
const props = defineProps({

    // Si se pasa 'to', navega a esa ruta específica
    // Si no se pasa, usa router.back() (historial del navegador)
    to: {
        type: String,
        default: null
    },

    // Texto del botón personalizado
    label: {
        type: String,
        default: 'Volver'
    }
});

const router = useRouter();

const handleBack = () => {
    if (props.to) {
        router.push(props.to);
    } else if (window.history.length > 1) {
        router.back();
    } else {
        router.push('/');
    }
};
</script>

<template>
    <button @click="handleBack" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
    </svg>
    {{ label }}
    </button>
</template>

<style scoped>

.back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.625rem;
    background-color: transparent;
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 800;
    cursor:pointer;
    transition: background-color 0.2s ease, color 0.2s ease,
        border-color 0.2s ease, transform 0.15s ease;
    text-decoration: none;
}

.back-btn:hover {
    background-color: var(--bg-elevated);
    color: var(--text-primary);
    border-color: var(--accent);
    transform: translateX(-2px);
}

.back-btn:active {
    transform: translateX(-4px);
}

.back-icon {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
}

</style>