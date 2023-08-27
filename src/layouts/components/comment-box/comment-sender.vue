<script setup lang="ts">
const props = defineProps<{
  aid: number
  coid?: number
}>()

const emits = defineEmits<{
  refresh: []
}>()

// 更改评论框位置
const changeReplyComment = inject('changeReplyComment', Function, true)

const teleportSelector = computed(() => props.coid ? `#co${props.coid} .comment-sender` : '#article-comment-sender')

const isSending = ref(false)

const toast = useToast()
const userCache = useStorage('bhblog.user.cache', {
  nickname: '',
  email: '',
  site: '',
})

const { t } = useI18n()
const data = reactive({
  nickname: {
    value: userCache.value.nickname,
    rule: betweenLength(2, 32, {
      min: t('page.article.validate.nickname-min'),
      max: t('page.article.validate.nickname-max'),
    }),
    invalid: false,
  },
  email: {
    value: userCache.value.email,
    rule: or(email(t('page.article.validate.email')), isEmpty('')),
    invalid: false,
  },
  site: {
    value: userCache.value.site,
  },
  content: {
    value: '',
    rule: betweenLength(1, 300, {
      min: t('page.article.validate.content-blank'),
      max: t('page.article.validate.content-max'),
    }),
    invalid: false,
  },
})

function parseLink(link: string) {
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return link
  }
  return `https://${link}`
}

function sendComment() {
  validate(data, (valid: boolean, message: string) => {
    if (valid) {
      isSending.value = true
      api.comment.add({
        aid: props.aid,
        nickname: data.nickname.value,
        email: data.email.value ? data.email.value : undefined,
        site: data.site.value ? parseLink(data.site.value) : undefined,
        content: data.content.value,
        replyId: props.coid ? props.coid : undefined,
      }).then((res) => {
        isSending.value = false
        if (res.success) {
          emits('refresh')
          data.content.value = ''
          toast.add({
            type: 'success',
            message: res.msg,
            duration: 5000,
          })

          // 缓存用户信息
          userCache.value.nickname = data.nickname.value
          userCache.value.email = data.email.value
          userCache.value.site = data.site.value
        }
        else {
          toast.add({
            type: 'danger',
            message: res.msg,
            duration: 5000,
          })
        }
      })
    }
    else {
      toast.add({
        type: 'danger',
        message,
        duration: 5000,
      })
    }
  })
}
</script>

<template>
  <teleport :to="teleportSelector">
    <div class="my-2 border-dashed border-primary-300 rounded-md">
      <div class="flex flex-col sm:flex-row gap-2 mb-2">
        <bh-input v-model="data.nickname.value" :placeholder="t('page.article.comment.nickname')" :invalid="data.nickname.invalid">
          <template #left>
            <i-regular-user />
          </template>
        </bh-input>
        <bh-input v-model="data.email.value" :placeholder="t('page.article.comment.email')" :invalid="data.email.invalid">
          <template #left>
            <i-regular-envelope />
          </template>
        </bh-input>
        <bh-input v-model="data.site.value" :placeholder="t('page.article.comment.site')">
          <template #left>
            <i-regular-link />
          </template>
        </bh-input>
      </div>
      <bh-textarea
        v-model="data.content.value" :min-rows="4" :placeholder="t('page.article.comment.content')"
        :invalid="data.content.invalid"
      />
      <div class="flex justify-end items-center gap-2 p-2">
        <div class="mr-1 text-gray-400 dark:text-slate-400">
          {{ data.content.value.length }}/300
        </div>
        <bh-button
          v-if="props.coid"
          class="px-3 text-lg bg-danger-500 dark:bg-gray-50
          text-white dark:text-black ring-danger-500 dark:ring-gray-50"
          @click="changeReplyComment()"
        >
          {{ t('page.article.comment.cancel-reply') }}
        </bh-button>
        <bh-button
          class="px-3 text-lg bg-primary-500 dark:bg-dark-500
          text-white dark:text-white ring-primary-500 dark:ring-dark-500"
          :disabled="isSending"
          @click="sendComment"
        >
          <template v-if="isSending" #icon>
            <i-regular-spinner-third class="animate-spin" />
          </template>
          {{ isSending ? t('page.article.comment.sending') : t('page.article.comment.submit') }}
        </bh-button>
      </div>
    </div>
  </teleport>
</template>
