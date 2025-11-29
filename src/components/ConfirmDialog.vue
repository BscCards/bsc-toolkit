<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click="handleCancel"
      >
        <div
          class="modal-container"
          @click.stop
        >
          <div class="modal-icon">
            {{ icon }}
          </div>
          <h3 class="modal-title">
            {{ title }}
          </h3>
          <p class="modal-message">
            {{ message }}
          </p>
          <div class="modal-actions">
            <button
              class="modal-button cancel"
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="modal-button confirm"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm'
  },
  message: {
    type: String,
    default: 'Are you sure?'
  },
  icon: {
    type: String,
    default: '⚠️'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  text-align: center;
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #111;
}

.modal-message {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-button {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-button.cancel {
  background: #f5f5f5;
  color: #666;
}

.modal-button.cancel:hover {
  background: #e5e5e5;
}

.modal-button.confirm {
  background: #000;
  color: white;
}

.modal-button.confirm:hover {
  background: #333;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
