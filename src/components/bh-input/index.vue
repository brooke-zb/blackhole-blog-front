<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: 'text' | 'password'
  placeholder?: string
  invalid?: boolean
  focus?: boolean
}>(), {
  type: 'text',
  placeholder: '',
})

const inputValue = defineModel<string>({
  required: true,
})

const input = ref<HTMLInputElement>()

onMounted(() => {
  if (props.focus) {
    input.value?.focus()
  }
})

const slots = useSlots()

const classAppend = computed(() => ({
  'pl-8': slots.left,
  'pr-8': slots.right,
  'border-danger-300 focus:border-danger-500 dark:border-danger-500/40 dark:focus:border-danger-700': props.invalid,
  'placeholder:text-danger-400 dark:placeholder:text-danger-400': props.invalid,
  'border-gray-300 dark:border-slate-600 focus:border-primary-500 dark:focus:border-dark-500': !props.invalid,
}))
const slotClassAppend = computed(() => ({
  'fill-gray-400 dark:fill-slate-500': !props.invalid,
  'fill-danger-400 dark:fill-danger-500/70': props.invalid,
}))
</script>

<template>
  <div class="flex relative w-full">
    <div v-if="$slots.left" class="absolute w-5 h-5 left-3 top-0 bottom-0 m-auto" :class="slotClassAppend">
      <slot name="left" />
    </div>
    <input
      ref="input"
      v-model="inputValue" class="rounded-md bg-transparent px-2 py-1.5 w-full border-2 placeholder:text-sm
      transition-colors placeholder:transition-colors outline-0" :class="classAppend"
      :type="props.type" :placeholder="props.placeholder"
    >
    <div
      v-if="$slots.right" class="absolute w-5 h-5 right-3 top-0 bottom-0 m-auto"
      :class="slotClassAppend"
    >
      <slot name="right" />
    </div>
  </div>
</template>
