export const toastImpl = {
  add: (_message: ToastProps) => {},
  remove: (_id: number) => {},
  clear: () => {},
}

export function useToast() {
  return {
    add: (message: ToastProps) => {
      if (message.icon) {
        message.icon = shallowRef(message.icon)
      }
      toastImpl.add(message)
    },
    remove: (id: number) => {
      toastImpl.remove(id)
    },
    clear: () => {
      toastImpl.clear()
    },
  }
}
