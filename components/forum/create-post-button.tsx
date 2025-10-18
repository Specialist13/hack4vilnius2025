"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export function CreatePostButton() {
  const t = useTranslations()
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/forum/create")} size="lg">
      <Plus className="w-5 h-5 mr-2" />
      {t("forum.createPost")}
    </Button>
  )
}
