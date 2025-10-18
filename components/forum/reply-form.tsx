"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReplyFormProps {
  postId: string
  onReplySubmit: () => void
}

export function ReplyForm({ postId, onReplySubmit }: ReplyFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Submit reply to backend
      // POST /api/posts/{postId}/replies with { content }
      // Expected response: { success: boolean, reply: Reply }

      console.log("[v0] Submitting reply to post:", postId, { content })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setContent("")
      onReplySubmit()
    } catch (error) {
      console.error("[v0] Error submitting reply:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Reply</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts, experiences, or advice..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isSubmitting}
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
