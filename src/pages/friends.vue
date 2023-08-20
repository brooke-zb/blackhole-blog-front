<route lang="yaml">
name: friends
</route>

<script setup lang="ts">
onMounted(getFriends)

setTitle('友链')
const friends = ref<Friend[]>([])
const loading = ref(true)
async function getFriends() {
  loading.value = true
  const resp = await api.friend.getList()
  if (resp.success) {
    friends.value = resp.data
  }
  else {
    // TODO: toast
  }
  loading.value = false
}
</script>

<template>
  <bh-skeleton v-if="loading" type="friend" />
  <div v-else-if="friends?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
    <a
      v-for="friend in friends" :key="friend.name"
      :href="friend.link" target="_blank"
      class="p-3 bg-primary-200 dark:bg-gray-700 flex items-center rounded-lg
      shadow hover:shadow-lg hover:-translate-y-1 dark:shadow-gray-950/70 transition-all"
    >
      <img :src="friend.avatar" class="h-12 w-12 rounded-lg">
      <div class="ml-3">
        <div class="text-lg mb-1">{{ friend.name }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-300">{{ friend.description }}</div>
      </div>
    </a>
  </div>
  <bh-empty v-else />
</template>
