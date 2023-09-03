import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:meta-layouts'
import { routes } from 'vue-router/auto/routes'

const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHistory(),
})

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()
  const toast = useToast()

  setPageLoading(true)

  // 获取用户信息
  await userStore.initOnce()

  // 登录页判断
  if (to.name === 'login') {
    if (userStore.isLogin) {
      router.replace('/admin')
      return
    }
    next()
    return
  }

  // 路由鉴权
  if (to.meta.auth) {
    if (!userStore.isLogin) {
      toast.add({
        type: 'danger',
        translate: 'auth.require-login',
        duration: 3000,
      })
      next('/admin/login')
      return
    }
    if (to.meta.auth === true) {
      next()
      return
    }
    if (!userStore.hasPermission(to.meta.auth as string)) {
      toast.add({
        type: 'danger',
        translate: 'auth.no-permission',
        duration: 3000,
      })
      next('/admin')
      return
    }
  }
  next()
})

router.beforeResolve((to, _from, next) => {
  if (!to.meta.noLoaded) {
    setPageLoading(false)
  }
  next()
})

export { router }
