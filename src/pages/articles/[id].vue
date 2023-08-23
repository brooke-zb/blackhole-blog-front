<route lang="yaml">
name: article-detail
</route>

<script setup lang="ts">
import { md } from '@/utils'

definePage({
  path: '/articles/:id(\\d+)',
})

onMounted(getArticle)
const titleStore = useTitleStore()
titleStore.title = '文章'

const article = ref<Article>()
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
    // TODO: toast
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
    <div
      class="flex justify-center gap-2 mb-2 text-gray-500 fill-gray-500 dark:text-gray-400 dark:fill-gray-400"
    >
      <bh-tooltip text="发布时间">
        <i-regular-calendar-lines class="inline align-text-top" />
        {{ formatDate(article.createdAt) }}
      </bh-tooltip>
      <template v-if="article.updatedAt">
        <span> - </span>
        <bh-tooltip text="上次更新">
          <i-regular-calendar-lines-pen class="inline align-text-top" />
          {{ formatDate(article.updatedAt) }}
        </bh-tooltip>
      </template>
    </div>
    <div
      class="flex justify-center items-center gap-1.5 mb-2 text-gray-500 fill-gray-500 dark:text-gray-400 dark:fill-gray-400"
    >
      <IRegularEye />
      {{ article.readCount }}
      -
      <router-link
        class="link flex justify-center items-center gap-1.5"
        :to="`/categories/${article.category.name}`" title="分类"
      >
        <IRegularFolder />
        {{ article.category.name }}
      </router-link>
    </div>
    <div
      class="flex justify-center items-end gap-2 mb-2 text-light-500 fill-light-500 dark:text-light-400 dark:fill-light-400"
    >
      <router-link
        v-for="tag in article.tags" :key="tag.name"
        class="link flex justify-center items-center gap-0.5"
        :to="`/tags/${tag.name}`" title="标签"
      >
        <IRegularTag />
        {{ tag.name }}
      </router-link>
    </div>
    <div v-html="contentHTML" />
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
:not(pre) > code {
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
</style>
