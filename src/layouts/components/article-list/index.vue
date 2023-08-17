<script setup lang="ts">
// 参数
const props = defineProps<{
  data: Page<Article>
  getDataFunc: (page: number) => Promise<void>
}>()

// 事件
const emit = defineEmits<{
  change: [page: number]
}>()
</script>

<template>
  <div v-if="props.data.size">
    <paginator />
  </div>
</template>
