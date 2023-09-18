<script setup lang="ts">
const props = withDefaults(defineProps<{
  placeholder: string
}>(), {
  placeholder: '',
})

const data = defineModel<string[]>({
  required: true,
})

function removeChip(index: number) {
  data.value.splice(index, 1)
}

const onFocus = ref(false)
const classAppend = computed(() => ({
  'border-primary-500 dark:border-dark-500': onFocus.value,
  'border-gray-300 dark:border-slate-600': !onFocus.value,
}))

const inputValue = ref('')
function onCommit() {
  if (inputValue.value.length > 0 && inputValue.value.trim().length > 0) {
    data.value.push(inputValue.value)
    inputValue.value = ''
  }
}
</script>

<template>
  <div
    class="rounded-md outline-0 bg-transparent px-2 py-1.5 w-full border-2 placeholder:text-sm transition-colors flex flex-col gap-1"
    :class="classAppend"
  >
    <div
      v-for="(item, index) in data"
      :key="item"
      class="flex rounded justify-between flex-wrap bg-primary-200 dark:bg-dark-500 px-1"
    >
      <div>{{ item }}</div>
      <button @click="removeChip(index)">
        <i-regular-circle-xmark class="w-4 h-4 fill-gray-500 dark:fill-gray-300" />
      </button>
    </div>
    <input
      v-model="inputValue" type="text" class="outline-0 bg-transparent" :placeholder="props.placeholder"
      @keydown.enter="onCommit" @focusin="onFocus = true" @focusout="onFocus = false"
    >
  </div>
</template>
