<script setup lang="ts">
import IconRegularBoxArchive from '~icons/regular/box-archive'
import IconRegularFolders from '~icons/regular/folders'
import IconRegularTags from '~icons/regular/tags'
import IconRegularAddressCard from '~icons/regular/address-card'
import IconRegularFaceSunglasses from '~icons/regular/face-sunglasses'
import { title } from '@/utils'

const userStore = useUserStore()
const { t } = useI18n()
const links = [
  { name: t('link.blog'), path: '/', icon: IconRegularBoxArchive },
  { name: t('link.category'), path: '/categories', icon: IconRegularFolders },
  { name: t('link.tag'), path: '/tags', icon: IconRegularTags },
  { name: t('link.about'), path: '/about', icon: IconRegularAddressCard },
  { name: t('link.friend'), path: '/friends', icon: IconRegularFaceSunglasses },
]
const navTitle = import.meta.env.BHBLOG_APP_TITLE
</script>

<template>
  <nav
    class="sticky top-0 h-14 px-2 py-1 flex justify-between items-center z-50
    ring-1 ring-gray-500/10 dark:ring-gray-500/10 backdrop-blur"
  >
    <div class="flex gap-2 ps-1.5 items-baseline grow">
      <router-link to="/" class="text-lg">
        {{ navTitle }}
      </router-link>
      <div class="hidden md:block text-ellipsis overflow-hidden whitespace-nowrap w-0 grow">
        {{ title }}
      </div>
    </div>
    <div class="flex items-center gap-6 sm:gap-4">
      <router-link
        v-for="link in links" :key="link.path" :to="link.path"
        class="text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100
        fill-gray-600 hover:fill-gray-950 dark:fill-gray-400 dark:hover:fill-gray-100
        transition-colors duration-200"
      >
        <span class="hidden sm:inline">{{ link.name }}</span>
        <bh-tooltip :text="link.name">
          <component :is="link.icon" class="sm:hidden" />
        </bh-tooltip>
      </router-link>
      <bh-tooltip text="切换主题">
        <bh-button
          class="text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100
          fill-gray-600 hover:fill-gray-950 dark:fill-gray-400 dark:hover:fill-gray-100
          transition-colors duration-200"
          @click="toggleDark()"
        >
          <template #icon>
            <i-regular-moon-stars v-if="isDark" />
            <i-regular-brightness v-else />
          </template>
        </bh-button>
      </bh-tooltip>
      <bh-tooltip :text="userStore.isLogin ? '管理' : '登录'">
        <router-link to="/admin">
          <bh-button
            class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100
          fill-gray-600 hover:fill-gray-900 dark:fill-gray-400 dark:hover:fill-gray-100"
          >
            <template #icon>
              <i-regular-gear v-if="userStore.isLogin" />
              <i-regular-right-to-bracket v-else />
            </template>
          </bh-button>
        </router-link>
      </bh-tooltip>
    </div>
  </nav>
</template>
