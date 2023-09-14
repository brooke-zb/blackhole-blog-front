<script setup lang="ts">
import logo from '@/assets/images/avatar.png?url'
import IconRegularMemo from '~icons/regular/memo'
import IconRegularFolders from '~icons/regular/folders'
import IconRegularTags from '~icons/regular/tags'
import IconRegularUserGear from '~icons/regular/user-gear'
import IconRegularComments from '~icons/regular/comments'
import IconRegularShieldHalved from '~icons/regular/shield-halved'

const appName = import.meta.env.BHBLOG_APP_TITLE

const routerList = [
  {
    path: '/admin/articles',
    translate: 'routes.admin.articles',
    icon: IconRegularMemo,
  },
  {
    path: '/admin/comments',
    translate: 'routes.admin.comments',
    icon: IconRegularComments,
  },
  {
    path: '/admin/categories',
    translate: 'routes.admin.categories',
    icon: IconRegularFolders,
  },
  {
    path: '/admin/tags',
    translate: 'routes.admin.tags',
    icon: IconRegularTags,
  },
  {
    path: '/admin/users',
    translate: 'routes.admin.users',
    icon: IconRegularUserGear,
  },
  {
    path: '/admin/roles',
    translate: 'routes.admin.roles',
    icon: IconRegularShieldHalved,
  },
]
</script>

<template>
  <div class="h-screen w-16 hover:w-56 delay-500 duration-200 transition-[width] bg-gray-50 dark:bg-slate-900 group/sidebar overflow-hidden">
    <!-- logo -->
    <router-link to="/admin" class="flex items-center gap-2 p-2">
      <img :src="logo" alt="logo" class="w-12 h-12 rounded-lg">
      <h1
        class="text-lg whitespace-nowrap select-none group-hover/sidebar:select-auto transition-colors delay-500 duration-200
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
        >
          <component :is="router.icon" class="w-5 h-5 m-5 shrink-0 fill-gray-600 dark:fill-gray-200" />
          <span
            class="whitespace-nowrap transition-colors delay-500 duration-200 select-none group-hover/sidebar:select-auto
            text-transparent group-hover/sidebar:text-gray-600 dark:group-hover/sidebar:text-gray-200"
          >
            {{ $t(router.translate) }}
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
