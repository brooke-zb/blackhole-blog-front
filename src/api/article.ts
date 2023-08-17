import { request } from '@/utils'

export default {
  getByAid(aid: number) {
    return request.get<Article>(`/articles/${aid}`)
  },

  getList(page = 1) {
    return request.get<Page<ArticlePreview>>('/articles', {
      params: { page },
    })
  },

  getListByCategory(categoryName: string, page = 1) {
    return request.get<Page<ArticlePreview>>(`/categories/${categoryName}/articles`, {
      params: { page },
    })
  },

  getListByTag(tagName: string, page = 1) {
    return request.get<Page<ArticlePreview>>(`/tags/${tagName}/articles`, {
      params: { page },
    })
  },
}
