<script setup lang="ts">
import IconRegularBoxArchive from '~icons/regular/box-archive'
import IconRegularFolders from '~icons/regular/folders'
import IconRegularTags from '~icons/regular/tags'
import IconRegularAddressCard from '~icons/regular/address-card'
import IconRegularFaceSunglasses from '~icons/regular/face-sunglasses'

const titleStore = useTitleStore()
const userStore = useUserStore()

const { t } = useI18n()
const links = [
  { name: t('routes.blog'), path: '/', icon: IconRegularBoxArchive },
  { name: t('routes.category'), path: '/categories', icon: IconRegularFolders },
  { name: t('routes.tag'), path: '/tags', icon: IconRegularTags },
  { name: t('routes.about'), path: '/about', icon: IconRegularAddressCard },
  { name: t('routes.friend'), path: '/friends', icon: IconRegularFaceSunglasses },
]
const navTitle = import.meta.env.BHBLOG_APP_TITLE
</script>

<template>
  <nav
    class="sticky top-0 h-14 px-2 py-1 flex justify-between items-center z-30
    ring-1 ring-gray-500/10 dark:ring-gray-500/10 bg-gray-50 dark:bg-slate-900 bg-opacity-60 backdrop-blur"
  >
    <div class="flex gap-2 ps-1.5 items-baseline grow">
      <router-link to="/" class="text-lg">
        {{ navTitle }}
      </router-link>
      <div class="hidden md:block text-ellipsis overflow-hidden whitespace-nowrap w-0 grow">
        {{ titleStore.title }}
      </div>
    </div>
    <div class="flex items-center gap-5 sm:gap-4">
      <router-link
        v-for="link in links" :key="link.path" :to="link.path"
        class="text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100
        fill-gray-600 hover:fill-gray-950 dark:fill-gray-400 dark:hover:fill-gray-100
        transition-colors duration-200"
      >
        <span class="hidden sm:inline">{{ link.name }}</span>
        <component :is="link.icon" v-tooltip="link.name" class="sm:hidden" />
      </router-link>
      <bh-button
        v-tooltip="t('nav.swtich-theme')"
        class="text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100
          fill-gray-600 hover:fill-gray-950 dark:fill-gray-400 dark:hover:fill-gray-100" no-ring @click="toggleDark()"
      >
        <template #icon>
          <i-regular-moon-stars v-if="isDark" class="align-bottom" />
          <i-regular-brightness v-else class="align-bottom" />
        </template>
      </bh-button>
      <router-link
        v-tooltip="userStore.isLogin ? t('nav.manage') : t('nav.login')"
        :to="userStore.isLogin ? '/admin' : '/admin/login'"
        class="inline-flex"
      >
        <bh-button
          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100
          fill-gray-600 hover:fill-gray-900 dark:fill-gray-400 dark:hover:fill-gray-100"
          no-ring
        >
          <template #icon>
            <i-regular-gear v-if="userStore.isLogin" class="align-bottom" />
            <i-regular-right-to-bracket v-else class="align-bottom" />
          </template>
        </bh-button>
      </router-link>
    </div>
  </nav>
</template>
