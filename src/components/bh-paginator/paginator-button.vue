<script lang="ts">
export default defineComponent({
  name: 'PaginatorButton',
})
</script>

<script lang="ts" setup>
const props = defineProps<{
  isCurrentPage?: boolean
  disabled?: boolean
}>()

const classAppend = computed(() => ({
  'bg-primary-500 text-white dark:bg-dark-500': props.isCurrentPage,
  'bg-gray-100 hover:bg-primary-200 text-primary-600 dark:text-dark-300 dark:bg-slate-800 dark:hover:bg-dark-900': !props.isCurrentPage,
  'text-gray-300 fill-gray-300 dark:text-gray-500 dark:fill-gray-500 cursor-not-allowed pointer-events-none': props.disabled,
}))
</script>

<template>
  <button
    class="relative border border-primary-200 dark:border-dark-950 select-none flex justify-center items-center
      text-sm w-9 h-9 sm:text-base sm:w-10 sm:h-10 rounded-lg after:rounded-lg align-text-bottom
      after:absolute after:left-0 after:top-0 after:h-full after:w-full
      after:transition-all duration-200 ease-in-out hover:after:ring-2
      after:z-10 after:ring-offset-2 after:ring-offset-gray-50
      dark:after:ring-offset-slate-800 after:ring-primary-500 dark:after:ring-dark-400"
    :disabled="props.disabled" :class="classAppend"
  >
    <slot />
  </button>
</template>
