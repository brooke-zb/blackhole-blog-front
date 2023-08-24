<script setup lang="ts">
const props = withDefaults(defineProps<{
  placeholder?: string
  invalid?: boolean
  minRows?: number
}>(), {
  placeholder: '',
  minRows: 3,
})

const el = ref<HTMLTextAreaElement>()

const inputValue = defineModel<string>({
  required: true,
})

const observer = new ResizeObserver(onResize)
onMounted(() => {
  onResize()
  observer.observe(el.value!)
})
onUnmounted(() => {
  observer.disconnect()
})

const classAppend = computed(() => ({
  'border-danger-300/60 focus:border-danger-500 dark:border-danger-500/40 dark:focus:border-danger-700': props.invalid,
  'placeholder:text-danger-300 dark:placeholder:text-danger-400': props.invalid,
}))

function onResize() {
  const currentScrollTop = window.scrollY
  const style = window.getComputedStyle(el.value!)
  el.value!.style.height = 'auto'
  el.value!.style.height = `calc(${el.value!.scrollHeight}px + ${style.borderTopWidth} + ${style.borderBottomWidth})`
  window.scrollTo(0, currentScrollTop)
}
</script>

<template>
  <textarea
    ref="el" v-model="inputValue"
    class="p-2 rounded-md outline-0 bg-transparent border-2 block w-full resize-none transition-colors
    border-gray-300 dark:border-slate-600 focus:border-primary-500 dark:focus:border-dark-500"
    :class="classAppend" :rows="props.minRows" :placeholder="props.placeholder" @input="onResize"
  />
</template>
