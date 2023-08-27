<route lang="yaml">
name: article-detail
</route>

<script setup lang="ts">
import { md } from '@/utils'

definePage({
  path: '/articles/:id(\\d+)',
})

onMounted(getArticle)
const toast = useToast()
const titleStore = useTitleStore()
const { t } = useI18n()

titleStore.title = t('title.article')

const article = ref<BhArticle>()
const contentHTML = ref('')
const loading = ref(true)
async function getArticle() {
  loading.value = true

  const resp = await api.article.getByAid(useRoute('article-detail').params.id)
  if (resp.success) {
    article.value = resp.data
    contentHTML.value = md.render(resp.data.content)
    titleStore.title = resp.data.title
  }
  else {
    toast.add({
      type: 'danger',
      message: resp.msg,
      duration: 5000,
    })
  }
  loading.value = false
}

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD')
}
</script>

<template>
  <bh-skeleton v-if="loading || !article" type="article" />
  <div v-else class="py-2">
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
        :title="t('link.category')"
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
        :to="`/tags/${tag.name}`" :title="t('link.tag')"
      >
        <IRegularTag />
        {{ tag.name }}
      </router-link>
    </div>
    <div v-html="contentHTML" />
    <comment-box :aid="article.aid" :author-uid="article.user.uid" />
  </div>
</template>

<style>
.article-paragraph {
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0;
  margin-inline-end: 0;
}

/* prismjs */
code[class*='language-'],
pre[class*='language-'] {
  @apply text-gray-50 bg-none font-mono text-base text-left whitespace-pre break-normal leading-6 rounded-md;
  word-spacing: normal;
  word-wrap: normal;
  tab-size: 4;
  hyphens: none;
}

/* Code blocks */
.code-block {
  @apply relative my-2 p-0 bg-gray-100 dark:bg-slate-800 transition-colors rounded-md;
}

.code-lang {
  @apply select-none rounded-md px-2 pt-1 transition-colors text-sm text-right;
  @apply bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500;
}

pre[class*='language-'] {
  @apply pb-4 pt-0 overflow-auto select-text;
}

code[class*='language-'] {
  @apply text-gray-700 dark:text-gray-100;
}

/* Inline code */
:not(pre)>code {
  @apply font-mono py-0.5 px-1 mx-0.5;
  @apply bg-primary-100 dark:bg-slate-700 text-primary-800 dark:text-white transition-colors rounded-md;
  @apply border border-primary-300 dark:border-slate-500;
  white-space: normal;
}

/* prismjs code style */
.token.comment,
.token.block-comment,
.token.prolog,
.token.doctype,
.token.cdata {
  @apply text-gray-600 dark:text-gray-400;
}

.token.punctuation {
  @apply text-gray-500 dark:text-gray-300;
}

.token.tag,
.token.attr-name,
.token.namespace,
.token.deleted {
  @apply text-rose-700 dark:text-amber-300;
}

.token.function-name .token.boolean,
.token.number,
.token.function {
  @apply text-red-600 dark:text-sky-300;
}

.token.property,
.token.class-name,
.token.constant,
.token.symbol {
  @apply text-pink-700 dark:text-yellow-200;
}

.token.selector,
.token.important,
.token.atrule,
.token.keyword,
.token.builtin {
  @apply text-blue-600 dark:text-fuchsia-400;
}

.token.string,
.token.char,
.token.attr-value,
.token.regex,
.token.variable {
  @apply text-lime-600 dark:text-lime-400;
}

.token.operator,
.token.entity,
.token.url {
  @apply text-amber-700 dark:text-cyan-300;
}

.token.important,
.token.bold {
  @apply font-bold;
}

.token.entity {
  @apply cursor-help;
}

.token.inserted {
  @apply text-green-700 dark:text-green-300;
}

/* task list */
.task-list-item {
  @apply flex items-center;
}

.task-list-item-checkbox {
  @apply relative appearance-none mr-2 h-4 w-4 border rounded disabled:opacity-80 disabled:cursor-not-allowed outline-none;
  @apply border-primary-400 checked:bg-primary-700 to-primary-500;
  @apply dark:border-dark-500 dark:checked:bg-dark-600 dark:to-dark-400;
}

.task-list-item-checkbox:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>
