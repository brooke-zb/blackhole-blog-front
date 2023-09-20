<script setup lang="ts">
import { md } from '@/utils'
import '@/pages/articles/article.css'

const props = withDefaults(defineProps<{
  update: boolean
  aid?: number
}>(), {
  update: false,
})

const emit = defineEmits<{
  add: [article: BhArticleAdd]
  update: [article: BhArticleUpdate]
}>()

onMounted(() => {
  loadCategories()
  loadArticle()
})

const toast = useToast()
const { t } = useI18n()
const article = reactive<BhArticleUpdate>({
  aid: -1,
  cid: 1,
  tags: [],
  title: '',
  content: '',
  commentable: true,
  status: 'PUBLISHED',
  createdAt: dayjs().format('YYYY-MM-DDTHH:mm'),
})

// 分类列表
const categories = ref<BhCategory[]>([])
function loadCategories() {
  api.admin.category.getList(1, 50).then((resp) => {
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

// 文章标签
const tags = ref<string[]>([])

// 加载文章
function loadArticle() {
  if (props.update && props.aid) {
    api.admin.article.getByAid(props.aid).then((resp) => {
      if (resp.success) {
        article.aid = resp.data.aid
        article.cid = resp.data.category.cid
        article.tags = resp.data.tags
        article.title = resp.data.title
        article.content = resp.data.content
        article.commentable = resp.data.commentable
        article.status = resp.data.status
        article.createdAt = dayjs(resp.data.createdAt).format('YYYY-MM-DDTHH:mm')
        tags.value = article.tags.map(item => item.name)
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
}

// 预览文章
const gallery = ref()
const isPreview = ref(false)
const renderHTML = ref('')
function togglePreview() {
  isPreview.value = !isPreview.value
  if (isPreview.value) {
    renderHTML.value = md.render(article.content)
    nextTick(() => {
      gallery.value.init('[data-gallery]')
    })
  }
}

// 更新日期
const updateLastModified = ref(true)

// 提交文章
function onSubmit() {
  if (props.update) {
    const updateArticle: BhArticleUpdate = {
      aid: article.aid,
      cid: article.cid,
      tags: tags.value.map(item => ({ name: item })),
      title: article.title,
      content: article.content,
      commentable: article.commentable,
      status: article.status,
      createdAt: dayjs(article.createdAt).format(),
      updatedAt: updateLastModified.value ? dayjs().format() : undefined,
    }
    emit('update', updateArticle)
  }
  else {
    const addArticle: BhArticleAdd = {
      cid: article.cid,
      tags: tags.value.map(item => ({ name: item })),
      title: article.title,
      content: article.content,
      commentable: article.commentable,
      status: article.status,
    }
    emit('add', addArticle)
  }
}
</script>

<template>
  <div class="flex flex-col-reverse md:flex-row gap-2">
    <!-- left -->
    <div class="min-w-0 flex-1">
      <bh-input
        v-model="article.title"
        :placeholder="t('page.admin-article-write.title')"
        class="mb-2"
      />
      <bh-textarea
        v-show="!isPreview"
        v-model="article.content"
        :placeholder="t('page.admin-article-write.content')"
        :min-rows="15"
        class="mb-2"
      />
      <div
        v-show="isPreview"
        class="mb-2 rounded-md border-2 border-dashed p-2 border-gray-300 dark:border-slate-600 shrink"
        v-html="renderHTML"
      />
      <div class="flex justify-end items-center gap-2">
        <input id="articleCommentable" v-model="article.commentable" type="checkbox" class="checkbox shrink-0">
        <label for="articleCommentable" class="mr-2">
          {{ t('page.admin-article-write.commentable') }}
        </label>
        <select v-model="article.status" class="mr-2">
          <option value="PUBLISHED">
            {{ t('status.article.published') }}
          </option>
          <option value="DRAFT">
            {{ t('status.article.draft') }}
          </option>
          <option value="HIDDEN">
            {{ t('status.article.hidden') }}
          </option>
        </select>
        <bh-button class="text-white bg-primary-500 dark:bg-dark-500 ring-primary-500 dark:ring-dark-500 px-3" @click="onSubmit()">
          {{ t('page.admin-article-write.submit') }}
        </bh-button>
      </div>
    </div>

    <!-- right -->
    <div class="shrink-0 md:pt-12 flex flex-col gap-2">
      <bh-button
        class="text-white"
        :class="isPreview ? 'bg-warning-600 ring-warning-600' : 'bg-primary-500 dark:bg-dark-500 ring-primary-500 dark:ring-dark-500'"
        @click="togglePreview()"
      >
        {{ isPreview ? t('page.admin-article-write.cancel-preview') : t('page.admin-article-write.preview') }}
      </bh-button>
      <select v-model="article.cid">
        <option v-for="item in categories" :key="item.cid" :value="item.cid">
          {{ item.name }}
        </option>
      </select>
      <bh-chips v-model="tags" :placeholder="t('page.admin-article-write.input-tags')" />
      <template v-if="props.update">
        <h3>{{ t('page.admin-article-write.published_time') }}</h3>
        <input
          v-model="article.createdAt" class="appearance-none bg-primary-50 dark:bg-slate-700 p-0.5
        rounded border border-primary-400 dark:border-dark-600 outline-0" type="datetime-local"
        >
      </template>
      <div v-if="props.update" class="flex items-center gap-2">
        <input id="updateLastModified" v-model="updateLastModified" type="checkbox" class="checkbox shrink-0">
        <label for="updateLastModified">{{ t('page.admin-article-write.update_modified') }}</label>
      </div>
    </div>

    <bh-gallery ref="gallery" />
  </div>
</template>
