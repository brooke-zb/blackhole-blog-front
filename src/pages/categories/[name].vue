<route lang="yaml">
name: category-articles
</route>

<script setup lang="ts">
const route = useRoute('category-articles')
const titleStore = useTitleStore()
titleStore.title = `分类 ${route.params.name} 下的文章`

function loadArticle(page: number) {
  return api.article.getListByCategory(route.params.name, page)
}
</script>

<template>
  <div>
    <article-list :get-data-func="loadArticle" timeline />
  </div>
</template>
