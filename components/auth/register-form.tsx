"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { authAPI, setAuthToken, APIError } from "@/lib/api"
import { AddressPicker } from "@/components/map/address-picker"
export function RegisterForm() {
  const t = useTranslations()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    coordinates: undefined as { lat: number; lng: number } | undefined,
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const handleAddressSelect = (address: string, coordinates?: { lat: number; lng: number }) => {
    setFormData((prev) => ({ ...prev, address, coordinates }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions")
      setIsLoading(false)
      return
    }
    try {
      // Call backend registration API
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address || undefined,
      })
      console.log("[Registration] Success:", {
        email: response.email,
        name: response.name,
      })
      // For registration, backend returns user data but not a token
      // User needs to login after registration
      // Redirect to login page with success message
      router.push("/auth/login?registered=true")
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 400) {
          setError(err.data?.error || "User already exists or invalid data provided.")
        } else {
          setError("Registration failed. Please try again.")
        }
      } else {
        setError("Registration failed. Please try again.")
      }
      console.error("[Registration] Error:", err)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl">{t("auth.register.title")}</CardTitle>
        <CardDescription>{t("auth.register.description")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="name">{t("auth.register.name")}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t("auth.register.namePlaceholder")}
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.register.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.register.emailPlaceholder")}
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>
          {/* Google Maps Address Picker */}
          <div className="space-y-2">
            <AddressPicker
              onAddressSelect={handleAddressSelect}
              initialAddress={formData.address}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.register.password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("auth.register.passwordPlaceholder")}
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("auth.register.confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("auth.register.confirmPasswordPlaceholder")}
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked: boolean) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
              disabled={isLoading}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              {t("auth.register.terms")}{" "}
              <Link href="/terms" className="text-primary hover:underline">
                {t("auth.register.termsLink")}
              </Link>{" "}
              {t("auth.register.and")}{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                {t("auth.register.privacyLink")}
              </Link>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "..." : t("auth.register.submit")}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            {t("auth.register.hasAccount")}{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              {t("auth.register.loginLink")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
