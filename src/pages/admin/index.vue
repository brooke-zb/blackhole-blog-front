<route lang="yaml">
name: admin
meta:
  auth: true
  layout: admin
</route>

<script setup lang="ts">
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.index')
</script>

<template>
  <div>admin</div>
</template>
