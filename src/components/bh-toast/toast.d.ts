declare interface ToastMessage {
  id?: number,
  config: ToastProps,
}

declare type ToastProps = EitherOr<{
  type: 'info' | 'success' | 'danger' | 'warning',
  message: string,
  translate: string,
  icon?: any,
  duration?: number,
}, 'message', 'translate'>;