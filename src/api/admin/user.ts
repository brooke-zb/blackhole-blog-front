import { request } from '@/utils'

export default {
  getByUid(uid: number) {
    return request.get<BhUser>(`/admin/users/${uid}`)
  },
  getList(page = 1, size = 10) {
    return request.get<Page<BhUser>>('/admin/users', {
      params: {
        page,
        size,
      },
    })
  },
  add(data: BhUserAdd) {
    return request.post<void>('/admin/users', {
      data,
    })
  },
  update(data: BhUserUpdate) {
    return request.put<void>('/admin/users', {
      data,
    })
  },
  delete(uid: number) {
    return request.delete<void>(`/admin/users/${uid}`)
  },
}
