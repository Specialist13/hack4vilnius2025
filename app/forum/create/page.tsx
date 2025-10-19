"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations, useLocale } from "next-intl"
import { useToast } from "@/hooks/use-toast"
import { forumAPI } from "@/lib/api"
import { AddressPicker } from "@/components/map/address-picker"
export default function CreatePostPage() {
  const t = useTranslations("forum.create")
  const tForum = useTranslations("forum")
  const router = useRouter()
  const { toast } = useToast()
  const locale = useLocale()

  // Map locale (e.g. 'en' | 'lt') to post language code used by the API ('EN' | 'LT')
  const defaultLanguage = locale === 'lt' ? 'LT' : 'EN'

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyChargers, setNearbyChargers] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    address: "",
    language: defaultLanguage as "EN" | "LT",
  })
  const handleAddressSelect = async (address: string, coords?: { lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, address }))

    if (!coords) return

    setCoordinates(coords)
    // Fetch ML-suggested optimal locations for EV charging stations (GeoJSON)
    try {
      const url = `https://web-production-46395.up.railway.app/predict/geojson?lat=${coords.lat}&lon=${coords.lng}&radius=0.2&top_n=5`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setNearbyChargers(data)
        console.log('ML suggested GeoJSON:', data)
      } else {
        console.error('ML API returned', res.status, res.statusText)
        setNearbyChargers(null)
      }
    } catch (err) {
      console.error('Error fetching ML suggestions:', err)
      setNearbyChargers(null)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.body.trim()) {
      toast({
        title: t("errorTitle"),
        description: t("errorFillFields"),
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      await forumAPI.createForum({
        title: formData.title,
        body: formData.body,
        address: formData.address || undefined,
        language: formData.language,
      })
      toast({
        title: t("successTitle"),
        description: t("successCreate"),
      })
      router.push("/forum")
    } catch (error: any) {
      toast({
        title: t("errorTitle"),
        description: error?.data?.error || t("errorCreate"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {tForum("post.backToForum")}
            </Button>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
              <p className="text-muted-foreground">
                {t("subtitle")}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{t("postDetailsTitle")}</CardTitle>
                <CardDescription>
                  {t("postDetailsDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">
                    {t("postTitle")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder={t("postTitlePlaceholder")}
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    disabled={isSubmitting}
                    className="text-base"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("charactersCount", { count: formData.title.length, max: 200 })}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-base">{t("language")}</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value: "EN" | "LT") => 
                      setFormData(prev => ({ ...prev, language: value }))
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EN">🇬🇧 English</SelectItem>
                      <SelectItem value="LT">🇱🇹 Lietuvių</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">{t("languageHelp")}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base">
                    {t("address")}
                  </Label>
                  <AddressPicker
                    onAddressSelect={handleAddressSelect}
                    initialAddress={formData.address}
                    placeholder={t("addressPlaceholder")}
                    geoJsonData={nearbyChargers}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-base">
                    {t("content")} <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder={t("contentPlaceholder")}
                    rows={10}
                    value={formData.body}
                    onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                    disabled={isSubmitting}
                    className="resize-none text-base"
                    maxLength={5000}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("charactersCount", { count: formData.body.length, max: 5000 })}
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                size="lg"
              >
                {t("cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.title.trim() || !formData.body.trim()}
                size="lg"
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("submit")
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
