<script setup lang="ts">
// 参数
const props = defineProps<{
  data: BhArticlePreview
  dateFormat: string
}>()

const { t } = useI18n()

function formatDate(time: string) {
  return dayjs(time).format(props.dateFormat)
}
</script>

<template>
  <div class="group text-gray-400 dark:text-slate-600 hover:text-gray-500 dark:hover:text-slate-400 md:hover:scale-105 transition-transform">
    <router-link
      :to="`/articles/${props.data.aid}`" class="text-xl mb-1 me-2 text-primary-600 dark:text-dark-400
        hover:text-primary-800 dark:hover:text-dark-200"
    >
      {{ props.data.title }}
    </router-link>
    <span title="发布时间" class="sm:text-sm me-2 sm:me-0 whitespace-nowrap">{{ formatDate(props.data.createdAt) }}</span>
    <br>
    <router-link
      :to="`/categories/${props.data.category.name}`" :title="t('routes.category')"
      class="inline-flex items-center gap-1 me-2"
    >
      <i-regular-folder class="inline w-4 h-4 fill-gray-400 dark:fill-slate-600 group-hover:fill-gray-500 dark:group-hover:fill-slate-400" />
      {{ props.data.category.name }}
    </router-link>
    <div class="inline-flex items-center gap-x-3 flex-wrap">
      <router-link
        v-for="tag in props.data.tags" :key="tag.name" :to="`/tags/${tag.name}`" :title="t('routes.tag')"
        class="inline-flex items-center text-sm"
      >
        <i-regular-tag class="inline w-4 h-4 fill-gray-400 dark:fill-slate-600 group-hover:fill-gray-500 dark:group-hover:fill-slate-400" />
        {{ tag.name }}
      </router-link>
    </div>
  </div>
</template>
