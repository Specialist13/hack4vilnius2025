"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Users, MapPin, MessageSquare, Target, Heart } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

export default function AboutPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-balance mb-4">{t("about.title")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">{t("about.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Target className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{t("about.mission.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{t("about.mission.description")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{t("about.values.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{t("about.values.description")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">{t("about.howItWorks.title")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t("about.howItWorks.share.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("about.howItWorks.share.description")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t("about.howItWorks.discover.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("about.howItWorks.discover.description")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t("about.howItWorks.action.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("about.howItWorks.action.description")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">{t("about.cta.title")}</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t("about.cta.description")}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link href="/auth/register">{t("about.cta.getStarted")}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/forum">{t("about.cta.viewForum")}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            {t("about.contact")}{" "}
            <a href="mailto:info@Chargington.lt" className="text-primary hover:underline">
              info@Chargington.lt
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
