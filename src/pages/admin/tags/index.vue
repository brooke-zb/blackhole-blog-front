<route lang="yaml">
name: admin-tags
meta:
  auth: TAG:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
onMounted(() => {
  loadTags()
})

const toast = useToast()
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.tags')

// 标签列表
const tags = ref<Page<BhTag>>({
  total: 0,
  page: 1,
  size: 10,
  data: [],
})
function loadTags() {
  api.admin.tag.getList(tags.value.page).then((resp) => {
    if (resp.success) {
      tags.value = resp.data
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

// 删除标签
const showDeleteModal = ref(false)
const deleteTag = ref<BhTag>()
function onDelete(tag: BhTag) {
  deleteTag.value = tag
  showDeleteModal.value = true
}
function onComfirmDelete() {
  if (!deleteTag.value) {
    return
  }
  api.admin.tag.deleteBatch(deleteTag.value.tid).then((resp) => {
    if (resp.success) {
      loadTags()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}

// 编辑标签
const showEditModal = ref(false)
const editTag = ref<BhTag>()
function onEdit(tag: BhTag) {
  editTag.value = Object.assign({}, tag)
  showEditModal.value = true
}
function onComfirmEdit() {
  if (!editTag.value) {
    return
  }
  api.admin.tag.update(editTag.value).then((resp) => {
    if (resp.success) {
      loadTags()
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
    <bh-table :data="tags.data">
      <template #header>
        <th>{{ t('page.admin-tag.name') }}</th>
        <th class="sticky right-0">
          {{ t('page.admin-tag.operation') }}
        </th>
      </template>
      <template #default="{ rowData }">
        <td>
          <a class="link" :href="`/tags/${rowData.name}`" target="_blank">
            {{ rowData.name }}
            <i-regular-arrow-up-right-from-square class="inline w-3 h-3" />
          </a>
        </td>
        <td class="sticky right-0">
          <bh-button
            class="mr-2 px-2 py-0.5 bg-info-600 ring-info-600
          ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onEdit(rowData)"
          >
            {{ t('page.admin-tag.edit') }}
          </bh-button>
          <bh-button
            class="px-2 py-0.5 bg-danger-500 ring-danger-500
          ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onDelete(rowData)"
          >
            {{ t('page.admin-tag.delete') }}
          </bh-button>
        </td>
      </template>
      <template #footer>
        <bh-paginator
          v-model="tags.page"
          :total="tags.total"
          :size="tags.size"
          hide-on-single-page
          @change="loadTags()"
        />
      </template>
    </bh-table>
    <bh-modal
      v-model="showDeleteModal"
      :title="t('page.admin-tag.delete-title')"
      :content="t('page.admin-tag.confirm-delete', { name: deleteTag?.name })"
      danger
      @confirm="onComfirmDelete()"
    />
    <bh-modal
      v-model="showEditModal"
      :title="t('page.admin-tag.edit-title')"
      @confirm="onComfirmEdit()"
    >
      <bh-input v-model="editTag!.name" :placeholder="t('page.admin-tag.name')" />
    </bh-modal>
  </div>
</template>
