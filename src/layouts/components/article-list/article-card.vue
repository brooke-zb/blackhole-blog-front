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
  <router-link
    :to="`/articles/${props.data.aid}`" class="text-gray-500 dark:text-slate-400 relative p-2
    after:bg-primary-400/0 dark:after:bg-slate-500/0 after:left-4 after:top-2 after:w-[calc(100%-2rem)] after:h-[calc(100%-1rem)] after:absolute after:rounded-lg after:-z-10
    hover:after:bg-primary-400/20 dark:hover:after:bg-slate-400/20 hover:after:left-0 hover:after:top-0 hover:after:w-full hover:after:h-full after:duration-200"
  >
    <span class="text-xl mb-1 me-2 text-primary-600 dark:text-dark-300">
      {{ props.data.title }}
    </span>
    <span title="发布时间" class="sm:text-sm me-2 sm:me-0 whitespace-nowrap">{{ formatDate(props.data.createdAt) }}</span>
    <br>
    <router-link
      :to="`/categories/${props.data.category.name}`" :title="t('routes.category')"
      class="inline-flex items-center gap-1 me-2"
    >
      <i-regular-folder class="inline w-4 h-4 fill-gray-500 dark:fill-slate-400" />
      {{ props.data.category.name }}
    </router-link>
    <div class="inline-flex items-center gap-x-3 flex-wrap">
      <router-link
        v-for="tag in props.data.tags" :key="tag.name" :to="`/tags/${tag.name}`" :title="t('routes.tag')"
        class="inline-flex items-center text-sm"
      >
        <i-regular-tag class="inline w-4 h-4 fill-gray-500 dark:fill-slate-400" />
        {{ tag.name }}
      </router-link>
    </div>
  </router-link>
</template>
