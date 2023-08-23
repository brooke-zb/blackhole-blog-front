<route lang="yaml">
name: index
</route>

<script setup lang="ts">
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('title.index')

function loadArticle(page: number) {
  return api.article.getList(page)
}
</script>

<template>
  <div>
    <article-list :get-data-func="loadArticle" timeline />
  </div>
</template>
