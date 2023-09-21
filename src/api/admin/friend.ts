import { request } from '@/utils'

export default {
  getByFid(fid: number) {
    return request.get<BhFriend>(`/admin/friends/${fid}`)
  },
  getList() {
    return request.get<BhFriend[]>('/admin/friends')
  },
  add(data: BhFriendAdd) {
    return request.post<BhFriend>('/admin/friends', {
      data,
    })
  },
  update(data: BhFriend) {
    return request.put<BhFriend>('/admin/friends', {
      data,
    })
  },
  delete(fid: number) {
    return request.delete(`/admin/friends/${fid}`)
  },
}
