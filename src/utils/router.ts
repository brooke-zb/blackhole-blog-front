import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:meta-layouts'
import { routes } from 'vue-router/auto/routes'

const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHistory(),
})

router.beforeEach((_to, _from, next) => {
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

router.beforeResolve((to, _from, next) => {
  if (!to.meta.noLoaded) {
    setPageLoading(false)
  }
  next()
})

export { router }
