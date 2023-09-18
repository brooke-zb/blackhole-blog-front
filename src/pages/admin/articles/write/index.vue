<route lang="yaml">
name: admin-articles-write
meta:
  auth: ARTICLE:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.articles-write')

function addArticle(article: BhArticleAdd) {
  api.admin.article.add(article).then((resp) => {
    if (resp.success) {
      toast.add({
        type: 'success',
        message: t('page.admin-article-write.success'),
        duration: 3000,
      })
      router.push('/admin/articles')
    }
    else {
      toast.add({
        type: 'danger',
        message: resp.msg,
        duration: 3000,
      })
    }
  })
}
</script>

<template>
  <article-write-box @add="addArticle" />
</template>
