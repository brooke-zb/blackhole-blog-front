<script lang="ts" setup>
const props = defineProps<{
  type: 'article' | 'timeline' | 'list' | 'category' | 'tag' | 'friend'
}>()
</script>

<template>
  <div
    v-if="props.type === 'article'"
    class="relative flex flex-col gap-4 items-center fill-light-500/50 dark:fill-light-200/50"
  >
    <div class="skeleton p-5 w-2/3 sm:w-1/2 md:w-1/3 mb-1" />
    <div class="skeleton p-2 w-1/2 sm:w-1/3 md:w-1/4" />
    <div class="skeleton p-2 w-1/3 sm:w-1/4 md:w-1/5" />
    <div class="skeleton p-2 w-1/2 sm:w-1/3 md:w-1/4 mb-2" />
    <div class="w-full flex flex-col gap-4">
      <div class="skeleton p-3 w-2/3 sm:w-1/2" />
      <div class="skeleton p-3 w-full" />
      <div class="skeleton p-3 w-full" />
      <div class="skeleton p-3 w-3/4" />
    </div>
    <div class="skeleton p-4 w-80 md:w-96 h-64 flex justify-center items-center">
      <i-regular-image class="h-10 w-10" />
    </div>
    <div class="w-full flex flex-col gap-4">
      <div class="skeleton p-3 w-full" />
      <div class="skeleton p-3 w-full" />
      <div class="skeleton p-3 w-3/4" />
    </div>
  </div>
  <div v-else-if="props.type === 'timeline'" class="px-4 mx-auto max-w-xl flex gap-3">
    <div class="w-2 skeleton" />
    <div class="relative flex flex-col gap-4 fill-light-500/50 dark:fill-light-200/50 grow">
      <div class="skeleton p-4 w-1/4 my-2" />
      <div class="skeleton p-3 w-1/2" />
      <div class="skeleton p-3 w-2/3" />
      <div class="skeleton p-3 w-1/2" />
      <div class="skeleton p-3 w-2/3" />
      <div class="skeleton p-3 w-1/2" />
      <div class="skeleton p-4 w-1/4 my-2" />
      <div class="skeleton p-3 w-3/4" />
      <div class="skeleton p-3 w-1/2" />
      <div class="skeleton p-3 w-2/3" />
      <div class="skeleton p-3 w-2/3" />
      <div class="skeleton p-3 w-2/3" />
    </div>
  </div>
  <div v-else-if="props.type === 'list'" class="px-2 mx-auto max-w-xl flex flex-col items-center gap-4">
    <div class="skeleton p-10 w-full max-w-sm" />
    <div class="skeleton p-10 w-full max-w-sm" />
    <div class="skeleton p-10 w-full max-w-sm" />
    <div class="skeleton p-10 w-full max-w-sm" />
  </div>
  <div v-else-if="props.type === 'category'" class="flex flex-col gap-4 pt-2">
    <div class="flex justify-center">
      <div class="skeleton p-3.5 w-24" />
    </div>
    <div class="skeleton p-3 w-24" />
    <div class="skeleton p-3 w-16" />
    <div class="skeleton p-3 w-24" />
    <div class="skeleton p-3 w-16" />
    <div class="skeleton p-3 w-36" />
    <div class="skeleton p-3 w-24" />
  </div>
  <div v-else-if="props.type === 'tag'" class="flex flex-col gap-4 items-center pt-2">
    <div class="skeleton p-3.5 w-24" />
    <div class="gap-4 flex flex-wrap justify-center">
      <div class="inline-block skeleton p-3.5 w-16" />
      <div class="inline-block skeleton p-3.5 w-24" />
      <div class="inline-block skeleton p-3.5 w-16" />
      <div class="inline-block skeleton p-3.5 w-16" />
      <div class="inline-block skeleton p-3.5 w-24" />
      <div class="inline-block skeleton p-3.5 w-12" />
      <div class="inline-block skeleton p-3.5 w-16" />
      <div class="inline-block skeleton p-3.5 w-16" />
      <div class="inline-block skeleton p-3.5 w-24" />
      <div class="inline-block skeleton p-3.5 w-12" />
    </div>
  </div>
  <div v-else-if="props.type === 'friend'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
    <div class="skeleton p-8 w-full h-20" />
    <div class="skeleton p-8 w-full h-20" />
    <div class="skeleton p-8 w-full h-20" />
    <div class="skeleton p-8 w-full h-20" />
    <div class="skeleton p-8 w-full h-20" />
  </div>
</template>

<style scoped>
.skeleton {
  @apply bg-gray-400/75 rounded-lg animate-pulse;
}
</style>
