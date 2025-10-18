"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, MapPin, Users, MessageSquare } from "lucide-react"
import { useTranslations } from "next-intl"

export default function HomePage() {
  const t = useTranslations()

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
              {t("home.hero.title")}
            </h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty md:text-xl px-4">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/auth/register">{t("home.hero.getStarted")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                <Link href="/map">{t("home.hero.viewMap")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center px-4">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight">{t("home.howItWorks.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("home.howItWorks.subtitle")}</p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg sm:text-xl font-semibold">{t("home.howItWorks.step1.title")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t("home.howItWorks.step1.description")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg sm:text-xl font-semibold">{t("home.howItWorks.step2.title")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t("home.howItWorks.step2.description")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                  <MessageSquare className="h-6 w-6 text-chart-2" />
                </div>
                <h3 className="mb-2 text-lg sm:text-xl font-semibold">{t("home.howItWorks.step3.title")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t("home.howItWorks.step3.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center px-4">
            <Zap className="mx-auto mb-6 h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-balance">{t("home.cta.title")}</h2>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t("home.cta.subtitle")}
            </p>
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/auth/register">{t("home.cta.button")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
