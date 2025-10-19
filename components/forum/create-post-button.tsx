"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export function CreatePostButton() {
  const t = useTranslations("forum")
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/forum/create")} size="lg">
      <Plus className="mr-2 h-4 w-4" />
      {t("createPost")}
    </Button>
  )
}
