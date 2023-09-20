<route lang="yaml">
name: admin-categories
meta:
  auth: CATEGORY:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
onMounted(() => {
  loadCategories()
})

const toast = useToast()
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.categories')

// 分类列表
const categories = ref<Page<BhCategory>>({
  total: 0,
  page: 1,
  size: 10,
  data: [],
})
function loadCategories() {
  api.admin.category.getList().then((resp) => {
    if (resp.success) {
      categories.value = resp.data
    }
    else {
      toast.add({
        type: resp.success ? 'success' : 'danger',
        message: resp.msg,
        duration: 3000,
      })
    }
  })
}

// 删除分类
const showDeleteModal = ref(false)
const deleteCategory = ref<BhCategory>()
function onDelete(category: BhCategory) {
  deleteCategory.value = category
  showDeleteModal.value = true
}
function onComfirmDelete() {
  if (!deleteCategory.value) {
    return
  }
  api.admin.category.delete(deleteCategory.value.cid).then((resp) => {
    if (resp.success) {
      loadCategories()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}

// 编辑分类
const showEditModal = ref(false)
const editCategory = ref<BhCategory>()
function onEdit(category: BhCategory) {
  editCategory.value = Object.assign({}, category)
  showEditModal.value = true
}
function onComfirmEdit() {
  if (!editCategory.value) {
    return
  }
  api.admin.category.update(editCategory.value).then((resp) => {
    if (resp.success) {
      loadCategories()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}

// 添加分类
const showAddModal = ref(false)
const addCategory = ref<BhCategoryAdd>({
  name: '',
})
function onAdd() {
  addCategory.value.name = ''
  showAddModal.value = true
}
function onComfirmAdd() {
  if (!addCategory.value.name) {
    return
  }
  api.admin.category.add(addCategory.value).then((resp) => {
    if (resp.success) {
      loadCategories()
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
    <div>
      <bh-button class="bg-success-600 dark:!ring-offset-slate-700 ring-success-600 px-2 text-white whitespace-nowrap" @click="onAdd()">
        {{ t('page.admin-category.add') }}
      </bh-button>
    </div>
    <bh-table :data="categories.data">
      <template #header>
        <th>{{ t('page.admin-category.name') }}</th>
        <th>{{ t('page.admin-category.operation') }}</th>
      </template>
      <template #default="{ rowData }">
        <td>
          <a class="link" :href="`/categories/${rowData.name}`" target="_blank">
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
            {{ t('page.admin-category.edit') }}
          </bh-button>
          <bh-button
            :disabled="rowData.cid === 1"
            class="px-2 py-0.5 bg-danger-500 ring-danger-500
          ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onDelete(rowData)"
          >
            {{ t('page.admin-category.delete') }}
          </bh-button>
        </td>
      </template>
      <template #footer>
        <bh-paginator
          v-model="categories.page"
          :total="categories.total"
          :size="categories.size"
          hide-on-single-page
          @change="loadCategories()"
        />
      </template>
    </bh-table>
    <bh-modal
      v-model="showDeleteModal"
      :title="t('page.admin-category.delete-title')"
      :content="t('page.admin-category.confirm-delete', { name: deleteCategory?.name })"
      danger
      @confirm="onComfirmDelete()"
    />
    <bh-modal
      v-model="showEditModal"
      :title="t('page.admin-category.edit-title')"
      @confirm="onComfirmEdit()"
    >
      <bh-input v-model="editCategory!.name" :placeholder="t('page.admin-category.name')" />
    </bh-modal>
    <bh-modal
      v-model="showAddModal"
      :title="t('page.admin-category.add-title')"
      @confirm="onComfirmAdd()"
    >
      <bh-input v-model="addCategory!.name" :placeholder="t('page.admin-category.name')" />
    </bh-modal>
  </div>
</template>
