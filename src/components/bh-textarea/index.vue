<script setup lang="ts">
import type { StyleValue } from 'vue'
import { calcTextareaHeight } from './utils'

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
  'border-danger-300 focus:border-danger-500 dark:border-danger-500/40 dark:focus:border-danger-700': props.invalid,
  'placeholder:text-danger-400 dark:placeholder:text-danger-400': props.invalid,
  'border-gray-300 dark:border-slate-600 focus:border-primary-500 dark:focus:border-dark-500': !props.invalid,
}))

// @ts-expect-error ts(2589)
const textareaCalcStyle = ref<StyleValue>({
  overflowY: 'hidden',
})

function onResize() {
  const textareaStyle = calcTextareaHeight(el.value!, props.minRows)
  textareaCalcStyle.value = {
    overflowY: 'hidden',
    ...textareaStyle,
  }

  nextTick(() => {
    // NOTE: Force repaint to make sure the style set above is applied.
    // eslint-disable-next-line ts/no-unused-expressions
    el.value!.offsetHeight
    textareaCalcStyle.value = textareaStyle as any
  })
}
</script>

<template>
  <textarea
    ref="el" v-model="inputValue"
    class="p-2 rounded-md outline-0 bg-transparent border-2 block w-full resize-none transition-colors"
    :class="classAppend" :style="textareaCalcStyle" :rows="props.minRows" :placeholder="props.placeholder" @input="onResize"
  />
</template>
