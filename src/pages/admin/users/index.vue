<route lang="yaml">
name: admin-users
meta:
  auth: USER:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.users')
</script>

<template>
  users
</template>
