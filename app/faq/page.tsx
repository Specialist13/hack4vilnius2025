"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Zap, Scale, Users } from "lucide-react"

export default function FAQPage() {
  const t = useTranslations("faq")

  const categories = [
    {
      id: "general",
      icon: HelpCircle,
      color: "text-blue-500",
    },
    {
      id: "technical",
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      id: "legal",
      icon: Scale,
      color: "text-purple-500",
    },
    {
      id: "community",
      icon: Users,
      color: "text-green-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t("title")}</h1>
          <p className="text-muted-foreground text-base sm:text-lg">{t("subtitle")}</p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => {
            const Icon = category.icon
            const questions = t.raw(`categories.${category.id}.questions`) as Array<{ q: string; a: string }>

            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${category.color}`} />
                    {t(`categories.${category.id}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {questions.map((item, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium">{item.q}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Still have questions?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Check our{" "}
              <a href="/contact" className="text-primary hover:underline font-medium">
                Contact page
              </a>{" "}
              to get in touch with our team.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

