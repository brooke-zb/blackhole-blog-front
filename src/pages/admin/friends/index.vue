<route lang="yaml">
name: admin-friends
meta:
  auth: FRIEND:FULLACCESS
  layout: admin
</route>

<script setup lang="ts">
onMounted(() => {
  loadFriends()
})

const toast = useToast()
const { t } = useI18n()
const titleStore = useTitleStore()
titleStore.title = t('routes.admin.friends')

// 友链列表
const friends = ref<BhFriend[]>([])
function loadFriends() {
  api.admin.friend.getList().then((resp) => {
    if (resp.success) {
      friends.value = resp.data
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

// 删除友链
const showDeleteModal = ref(false)
const deleteFriend = ref<BhFriend>()
function onDelete(role: BhFriend) {
  deleteFriend.value = role
  showDeleteModal.value = true
}
function onComfirmDelete() {
  if (!deleteFriend.value) {
    return
  }
  api.admin.friend.delete(deleteFriend.value.fid).then((resp) => {
    if (resp.success) {
      loadFriends()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}

// 编辑友链
const showEditModal = ref(false)
const editFriend = reactive({
  fid: 0,
  name: '',
  avatar: '',
  link: '',
  description: '',
})
function onEdit(friend: BhFriend) {
  editFriend.fid = friend.fid
  editFriend.name = friend.name
  editFriend.avatar = friend.avatar
  editFriend.link = friend.link
  editFriend.description = friend.description || ''
  showEditModal.value = true
}
function onComfirmEdit() {
  const updateFriend = {
    fid: editFriend.fid,
    name: editFriend.name,
    avatar: editFriend.avatar,
    link: editFriend.link,
    description: editFriend.description || undefined,
  }
  api.admin.friend.update(updateFriend).then((resp) => {
    if (resp.success) {
      loadFriends()
    }
    toast.add({
      type: resp.success ? 'success' : 'danger',
      message: resp.msg,
      duration: 3000,
    })
  })
}

// 添加友链
const showAddModal = ref(false)
const addFriend = reactive({
  name: '',
  avatar: '',
  link: '',
  description: '',
})
function onAdd() {
  addFriend.name = ''
  addFriend.avatar = ''
  addFriend.link = ''
  addFriend.description = ''
  showAddModal.value = true
}
function onComfirmAdd() {
  const addFriendVal = {
    name: addFriend.name,
    avatar: addFriend.avatar,
    link: addFriend.link,
    description: addFriend.description || undefined,
  }
  api.admin.friend.add(addFriendVal).then((resp) => {
    if (resp.success) {
      loadFriends()
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
        {{ t('page.admin-friend.add') }}
      </bh-button>
    </div>
    <bh-table :data="friends">
      <template #header>
        <th>{{ t('page.admin-friend.avatar') }}</th>
        <th>{{ t('page.admin-friend.name') }}</th>
        <th>{{ t('page.admin-friend.description') }}</th>
        <th class="sticky right-0">
          {{ t('page.admin-friend.operation') }}
        </th>
      </template>
      <template #default="{ rowData }">
        <td>
          <img :src="rowData.avatar" class="w-16 h-16 object-contain">
        </td>
        <td>
          <a :href="rowData.link" class="link" target="_blank">
            {{ rowData.name }}
            <i-regular-arrow-up-right-from-square class="inline w-3 h-3" />
          </a>
        </td>
        <td>{{ rowData.description }}</td>
        <td class="sticky right-0">
          <bh-button
            class="mr-2 px-2 py-0.5 bg-info-600 ring-info-600
          ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onEdit(rowData)"
          >
            {{ t('page.admin-friend.edit') }}
          </bh-button>
          <bh-button
            class="px-2 py-0.5 bg-danger-500 ring-danger-500
          ring-offset-primary-100 dark:!ring-offset-slate-600 text-white text-sm"
            @click="onDelete(rowData)"
          >
            {{ t('page.admin-friend.delete') }}
          </bh-button>
        </td>
      </template>
    </bh-table>
    <bh-modal
      v-model="showDeleteModal"
      :title="t('page.admin-friend.delete-title')"
      :content="t('page.admin-friend.confirm-delete', { name: deleteFriend?.name })"
      danger
      @confirm="onComfirmDelete()"
    />
    <bh-modal
      v-model="showEditModal"
      :title="t('page.admin-friend.edit-title')"
      @confirm="onComfirmEdit()"
    >
      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">{{ t('page.admin-friend.name') }}</label>
        <bh-input v-model="editFriend.name" :placeholder="t('page.admin-friend.name')" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <label class="whitespace-nowrap">{{ t('page.admin-friend.link') }}</label>
        <bh-input v-model="editFriend.link" :placeholder="t('page.admin-friend.link')" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <label class="whitespace-nowrap">{{ t('page.admin-friend.avatar') }}</label>
        <bh-input v-model="editFriend.avatar" :placeholder="t('page.admin-friend.avatar')" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <label class="whitespace-nowrap">{{ t('page.admin-friend.description') }}</label>
        <bh-input v-model="editFriend.description" :placeholder="t('page.admin-friend.description-placeholder')" />
      </div>
    </bh-modal>
    <bh-modal
      v-model="showAddModal"
      :title="t('page.admin-friend.add-title')"
      @confirm="onComfirmAdd()"
    >
      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">{{ t('page.admin-friend.name') }}</label>
        <bh-input v-model="addFriend.name" :placeholder="t('page.admin-friend.name')" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <label class="whitespace-nowrap">{{ t('page.admin-friend.link') }}</label>
        <bh-input v-model="addFriend.link" :placeholder="t('page.admin-friend.link')" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <label class="whitespace-nowrap">{{ t('page.admin-friend.avatar') }}</label>
        <bh-input v-model="addFriend.avatar" :placeholder="t('page.admin-friend.avatar')" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <label class="whitespace-nowrap">{{ t('page.admin-friend.description') }}</label>
        <bh-input v-model="addFriend.description" :placeholder="t('page.admin-friend.description-placeholder')" />
      </div>
    </bh-modal>
  </div>
</template>
