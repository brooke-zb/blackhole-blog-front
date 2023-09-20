<route lang="yaml">
name: admin-roles
meta:
  auth: ROLE:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.roles')
</script>

<template>
  roles
</template>
