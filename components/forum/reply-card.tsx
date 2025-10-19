"use client"

import { formatDistanceToNow } from "date-fns"
import { ThumbsUp } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import type { Reply } from "@/types/forum"

interface ReplyCardProps {
  reply: Reply
}

export function ReplyCard({ reply }: ReplyCardProps) {
  const t = useTranslations("forum")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={reply.authorAvatar} alt={reply.authorName} />
              <AvatarFallback>{reply.authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{reply.authorName}</p>
                {reply.isSupporter && (
                  <Badge variant="secondary" className="text-xs">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Supporter
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
      </CardContent>
    </Card>
  )
}
