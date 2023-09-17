<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  content: string
  danger: boolean
}>(), {
  danger: false,
})

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const show = defineModel<boolean>({
  required: true,
})

function onCancel() {
  show.value = false
  emit('cancel')
}

function onConfirm() {
  show.value = false
  emit('confirm')
}

const confirmClass = computed(() => {
  if (props.danger) {
    return 'text-white bg-red-600 dark:!ring-offset-slate-700 ring-red-600 px-2'
  }
  else {
    return 'text-white bg-primary-500 dark:bg-dark-500 dark:!ring-offset-slate-700 ring-primary-500 dark:ring-dark-500 px-2'
  }
})
</script>

<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-show="show" class="fixed top-0 left-0 w-full h-full bg-opacity-70
        flex justify-center items-end sm:items-center z-50 overflow-hidden bg-black" @click="onCancel"
      >
        <div class="modal m-2 p-4 mb-8 bg-gray-100 dark:bg-slate-700 rounded-lg w-full max-w-sm" @click.stop="">
          <div class="mb-2 text-lg">
            {{ props.title }}
          </div>
          <div class="text-gray-600 dark:text-gray-300 mb-2">
            {{ props.content }}
          </div>
          <div class="flex justify-end gap-2">
            <bh-button class="dark:text-white bg-gray-200 dark:bg-slate-600 dark:!ring-offset-slate-700 ring-primary-300 dark:ring-dark-500 px-2" @click="onCancel()">
              {{ $t('modal.cancel') }}
            </bh-button>
            <bh-button :class="confirmClass" @click="onConfirm()">
              {{ $t('modal.confirm') }}
            </bh-button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active,
.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: all 0.25s;
}

.modal-enter-from,
.modal-leave-to {
  --tw-bg-opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
  --tw-bg-opacity: 0.7;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale3d(0.8, 0.8, 1);
  opacity: 0;
}

.modal-enter-to .modal,
.modal-leave-from .modal {
  transform: scale3d(1, 1, 1);
  opacity: 1;
}
</style>
