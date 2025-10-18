"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { extendedForumAPI, APIError } from "@/lib/api"

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
      // Submit reply to backend (using extended API - not in OpenAPI spec)
      const response = await extendedForumAPI.createReply(postId, { content })

      console.log("[Reply Form] Reply submitted:", response)

      setContent("")
      onReplySubmit()
    } catch (error) {
      console.error("[Reply Form] Error submitting reply:", error)
      if (error instanceof APIError) {
        alert(`Failed to submit reply: ${error.data?.error || error.statusText}`)
      } else {
        alert("Failed to submit reply. Please try again.")
      }
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
