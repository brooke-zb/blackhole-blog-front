<route lang="yaml">
name: admin-tags
meta:
  auth: TAG:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.tags')
</script>

<template>
  tags
</template>
