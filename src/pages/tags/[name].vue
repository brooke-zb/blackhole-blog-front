<route lang="yaml">
name: tag-articles
meta:
  noLoaded: true
  layout: blog
</route>

<script setup lang="ts">
const route = useRoute('tag-articles')
const titleStore = useTitleStore()
const { t } = useI18n()
titleStore.title = t('page.tag.title', { name: route.params.name })

function loadArticle(page: number) {
  return api.article.getListByTag(route.params.name as string, page)
}
</script>

<template>
  <div>
    <article-list
      :get-data-func="loadArticle" timeline
      @loaded="setPageLoading(false)"
    />
  </div>
</template>
