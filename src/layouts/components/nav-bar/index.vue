<script setup lang="ts">
import IconRegularAddressCard from '~icons/regular/address-card'
import IconRegularBoxArchive from '~icons/regular/box-archive'
import IconRegularFaceSunglasses from '~icons/regular/face-sunglasses'
import IconRegularFolders from '~icons/regular/folders'
import IconRegularTags from '~icons/regular/tags'

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
const isLinksOpen = ref(false)
const linkMenuHeight = ref(links.length) // * 3rem
const navTitle = import.meta.env.BHBLOG_APP_TITLE
</script>

<template>
  <nav
    class="sticky top-0 px-2 py-1 flex justify-between items-center z-30
    ring-1 ring-gray-500/10 dark:ring-gray-500/10 bg-gray-50 dark:bg-slate-900 bg-opacity-60 backdrop-blur flex-wrap md:flex-nowrap"
  >
    <div class="flex gap-2 ps-1.5 items-center grow h-12">
      <router-link to="/" class="text-lg">
        {{ navTitle }}
      </router-link>
      <div class="hidden md:block text-ellipsis overflow-hidden whitespace-nowrap w-0 grow">
        {{ titleStore.title }}
      </div>
    </div>

    <!-- 链接区 -->
    <div class="flex items-center gap-5 sm:gap-4">
      <router-link
        v-for="link in links" :key="link.path" :to="link.path"
        class="text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100
        fill-gray-600 hover:fill-gray-950 dark:fill-gray-400 dark:hover:fill-gray-100
        hidden sm:inline transition-colors duration-200"
      >
        {{ link.name }}
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
      <bh-button
        class="sm:hidden text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100
        fill-gray-600 hover:fill-gray-900 dark:fill-gray-400 dark:hover:fill-gray-100"
        no-ring @click="isLinksOpen = !isLinksOpen"
      >
        <i-regular-bars v-show="!isLinksOpen" />
        <i-regular-xmark v-show="isLinksOpen" />
      </bh-button>
    </div>
    <!-- 小屏幕下的链接区 -->
    <transition name="link">
      <div v-show="isLinksOpen" class="sm:hidden basis-full overflow-hidden">
        <router-link
          v-for="link in links" :key="link.path" :to="link.path"
          class="block px-1 py-0.5 h-12 text-center group/link
          text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100
          fill-gray-600 hover:fill-gray-950 dark:fill-gray-400 dark:hover:fill-gray-100"
          @click="isLinksOpen = false"
        >
          <div class="group-hover/link:bg-gray-200 dark:group-hover/link:bg-slate-800 p-1.5 rounded">
            {{ link.name }}
          </div>
        </router-link>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.link-enter-active, .link-leave-active {
  transition: all 0.3s;
}
.link-enter-from, .link-leave-to {
  height: 0;
}
.link-enter-to, .link-leave-from {
  height: calc(v-bind(linkMenuHeight) * 3rem);
}
</style>
