<script lang="ts" setup>
const props = defineProps<{
  size: number // 每页条数
  total: number // 总条数
}>()

// 当前页码
const page = defineModel<number>({
  required: true,
})

// 总页数
const totalPages = computed(() => Math.ceil(props.total / props.size))

const displaySize = 5

interface PageInfo {
  pages: number[]
  hasPrevious: boolean
  hasNext: boolean
  hasPreviousMore: boolean
  hasNextMore: boolean
}

const pageInfo = reactive<PageInfo>({
  pages: [],
  hasPrevious: true,
  hasNext: true,
  hasPreviousMore: true,
  hasNextMore: true,
})

watchEffect(() => {
  getPages(page.value)
})

// 获取页码数组
function getPages(page: number) {
  pageInfo.hasPrevious = page > 1
  pageInfo.hasNext = page < totalPages.value

  pageInfo.pages = []

  let start = Math.max(1, page - Math.floor(displaySize / 2))
  const end = Math.min(totalPages.value, start + displaySize - 1)
  if (end - start < displaySize - 1) {
    start = Math.max(1, end - displaySize + 1)
  }

  pageInfo.hasPreviousMore = start > 1
  pageInfo.hasNextMore = end < totalPages.value

  for (let i = start; i <= end; i++) {
    pageInfo.pages.push(i)
  }
  return pageInfo.pages
}

function toPage(to: number) {
  if (to < 1) {
    to = 1
  }
  else if (to > totalPages.value) {
    to = totalPages.value
  }
  if (to === page.value) {
    return
  }
  page.value = to
  getPages(to)
}

function offsetPage(offset: number) {
  toPage(page.value + offset)
}
</script>

<template>
  <div class="flex p-1.5 gap-1.5">
    <!-- 前一页 -->
    <paginator-button :disabled="!pageInfo.hasPrevious" @click="offsetPage(-1)">
      <i-regular-chevron-left />
    </paginator-button>

    <!-- 头页 -->
    <paginator-button v-if="totalPages > displaySize" class="group" :disabled="!pageInfo.hasPreviousMore" @click="toPage(1)">
      <i-regular-chevrons-left class="hidden group-disabled:inline" />
      <div class="inline group-disabled:hidden" v-text="'1..'" />
    </paginator-button>

    <!-- 展示页 -->
    <div class="paginator-group">
      <paginator-button
        v-for="num, index in pageInfo.pages" :key="index"
        :is-current-page="page === num" @click="toPage(num)" v-text="num"
      />
    </div>

    <!-- 尾页 -->
    <paginator-button v-if="totalPages > displaySize" class="group" :disabled="!pageInfo.hasNextMore" @click="toPage(props.total)">
      <i-regular-chevrons-right class="hidden group-disabled:inline" />
      <div class="inline group-disabled:hidden" v-text="`..${totalPages}`" />
    </paginator-button>

    <!-- 后一页 -->
    <paginator-button :disabled="!pageInfo.hasNext" @click="offsetPage(1)">
      <i-regular-chevron-right />
    </paginator-button>
  </div>
</template>

<style scoped>
.paginator-group > button {
  @apply rounded-none after:rounded-none;
}

.paginator-group > button:first-child {
  @apply rounded-l-lg after:rounded-l-lg;
}

.paginator-group > button:last-child {
  @apply rounded-r-lg after:rounded-r-lg;
}
</style>
