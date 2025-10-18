"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { authAPI, setAuthToken, APIError } from "@/lib/api"

export function LoginForm() {
  const t = useTranslations()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Call backend authentication API
      const response = await authAPI.login({ email, password })
      
      // Store auth token in localStorage
      setAuthToken(response.accessToken)

      // Trigger storage event for other tabs/components
      window.dispatchEvent(new Event('storage'))
      
      // Force page refresh to update UI state everywhere
      window.location.href = "/forum"
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 401) {
          setError("Invalid email or password. Please try again.")
        } else if (err.status === 400) {
          setError("Please provide valid email and password.")
        } else {
          setError("An error occurred. Please try again later.")
        }
      } else {
        setError("Invalid email or password. Please try again.")
      }
      console.error("[Login] Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{t("auth.login.title")}</CardTitle>
        <CardDescription>{t("auth.login.description")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.login.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("auth.login.password")}</Label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                {t("auth.login.forgotPassword")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t("auth.login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "..." : t("auth.login.submit")}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            {t("auth.login.noAccount")}{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              {t("auth.login.signupLink")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

