export type ToastKind = 'success' | 'error' | 'info'

export interface ToastAction {
  label: string
  /** Read by screen readers when the toast is announced (Reka UI requires it). */
  altText: string
  run: () => void
}

export interface Toast {
  id: number
  message: string
  kind: ToastKind
  action?: ToastAction
}

/** Mockup keeps at most three toasts on screen; older ones make way. */
const MAX_VISIBLE = 3

/**
 * App-wide feedback, replacing every `alert()` of the old app (CDC §7.1).
 * State lives in `useState` so the queue survives navigation and stays SSR-safe.
 */
export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function show(message: string, options: { kind?: ToastKind; action?: ToastAction } = {}) {
    const toast: Toast = {
      id: Date.now() + Math.random(),
      message,
      kind: options.kind ?? 'success',
      action: options.action,
    }
    toasts.value = [...toasts.value.slice(-(MAX_VISIBLE - 1)), toast]
    return toast.id
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return {
    toasts: readonly(toasts),
    show,
    success: (message: string, action?: ToastAction) => show(message, { kind: 'success', action }),
    error: (message: string, action?: ToastAction) => show(message, { kind: 'error', action }),
    info: (message: string, action?: ToastAction) => show(message, { kind: 'info', action }),
    dismiss,
  }
}
