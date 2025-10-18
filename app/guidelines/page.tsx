"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Heart, Lightbulb, CheckCircle, Shield, MessageSquare, Gavel, AlertTriangle, Info } from "lucide-react"

export default function GuidelinesPage() {
  const t = useTranslations("guidelines")

  const sections = [
    {
      id: "respect",
      icon: Heart,
      color: "text-red-500",
    },
    {
      id: "helpful",
      icon: Lightbulb,
      color: "text-yellow-500",
    },
    {
      id: "accurate",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      id: "privacy",
      icon: Shield,
      color: "text-blue-500",
    },
    {
      id: "ontopic",
      icon: MessageSquare,
      color: "text-purple-500",
    },
    {
      id: "legal",
      icon: Gavel,
      color: "text-gray-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t("title")}</h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-4">{t("subtitle")}</p>
          <p className="text-sm sm:text-base leading-relaxed">{t("intro")}</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon
            const items = t.raw(`sections.${section.id}.items`) as string[]

            return (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${section.color}`} />
                    {t(`sections.${section.id}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {items.map((item, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span className="text-sm sm:text-base text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 space-y-4">
          <Alert>
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-semibold">{t("reporting.title")}</AlertTitle>
            <AlertDescription className="text-sm leading-relaxed">{t("reporting.description")}</AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <Info className="h-5 w-5" />
            <AlertTitle className="font-semibold">{t("consequences.title")}</AlertTitle>
            <AlertDescription className="text-sm leading-relaxed">{t("consequences.description")}</AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

