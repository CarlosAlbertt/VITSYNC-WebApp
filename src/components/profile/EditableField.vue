<template>
  <div>
    <label v-if="label" class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
      {{ label }}<span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <!-- Modo vista -->
    <div v-if="!editing" class="flex items-center gap-2 min-h-[36px]">
      <span class="text-gray-800 dark:text-gray-100 text-sm">
        {{ displayValue }}
      </span>
    </div>

    <!-- Modo edición -->
    <div v-else>
      <!-- Select -->
      <select
        v-if="type === 'select'"
        v-model="localValue"
        :required="required"
        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        :class="{ 'border-red-400': error }"
      >
        <option value="" disabled>Seleccionar...</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>

      <!-- Textarea -->
      <textarea
        v-else-if="type === 'textarea'"
        v-model="localValue"
        :required="required"
        :placeholder="placeholder"
        rows="2"
        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 resize-none"
        :class="{ 'border-red-400': error }"
      />

      <!-- Input normal -->
      <input
        v-else
        v-model="localValue"
        :type="type"
        :required="required"
        :placeholder="placeholder"
        :readonly="readonly"
        class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 disabled:opacity-60"
        :class="{ 'border-red-400': error, 'bg-gray-50 dark:bg-gray-600 cursor-not-allowed': readonly }"
      />
      <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  label: String,
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  editing: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  mask: { type: Boolean, default: false },
  options: { type: Array, default: () => [] }, // para type='select'
  error: { type: String, default: null }
});
const emit = defineEmits(['update:modelValue']);

const localValue = ref(props.modelValue);

watch(() => props.modelValue, (v) => { localValue.value = v; });
watch(localValue, (v) => emit('update:modelValue', v));

const displayValue = computed(() => {
  if (!localValue.value && localValue.value !== 0) return '—';
  if (props.mask) return '••••••••';
  if (props.type === 'select') {
    const opt = props.options.find(o => o.value === localValue.value);
    return opt ? opt.label : localValue.value;
  }
  return localValue.value;
});
</script>
