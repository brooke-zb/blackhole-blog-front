import { request } from '@/utils'

export default {
  login(data: BhLoginBody) {
    return request.post<void>('/accounts/tokens', {
      data,
    })
  },
  logout() {
    return request.delete<void>('/accounts/tokens')
  },
  getInfo() {
    return request.get<BhUser>('/accounts')
  },
}