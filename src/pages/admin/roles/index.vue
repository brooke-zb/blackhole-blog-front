<route lang="yaml">
name: admin-roles
meta:
  auth: ROLE:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
onMounted(() => {
  loadRoles()
})

const toast = useToast()
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.roles')

// 权限列表
const permissionI18nKey = {
  'ARTICLE:FULLACCESS': 'page.admin-role.perm-article-full',
  'COMMENT:FULLACCESS': 'page.admin-role.perm-comment-full',
  'CATEGORY:FULLACCESS': 'page.admin-role.perm-category-full',
  'TAG:FULLACCESS': 'page.admin-role.perm-tag-full',
  'USER:FULLACCESS': 'page.admin-role.perm-user-full',
  'ROLE:FULLACCESS': 'page.admin-role.perm-role-full',
  'FRIEND:FULLACCESS': 'page.admin-role.perm-friend-full',
}
const PERMISSIONS: (keyof typeof permissionI18nKey)[] = ['ARTICLE:FULLACCESS', 'COMMENT:FULLACCESS', 'CATEGORY:FULLACCESS', 'TAG:FULLACCESS', 'USER:FULLACCESS', 'ROLE:FULLACCESS', 'FRIEND:FULLACCESS']

// 角色列表
const roles = ref<Page<BhRole>>({
  total: 0,
  page: 1,
  size: 10,
  data: [],
})
function loadRoles() {
  api.admin.role.getList(roles.value.page).then((resp) => {
    if (resp.success) {
      roles.value = resp.data
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

// 删除角色
const showDeleteModal = ref(false)
const deleteRole = ref<BhRole>()
function onDelete(role: BhRole) {
  deleteRole.value = role
  showDeleteModal.value = true
}
function onComfirmDelete() {
  if (!deleteRole.value) {
    return
  }
  api.admin.role.delete(deleteRole.value.rid).then((resp) => {
    if (resp.success) {
      loadRoles()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}

// 编辑角色
const showEditModal = ref(false)
const editRole = reactive({
  rid: 0,
  name: '',
})
const editRolePermissions = reactive<Record<string, boolean>>({})
function onEdit(role: BhRole) {
  editRole.rid = role.rid
  editRole.name = role.name
  PERMISSIONS.forEach((key) => {
    editRolePermissions[key] = false
  })
  for (const permission of role.permissions) {
    editRolePermissions[permission.name] = true
  }
  showEditModal.value = true
}
function onComfirmEdit() {
  const updateRole = {
    rid: editRole.rid,
    name: editRole.name,
    permissions: PERMISSIONS.filter(key => editRolePermissions[key]).map(key => ({ name: key })),
  }
  api.admin.role.update(updateRole).then((resp) => {
    if (resp.success) {
      loadRoles()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}

// 添加角色
const showAddModal = ref(false)
const addRole = reactive({
  name: '',
})
const addRolePermissions = reactive<Record<string, boolean>>({})
function onAdd() {
  addRole.name = ''
  PERMISSIONS.forEach((key) => {
    addRolePermissions[key] = false
  })
  showAddModal.value = true
}
function onComfirmAdd() {
  const addRoleVal = {
    name: addRole.name,
    permissions: PERMISSIONS.filter(key => addRolePermissions[key]).map(key => ({ name: key })),
  }
  api.admin.role.add(addRoleVal).then((resp) => {
    if (resp.success) {
      loadRoles()
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
        {{ t('page.admin-role.add') }}
      </bh-button>
    </div>
    <bh-table :data="roles.data">
      <template #header>
        <th>{{ t('page.admin-role.name') }}</th>
        <th class="sticky right-0">
          {{ t('page.admin-role.operation') }}
        </th>
      </template>
      <template #default="{ rowData }">
        <td>
          {{ rowData.name }}
        </td>
        <td class="sticky right-0">
          <bh-button
            :disabled="rowData.rid === 1"
            class="mr-2 px-2 py-0.5 bg-info-600 ring-info-600
          ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onEdit(rowData)"
          >
            {{ t('page.admin-role.edit') }}
          </bh-button>
          <bh-button
            :disabled="rowData.rid === 1"
            class="px-2 py-0.5 bg-danger-500 ring-danger-500
          ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onDelete(rowData)"
          >
            {{ t('page.admin-role.delete') }}
          </bh-button>
        </td>
      </template>
      <template #footer>
        <bh-paginator
          v-model="roles.page"
          :total="roles.total"
          :size="roles.size"
          hide-on-single-page
          @change="loadRoles()"
        />
      </template>
    </bh-table>
    <bh-modal
      v-model="showDeleteModal"
      :title="t('page.admin-role.delete-title')"
      :content="t('page.admin-role.confirm-delete', { name: deleteRole?.name })"
      danger
      @confirm="onComfirmDelete()"
    />
    <bh-modal
      v-model="showEditModal"
      :title="t('page.admin-role.edit-title')"
      @confirm="onComfirmEdit()"
    >
      <bh-input v-model="editRole.name" :placeholder="t('page.admin-role.name')" />
      <div class="flex flex-wrap gap-y-2 mt-2">
        <div v-for="perm in PERMISSIONS" :key="perm" class="flex items-center gap-1 w-1/2">
          <input :id="`edit${perm}`" v-model="editRolePermissions[perm]" type="checkbox" class="checkbox">
          <label :for="`edit${perm}`" class="ml-1">{{ t(permissionI18nKey[perm]) }}</label>
        </div>
      </div>
    </bh-modal>
    <bh-modal
      v-model="showAddModal"
      :title="t('page.admin-role.add-title')"
      @confirm="onComfirmAdd()"
    >
      <bh-input v-model="addRole.name" :placeholder="t('page.admin-role.name')" />
      <div class="flex flex-wrap gap-y-2 mt-2">
        <div v-for="perm in PERMISSIONS" :key="perm" class="flex items-center gap-1 w-1/2">
          <input :id="`edit${perm}`" v-model="addRolePermissions[perm]" type="checkbox" class="checkbox">
          <label :for="`edit${perm}`" class="ml-1">{{ t(permissionI18nKey[perm]) }}</label>
        </div>
      </div>
    </bh-modal>
  </div>
</template>
