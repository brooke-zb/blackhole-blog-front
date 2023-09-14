import { request } from '@/utils'

export default {
  login(data: BhLoginBody) {
    return request.post<string>('/accounts/tokens', {
      data,
    })
  },
  logout() {
    return request.delete<string>('/accounts/tokens')
  },
  getInfo() {
    return request.get<BhUser>('/accounts')
  },
}
