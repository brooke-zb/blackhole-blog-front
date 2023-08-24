import { request } from '@/utils'

export default {
  getList() {
    return request.get<BhCategoryHeat[]>('/categories')
    // .then(async (res) => {
    //   await new Promise<void>((resolve) => {
    //     setTimeout(() => {
    //       resolve()
    //     }, 1000)
    //   })
    //   return res
    // })
  },
}
