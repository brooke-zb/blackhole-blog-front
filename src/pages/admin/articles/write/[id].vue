<route lang="yaml">
name: admin-articles-update
meta:
  auth: ARTICLE:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.articles-update')

function updateArticle(article: BhArticleUpdate) {
  api.admin.article.update(article).then((resp) => {
    if (resp.success) {
      toast.add({
        type: 'success',
        message: t('page.admin-article-update.success'),
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
  <article-write-box :aid="parseInt(useRoute('admin-articles-update').params.id as string)" update @update="updateArticle" />
</template>
