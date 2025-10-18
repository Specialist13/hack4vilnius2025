"use client"

import { RegisterForm } from "@/components/auth/register-form"
import { Zap } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

export default function RegisterPage() {
  const t = useTranslations()

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
            </div>
            <span className="text-xl sm:text-2xl font-bold">{t("common.appName")}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">{t("auth.register.subtitle")}</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">{t("auth.register.description")}</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
