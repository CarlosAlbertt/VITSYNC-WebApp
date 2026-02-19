<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-[9998] flex items-center justify-center p-4" @click.self="$emit('update:modelValue', false)">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Card -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
          <!-- Icono -->
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              :class="iconBg">
              <span class="text-xl">{{ icon }}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">{{ title }}</h3>
          </div>

          <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">{{ message }}</p>

          <!-- Campo opcional (motivo, etc.) -->
          <div v-if="showInput" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ inputLabel }}</label>
            <textarea
              v-model="inputValue"
              rows="2"
              :placeholder="inputPlaceholder"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            />
          </div>

          <!-- Botones -->
          <div class="flex gap-3 justify-end">
            <button
              @click="$emit('update:modelValue', false)"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :disabled="loading"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-60"
              :class="confirmBtnClass"
            >
              <span v-if="loading" class="flex items-center gap-2">
                <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Procesando...
              </span>
              <span v-else>{{ confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '¿Estás seguro?' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirmar' },
  cancelText: { type: String, default: 'Cancelar' },
  variant: { type: String, default: 'danger' }, // danger | warning | info
  showInput: { type: Boolean, default: false },
  inputLabel: { type: String, default: 'Motivo (opcional)' },
  inputPlaceholder: { type: String, default: '' },
  loading: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'confirm']);

const inputValue = ref('');

const iconBg = computed(() => ({
  danger: 'bg-red-100 dark:bg-red-900/30',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30',
  info: 'bg-teal-100 dark:bg-teal-900/30'
}[props.variant]));

const icon = computed(() => ({ danger: '', warning: '', info: '' }[props.variant]));

const confirmBtnClass = computed(() => ({
  danger: 'bg-red-600 hover:bg-red-700',
  warning: 'bg-yellow-500 hover:bg-yellow-600',
  info: 'bg-teal-600 hover:bg-teal-700'
}[props.variant]));

const handleConfirm = () => emit('confirm', inputValue.value);
</script>

<style scoped>
.modal-enter-active { transition: all 0.3s ease; }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from  { opacity: 0; transform: scale(0.95); }
.modal-leave-to   { opacity: 0; transform: scale(0.97); }
</style>
