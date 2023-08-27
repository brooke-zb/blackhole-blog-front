<script setup lang="ts">
const props = defineProps<{
  code: string
  title: string
  message?: string
}>()

const { t } = useI18n()
useTitleStore().title = props.title
</script>

<template>
  <div class="p-2 flex justify-center">
    <div class="flex flex-col gap-y-4 rounded-lg bg-gray-50/80 dark:bg-slate-700/90 p-8 backdrop-blur max-w-sm">
      <h3 class="text-6xl font-bold text-danger-600 dark:text-danger-500">
        {{ props.code }}
      </h3>
      <h4 class="text-4xl">
        {{ props.title }}
      </h4>
      <p>{{ props.message || t('page.not-found.message') }}</p>
      <div class="flex justify-end">
        <router-link to="/">
          <bh-button class="ring-primary-500 bg-primary-500 dark:ring-dark-500 dark:bg-dark-500 text-white px-3 py-2">
            {{ t('page.not-found.homepage') }}
          </bh-button>
        </router-link>
      </div>
    </div>
  </div>
</template>
