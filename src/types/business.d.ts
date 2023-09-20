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

type BhArticle = {
  aid: number
  user: BhArticleUser
  category: BhArticleCategory
  tags: BhArticleTag[]
  title: string
  content: string
  commentable: boolean
  createdAt: string
  updatedAt: string | null
  status: BhArticleStatus
  readCount: number
}

type BhArticlePreview = {
  aid: number
  user: BhArticleUser
  category: BhArticleCategory
  tags: BhArticleTag[]
  title: string
  createdAt: string
  status: BhArticleStatus
  readCount: number
}

type BhArticleStatus = 'PUBLISHED' | 'DRAFT' | 'HIDDEN'

type BhArticleUser = {
  uid: number
  name: string
}

type BhArticleCategory = {
  cid: number
  name: string
}

type BhArticleTag = {
  name: string
}

type BhTag = {
  tid: number
  name: string
}

type BhArticleCountInfo = {
  articleCount: number
}

type BhTagHeat = BhTag & BhArticleCountInfo

type BhCategory = {
  cid: number
  name: string
}

type BhCategoryHeat = BhCategory & BhArticleCountInfo

type BhFriend = {
  fid: number
  name: string
  link: string
  avatar: string
  description: string | null
}

type BhCommentStatus = 'PUBLISHED' | 'REVIEW' | 'HIDDEN'

type BhComment = {
  coid: number
  nickname: string
  email?: string
  uid?: number
  avatar?: string
  site?: string
  ip: string
  content: string
  createdAt: string
  children: BhComment[]
  parentId?: number
  replyId?: number
  replyTo?: string
  status: BhCommentStatus
}

type BhCommentAdd = {
  aid: number
  nickname: string
  email?: string
  site?: string
  content: string
  replyId?: number
}

type BhCommentUpdate = {
  coid: number
  nickname: string
  content: string
  site?: string
  status: BhCommentStatus
}

type BhLoginBody = {
  username: string
  password: string
  rememberMe: boolean
}

type BhUser = {
  uid: number
  name: string
  mail: string
  link?: string
  role: BhRole
  enabled: boolean
}

type BhRole = {
  rid: number
  name: string
  permissions: BhPermission[]
}

type BhPermission = {
  name: string
}

type BhArticleCondition = {
  title?: string,
  username?: string,
  status?: BhArticleStatus,
  category?: string,
  tag?: string,
  sortBy?: 'created_at' | 'read_count',
}

type BhCommentCondition = {
  aid?: number,
  nickname?: string,
  status?: BhCommentStatus,
  ip?: string,
}

type BhArticleAdd = {
  cid: number
  tags: Omit<BhTag, 'tid'>[]
  title: string
  content: string
  commentable: boolean
  status: BhArticleStatus
}

type BhArticleUpdate = {
  aid: number
  cid: number
  tags: Omit<BhTag, 'tid'>[]
  title: string
  content: string
  commentable: boolean
  status: BhArticleStatus
  createdAt: string
  updatedAt?: string
}

type BhCategoryAdd = Omit<BhCategory, 'cid'>

type BhTagAdd = Omit<BhTag, 'tid'>