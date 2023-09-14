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
  <div class="h-12 bg-gray-50 dark:bg-slate-800 p-2 flex items-center">
    <h1>{{ titleStore.title }}</h1>
    <div class="grow" />
    <bh-menu>
      <div class="flex items-baseline gap-1">
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
