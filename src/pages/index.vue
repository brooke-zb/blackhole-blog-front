<route lang="yaml">
name: index
</route>

<script setup lang="ts">
const { t } = useI18n()
setTitle(t('title.index'))

function loadArticle(page: number) {
  return api.article.getList(page)
}
</script>

<template>
  <div class="text-indigo-500">
    <article-list :get-data-func="loadArticle" timeline />
  </div>
</template>
