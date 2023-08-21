<route lang="yaml">
name: about
</route>

<script setup lang="ts">
import { md } from '@/utils'

const content = `
# About

## katex test

### block

$$
O(N^2)
$$

### inline

时间复杂度仅为$O(logN)$
`
</script>

<template>
  <div v-html="md.render(content)" />
</template>
