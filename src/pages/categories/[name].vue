<route lang="yaml">
name: category-articles
meta:
  noLoaded: true
</route>

<script setup lang="ts">
const route = useRoute('category-articles')
const titleStore = useTitleStore()
const { t } = useI18n()
titleStore.title = t('page.category.title', { name: route.params.name })

function loadArticle(page: number) {
  return api.article.getListByCategory(route.params.name, page)
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
