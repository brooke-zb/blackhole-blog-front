import { request } from '@/utils'

export default {
  getByAid(aid: number | string) {
    return request.get<BhArticle>(`/articles/${aid}`)
  },

  getList(page = 1) {
    return request.get<Page<BhArticlePreview>>('/articles', {
      params: { page },
    })
  },

  getListByCategory(categoryName: string, page = 1) {
    return request.get<Page<BhArticlePreview>>(`/categories/${categoryName}/articles`, {
      params: { page },
    })
  },

  getListByTag(tagName: string, page = 1) {
    return request.get<Page<BhArticlePreview>>(`/tags/${tagName}/articles`, {
      params: { page },
    })
  },
}
