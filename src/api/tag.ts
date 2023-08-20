import { request } from '@/utils'

export default {
  getList() {
    return request.get<TagHeat[]>('/tags')
  },
}
