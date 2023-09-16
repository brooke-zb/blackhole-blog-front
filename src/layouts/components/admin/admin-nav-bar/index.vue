<script setup lang="ts">
const titleStore = useTitleStore()
const userStore = useUserStore()
const router = useRouter()
const toast = useToast()

function logout() {
  userStore.logout().then((resp) => {
    toast.add({
      type: 'success',
      message: resp.msg,
      duration: 3000,
    })
    router.push({ name: 'login' })
  })
}
</script>

<template>
  <div class="sticky top-0 h-12 bg-gray-50 dark:bg-slate-800 p-2 flex items-center z-30">
    <h1>{{ titleStore.title }}</h1>
    <div class="grow" />
    <bh-button
      v-tooltip="$t('nav.swtich-theme')"
      class="text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100
          fill-gray-600 hover:fill-gray-950 dark:fill-gray-400 dark:hover:fill-gray-100" no-ring @click="toggleDark()"
    >
      <template #icon>
        <i-regular-moon-stars v-if="isDark" class="align-bottom" />
        <i-regular-brightness v-else class="align-bottom" />
      </template>
    </bh-button>
    <bh-menu>
      <div class="flex items-center gap-1">
        <i-solid-user class="h-4 w-4" />
        <h1>{{ userStore.info?.name }}</h1>
      </div>
      <template #menu>
        <bh-menu-item class="flex items-center gap-1.5">
          <i-solid-gear class="h-4 w-4" />
          <h1>{{ $t('page.admin.settings') }}</h1>
        </bh-menu-item>
        <bh-menu-item class="flex items-center gap-1.5" @click="logout()">
          <i-solid-right-from-bracket class="h-4 w-4" />
          <h1>{{ $t('page.admin.logout') }}</h1>
        </bh-menu-item>
      </template>
    </bh-menu>
  </div>
</template>
