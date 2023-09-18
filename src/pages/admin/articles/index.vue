<route lang="yaml">
name: admin-articles
meta:
  auth: ARTICLE:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
onMounted(() => {
  loadArticles()
  loadCategories()
})

const toast = useToast()
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.articles')

const conditions = reactive({
  title: '',
  category: '',
  tag: '',
  sortBy: 'created_at',
  status: 'PUBLISHED',
})

// 文章列表
const articles = ref<Page<BhArticlePreview>>({
  total: 0,
  page: 1,
  size: 10,
  data: [],
})
function loadArticles() {
  // remove empty conditions
  const keys = Object.keys(conditions) as (keyof typeof conditions)[]
  const queryCond = keys.reduce((prev, key) => {
    if (conditions[key]) {
      prev[key] = conditions[key]
    }
    return prev
  }, {} as Record<string, string>)

  api.admin.article.getList(articles.value.page, queryCond).then((resp) => {
    if (resp.success) {
      articles.value = resp.data
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

// 分类列表
const categories = ref<BhCategory[]>([])
function loadCategories() {
  api.admin.category.getList().then((resp) => {
    if (resp.success) {
      categories.value = resp.data.data
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

// 更改排序条件
function changeSortBy(sortBy: 'created_at' | 'read_count') {
  if (conditions.sortBy === sortBy) {
    return
  }
  conditions.sortBy = sortBy
  loadArticles()
}

// 删除文章
const showDeleteModal = ref(false)
const deleteArticle = ref<BhArticlePreview>()
function onDelete(article: BhArticlePreview) {
  deleteArticle.value = article
  showDeleteModal.value = true
}
function onComfirmDelete() {
  if (!deleteArticle.value) {
    return
  }
  api.admin.article.delete(deleteArticle.value.aid).then((resp) => {
    if (resp.success) {
      toast.add({
        type: 'success',
        message: resp.msg,
        duration: 3000,
      })
      loadArticles()
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
  <div>
    <div class="flex items-center gap-2">
      <router-link to="/admin/articles/write">
        <bh-button class="bg-success-600 dark:!ring-offset-slate-700 ring-success-600 px-2 text-white whitespace-nowrap">
          {{ t('page.admin-article.write') }}
        </bh-button>
      </router-link>
      <bh-input v-model="conditions.title" :placeholder="t('page.admin-article.title')" class="!w-auto" />
      <bh-input v-model="conditions.tag" :placeholder="t('page.admin-article.tag')" class="!w-36" />
      <select v-model="conditions.category">
        <option value="" selected>
          {{ t('page.admin-article.all-category') }}
        </option>
        <option v-for="item in categories" :key="item.cid" :value="item.name">
          {{ item.name }}
        </option>
      </select>
      <select v-model="conditions.status">
        <option value="PUBLISHED">
          {{ t('page.admin-article.status.published') }}
        </option>
        <option value="DRAFT">
          {{ t('page.admin-article.status.draft') }}
        </option>
        <option value="HIDDEN">
          {{ t('page.admin-article.status.hidden') }}
        </option>
      </select>
      <bh-button class="bg-primary-500 dark:bg-dark-600 dark:!ring-offset-slate-700 ring-primary-500 dark:ring-dark-600 px-2 text-white whitespace-nowrap" @click="loadArticles()">
        {{ t('page.admin-article.search') }}
      </bh-button>
    </div>
    <bh-table :data="articles.data">
      <template #header>
        <th>{{ t('page.admin-article.title') }}</th>
        <th class="cursor-pointer" @click="changeSortBy('read_count')">
          <span>{{ t('page.admin-article.read-count') }}</span>
          <i-sharp-solid-caret-down v-if="conditions.sortBy === 'read_count'" class="inline" />
          <i-sharp-regular-caret-down v-else class="inline" />
        </th>
        <th>{{ t('page.admin-article.category') }}</th>
        <th class="cursor-pointer" @click="changeSortBy('created_at')">
          <span>{{ t('page.admin-article.created') }}</span>
          <i-sharp-solid-caret-down v-if="conditions.sortBy === 'created_at'" class="inline" />
          <i-sharp-regular-caret-down v-else class="inline" />
        </th>
        <th class="sticky right-0">
          {{ t('page.admin-article.operation') }}
        </th>
      </template>
      <template #default="{ rowData }">
        <td>
          <a class="link" :href="`/articles/${rowData.aid}`" target="_blank">
            {{ rowData.title }}
            <i-regular-arrow-up-right-from-square class="inline w-3 h-3" />
          </a>
        </td>
        <td>{{ rowData.readCount }}</td>
        <td>{{ rowData.category.name }}</td>
        <td>
          {{ dayjs(rowData.createdAt).format(t('page.admin-article.date-format')) }}
        </td>
        <td class="sticky right-0">
          <router-link :to="`/admin/articles/write/${rowData.aid}`">
            <bh-button
              class="mr-2 px-2 py-0.5 bg-info-600 ring-info-600
            ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            >
              {{ t('page.admin-article.edit') }}
            </bh-button>
          </router-link>
          <bh-button
            class="px-2 py-0.5 bg-danger-500 ring-danger-500
            ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onDelete(rowData)"
          >
            {{ t('page.admin-article.delete') }}
          </bh-button>
        </td>
      </template>
      <template #footer>
        <bh-paginator
          v-model="articles.page"
          :total="articles.total"
          :size="articles.size"
          hide-on-single-page
          @change="loadArticles()"
        />
      </template>
    </bh-table>
    <bh-modal
      v-model="showDeleteModal"
      :title="t('page.admin-article.delete-title')"
      :content="t('page.admin-article.confirm-delete', { title: deleteArticle?.title })"
      danger
      @confirm="onComfirmDelete()"
    />
  </div>
</template>
