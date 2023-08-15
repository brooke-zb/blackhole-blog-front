import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:meta-layouts'
import { routes } from 'vue-router/auto/routes'
import { setPageLoading } from '.'

const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
  setPageLoading(true)
  next()
  // if (to.meta.auth) {
  //   if (localStorage.getItem('token')) {
  //     next()
  //   }
  //   else {
  //     next({ name: 'login' })
  //   }
  // }
  // else {
  //   next()
  // }
})

router.beforeResolve(() => {
  setPageLoading(false)
})

export { router }
