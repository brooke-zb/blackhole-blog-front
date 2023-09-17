import { request } from '@/utils'

export default {
  getList(page = 1, size = 50) {
    return request.get<Page<BhCategory>>('/admin/categories', {
      params: {
        page,
        size,
      },
    })
  },
}
