"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, ThumbsUp, Loader2, AlertCircle, User, Send, Edit, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"
import { useToast } from "@/hooks/use-toast"
import { forumAPI, commentsAPI } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Comment {
  code: string
  userCode: string
  userName: string
  userImage?: string
  commentText: string
  createdAt: string
  updatedAt?: string
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "recently"
    }
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return "recently"
  }
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations("forum.post")
  const router = useRouter()
  const { toast } = useToast()

  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasSupported, setHasSupported] = useState(false)
  const [isSupportLoading, setIsSupportLoading] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [postId, setPostId] = useState<string | null>(null)

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setPostId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (postId) {
      fetchPost()
      fetchComments()
    }
  }, [postId])

  const fetchPost = async () => {
    if (!postId) return
    setIsLoading(true)
    setError(null)

    try {
      const data = await forumAPI.getForum(postId)
      setPost(data)
    } catch (err: any) {
      setError(err?.data?.error || "Failed to load post")
      console.error("Error fetching post:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async () => {
    if (!postId) return
    try {
      const data = await commentsAPI.getComments(postId)
      setComments(data)
    } catch (err) {
      console.error("Error fetching comments:", err)
    }
  }

  const handleSupport = async () => {
    if (!post) return

    setIsSupportLoading(true)
    try {
      if (hasSupported) {
        await forumAPI.removeApproval(post.code)
        setHasSupported(false)
        setPost({ ...post, approvalCount: post.approvalCount - 1 })
        toast({ title: "Support removed" })
      } else {
        await forumAPI.approveForum(post.code)
        setHasSupported(true)
        setPost({ ...post, approvalCount: post.approvalCount + 1 })
        toast({ title: "Post supported!" })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.error || "Failed to update support",
        variant: "destructive",
      })
    } finally {
      setIsSupportLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim() || !postId) return

    setIsSubmittingComment(true)
    try {
      await commentsAPI.createComment(postId, { commentText: commentText.trim() })
      setCommentText("")
      await fetchComments()
      toast({ title: "Comment posted!" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.error || "Failed to post comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleEdit = () => {
    router.push(`/forum/edit/${post.code}`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await forumAPI.deleteForum(post.code)
      toast({ 
        title: "Post deleted",
        description: "Your forum post has been deleted successfully"
      })
      router.push("/forum")
    } catch (error: any) {
      let errorMessage = "Failed to delete post"
      if (error?.status === 403) {
        errorMessage = "You don't have permission to delete this post"
      } else if (error?.data?.error) {
        errorMessage = error.data.error
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading post...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToForum")}
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || t("notFound")}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => router.back()} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t("backToForum")}
          </Button>

          {/* Main Post Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar className="h-12 w-12 ring-2 ring-background flex-shrink-0">
                    <AvatarImage src={post.userImage} alt={post.userName} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{post.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.language === "EN" ? "🇬🇧 EN" : "🇱🇹 LT"}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Post
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold">{post.title}</h1>
                {post.address && (
                  <p className="text-muted-foreground">{post.address}</p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="whitespace-pre-wrap text-base leading-relaxed">{post.body}</p>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <ThumbsUp className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{post.approvalCount} supporters</span>
                </div>

                <Button
                  variant={hasSupported ? "default" : "outline"}
                  onClick={handleSupport}
                  disabled={isSupportLoading}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {hasSupported ? "Supported" : t("support")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts or advice..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={4}
                    className="resize-none"
                    disabled={isSubmittingComment}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmittingComment || !commentText.trim()}
                    >
                      {isSubmittingComment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Comments List */}
            {comments.length > 0 && (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <Card key={comment.code} className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-background">
                          <AvatarImage src={comment.userImage} alt={comment.userName} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{comment.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{comment.commentText}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Forum Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be undone and will also delete all comments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
