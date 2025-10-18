import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"

export interface Reply {
  id: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  likes: number
}

interface ReplyCardProps {
  reply: Reply
}

export function ReplyCard({ reply }: ReplyCardProps) {
  const initials = reply.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{reply.author.name}</p>
            <p className="text-sm text-muted-foreground">{new Date(reply.createdAt).toLocaleString("lt-LT")}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed mb-4">{reply.content}</p>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <ThumbsUp className="w-4 h-4" />
          <span>{reply.likes}</span>
        </Button>
      </CardContent>
    </Card>
  )
}
