<template>
  <Teleport to="body">
    <Transition name="toast">
      <!-- Contenedor a lo ancho, fijo arriba: centra el alert y permite que
           la animación use translateY sin pelearse con el centrado. -->
      <div v-if="toast.visible" class="toast-wrap">
        <div class="toast-alert" :class="`toast-${toast.type}`" role="alert" aria-live="assertive">
          <span class="toast-ico" aria-hidden="true">
            <!-- success -->
            <svg v-if="toast.type === 'success'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 10.5l3.5 3.5L15 6.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <!-- error -->
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 6l8 8M14 6l-8 8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <!-- info -->
            <svg v-else viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 9v5M10 6.5v.01" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="10" cy="10" r="7.5" />
            </svg>
          </span>

          <span class="toast-msg">{{ toast.message }}</span>

          <button @click="toast.visible = false" class="toast-close" aria-label="Cerrar aviso">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 6l8 8M14 6l-8 8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { toast } from '../../store/profile';
</script>

<style scoped>
.toast-wrap {
  position: fixed;
  top: 1rem;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  pointer-events: none;
}

.toast-alert {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  max-width: 26rem;
  padding: 0.75rem 0.85rem 0.75rem 1rem;
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border);
  border-radius: 0.75rem;
  box-shadow: 0 12px 32px -12px rgba(15, 23, 42, 0.35);
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Icono coloreado por tipo */
.toast-ico {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
}
.toast-ico svg { width: 1.05rem; height: 1.05rem; }

.toast-success .toast-ico { color: var(--accent); background-color: var(--accent-subtle); }
.toast-error   .toast-ico { color: #E11D48; background-color: rgba(244, 63, 94, 0.12); }
.toast-info    .toast-ico { color: #0EA5E9; background-color: rgba(14, 165, 233, 0.12); }

/* Borde de color completo según el tipo */
.toast-success { border-color: var(--accent); }
.toast-error   { border-color: #E11D48; }
.toast-info    { border-color: #0EA5E9; }

.toast-msg { flex: 1; min-width: 0; line-height: 1.4; }

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  flex-shrink: 0;
  border: none;
  background: transparent;
  border-radius: 0.45rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
}
.toast-close svg { width: 0.95rem; height: 0.95rem; }
.toast-close:hover { color: var(--text-primary); background-color: var(--bg-elevated); }

/* ── Animación: baja desde arriba, suave y fluida ───── */
.toast-enter-active {
  transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.1s ease;
}
.toast-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 1, 1), opacity 0.4s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-130%);
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active, .toast-leave-active { transition: opacity 0.2s ease; }
  .toast-enter-from, .toast-leave-to { transform: none; }
}
</style>
