import { request } from '@/utils'

export default {
  getByAid(aid: number | string) {
    return request.get<BhArticle>(`/admin/articles/${aid}`)
  },

  getList(page = 1, condition: BhArticleCondition = {}) {
    return request.get<Page<BhArticlePreview>>('/admin/articles', {
      params: { page, ...condition },
    })
  },

  add(article: BhArticleAdd) {
    return request.post<void>('/admin/articles', {
      data: article,
    })
  },

  addAttachment(attachment: File) {
    // FormData
    const formData = new FormData()
    formData.append('file', attachment)

    return request.post<string>('/admin/articles/attachments', {
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  update(article: BhArticleAdd) {
    return request.put<void>('/admin/articles', {
      data: article,
    })
  },

  delete(aid: number | string) {
    return request.delete<void>(`/admin/articles/${aid}`)
  },
}
