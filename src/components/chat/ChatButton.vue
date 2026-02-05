<script setup>
  const emit = defineEmits(['toggle']);
</script>

<template>
  <button class="chat-toggle-btn" @click="emit('toggle')">
    💬
  </button>
</template>

<style scoped>
.chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: bg-orange-500;
  color: bg-teal-600;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: transform 0.2s;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  background-color: bg-teal-600;
}
</style>
