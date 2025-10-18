"use client"

import { useTranslations } from "next-intl"

export default function PrivacyPolicyPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t("privacy.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("privacy.lastUpdated")}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("privacy.sections.intro.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.sections.intro.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("privacy.sections.collection.title")}</h2>
            <h3 className="text-xl font-semibold mb-2 mt-4">{t("privacy.sections.collection.personal.title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {t("privacy.sections.collection.personal.intro")}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              {(t.raw("privacy.sections.collection.personal.items") as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">{t("privacy.sections.collection.content.title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {t("privacy.sections.collection.content.intro")}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              {(t.raw("privacy.sections.collection.content.items") as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">{t("privacy.sections.collection.technical.title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {t("privacy.sections.collection.technical.intro")}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              {(t.raw("privacy.sections.collection.technical.items") as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("privacy.sections.use.title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">{t("privacy.sections.use.intro")}</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              {(t.raw("privacy.sections.use.items") as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("privacy.sections.sharing.title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">{t("privacy.sections.sharing.intro")}</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              {(t.raw("privacy.sections.sharing.items") as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">{t("privacy.sections.sharing.note")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("privacy.sections.rights.title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">{t("privacy.sections.rights.intro")}</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              {(t.raw("privacy.sections.rights.items") as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">{t("privacy.sections.rights.contact")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("privacy.sections.security.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.sections.security.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("privacy.sections.retention.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.sections.retention.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("privacy.sections.children.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.sections.children.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("privacy.sections.changes.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.sections.changes.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">{t("privacy.sections.contact.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("privacy.sections.contact.content")}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
