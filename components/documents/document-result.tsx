"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Download, FileText, Home, Phone, Mail, Building2, Wrench, Star } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import type { FormData } from "@/app/documents/page"
import { generatePDF } from "@/lib/pdf-generator-pdfmake"

type Props = {
  formData: FormData
  onReset: () => void
}

export function DocumentResult({ formData, onReset }: Props) {
  const t = useTranslations("documents.result")
  const tPdf = useTranslations("documents.pdf")
  const locale = useLocale()
  const [isGenerating, setIsGenerating] = useState(false)

  const isApartment = formData.propertyType === "apartment"
  const needsCoOwnerDocs = isApartment && formData.hasCoOwnerConsent === "no"

  // Installer data - matching the data from installer-selection-step.tsx
  const installers = [
    {
      id: "ev-charging-pro",
      name: "EV Charging Pro",
      rating: 4.9,
      reviewCount: 127,
      basePrice: 1200,
      pricePerKW: 100,
      phone: "+370 600 12345",
      email: "info@evchargingpro.lt",
    },
    {
      id: "green-energy-lt",
      name: "Green Energy LT",
      rating: 4.8,
      reviewCount: 98,
      basePrice: 1400,
      pricePerKW: 120,
      phone: "+370 600 54321",
      email: "kontaktai@greenenergy.lt",
    },
    {
      id: "smart-charge-vilnius",
      name: "Smart Charge Vilnius",
      rating: 4.7,
      reviewCount: 156,
      basePrice: 1100,
      pricePerKW: 90,
      phone: "+370 600 98765",
      email: "info@smartcharge.lt",
    },
  ]

  const selectedInstaller = installers.find((inst) => inst.id === formData.selectedInstaller)

  // Calculate price based on project parameters
  const calculatePrice = () => {
    if (!selectedInstaller) return { min: 0, max: 0 }

    let basePrice = selectedInstaller.basePrice

    // Add cost based on power (kW)
    const power = parseFloat(formData.power) || 11
    const powerCost = power * selectedInstaller.pricePerKW

    // Add cost for additional connectors
    const connectors = parseInt(formData.connectors) || 1
    const connectorCost = connectors > 1 ? 300 : 0

    // Add cost for apartment complexity (need more work)
    const apartmentCost = formData.propertyType === "apartment" ? 200 : 0

    // Add cost for ground-mounted charger (more installation work)
    const typeCost = formData.chargerType === "ground" ? 400 : 0

    const totalMin = basePrice + powerCost + connectorCost + apartmentCost + typeCost
    const totalMax = totalMin + 500 // Add range for variations

    return { min: Math.round(totalMin), max: Math.round(totalMax) }
  }

  const installerPrice = calculatePrice()

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      // Create a translation function that can access all PDF translations
      const translateFn = (key: string, values?: Record<string, any>) => {
        // Remove 'pdf.' prefix if it exists
        const cleanKey = key.startsWith('pdf.') ? key.substring(4) : key

        // Handle the values parameter properly for next-intl
        if (values) {
          return tPdf(cleanKey as any, values)
        }
        return tPdf(cleanKey as any)
      }

      await generatePDF(formData, translateFn, locale)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert(t("downloadError"))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3">{t("title")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("subtitle", { name: formData.fullName })}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("summaryTitle")}</CardTitle>
            <CardDescription>{t("summaryDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t("property")}</p>
                  <p className="text-sm text-muted-foreground">{formData.address}</p>
                  {isApartment && (
                    <p className="text-sm text-muted-foreground">
                      {t("apartment")} {formData.apartmentNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t("charger")}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.chargerType} - {formData.power} kW
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedInstaller && (
          <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-green-600" />
                {t("installerTitle")}
              </CardTitle>
              <CardDescription>{t("installerDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedInstaller.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-sm">{selectedInstaller.rating}</span>
                        <span className="text-muted-foreground text-sm">
                          ({selectedInstaller.reviewCount} {t("reviews")})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      €{installerPrice.min.toLocaleString()} - €{installerPrice.max.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">{t("priceRange")}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedInstaller.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedInstaller.email}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>📞 {t("contactNote")}</strong> {t("contactNoteDescription")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("documentsTitle")}</CardTitle>
            <CardDescription>{t("documentsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">{t("applicationDocument")}</h3>
                <p className="text-sm text-muted-foreground">{t("applicationDescription")}</p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>

            {needsCoOwnerDocs && (
              <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                <FileText className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold">{t("coOwnerDocument")}</h3>
                  <p className="text-sm text-muted-foreground">{t("coOwnerDescription")}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            )}

            <Button onClick={handleDownload} disabled={isGenerating} className="w-full" size="lg">
              <Download className="w-5 h-5 mr-2" />
              {isGenerating ? t("generating") : t("downloadPDF")}
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("nextStepsTitle")}</CardTitle>
            <CardDescription>{t("nextStepsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {needsCoOwnerDocs && (
              <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950 p-4 rounded-r-lg">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-base">{t("step1Title")}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t("step1Description")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 p-4 rounded-r-lg">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {needsCoOwnerDocs ? "2" : "1"}
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-base">{t("step2Title")}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("step2Description")}
                  </p>
                  <a
                    href="https://www.registrucentras.lt/paslaugos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm font-medium text-yellow-700 dark:text-yellow-400 hover:underline"
                  >
                    www.registrucentras.lt
                  </a>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950 p-4 rounded-r-lg">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {needsCoOwnerDocs ? "3" : "2"}
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-base">{t("step3Title")}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("step3Description")}
                  </p>
                  <div className="text-sm">
                    <a
                      href="https://www.eso.lt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-purple-700 dark:text-purple-400 hover:underline"
                    >
                      www.eso.lt
                    </a>
                    <span className="text-muted-foreground"> | {t("phone")}: 1852</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-950 p-4 rounded-r-lg">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {needsCoOwnerDocs ? "4" : "3"}
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-base">{t("step4Title")}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("step4Description", {
                      percentage: isApartment ? "60%" : "40%",
                      amount: "1,500 EUR",
                    })}
                  </p>
                  <a
                    href="https://www.ena.lt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm font-medium text-green-700 dark:text-green-400 hover:underline"
                  >
                    www.ena.lt
                  </a>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
                    <span>⚠️</span>
                    <span>{t("step4Important")}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("contactsTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-2">{t("enaTitle")}</h3>
                <div className="space-y-1 text-sm">
                  <a href="https://www.ena.lt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Home className="w-4 h-4" />
                    www.ena.lt
                  </a>
                  <a href="mailto:info@ena.lt" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Mail className="w-4 h-4" />
                    info@ena.lt
                  </a>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-2">{t("esoTitle")}</h3>
                <div className="space-y-1 text-sm">
                  <a href="https://www.eso.lt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Home className="w-4 h-4" />
                    www.eso.lt
                  </a>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    1852
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onReset} className="flex-1">
            {t("newProject")}
          </Button>
          <Button onClick={handleDownload} disabled={isGenerating} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            {t("downloadAgain")}
          </Button>
        </div>
      </div>
    </div>
  )
}
