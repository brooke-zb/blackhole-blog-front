declare interface ToastMessage {
  id?: number,
  config: ToastProps,
}

declare interface ToastProps {
  type: 'info' | 'success' | 'danger' | 'warning',
  message: string,
  icon?: any,
  duration?: number,
}