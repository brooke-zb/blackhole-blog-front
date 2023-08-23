<route lang="yaml">
name: tag-articles
</route>

<script setup lang="ts">
const route = useRoute('tag-articles')
const titleStore = useTitleStore()
titleStore.title = `标签 ${route.params.name} 下的文章`

function loadArticle(page: number) {
  return api.article.getListByTag(route.params.name, page)
}
</script>

<template>
  <div>
    <article-list :get-data-func="loadArticle" timeline />
  </div>
</template>
