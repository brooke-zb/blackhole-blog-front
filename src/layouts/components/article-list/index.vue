<script setup lang="ts">
// 参数
const props = withDefaults(defineProps<{
  getDataFunc: (page: number) => Promise<Resp<Page<BhArticlePreview>>>
  timeline?: boolean
}>(), {
  timeline: false,
})

// 事件
const emit = defineEmits<{
  change: [page: number]
  loaded: []
}>()

const toast = useToast()

// 数据
const pageData = reactive<Page<BhArticlePreview>>({
  page: 1,
  size: 10,
  total: 0,
  data: [],
})

// 时间线数据<年份、文章>
const timelineData = reactive<Map<string, BhArticlePreview[]>>(new Map())

// 获取数据
async function getData(page: number) {
  const resp = await props.getDataFunc(page)
  if (resp.success) {
    pageData.page = resp.data.page
    pageData.size = resp.data.size
    pageData.total = resp.data.total
    pageData.data = resp.data.data

    if (props.timeline) {
      // 时间线数据
      timelineData.clear()
      resp.data.data.forEach((article) => {
        const year = dayjs(article.createdAt).format('YYYY')
        if (timelineData.has(year)) {
          timelineData.get(year)?.push(article)
        }
        else {
          timelineData.set(year, [article])
        }
      })
    }
  }
  else {
    toast.add({
      type: 'danger',
      message: resp.msg,
      duration: 3000,
    })
  }
  emit('loaded')
}

watchEffect(() => {
  getData(pageData.page)
  emit('change', pageData.page)
})
</script>

<template>
  <div class="flex flex-col items-center mb-4">
    <template v-if="props.timeline">
      <div
        v-for="year in timelineData.keys()" :key="year"
        class="flex flex-col gap-8 w-full sm:max-w-2xl relative mt-8 mb-4"
      >
        <h2 class="text-4xl font-bold absolute -z-10 left-0 md:-left-10 -top-8 text-primary-200 dark:text-slate-800 select-none">
          {{ year }}
        </h2>
        <article-card
          v-for="article in timelineData.get(year)"
          :key="article.aid"
          :data="article"
          date-format="MM-DD"
        />
      </div>
    </template>
    <div v-else class="flex flex-col gap-8 w-full sm:max-w-2xl relative my-4">
      <article-card
        v-for="article in pageData.data"
        :key="article.aid"
        :data="article"
        date-format="YYYY-MM-DD"
      />
    </div>
  </div>
  <bh-paginator v-model="pageData.page" hide-on-single-page :size="pageData.size" :total="pageData.total" />
</template>
