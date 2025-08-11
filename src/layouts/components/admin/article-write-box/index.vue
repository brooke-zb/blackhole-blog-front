<script setup lang="ts">
import { afterMarkdownRender, getMarkdownRenderer } from '@/utils'
import { beforeUnmounted } from '@/utils/markdown'
import '@/pages/articles/article.css'

const props = withDefaults(defineProps<{
  update?: boolean
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
  initUploadEl()
})

onUnmounted(beforeUnmounted)

const toast = useToast()
const { t } = useI18n()
const article = reactive<BhArticleUpdate>({
  aid: -1,
  cid: 1,
  tags: [],
  title: '',
  abstract: '',
  content: '',
  commentable: true,
  status: 'PUBLISHED',
  createdAt: dayjs().format('YYYY-MM-DDTHH:mm'),
})

// 工具栏吸顶
const { y } = useWindowScroll()
const windowY = computed(() => Math.max(0, y.value - 48))

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

// 文章摘要
const abstractLoading = ref(false)
function getArticleAbstract() {
  article.abstract = ''
  abstractLoading.value = true
  api.admin.article.getAbstract(article.content).then(async (resp) => {
    const streamReader = resp.getReader()
    const decoder = new TextDecoder('utf-8')
    while (true) {
      const { done, value } = await streamReader.read()
      if (done)
        break

      // 获取到数据时，将数据添加到文本中
      article.abstract += decoder.decode(value)
    }
    toast.add({
      type: 'success',
      message: t('page.admin-article-write.abstract-success'),
      duration: 3000,
    })
  }).finally(() => {
    abstractLoading.value = false
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
        article.abstract = resp.data.abstract || ''
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
    getMarkdownRenderer()
      .then(md => md.renderAsync(article.content))
      .then(content => renderHTML.value = content)
      .then(() => {
        afterMarkdownRender({
          gallery: gallery.value,
          t,
        })
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
      abstract: article.abstract,
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

// 上传图片
const uploadEl = ref<HTMLInputElement>()
const staticBaseUrl = import.meta.env.BHBLOG_STATIC_BASEURL
const uploadImagePath = ref('')
const imageMarkdown = computed(() => {
  return uploadImagePath.value ? `![${getUploadImageName()}](${staticBaseUrl}/${uploadImagePath.value})` : ''
})
function getUploadImageName() {
  const idxStart = uploadImagePath.value.lastIndexOf('/')
  const idxEnd = uploadImagePath.value.lastIndexOf('.')
  return uploadImagePath.value.substring(idxStart + 1, idxEnd)
}
function initUploadEl() {
  uploadEl.value!.addEventListener('change', () => {
    if (uploadEl.value?.files?.length) {
      api.admin.article.addAttachment(uploadEl.value.files[0]).then((resp) => {
        if (resp.success) {
          uploadImagePath.value = resp.data
        }
        toast.add({
          type: resp.success ? 'success' : 'danger',
          message: resp.success ? t('page.admin-article-write.upload-success') : resp.msg,
          duration: 3000,
        })
      })
    }
  })
}
function uploadImage() {
  uploadEl.value?.click()
}
function copyImageMarkdown() {
  navigator.clipboard.writeText(imageMarkdown.value).then(() => {
    toast.add({
      type: 'success',
      message: t('page.admin-article-write.copy-success'),
      duration: 3000,
    })
  })
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
        v-model="article.abstract!"
        :placeholder="t('page.admin-article-write.abstract')"
        :min-rows="3"
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
    <div class="shrink-0 md:pt-12">
      <div class="flex flex-col gap-2 md:relative sticky-bar">
        <bh-button
          class="text-white"
          :class="isPreview ? 'bg-warning-600 ring-warning-600' : 'bg-primary-500 dark:bg-dark-500 ring-primary-500 dark:ring-dark-500'"
          @click="togglePreview()"
        >
          <template #icon>
            <i-regular-eye class="fill-white" />
          </template>
          {{ isPreview ? t('page.admin-article-write.cancel-preview') : t('page.admin-article-write.preview') }}
        </bh-button>
        <input ref="uploadEl" type="file" accept="image/*" class="hidden">
        <bh-button
          class="text-white bg-primary-500 dark:bg-dark-500 ring-primary-500 dark:ring-dark-500"
          @click="uploadImage()"
        >
          <template #icon>
            <i-regular-cloud-arrow-up class="fill-white" />
          </template>
          {{ t('page.admin-article-write.upload-image') }}
        </bh-button>
        <bh-input v-if="imageMarkdown" v-model="imageMarkdown" readonly :placeholder="t('page.admin-article-write.title')" @click="copyImageMarkdown()" />
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
        <bh-button
          class="text-white bg-primary-500 dark:bg-dark-500 ring-primary-500 dark:ring-dark-500"
          :disabled="abstractLoading"
          @click="getArticleAbstract()"
        >
          <template v-if="abstractLoading">
            <i-regular-spinner-third class="animate-spin w-6 h-6" />
          </template>
          <template v-else>
            {{ t('page.admin-article-write.get-abstract') }}
          </template>
        </bh-button>
      </div>
    </div>

    <bh-gallery ref="gallery" />
  </div>
</template>

<style scoped>
.sticky-bar {
  top: calc(v-bind('windowY') * 1px);
}
</style>
