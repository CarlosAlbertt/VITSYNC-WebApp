<script setup>
import AdminHeader from '@/components/admin/AdminHeader.vue';
</script>

<template>
  <div class="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
    <AdminHeader />
    <main class="flex-grow">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
