<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
    <!-- Header: Mês y controles -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 capitalize">
        {{ currentMonthName }} {{ currentYear }}
      </h3>
      <div class="flex gap-2">
        <button @click="changeMonth(-1)" class="px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 font-medium text-sm">
          Anterior
        </button>
        <button @click="changeMonth(1)" class="px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 font-medium text-sm">
          Siguiente
        </button>
      </div>
    </div>

    <!-- Días de la semana -->
    <div class="grid grid-cols-7 gap-1 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
      <div v-for="day in weekDays" :key="day" class="text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
        {{ day }}
      </div>
    </div>

    <!-- Grid del mes -->
    <div class="grid grid-cols-7 gap-1">
      <div v-for="(day, idx) in days" :key="idx" 
           class="min-h-[90px] p-1 border border-transparent hover:border-teal-100 dark:hover:border-teal-900/50 rounded-lg relative transition-all"
           :class="[
             day.isCurrentMonth ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-gray-50/50 dark:bg-gray-800/30 text-gray-400 dark:text-gray-600',
             day.isToday ? 'ring-2 ring-teal-500 ring-inset bg-teal-50/10 dark:bg-teal-900/10' : ''
           ]">
        <div class="text-xs font-medium mb-1 px-1" :class="day.isToday ? 'text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'">
          {{ day.date.getDate() }}
        </div>
        
        <!-- Eventos -->
        <div class="space-y-1 mt-1 overflow-y-auto max-h-[60px] custom-scrollbar">
          <div v-for="appt in getAppointmentsForDay(day.date)" :key="appt.id"
               @click="$emit('select-appointment', appt)"
               class="text-[10px] leading-tight truncate px-1.5 py-0.5 rounded cursor-pointer transition-colors"
               :class="{
                 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300': appt.status === 'Programada',
                 'bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900/40 dark:text-teal-300': appt.status === 'Confirmada',
                 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400': appt.status === 'Completada',
                 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400': appt.status === 'Cancelada'
               }">
             {{ appt.time.substring(0, 5) }} {{ appt.doctor }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  appointments: { type: Array, default: () => [] }
});
defineEmits(['select-appointment']);

const currentDate = ref(new Date());

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());

const currentMonthName = computed(() => {
  return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentDate.value);
});

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const getAppointmentsForDay = (date) => {
  // Configurar date en hora local para la comparación ISO
  const d = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  const dateStr = d.toISOString().split('T')[0];
  return props.appointments.filter(a => a.date === dateStr);
};

const changeMonth = (delta) => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + delta, 1);
};

const days = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Ajustar para que la semana empiece en Lunes (1) en lugar de Domingo (0)
  let firstDayOfWeek = firstDayOfMonth.getDay() || 7;
  firstDayOfWeek--;
  
  const daysArray = [];
  const today = new Date();
  today.setHours(0,0,0,0);

  // Días del mes anterior
  for (let i = firstDayOfWeek; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    daysArray.push({ date: d, isCurrentMonth: false, isToday: d.getTime() === today.getTime() });
  }
  
  // Días del mes actual
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(year, month, i);
    daysArray.push({ date: d, isCurrentMonth: true, isToday: d.getTime() === today.getTime() });
  }
  
  // Días del mes siguiente para completar la cuadrícula (hasta 42 días)
  const remainingDays = 42 - daysArray.length;
  for (let i = 1; i <= remainingDays; i++) {
    const d = new Date(year, month + 1, i);
    daysArray.push({ date: d, isCurrentMonth: false, isToday: d.getTime() === today.getTime() });
  }
  
  return daysArray;
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>
