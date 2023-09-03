import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

interface UserState {
  info?: BhUser
}

const cookieKey = 'Authorization'

export const useUserStore = defineStore('user', () => {
  // state
  const state = ref<UserState>({
    info: undefined,
  })

  // getters
  const isLogin = computed(() => {
    return !!state.value.info
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
      state.value.info = resp.data
    }
  }
  function hasPermission(permission: string) {
    for (const perm of state.value.info?.role.permissions || []) {
      if (perm.name === permission) {
        return true
      }
    }
    return false
  }

  return {
    state,
    isLogin,
    initOnce,
    login,
    logout,
    getInfo,
    hasPermission,
  }
})
