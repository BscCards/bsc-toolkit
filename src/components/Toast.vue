<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="div"
      class="toast-container"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✓</span>
          <span v-else-if="toast.type === 'error'">✕</span>
          <span v-else-if="toast.type === 'warning'">⚠</span>
          <span v-else>ℹ</span>
        </div>
        <div class="toast-content">
          {{ toast.message }}
        </div>
        <button
          class="toast-close"
          @click="removeToast(toast.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { toastState, removeToast } from '@/composables/useToast'

const toasts = toastState.toasts
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 450px;
  padding: 14px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  border-left: 4px solid;
  pointer-events: auto;
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  border-left-color: #10b981;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 16px;
}

.toast-success .toast-icon {
  background: #d1fae5;
  color: #10b981;
}

.toast-error .toast-icon {
  background: #fee2e2;
  color: #ef4444;
}

.toast-warning .toast-icon {
  background: #fef3c7;
  color: #f59e0b;
}

.toast-info .toast-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.toast-content {
  flex: 1;
  color: #1f2937;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  padding: 0;
}

.toast-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.95);
}

@media (max-width: 640px) {
  .toast-container {
    top: 70px;
    right: 12px;
    left: 12px;
  }

  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>
