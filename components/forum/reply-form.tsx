"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import { useToast } from "@/hooks/use-toast"

interface ReplyFormProps {
  postId: string
  onReplyAdded: () => void
}

export function ReplyForm({ postId, onReplyAdded }: ReplyFormProps) {
  const t = useTranslations("forum.reply")
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const [isSupporter, setIsSupporter] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Integrate with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Reply posted successfully",
      })

      setContent("")
      setIsSupporter(false)
      onReplyAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder={t("placeholder")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="resize-none"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="supporter"
          checked={isSupporter}
          onCheckedChange={(checked) => setIsSupporter(checked as boolean)}
          disabled={isSubmitting}
        />
        <Label
          htmlFor="supporter"
          className="text-sm font-normal cursor-pointer"
        >
          {t("markAsSupporter")}
        </Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            t("submitting")
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t("submit")}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
