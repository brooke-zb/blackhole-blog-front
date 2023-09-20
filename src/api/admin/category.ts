import { request } from '@/utils'

export default {
  getByCid(cid: number) {
    return request.get<BhCategory>(`/admin/categories/${cid}`)
  },
  getList(page = 1, size = 50) {
    return request.get<Page<BhCategory>>('/admin/categories', {
      params: {
        page,
        size,
      },
    })
  },
  add(data: BhCategoryAdd) {
    return request.post('/admin/categories', {
      data,
    })
  },
  update(data: BhCategory) {
    return request.put('/admin/categories', {
      data,
    })
  },
  delete(cid: number) {
    return request.delete(`/admin/categories/${cid}`)
  },
}
