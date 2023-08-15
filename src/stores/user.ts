import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({}),
  getters: {
    isLogin: (state) => {
      return false
    },
  },
  actions: {
  },
})
