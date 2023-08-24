<script setup lang="ts">
const props = defineProps<{
  item: BhComment
  authorUid: number
  sub?: boolean
}>()

const { t } = useI18n()

const baseAvatarUrl = import.meta.env.BHBLOG_AVATAR_BASEURL
const avatar = computed(() => {
  if (props.item.avatar) {
    return `${baseAvatarUrl}/${props.item.avatar}?s=48`
  }
  else {
    return `${baseAvatarUrl}/?s=48`
  }
})

function cleanURL(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}

function formatDate(date: string, format: string) {
  return dayjs(date).format(format)
}

// 子评论
const isShowAll = ref(false)
const subComment = computed(() => {
  let items = props.item.children
  const canShowMore = items?.length > 2 || false
  if (!isShowAll.value && items) {
    items = items.slice(0, 2)
  }
  return {
    items,
    canShowMore,
  }
})
function showAllSubComment() {
  isShowAll.value = true
  subComment.value.canShowMore = false
}

// 更改评论框位置
const changeReplyComment = inject('changeReplyComment', Function, true)

// eslint-disable-next-line prefer-arrow-callback
const debounceResetOpacity = debounce(function resetOpacity(anchor: HTMLElement) {
  anchor.style.setProperty('--tw-bg-opacity', '0')
}, 1000)

function toAnchor(id: number | string | null) {
  if (!id) {
    return
  }
  const anchor = document.getElementById(`co${id}`)
  if (anchor) {
    window.scrollTo({
      top: anchor.offsetTop - 56, // 减去导航栏的高度
      behavior: 'smooth',
    })
    anchor.style.setProperty('--tw-bg-opacity', '0.4')

    debounceResetOpacity(anchor)
  }
}
</script>

<template>
  <div :id="`co${props.item.coid}`" class="py-4 bg-primary-300 dark:bg-slate-400 bg-opacity-0 dark:bg-opacity-0 transition-colors duration-200">
    <div class="flex items-start" :class="{ 'gap-2': props.sub, 'gap-4': !props.sub }">
      <bh-tooltip :text="t('page.article.click-to-reply')" append-class="shrink-0">
        <img
          :alt="props.item.nickname" class="rounded-full cursor-pointer hover:opacity-70"
          :src="avatar" :height="props.sub ? 36 : 48" :width="props.sub ? 36 : 48"
          @click="changeReplyComment(props.item.coid)"
        >
      </bh-tooltip>
      <div class="grow">
        <div class="text-gray-500 dark:text-gray-400 flex items-baseline gap-1">
          <!-- 昵称 -->
          <a v-if="props.item.site" :href="cleanURL(props.item.site)" class="link font-bold">
            {{ props.item.nickname }}
          </a>
          <span v-else class="font-bold">
            {{ props.item.nickname }}
          </span>
          <!-- 用户标识 -->
          <i-regular-circle-check v-if="props.item.uid" class="fill-success-600 dark:fill-success-500 text-xs" />
          <!-- 作者标识 -->
          <span
            v-if="props.item.uid === props.authorUid"
            class="text-xs bg-primary-500 dark:bg-dark-600 text-gray-50 rounded px-1 py-0.5"
          >{{ t('page.article.author') }}</span>
          <span class="text-xs text-gray-400 dark:text-gray-500" :title="formatDate(props.item.createdAt, 'YYYY-MM-DD HH:mm:ss')">
            {{ formatDate(props.item.createdAt, 'YYYY-MM-DD') }}
          </span>
        </div>
        <div class="mt-0.5">
          <span v-if="props.item.replyId">
            <a
              class="link" :href="`#co${props.item.replyId}`"
              @click.prevent="toAnchor(props.item.replyId)"
            >@{{ props.item.replyTo }}</a>
          </span>
          {{ props.item.content }}
        </div>
        <!-- 评论框tp位置 -->
        <div class="comment-sender" />
        <!-- 子评论 -->
        <comment-content v-for="subItem in subComment.items" :key="subItem.coid" :item="subItem" :author-uid="props.authorUid" sub />
        <bh-button
          v-if="subComment.canShowMore"
          class="ring-primary-500 dark:ring-dark-500 bg-primary-500 dark:bg-dark-500 text-sm text-white"
          @click="showAllSubComment"
        >
          {{ t('page.article.show-remain-comments', { count: props.item.children.length - 2 }) }}
        </bh-button>
      </div>
    </div>
  </div>
</template>
