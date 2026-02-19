<template>
  <!-- Desktop: sidebar vertical -->
  <nav class="hidden lg:flex flex-col gap-1 w-56 flex-shrink-0">
    <button
      v-for="item in sections"
      :key="item.id"
      @click="setSection(item.id)"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left"
      :class="activeSection === item.id
        ? 'bg-teal-600 text-white shadow-md shadow-teal-200 dark:shadow-teal-900'
        : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-300'"
    >
      <span class="text-lg">{{ item.icon }}</span>
      <span>{{ item.label }}</span>
    </button>
  </nav>

  <!-- Mobile/tablet: tabs horizontales -->
  <div class="lg:hidden w-full mb-4 overflow-x-auto">
    <div class="flex gap-1 min-w-max border-b border-gray-200 dark:border-gray-700 pb-0">
      <button
        v-for="item in sections"
        :key="item.id"
        @click="setSection(item.id)"
        class="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap"
        :class="activeSection === item.id
          ? 'border-teal-600 text-teal-700 dark:text-teal-400'
          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { activeSection, setSection } from '../../store/profile';

const sections = [
  { id: 'general',       icon: '👤', label: 'General' },
  { id: 'informes',      icon: '📋', label: 'Informes' },
  { id: 'citas',         icon: '📅', label: 'Citas' },
  { id: 'configuracion', icon: '⚙️',  label: 'Configuración' }
];
</script>
