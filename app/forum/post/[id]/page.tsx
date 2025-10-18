"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Calendar, ThumbsUp, Loader2 } from "lucide-react"
import { ReplyCard, type Reply } from "@/components/forum/reply-card"
import { ReplyForm } from "@/components/forum/reply-form"
import type { ForumPost } from "@/components/forum/post-card"
import { forumAPI, APIError } from "@/lib/api"

const statusColors = {
  open: "bg-blue-100 text-blue-800 border-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
}

const statusLabels = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPostData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch post and replies from backend
      const postData = await forumAPI.getPost(postId)
      const repliesData = await forumAPI.getReplies(postId)

      console.log("[Post Detail] Fetched data:", { postData, repliesData })

      setPost(postData)
      setReplies(repliesData)
    } catch (error) {
      console.error("[Post Detail] Error fetching post:", error)
      if (error instanceof APIError) {
        // Post not found or other error
        setPost(null)
        setReplies([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPostData()
  }, [postId])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-8rem)] bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Post not found</h2>
          <Button onClick={() => router.push("/forum")}>Back to Forum</Button>
        </div>
      </div>
    )
  }

  const initials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => router.push("/forum")} className="mb-4 sm:mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Forum</span>
          <span className="sm:hidden">Back</span>
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-balance flex-1">{post.title}</h1>
              <Badge className={statusColors[post.status]} variant="outline">
                {statusLabels[post.status]}
              </Badge>
            </div>
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base">{post.author.name}</p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{post.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>{new Date(post.createdAt).toLocaleString("lt-LT")}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-line mb-6">
              {post.content}
            </p>
            <Separator className="my-4" />
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Replies ({replies.length})</h2>
            <div className="space-y-4">
              {replies.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}
            </div>
          </div>

          <ReplyForm postId={postId} onReplySubmit={fetchPostData} />
        </div>
      </div>
    </div>
  )
}
