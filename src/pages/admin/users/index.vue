<route lang="yaml">
name: admin-users
meta:
  auth: USER:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
onMounted(() => {
  loadUsers()
  loadRoles()
})

const toast = useToast()
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.users')

// 用户列表
const users = ref<Page<BhUser>>({
  total: 0,
  page: 1,
  size: 10,
  data: [],
})
function loadUsers() {
  api.admin.user.getList(users.value.page).then((resp) => {
    if (resp.success) {
      users.value = resp.data
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

// 角色列表
const roles = ref<BhRole[]>([])
function loadRoles() {
  api.admin.role.getList(1, 50).then((resp) => {
    if (resp.success) {
      roles.value = resp.data.data
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

// 删除用户
const showDeleteModal = ref(false)
const deleteUser = ref<BhUser>()
function onDelete(category: BhUser) {
  deleteUser.value = category
  showDeleteModal.value = true
}
function onComfirmDelete() {
  if (!deleteUser.value) {
    return
  }
  api.admin.user.delete(deleteUser.value.uid).then((resp) => {
    if (resp.success) {
      loadUsers()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}

// 编辑用户
const showEditModal = ref(false)
const editUser = reactive({
  uid: 0,
  name: '',
  password: '',
  mail: '',
  link: '',
  rid: 1,
  enabled: true,
})
function onEdit(category: BhUser) {
  editUser.uid = category.uid
  editUser.rid = category.role.rid
  editUser.enabled = category.enabled
  editUser.link = category.link || ''
  editUser.mail = category.mail
  editUser.name = category.name
  editUser.password = ''
  showEditModal.value = true
}
function onComfirmEdit() {
  const updateUser = {
    uid: editUser.uid,
    rid: editUser.rid,
    enabled: editUser.enabled,
    password: editUser.password || undefined,
    link: editUser.link || undefined,
    mail: editUser.mail,
    name: editUser.name,
  }
  api.admin.user.update(updateUser).then((resp) => {
    if (resp.success) {
      loadUsers()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}

// 添加用户
const showAddModal = ref(false)
const addUser = ref({
  name: '',
  password: '',
  mail: '',
  link: '',
  rid: 1,
  enabled: true,
})
function onAdd() {
  addUser.value = {
    name: '',
    password: '',
    mail: '',
    link: '',
    rid: 1,
    enabled: true,
  }
  showAddModal.value = true
}
function onComfirmAdd() {
  const addUserVal = {
    rid: addUser.value.rid,
    enabled: addUser.value.enabled,
    password: addUser.value.password,
    link: addUser.value.link || undefined,
    mail: addUser.value.mail,
    name: addUser.value.name,
  }
  api.admin.user.add(addUserVal).then((resp) => {
    if (resp.success) {
      loadUsers()
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
        {{ t('page.admin-user.add') }}
      </bh-button>
    </div>
    <bh-table :data="users.data">
      <template #header>
        <th>{{ t('page.admin-user.name') }}</th>
        <th>{{ t('page.admin-user.role') }}</th>
        <th>{{ t('page.admin-user.email') }}</th>
        <th>{{ t('page.admin-user.status') }}</th>
        <th class="sticky right-0">
          {{ t('page.admin-user.operation') }}
        </th>
      </template>
      <template #default="{ rowData }">
        <td>
          {{ rowData.name }}
        </td>
        <td>
          {{ rowData.role.name }}
        </td>
        <td>
          {{ rowData.mail }}
        </td>
        <td>
          <div v-if="rowData.enabled" class="inline-block border rounded px-1 text-sm text-success-700 dark:text-success-300 bg-success-200/50 dark:bg-success-800/50 border-success-400 dark:border-success-600">
            {{ t('page.admin-user.enabled') }}
          </div>
          <div v-else class="inline-block border rounded px-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-800/50 border-gray-400 dark:border-gray-600">
            {{ t('page.admin-user.disabled') }}
          </div>
        </td>
        <td class="sticky right-0">
          <bh-button
            class="mr-2 px-2 py-0.5 bg-info-600 ring-info-600
          ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onEdit(rowData)"
          >
            {{ t('page.admin-user.edit') }}
          </bh-button>
          <bh-button
            class="px-2 py-0.5 bg-danger-500 ring-danger-500
          ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onDelete(rowData)"
          >
            {{ t('page.admin-user.delete') }}
          </bh-button>
        </td>
      </template>
      <template #footer>
        <bh-paginator
          v-model="users.page"
          :total="users.total"
          :size="users.size"
          hide-on-single-page
          @change="loadUsers()"
        />
      </template>
    </bh-table>
    <bh-modal
      v-model="showDeleteModal"
      :title="t('page.admin-user.delete-title')"
      :content="t('page.admin-user.confirm-delete', { name: deleteUser?.name })"
      danger
      @confirm="onComfirmDelete()"
    />
    <bh-modal
      v-model="showEditModal"
      :title="t('page.admin-user.edit-title')"
      @confirm="onComfirmEdit()"
    >
      <bh-input v-model="editUser.name" :placeholder="t('page.admin-user.name')" />
      <bh-input v-model="editUser.password" class="mt-2" type="password" :placeholder="t('page.admin-user.reset-password')" />
      <div class="flex items-center gap-2 mt-2">
        <select v-model="editUser.rid">
          <option v-for="role in roles" :key="role.rid" :value="role.rid">
            {{ role.name }}
          </option>
        </select>
        <bh-input v-model="editUser.mail" :placeholder="t('page.admin-user.email')" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <input id="editUserEnabled" v-model="editUser.enabled" class="checkbox shrink-0" type="checkbox">
        <label for="editUserEnabled" class="shrink-0">{{ t('page.admin-user.enabled') }}</label>
        <bh-input v-model="editUser.link" :placeholder="t('page.admin-user.link')" />
      </div>
    </bh-modal>
    <bh-modal
      v-model="showAddModal"
      :title="t('page.admin-user.add-title')"
      @confirm="onComfirmAdd()"
    >
      <bh-input v-model="addUser.name" :placeholder="t('page.admin-user.name')" />
      <bh-input v-model="addUser.password" class="mt-2" type="password" :placeholder="t('page.admin-user.password')" />
      <div class="flex items-center gap-2 mt-2">
        <select v-model="addUser.rid">
          <option v-for="role in roles" :key="role.rid" :value="role.rid">
            {{ role.name }}
          </option>
        </select>
        <bh-input v-model="addUser.mail" :placeholder="t('page.admin-user.email')" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <input id="editUserEnabled" v-model="addUser.enabled" class="checkbox shrink-0" type="checkbox">
        <label for="editUserEnabled" class="shrink-0">{{ t('page.admin-user.enabled') }}</label>
        <bh-input v-model="addUser.link" :placeholder="t('page.admin-user.link')" />
      </div>
    </bh-modal>
  </div>
</template>
