<template>
  <div class="flex">
    <admin-side-bar />
    <div class="h-screen overflow-y-auto grow w-full">
      <admin-nav-bar />
      <div class="m-3 p-2 bg-gray-50 dark:bg-slate-800 overflow-x-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>
