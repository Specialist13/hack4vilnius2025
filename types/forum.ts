export type PostStatus = "active" | "planning" | "completed"

export interface ForumPost {
  id: string
  title: string
  content: string
  address: string
  coordinates?: {
    lat: number
    lng: number
  }
  authorId: string
  authorName: string
  authorAvatar?: string
  status: PostStatus
  language: "en" | "lt"
  createdAt: string
  updatedAt: string
  replyCount: number
  supportCount: number
  viewCount: number
  replies?: Reply[]
}

export interface Reply {
  id: string
  postId: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  createdAt: string
  updatedAt: string
  isSupporter: boolean
}

export interface CreatePostData {
  title: string
  content: string
  address: string
  coordinates?: {
    lat: number
    lng: number
  }
  language: "en" | "lt"
}

export interface CreateReplyData {
  content: string
  isSupporter?: boolean
}

export interface ForumSearchParams {
  query?: string
  status?: PostStatus
  page?: number
  limit?: number
}
