<script setup lang="ts">
const props = defineProps<{
  aid: number
  authorUid: number
}>()

const { t } = useI18n()

const currentPage = ref(1)
const comments = ref<Page<BhComment>>({
  total: 0,
  page: 1,
  size: 10,
  data: [],
})

watchEffect(() => {
  getComments(currentPage.value)
})
async function getComments(page: number) {
  const resp = await api.comment.getList(props.aid, page)
  if (resp.success) {
    comments.value = resp.data
  }
  else {
    // TODO: toast
  }
}
</script>

<template>
  <div id="article-comment-box" class="my-4 p-2 rounded-md bg-white/50 dark:bg-slate-700/50 shadow-lg">
    <div class="text-center text-xl text-primary-600 dark:text-gray-100">
      {{ comments.total > 0 ? t('page.article.comments-count', { count: comments.total }) : t('page.article.no-comments') }}
    </div>
    <div id="article-comment-sender" />
    <template v-if="comments.data">
      <comment-content
        v-for="(item, index) in comments.data" :key="index" :item="item" :author-uid="props.authorUid"
        :class="{ 'border-gray-300 dark:border-gray-600 border-t border-dashed': index !== 0 }"
      />
    </template>
    <bh-paginator v-model="currentPage" :size="10" :total="comments.total" hide-on-single-page />
  </div>
</template>
