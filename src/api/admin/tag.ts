import { request } from '@/utils'

export default {
  getByTid(tid: number) {
    return request.get<BhTag>(`/admin/tags/${tid}`)
  },
  getList(page = 1, size = 10) {
    return request.get<Page<BhTag>>('/admin/tags', {
      params: {
        page,
        size,
      },
    })
  },
  add(data: BhTagAdd) {
    return request.post<BhTag>('/admin/tags', {
      data,
    })
  },
  update(data: BhTag) {
    return request.put<BhTag>('/admin/tags', {
      data,
    })
  },
  deleteBatch(...tids: number[]) {
    return request.delete<BhTag[]>(`/admin/tags/${tids.join(',')}`)
  },
}
