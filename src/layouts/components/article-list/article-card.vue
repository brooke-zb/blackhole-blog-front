<script setup lang="ts">
// 参数
const props = defineProps<{
  data: ArticlePreview
  dateFormat: string
}>()

function formatDate(time: string) {
  return dayjs(time).format(props.dateFormat)
}
</script>

<template>
  <div class="group text-gray-400 dark:text-slate-600 hover:text-gray-500 dark:hover:text-slate-500">
    <router-link
      :to="`/articles/${props.data.aid}`" class="text-xl mb-1 text-primary-600 dark:text-dark-400
        hover:text-primary-800 dark:hover:text-dark-200"
    >
      {{ props.data.title }}
    </router-link>
    <br class="sm:hidden">
    <span title="发布时间" class="sm:text-sm me-2 sm:me-0 sm:ms-2">{{ formatDate(props.data.createdAt) }}</span>
    <br class="hidden sm:block">
    <router-link
      :to="`/categories/${props.data.category.name}`" title="分类"
      class="inline-flex items-center gap-1"
    >
      <i-regular-folder class="inline w-4 h-4 fill-gray-400 dark:fill-slate-600 group-hover:fill-gray-500 dark:group-hover:fill-slate-500" />
      {{ props.data.category.name }}
    </router-link>
    <div class="flex sm:inline-flex items-center gap-3 flex-wrap ms-0 sm:ms-2">
      <router-link
        v-for="tag in props.data.tags" :key="tag.name" :to="`/tags/${tag.name}`" title="标签"
        class="inline-flex items-center text-sm"
      >
        <i-regular-tag class="inline w-4 h-4 fill-gray-400 dark:fill-slate-600 group-hover:fill-gray-500 dark:group-hover:fill-slate-500" />
        {{ tag.name }}
      </router-link>
    </div>
  </div>
</template>
