import { reactive } from 'vue'

export const toastState = reactive({
  toasts: []
})

let toastId = 0

export function useToast() {
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = ++toastId
    const toast = { id, message, type }

    toastState.toasts.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const success = (message, duration) => showToast(message, 'success', duration)
  const error = (message, duration) => showToast(message, 'error', duration)
  const warning = (message, duration) => showToast(message, 'warning', duration)
  const info = (message, duration) => showToast(message, 'info', duration)

  return {
    showToast,
    success,
    error,
    warning,
    info,
    removeToast
  }
}

export function removeToast(id) {
  const index = toastState.toasts.findIndex(t => t.id === id)
  if (index !== -1) {
    toastState.toasts.splice(index, 1)
  }
}
