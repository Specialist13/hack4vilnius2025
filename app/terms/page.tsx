"use client"

import { useTranslations } from "next-intl"

export default function TermsOfServicePage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t("terms.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("terms.lastUpdated")}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.acceptance.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("terms.sections.acceptance.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.description.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("terms.sections.description.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.accounts.title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">{t("terms.sections.accounts.intro")}</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              {(t.raw("terms.sections.accounts.items") as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.conduct.title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">{t("terms.sections.conduct.intro")}</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              {(t.raw("terms.sections.conduct.items") as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.address.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("terms.sections.address.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.ip.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("terms.sections.ip.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.warranty.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("terms.sections.warranty.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.liability.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("terms.sections.liability.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.modifications.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("terms.sections.modifications.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.law.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("terms.sections.law.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("terms.sections.contact.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("terms.sections.contact.content")}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
