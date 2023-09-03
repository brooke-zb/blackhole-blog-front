<route lang="yaml">
name: login
</route>

<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()
const title = import.meta.env.BHBLOG_APP_TITLE
const loginBody = reactive({
  username: {
    value: '',
    rule: notEmpty(t('page.login.error.username-blank')),
    invalid: false,
  },
  password: {
    value: '',
    rule: notEmpty(t('page.login.error.password-blank')),
    invalid: false,
  },
  rememberMe: {
    value: false,
  },
})

const router = useRouter()
const userStore = useUserStore()
function login() {
  validate(loginBody, (valid, message) => {
    if (!valid) {
      toast.add({
        type: 'danger',
        message,
        duration: 3000,
      })
      return
    }
    userStore.login({
      username: loginBody.username.value,
      password: loginBody.password.value,
      rememberMe: loginBody.rememberMe.value,
    }).then(() => {
      toast.add({
        type: 'success',
        message: '登录成功',
        duration: 3000,
      })
      router.push('/admin')
    })
  })
}
</script>

<template>
  <div class="login-container flex justify-center items-center">
    <div class="p-6 rounded-xl bg-gray-50 dark:bg-slate-700">
      <div class="text-center text-xl text-gray-600 dark:text-gray-50">
        {{ title }}
      </div>
      <bh-input
        v-model="loginBody.username.value" :invalid="loginBody.username.invalid"
        :placeholder="t('page.login.username')" class="mt-4"
      >
        <template #left>
          <i-regular-user />
        </template>
      </bh-input>
      <bh-input
        v-model="loginBody.password.value" :invalid="loginBody.password.invalid"
        :placeholder="t('page.login.password')" type="password" class="mt-4"
      >
        <template #left>
          <i-regular-lock />
        </template>
      </bh-input>
      <div class="mt-4 flex items-center gap-2">
        <input id="remember-me" v-model="loginBody.rememberMe.value" type="checkbox" class="checkbox dark:ring-offset-slate-700">
        <label for="remember-me" class="text-sm text-gray-600 dark:text-gray-50">{{ t('page.login.remember-me') }}</label>
      </div>
      <bh-button
        class="mt-4 w-full bg-primary-500 ring-primary-500 text-white dark:bg-dark-500 dark:ring-dark-500 dark:ring-offset-slate-700"
        @click="login()"
      >
        {{ t('page.login.submit') }}
      </bh-button>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: calc(100vh - 136px); /* 顶栏56px，底栏80px */
}
</style>
