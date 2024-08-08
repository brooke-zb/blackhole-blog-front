<route lang="yaml">
name: article-detail
meta:
  layout: blog
</route>

<script setup lang="ts">
import { md } from '@/utils'
import './article.css'

definePage({
  path: '/articles/:id(\\d+)',
})

const gallery = ref()

onMounted(() => {
  getArticle().then(() => {
    gallery.value.init('[data-gallery]')
  })
})
const toast = useToast()
const titleStore = useTitleStore()
const anchorStore = useAnchorStore()
const { t } = useI18n()

titleStore.title = t('title.article')
const article = ref<BhArticle>()
const contentHTML = ref('')
const loading = ref(true)
async function getArticle() {
  loading.value = true

  const resp = await api.article.getByAid(useRoute('article-detail').params.id as string)
  if (resp.success) {
    article.value = resp.data
    anchorStore.clear()
    contentHTML.value = md.render(resp.data.content)
    titleStore.title = resp.data.title
  }
  else {
    toast.add({
      type: 'danger',
      message: resp.msg,
      duration: 3000,
    })
  }
  loading.value = false
}

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD')
}
</script>

<template>
  <bh-skeleton v-if="loading" type="article" />
  <div v-else-if="article" class="p-2">
    <div class="text-xl sm:text-2xl text-center font-bold mb-2">
      {{ article.title }}
    </div>
    <div class="flex justify-center gap-2 mb-2 text-gray-500 fill-gray-500 dark:text-gray-400 dark:fill-gray-400">
      <span v-tooltip="t('page.article.created')">
        <i-regular-calendar-lines class="inline align-text-top" />
        {{ formatDate(article.createdAt) }}
      </span>
      <template v-if="article.updatedAt">
        <span> - </span>
        <span v-tooltip="t('page.article.updated')">
          <i-regular-calendar-lines-pen class="inline align-text-top" />
          {{ formatDate(article.updatedAt) }}
        </span>
      </template>
    </div>
    <div
      class="flex justify-center items-center gap-1.5 mb-2 text-gray-500 fill-gray-500 dark:text-gray-400 dark:fill-gray-400"
    >
      <IRegularEye />
      {{ article.readCount }}
      -
      <router-link
        class="link flex justify-center items-center gap-1.5" :to="`/categories/${article.category.name}`"
        :title="t('routes.category')"
      >
        <IRegularFolder />
        {{ article.category.name }}
      </router-link>
    </div>
    <div
      class="flex justify-center items-end gap-2 mb-2 text-light-500 fill-light-500 dark:text-light-400 dark:fill-light-400"
    >
      <router-link
        v-for="tag in article.tags" :key="tag.name" class="link flex justify-center items-center gap-0.5"
        :to="`/tags/${tag.name}`" :title="t('routes.tag')"
      >
        <IRegularTag />
        {{ tag.name }}
      </router-link>
    </div>
    <div v-html="contentHTML" />
    <comment-box :aid="article.aid" :author-uid="article.user.uid" />
    <bh-gallery ref="gallery" />
    <article-directory />
  </div>
  <bh-not-found v-else code="404" :title="t('page.article.not-found')" />
</template>
