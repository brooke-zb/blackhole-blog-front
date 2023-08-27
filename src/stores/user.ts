import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

interface UserState {
  token?: string
  info?: BhUser
}

const cookieKey = 'Authorization'

export const useUserStore = defineStore('user', () => {
  // state
  const state = ref<UserState>({
    token: Cookies.get(cookieKey),
  })

  // getters
  const isLogin = computed(() => {
    return !!state.value.info
  })

  // init fn
  const initOnceFn = once(() => {
    if (state.value.token) {
      return getInfo()
    }
  })
  function initOnce() {
    return initOnceFn()
  }

  // actions
  function logout() {
    Cookies.remove(cookieKey)
  }
  async function getInfo() {
    const resp = await api.account.getInfo()
    if (resp.success) {
      state.value.info = resp.data
    }
    else {
      state.value.token = undefined
      useToast().add({
        type: 'danger',
        message: resp.msg,
      })
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
    logout,
    getInfo,
    hasPermission,
  }
})
