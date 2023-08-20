type Resp<T> = {
  success: true,
  data: T,
  msg: string,
} | {
  success: false,
  data: null,
  msg: string,
}

type Page<T> = {
  total: number
  page: number
  size: number
  data: T[]
}

type Article = {
  aid: number
  user: ArticleUser
  category: ArticleCategory
  tags: ArticleTag[]
  title: string
  content: string
  commentable: boolean
  createdAt: string
  updatedAt: string
  status: ArticleStatus
  readCount: number
}

type ArticlePreview = {
  aid: number
  user: ArticleUser
  category: ArticleCategory
  tags: ArticleTag[]
  title: string
  createdAt: string
  status: ArticleStatus
  readCount: number
}

type ArticleStatus = 'PUBLISHED' | 'DRAFT' | 'HIDDEN'

type ArticleUser = {
  uid: number
  name: string
}

type ArticleCategory = {
  cid: number
  name: string
}

type ArticleTag = {
  name: string
}

type Tag = {
  tid: number
  name: string
}

type ArticleCountInfo = {
  articleCount: number
}

type TagHeat = Tag & ArticleCountInfo

type Category = {
  cid: number
  name: string
}

type CategoryHeat = Category & ArticleCountInfo

type Friend = {
  fid: number
  name: string
  link: string
  avatar: string
  description: string | null
}