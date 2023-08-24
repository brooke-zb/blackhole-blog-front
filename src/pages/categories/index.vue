<route lang="yaml">
name: categories
</route>

<script setup lang="ts">
onMounted(getCategories)

const titleStore = useTitleStore()
const { t } = useI18n()
titleStore.title = t('link.category')

const categories = ref<BhCategoryHeat[]>([])
const loading = ref(true)
async function getCategories() {
  loading.value = true
  const resp = await api.category.getList()
  if (resp.success) {
    categories.value = resp.data
  }
  else {
    // TODO: toast
  }
  loading.value = false
}
</script>

<template>
  <bh-skeleton v-if="loading" type="category" />
  <div v-else-if="categories?.length > 0" class="my-2">
    <h2 class="text-2xl mb-2 text-center">
      {{ t('page.category.total', { count: categories.length }) }}
    </h2>
    <h3 v-for="category in categories" :key="category.name">
      <router-link
        :to="`/categories/${category.name}`"
        class="inline-flex items-center text-lg link my-2"
      >
        <i-solid-folder-closed class="mr-2 inline" />
        {{ category.name }} <span class="text-base text-gray-500">({{ category.articleCount }})</span>
      </router-link>
    </h3>
  </div>
  <bh-empty v-else />
</template>
