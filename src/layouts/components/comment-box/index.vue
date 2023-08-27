<script setup lang="ts">
const props = defineProps<{
  aid: number
  authorUid: number
}>()

// 奇怪的渲染顺序问题，必须mount后teleport才能正确渲染
const isRenderEnd = ref(false)
onMounted(() => {
  isRenderEnd.value = true
})

// 更改回复框位置
const coid = ref<number>()
provide('changeReplyComment', (id?: number) => {
  coid.value = id
})

const toast = useToast()
const { t } = useI18n()

const currentPage = ref(1)
const comments = ref<Page<BhComment>>({
  total: 0,
  page: 1,
  size: 10,
  data: [],
})

watchEffect(() => {
  coid.value = undefined
  getComments(currentPage.value)
})
async function getComments(page: number) {
  const resp = await api.comment.getList(props.aid, page)
  if (resp.success) {
    comments.value = resp.data
  }
  else {
    toast.add({
      type: 'danger',
      message: resp.msg,
      duration: 5000,
    })
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
    <comment-sender v-if="isRenderEnd" :aid="props.aid" :coid="coid" @refresh="getComments(currentPage)" />
  </div>
</template>
