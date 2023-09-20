import { request } from '@/utils'

export default {
  getByCoid(coid: number | string) {
    return request.get<BhComment>(`/admin/comments/${coid}`)
  },

  getList(page = 1, condition: BhCommentCondition = {}) {
    return request.get<Page<BhComment>>('/admin/comments', {
      params: { page, ...condition },
    })
  },

  update(comment: BhCommentUpdate) {
    return request.put<void>('/admin/comments', {
      data: comment,
    })
  },

  delete(coid: number | string) {
    return request.delete<void>(`/admin/comments/${coid}`)
  },
}
