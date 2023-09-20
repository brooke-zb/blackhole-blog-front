<route lang="yaml">
name: admin-friends
meta:
  auth: FRIEND:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.friends')
</script>

<template>
  friend
</template>
