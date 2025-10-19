"use client"

import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { MapPin, MessageSquare, ThumbsUp, User } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface PostCardProps {
  post: {
    code: string
    userCode: string
    userName: string
    userImage?: string
    title: string
    body: string
    address?: string
    language: "EN" | "LT"
    createdAt: string
    approvalCount: number
  }
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

export function PostCard({ post }: PostCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/forum/post/${post.code}`)
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-border/50 bg-card/50 backdrop-blur-sm"
      onClick={handleClick}
    >
      <CardHeader className="space-y-4 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="h-11 w-11 ring-2 ring-background flex-shrink-0">
              <AvatarImage src={post.userImage} alt={post.userName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate text-foreground">{post.userName}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {post.language === "EN" ? "🇬🇧 EN" : "🇱🇹 LT"}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0 text-primary/70" />
              <span className="truncate">{post.address}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {post.body}
        </p>
      </CardContent>

      <CardFooter className="flex items-center gap-6 text-sm pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="p-1.5 rounded-full bg-primary/10">
            <ThumbsUp className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-medium">{post.approvalCount}</span>
          <span className="text-xs">supporters</span>
        </div>
      </CardFooter>
    </Card>
  )
}
