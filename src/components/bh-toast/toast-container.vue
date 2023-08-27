<script setup lang="ts">
import gsap from 'gsap'
import { toastImpl } from '@/utils/toast'

toastImpl.add = add
toastImpl.remove = remove
toastImpl.clear = clear

// toast actions
const toastQueue = ref<ToastMessage[]>([])
let nextToastId = 0

function add(toast: ToastProps) {
  toastQueue.value.push({
    id: nextToastId++,
    config: toast,
  })
}

function remove(id?: number) {
  for (let i = 0; i < toastQueue.value.length; i++) {
    if (toastQueue.value[i].id === id) {
      toastQueue.value.splice(i, 1)
      break
    }
  }
}

function clear() {
  toastQueue.value = []
}

function onBeforeEnter(el: Element) {
  gsap.set(el, {
    opacity: 0,
    translateY: -50,
  })
}

function onEnter(el: Element, done: () => void) {
  gsap.to(el, {
    duration: 0.3,
    opacity: 1,
    translateY: 0,
    onComplete: done,
  })
}

function onLeave(el: Element, done: () => void) {
  gsap.fromTo(el, {
    height: el.clientHeight,
    zIndex: -1,
  }, {
    duration: 0.3,
    opacity: 0,
    height: 0,
    marginBottom: 0,
    translateY: -50,
    onComplete: done,
  })
}
</script>

<template>
  <teleport to="body">
    <div
      class="fixed z-50 top-0 left-0 right-0 mx-auto max-w-sm
      sm:left-auto sm:w-96 pointer-events-none
      flex flex-col p-2 origin-top"
    >
      <transition-group name="toast" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
        <bh-toast v-for="toast in toastQueue" :key="toast.id" :config="toast.config" @close="remove(toast.id)" />
      </transition-group>
    </div>
  </teleport>
</template>
