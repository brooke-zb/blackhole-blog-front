import { request } from '@/utils'

export default {
  getList(aid: number | string, page: number, size = 10) {
    return request.get<Page<BhComment>>(`/articles/${aid}/comments`, {
      params: {
        page,
        size,
      },
    })
  },
  add(data: BhCommentAdd) {
    return request.post<void>('/comments', {
      data,
    })
  },
}
