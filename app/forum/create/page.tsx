"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { AddressPicker } from "@/components/map/address-picker"
import { useTranslations } from "next-intl"
import { forumAPI, APIError } from "@/lib/api"

export default function CreatePostPage() {
  const t = useTranslations()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    address: "",
    status: "open",
    language: "en",
    coordinates: { lat: 0, lng: 0 },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit forum to backend - API only requires title and body
      const response = await forumAPI.createForum({
        title: formData.title,
        body: formData.content,
      })

      console.log("[Create Forum] Success:", response)

      // Redirect back to forum list
      router.push("/forum")
    } catch (error) {
      console.error("[Create Forum] Error:", error)
      if (error instanceof APIError) {
        alert(`Failed to create forum post: ${error.data?.error || error.statusText}`)
      } else {
        alert("Failed to create forum post. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddressSelect = (address: string, coordinates?: { lat: number; lng: number }) => {
    setFormData({
      ...formData,
      address,
      coordinates: coordinates || { lat: 0, lng: 0 },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => router.push("/forum")} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t("forum.post.backToForum")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("forum.create.title")}</CardTitle>
            <CardDescription>{t("auth.register.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t("forum.create.postTitle")}</Label>
                <Input
                  id="title"
                  placeholder={t("forum.create.postTitlePlaceholder")}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <AddressPicker onAddressSelect={handleAddressSelect} initialAddress={formData.address} />

              <div className="space-y-2">
                <Label htmlFor="language">{t("forum.create.language")}</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="lt">🇱🇹 Lietuvių</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">{t("forum.create.languageHelp")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open - Just starting</SelectItem>
                    <SelectItem value="in-progress">In Progress - Working on it</SelectItem>
                    <SelectItem value="resolved">Resolved - Successfully installed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">{t("forum.create.content")}</Label>
                <Textarea
                  id="content"
                  placeholder={t("forum.create.contentPlaceholder")}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  disabled={isSubmitting}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Be specific about your building, number of interested residents, and any challenges you're facing.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => router.push("/forum")} disabled={isSubmitting}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("forum.create.submitting") : t("forum.create.submit")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
