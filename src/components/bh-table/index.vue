<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = defineProps<{
  data: T[]
  cols?: (keyof T)[]
}>()

const renderHeader = computed(() => {
  if (!props.cols) {
    return Object.keys(props.data[0] || {})
  }
  return props.cols
})

const renderData = computed(() => {
  return props.data.map((item) => {
    if (!props.cols) {
      return item
    }
    const data: T = {} as T
    props.cols.forEach((col) => {
      data[col] = item[col]
    })
    return data
  })
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table-auto w-full bg-gray-50 dark:bg-slate-800">
      <!-- header -->
      <thead>
        <tr>
          <slot name="header">
            <th v-for="header in renderHeader" :key="header">
              {{ header }}
            </th>
          </slot>
        </tr>
      </thead>

      <!-- body -->
      <tbody>
        <tr v-for="(item, idx) in renderData" :key="idx">
          <slot :row-data="item">
            <td v-for="(col, idx2) in item" :key="idx2">
              {{ col }}
            </td>
          </slot>
        </tr>
      </tbody>

      <!-- empty -->
      <caption v-if="props.data.length === 0" class="caption-bottom">
        <div class="py-8">
          <i-regular-box-open class="w-12 h-12 fill-gray-500 dark:fill-gray-400" />
          <p class="text-gray-500 dark:text-gray-400">
            暂无数据
          </p>
        </div>
      </caption>

      <!-- footer -->
      <caption class="caption-bottom">
        <slot name="footer" />
      </caption>
    </table>
  </div>
</template>

<style scoped>
tr {
  @apply border-b border-gray-300 dark:border-gray-600;
}

tr th,
tr td,
tr :slotted(th),
tr :slotted(td) {
  @apply bg-gray-50 text-start p-2 whitespace-nowrap;
}
.dark tr th,
.dark tr td,
.dark tr :slotted(th),
.dark tr :slotted(td) {
  @apply bg-slate-800;
}

tbody tr:nth-child(odd) td,
tbody tr:nth-child(odd) :slotted(td) {
  @apply bg-primary-50;
}
.dark tbody tr:nth-child(odd) td,
.dark tbody tr:nth-child(odd) :slotted(td) {
  @apply bg-slate-700;
}

tbody tr:hover td,
tbody tr:hover :slotted(td) {
  @apply bg-primary-100;
}
.dark tbody tr:hover td,
.dark tbody tr:hover :slotted(td) {
  @apply bg-slate-600;
}
</style>
