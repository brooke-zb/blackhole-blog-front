import { request } from '@/utils'

export default {
  getList() {
    return request.get<CategoryHeat[]>('/categories')
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
