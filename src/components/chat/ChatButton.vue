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
  background-color: #1a2e44;
  color: white;
  border: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(26, 46, 68, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: transform 0.2s, background-color 0.2s;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  background-color: #0f1f30;
}
</style>
