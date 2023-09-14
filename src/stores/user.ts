import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

const cookieKey = 'Authorization'

export const useUserStore = defineStore('user', () => {
  // state
  const info = ref<BhUser>()

  // getters
  const isLogin = computed(() => {
    return !!info.value
  })

  // init fn
  const initOnceFn = once(() => {
    return getInfo()
  })
  function initOnce() {
    return initOnceFn()
  }

  // actions
  async function login(data: BhLoginBody) {
    const resp = await api.account.login(data)
    if (!resp.success) {
      useToast().add({
        type: 'danger',
        message: resp.msg,
        duration: 3000,
      })
      throw new Error(resp.msg)
    }
    return await getInfo()
  }
  function logout() {
    Cookies.remove(cookieKey)
  }
  async function getInfo() {
    const resp = await api.account.getInfo()
    if (resp.success) {
      info.value = resp.data
    }
  }
  function hasPermission(permission: string) {
    for (const perm of info.value?.role.permissions || []) {
      if (perm.name === permission) {
        return true
      }
    }
    return false
  }

  return {
    info,
    isLogin,
    initOnce,
    login,
    logout,
    getInfo,
    hasPermission,
  }
})
