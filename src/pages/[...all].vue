<route lang="yaml">
name: not-found
</route>

<script setup lang="ts">
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('title.not-found')
</script>

<template>
  <div>
    <h1>{{ t('not-found') }}</h1>
  </div>
</template>
