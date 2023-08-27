<script setup lang="ts">
import InfoIcon from '~icons/regular/circle-info'
import DangerIcon from '~icons/regular/triangle-exclamation'
import SuccessIcon from '~icons/regular/circle-check'
import WarningIcon from '~icons/regular/circle-exclamation'

const props = defineProps<{
  config: ToastProps
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

onMounted(() => {
  if (props.config.duration) {
    setTimeout(() => {
      emits('close')
    }, props.config.duration)
  }
})

const defaultIcons = {
  info: InfoIcon,
  danger: DangerIcon,
  success: SuccessIcon,
  warning: WarningIcon,
}

const classAppend = computed(() => ({
  'border-primary-600 bg-primary-100 text-primary-900 fill-primary-700': props.config.type === 'info',
  'border-danger-600 bg-danger-100 text-danger-900 fill-danger-700': props.config.type === 'danger',
  'border-success-600 bg-success-100 text-success-900 fill-success-700': props.config.type === 'success',
  'border-warning-600 bg-warning-100 text-warning-900 fill-warning-700': props.config.type === 'warning',
}))
</script>

<template>
  <div
    class="rounded-md cursor-pointer select-none pointer-events-auto border-l-4 shadow-md overflow-hidden mb-2 relative"
    :class="classAppend"
    @click="emits('close')"
  >
    <div class="p-4 flex items-start gap-2">
      <div class="flex items-center text-xl">
        <component :is="props.config.icon ? props.config.icon : defaultIcons[props.config.type]" />
      </div>
      <div class="whitespace-pre-wrap">
        {{ props.config.message }}
      </div>
    </div>
  </div>
</template>
