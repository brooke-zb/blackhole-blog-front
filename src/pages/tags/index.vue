<route lang="yaml">
name: tags
</route>

<script setup lang="ts">
interface TagInfo {
  name: string
  colorClass: string
  sizeClass: string
}

onMounted(getTags)

const titleStore = useTitleStore()
titleStore.title = '标签'
const data = ref<TagHeat[]>([])
const tags = ref<TagInfo[]>([])
const loading = ref(true)
async function getTags() {
  loading.value = true
  const resp = await api.tag.getList()
  if (resp.success) {
    data.value = resp.data
    parseTagsHeat()
  }
  else {
    // TODO: toast
  }
  loading.value = false
}

function parseTagsHeat() {
  let maxCount = -1
  if (data.value) {
    // 计算最大和最小热度
    data.value.forEach((tag) => {
      if (tag.articleCount > maxCount) {
        maxCount = tag.articleCount!
      }
    })
    if (maxCount < 5) {
      maxCount = 5
    }

    // 计算样式
    tags.value = data.value.map((tag) => {
      const heat = tag.articleCount! / maxCount
      return {
        name: tag.name,
        colorClass: heat > 0.66 ? 'text-primary-700 dark:text-dark-200' : heat > 0.33 ? 'text-primary-500 dark:text-dark-400' : 'text-gray-400 dark:text-slate-400',
        sizeClass: heat > 0.66 ? 'text-4xl' : heat > 0.33 ? 'text-2xl' : 'text-base',
      }
    })
  }
}
</script>

<template>
  <bh-skeleton v-if="loading" type="tag" />
  <div v-else-if="tags?.length > 0" class="my-2 text-center">
    <h2 class="text-2xl mb-2">
      {{ `共 ${tags.length} 个标签` }}
    </h2>
    <router-link
      v-for="tag in tags"
      :key="tag.name"
      :to="`/tags/${tag.name}`"
      class="m-3 leading-8 whitespace-nowrap" :class="[tag.colorClass, tag.sizeClass]"
    >
      {{ tag.name }}
    </router-link>
  </div>
  <bh-empty v-else />
</template>
