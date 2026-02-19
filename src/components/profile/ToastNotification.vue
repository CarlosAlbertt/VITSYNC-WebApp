<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toast.visible"
        class="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white text-sm font-medium max-w-sm"
        :class="bgClass"
        role="alert"
      >
        <!-- Icono -->
        <span class="text-lg">{{ icon }}</span>
        <span>{{ toast.message }}</span>
        <button @click="toast.visible = false" class="ml-auto opacity-70 hover:opacity-100 transition-opacity">✕</button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { toast } from '../../store/profile';

const bgClass = computed(() => ({
  'bg-teal-600': toast.type === 'success',
  'bg-red-500': toast.type === 'error',
  'bg-blue-500': toast.type === 'info'
}));

const icon = computed(() => ({
  success: '✓',
  error: '✕',
  info: 'ℹ'
}[toast.type] || '✓'));
</script>

<style scoped>
.toast-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.25s ease-in; }
.toast-enter-from  { opacity: 0; transform: translateY(20px) scale(0.95); }
.toast-leave-to   { opacity: 0; transform: translateY(10px); }
</style>
