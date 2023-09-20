<script setup lang="ts">
import logo from '@/assets/images/avatar.png?url'
import IconIndex from '~icons/regular/gauge-max'
import IconArticles from '~icons/regular/memo'
import IconCategories from '~icons/regular/folders'
import IconTags from '~icons/regular/tags'
import IconUsers from '~icons/regular/user-gear'
import IconComments from '~icons/regular/comments'
import IconRoles from '~icons/regular/shield-halved'
import IconFriend from '~icons/regular/user-group'

const appName = import.meta.env.BHBLOG_APP_TITLE

const routerList = [
  {
    path: '/admin',
    translate: 'routes.admin.index',
    icon: IconIndex,
  },
  {
    path: '/admin/articles',
    translate: 'routes.admin.articles',
    icon: IconArticles,
  },
  {
    path: '/admin/comments',
    translate: 'routes.admin.comments',
    icon: IconComments,
  },
  {
    path: '/admin/categories',
    translate: 'routes.admin.categories',
    icon: IconCategories,
  },
  {
    path: '/admin/tags',
    translate: 'routes.admin.tags',
    icon: IconTags,
  },
  {
    path: '/admin/users',
    translate: 'routes.admin.users',
    icon: IconUsers,
  },
  {
    path: '/admin/roles',
    translate: 'routes.admin.roles',
    icon: IconRoles,
  },
  {
    path: '/admin/friends',
    translate: 'routes.admin.friends',
    icon: IconFriend,
  },
]
</script>

<template>
  <div
    class="fixed top-0 bottom-0 w-16 hover:w-64 delay-200 duration-200 transition-[width]
    bg-gray-50 dark:bg-slate-800 group/sidebar overflow-hidden
    shadow-lg shadow-gray-300 dark:shadow-slate-950 translate-x-0 shrink-0 z-[35]"
  >
    <!-- logo -->
    <router-link to="/" class="flex items-center gap-2 p-2" :title="$t('routes.admin.back-to-blog')">
      <img :src="logo" alt="logo" class="w-12 h-12 rounded-lg">
      <h1
        class="text-lg whitespace-nowrap select-none group-hover/sidebar:select-auto transition-colors delay-200 duration-200
        text-transparent group-hover/sidebar:text-gray-600 dark:group-hover/sidebar:text-gray-200"
      >
        {{ appName }}
      </h1>
    </router-link>

    <!-- router list -->
    <ul>
      <li v-for="router in routerList" :key="router.path">
        <router-link
          :to="router.path"
          class="flex items-center w-full h-12 gap-1 transition-colors hover:bg-primary-200 dark:hover:bg-dark-600"
          :class="{ '!bg-primary-300 dark:!bg-dark-500': $route.path === router.path }"
        >
          <component
            :is="router.icon" class="w-5 h-5 m-5 shrink-0 fill-gray-600 dark:fill-gray-200"
            :class="{ '!fill-gray-700 dark:!fill-gray-50': $route.path === router.path }"
          />
          <span
            class="whitespace-nowrap transition-colors delay-200 duration-200 select-none group-hover/sidebar:select-auto
            text-transparent group-hover/sidebar:text-gray-600 dark:group-hover/sidebar:text-gray-200"
            :class="{ 'group-hover/sidebar:!text-gray-700 dark:group-hover/sidebar:!text-gray-50': $route.path === router.path }"
          >
            {{ $t(router.translate) }}
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
