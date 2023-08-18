<route lang="yaml">
name: index
</route>

<script setup lang="ts">
import { setPageLoading } from '@/utils'

const { t } = useI18n()
setTitle(t('title.index'))

function load() {
  setPageLoading(true)
  setTimeout(() => {
    setPageLoading(false)
  }, 1500)
}

const page = ref(1)
</script>

<template>
  <div class="text-indigo-500">
    This is index
    <button @click="load()">
      load {{ page }}
    </button>
    <bh-paginator v-model="page" :size="10" :total="100" />
  </div>
</template>
