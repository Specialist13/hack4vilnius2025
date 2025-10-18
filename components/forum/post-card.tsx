import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

export interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  address: string
  createdAt: string
  likes: number
  replies: number
  status: "open" | "in-progress" | "resolved"
  language?: "en" | "lt" // Added language field
}

interface PostCardProps {
  post: ForumPost
}

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

const languageLabels = {
  en: "🇬🇧",
  lt: "🇱🇹",
}

export function PostCard({ post }: PostCardProps) {
  const initials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Link href={`/forum/post/${post.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg leading-tight text-balance">{post.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{post.author.name}</p>
              </div>
            </div>
            <div className="flex gap-2 self-start sm:self-auto flex-shrink-0">
              {post.language && (
                <Badge variant="outline" className="bg-muted">
                  {languageLabels[post.language]}
                </Badge>
              )}
              <Badge className={`${statusColors[post.status]}`} variant="outline">
                {statusLabels[post.status]}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 leading-relaxed">{post.content}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{post.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{new Date(post.createdAt).toLocaleDateString("lt-LT")}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-3 border-t">
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{post.replies} replies</span>
              <span className="sm:hidden">{post.replies}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
