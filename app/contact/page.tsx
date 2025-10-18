"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Clock, MessageCircle, Facebook, Twitter, Linkedin, HelpCircle } from "lucide-react"

export default function ContactPage() {
  const t = useTranslations("contact")

  const emailContacts = [
    {
      id: "general",
      icon: Mail,
      color: "text-blue-500",
    },
    {
      id: "support",
      icon: MessageCircle,
      color: "text-green-500",
    },
    {
      id: "privacy",
      icon: Mail,
      color: "text-purple-500",
    },
    {
      id: "moderation",
      icon: Mail,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t("title")}</h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-2">{t("subtitle")}</p>
          <p className="text-sm sm:text-base">{t("intro")}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {t("methods.email.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {emailContacts.map((contact) => {
                const Icon = contact.icon
                return (
                  <div key={contact.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${contact.color}`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">{t(`methods.email.${contact.id}.label`)}</h3>
                        <a
                          href={`mailto:${t(`methods.email.${contact.id}.value`)}`}
                          className="text-primary hover:underline text-sm sm:text-base"
                        >
                          {t(`methods.email.${contact.id}.value`)}
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t(`methods.email.${contact.id}.description`)}
                        </p>
                      </div>
                    </div>
                    {contact.id !== "moderation" && <hr className="mt-4" />}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("methods.social.title")}</CardTitle>
              <CardDescription>{t("methods.social.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span className="text-sm sm:text-base">{t("methods.social.platforms.facebook")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-sky-500" />
                  <span className="text-sm sm:text-base">{t("methods.social.platforms.twitter")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                  <span className="text-sm sm:text-base">{t("methods.social.platforms.linkedin")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t("methods.response.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground">{t("methods.response.description")}</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <HelpCircle className="w-5 h-5" />
                {t("faq.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200">
                {t("faq.description")}{" "}
                <a href="/faq" className="font-medium underline hover:no-underline">
                  FAQ
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                <MessageCircle className="w-5 h-5" />
                {t("feedback.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-green-800 dark:text-green-200">{t("feedback.description")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

