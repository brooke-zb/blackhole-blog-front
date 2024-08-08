type Resp<T> = {
  success: true
  data: T
  msg: string
} | {
  success: false
  data: null
  msg: string
}

interface Page<T> {
  total: number
  page: number
  size: number
  data: T[]
}

interface BhArticle {
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

interface BhArticlePreview {
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

interface BhArticleUser {
  uid: number
  name: string
}

interface BhArticleCategory {
  cid: number
  name: string
}

interface BhArticleTag {
  name: string
}

interface BhTag {
  tid: number
  name: string
}

interface BhArticleCountInfo {
  articleCount: number
}

type BhTagHeat = BhTag & BhArticleCountInfo

interface BhCategory {
  cid: number
  name: string
}

type BhCategoryHeat = BhCategory & BhArticleCountInfo

interface BhFriend {
  fid: number
  name: string
  link: string
  avatar: string
  description?: string
}

type BhCommentStatus = 'PUBLISHED' | 'REVIEW' | 'HIDDEN'

interface BhComment {
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

interface BhCommentAdd {
  aid: number
  nickname: string
  email?: string
  site?: string
  content: string
  replyId?: number
}

interface BhCommentUpdate {
  coid: number
  nickname: string
  content: string
  site?: string
  status: BhCommentStatus
}

interface BhLoginBody {
  username: string
  password: string
  rememberMe: boolean
}

interface BhUser {
  uid: number
  name: string
  mail: string
  link?: string
  role: BhRole
  enabled: boolean
}

interface BhRole {
  rid: number
  name: string
  permissions: BhPermission[]
}

interface BhPermission {
  name: string
}

interface BhArticleCondition {
  title?: string
  username?: string
  status?: BhArticleStatus
  category?: string
  tag?: string
  sortBy?: 'created_at' | 'read_count'
}

interface BhCommentCondition {
  aid?: number
  nickname?: string
  status?: BhCommentStatus
  ip?: string
}

interface BhArticleAdd {
  cid: number
  tags: Omit<BhTag, 'tid'>[]
  title: string
  content: string
  commentable: boolean
  status: BhArticleStatus
}

interface BhArticleUpdate {
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

type BhUserAdd = Omit<BhUser, 'uid' | 'role'> & {
  password: string
  rid: number
}

type BhUserUpdate = Partial<BhUserAdd> & {
  uid: number
}

type BhRoleAdd = Omit<BhRole, 'rid'>

type BhFriendAdd = Omit<BhFriend, 'fid'>
