import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:meta-layouts'
import { routes } from 'vue-router/auto/routes'

const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHistory(),
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const toast = useToast()

  setPageLoading(true)

  // 获取用户信息
  await userStore.initOnce()

  // 登录页判断
  if (to.name === 'login') {
    if (userStore.isLogin) {
      return '/admin'
    }
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
      return '/admin/login'
    }
    if (to.meta.auth === true) {
      return
    }
    if (!userStore.hasPermission(to.meta.auth as string)) {
      toast.add({
        type: 'danger',
        translate: 'auth.no-permission',
        duration: 3000,
      })
      return '/admin'
    }
  }
})

router.afterEach((to, _from) => {
  if (!to.meta.noLoaded) {
    setPageLoading(false)
  }
})

export { router }
