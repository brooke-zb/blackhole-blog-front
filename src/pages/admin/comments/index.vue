<route lang="yaml">
name: admin-comments
meta:
  auth: COMMENT:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
onMounted(() => {
  loadComments()
})

const { t } = useI18n()
const toast = useToast()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.comments')

// 查询条件
const conditions = reactive({
  ip: '',
  nickname: '',
  status: '',
})
function resetConditions() {
  conditions.ip = ''
  conditions.nickname = ''
  conditions.status = ''
  loadComments()
}

// 评论列表
const comments = ref<Page<BhComment>>({
  total: 0,
  page: 1,
  size: 10,
  data: [],
})
function loadComments() {
  // remove empty conditions
  const keys = Object.keys(conditions) as (keyof typeof conditions)[]
  const queryCond = keys.reduce((prev, key) => {
    if (conditions[key]) {
      prev[key] = conditions[key]
    }
    return prev
  }, {} as Record<string, string>)

  api.admin.comment.getList(comments.value.page, queryCond).then((resp) => {
    if (resp.success) {
      comments.value = resp.data
    }
    else {
      toast.add({
        type: 'danger',
        message: resp.msg,
        duration: 3000,
      })
    }
  })
}

// 评论状态
const statusI18nKey = {
  PUBLISHED: 'status.comment.published',
  REVIEW: 'status.comment.review',
  HIDDEN: 'status.comment.hidden',
}
const statusClass = {
  PUBLISHED: 'text-success-700 dark:text-success-300 bg-success-200/50 dark:bg-success-800/50 border-success-400 dark:border-success-600',
  REVIEW: 'text-warning-700 dark:text-warning-300 bg-warning-200/50 dark:bg-warning-800/50 border-warning-400 dark:border-warning-600',
  HIDDEN: 'text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-800/50 border-gray-400 dark:border-gray-600',
}

// 删除评论
const showDeleteModal = ref(false)
const deleteComment = ref<BhComment>()
function onDelete(comment: BhComment) {
  deleteComment.value = comment
  showDeleteModal.value = true
}
function onComfirmDelete() {
  if (!deleteComment.value) {
    return
  }
  api.admin.comment.delete(deleteComment.value.coid).then((resp) => {
    if (resp.success) {
      loadComments()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}

// 编辑评论
const showEditModal = ref(false)
const editComment = ref<BhComment>()
const editCommentSite = ref('')
function onEdit(comment: BhComment) {
  const val = comment
  val.content = 'aaa'
  editComment.value = Object.assign({}, comment)
  editCommentSite.value = comment.site || ''
  showEditModal.value = true
}
function onComfirmEdit() {
  if (!editComment.value) {
    return
  }
  const updateComment = {
    coid: editComment.value.coid,
    nickname: editComment.value.nickname,
    content: editComment.value.content,
    status: editComment.value.status,
    site: editCommentSite.value || undefined,
  }
  api.admin.comment.update(updateComment).then((resp) => {
    if (resp.success) {
      loadComments()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2">
      <bh-input v-model="conditions.nickname" :placeholder="t('page.admin-comment.nickname')" class="!w-auto" />
      <bh-input v-model="conditions.ip" :placeholder="t('page.admin-comment.ip')" class="!w-36" />
      <select v-model="conditions.status">
        <option value="">
          {{ t('status.all') }}
        </option>
        <option value="PUBLISHED">
          {{ t('status.comment.published') }}
        </option>
        <option value="REVIEW">
          {{ t('status.comment.review') }}
        </option>
        <option value="HIDDEN">
          {{ t('status.comment.hidden') }}
        </option>
      </select>
      <bh-button class="bg-primary-500 dark:bg-dark-600 dark:!ring-offset-slate-700 ring-primary-500 dark:ring-dark-600 px-2 text-white whitespace-nowrap" @click="loadComments()">
        {{ t('page.admin-comment.search') }}
      </bh-button>
      <bh-button class="bg-warning-600 dark:!ring-offset-slate-700 ring-warning-600 px-2 text-white whitespace-nowrap" @click="resetConditions()">
        {{ t('page.admin-comment.reset') }}
      </bh-button>
    </div>
    <bh-table :data="comments.data">
      <template #header>
        <th>
          {{ t('page.admin-comment.nickname') }}
        </th>
        <th>
          {{ t('page.admin-comment.content') }}
        </th>
        <th>
          {{ t('page.admin-comment.created') }}
        </th>
        <th>
          {{ t('page.admin-comment.ip') }}
        </th>
        <th>
          {{ t('page.admin-comment.status') }}
        </th>
        <th class="sticky right-0">
          {{ t('page.admin-comment.operation') }}
        </th>
      </template>
      <template #default="{ rowData }">
        <td>
          {{ rowData.nickname }}
        </td>
        <td class="max-w-xs">
          <p class="whitespace-normal">
            {{ rowData.content }}
          </p>
        </td>
        <td>
          {{ dayjs(rowData.createdAt).format(t('page.admin-comment.date-format')) }}
        </td>
        <td>
          <span
            :title="t('page.admin-comment.click-to-search-ip')"
            class="cursor-pointer"
            @click="conditions.ip = rowData.ip; loadComments()"
          >
            {{ rowData.ip }}
          </span>
        </td>
        <td>
          <div class="inline-block border rounded px-1 text-sm" :class="statusClass[rowData.status]">
            {{ t(statusI18nKey[rowData.status]) }}
          </div>
        </td>
        <td class="sticky right-0">
          <bh-button
            class="mr-2 px-2 py-0.5 bg-info-600 ring-info-600
            ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onEdit(rowData)"
          >
            {{ t('page.admin-comment.edit') }}
          </bh-button>
          <bh-button
            class="px-2 py-0.5 bg-danger-500 ring-danger-500
            ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onDelete(rowData)"
          >
            {{ t('page.admin-comment.delete') }}
          </bh-button>
        </td>
      </template>
      <template #footer>
        <bh-paginator
          v-model="comments.page"
          :total="comments.total"
          :size="comments.size"
          hide-on-single-page
          @change="loadComments()"
        />
      </template>
    </bh-table>
    <bh-modal
      v-model="showDeleteModal"
      :title="t('page.admin-comment.delete-title')"
      :content="t('page.admin-comment.confirm-delete', { content: deleteComment?.content })"
      danger
      @confirm="onComfirmDelete()"
    />
    <bh-modal
      v-model="showEditModal"
      :title="t('page.admin-comment.edit-title')"
      @confirm="onComfirmEdit()"
    >
      <div class="flex gap-2">
        <bh-input v-model="editComment!.nickname" :placeholder="t('page.admin-comment.nickname')" />
        <select v-model="editComment!.status">
          <option value="PUBLISHED">
            {{ t('status.comment.published') }}
          </option>
          <option value="REVIEW">
            {{ t('status.comment.review') }}
          </option>
          <option value="HIDDEN">
            {{ t('status.comment.hidden') }}
          </option>
        </select>
      </div>
      <bh-input v-model="editCommentSite" :placeholder="t('page.admin-comment.site')" class="mt-2" />
      <bh-textarea v-model="editComment!.content" class="mt-2" :placeholder="t('page.admin-comment.content')" />
    </bh-modal>
  </div>
</template>
