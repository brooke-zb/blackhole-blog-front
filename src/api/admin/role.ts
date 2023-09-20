import { request } from '@/utils'

export default {
  getByUid(uid: number) {
    return request.get<BhRole>(`/admin/roles/${uid}`)
  },
  getList(page = 1, size = 10) {
    return request.get<Page<BhRole>>('/admin/roles', {
      params: {
        page,
        size,
      },
    })
  },
  add(data: BhRoleAdd) {
    return request.post<BhRole>('/admin/roles', {
      data,
    })
  },
  update(data: BhRole) {
    return request.put<BhRole>('/admin/roles', {
      data,
    })
  },
  delete(rid: number) {
    return request.delete<BhRole[]>(`/admin/roles/${rid}`)
  },
}
