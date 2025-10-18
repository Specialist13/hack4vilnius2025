"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoStep } from "@/components/documents/personal-info-step"
import { PropertyInfoStep } from "@/components/documents/property-info-step"
import { ParkingInfoStep } from "@/components/documents/parking-info-step"
import { ChargerInfoStep } from "@/components/documents/charger-info-step"
import { DocumentsUploadStep } from "@/components/documents/documents-upload-step"
import { DocumentResult } from "@/components/documents/document-result"
import { ChevronLeft, ChevronRight, FileText, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

export type FormData = {
  fullName: string
  personalCode: string
  phone: string
  email: string
  address: string
  apartmentNumber: string
  propertyType: "apartment" | "house" | ""
  ownership: "owner" | "tenant" | ""
  parkingSpot: string
  parkingLocation: string
  chargerType: string
  power: string
  connectors: string
  chargerModel: string
  hasCoOwnerConsent: "yes" | "no" | ""
}

export type FormErrors = Partial<Record<keyof FormData, string>>

export default function DocumentsPage() {
  const t = useTranslations("documents")
  const [step, setStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    personalCode: "",
    phone: "",
    email: "",
    address: "",
    apartmentNumber: "",
    propertyType: "",
    ownership: "",
    parkingSpot: "",
    parkingLocation: "",
    chargerType: "",
    power: "",
    connectors: "1",
    chargerModel: "",
    hasCoOwnerConsent: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const steps = [
    { title: t("steps.personal.title"), component: PersonalInfoStep },
    { title: t("steps.property.title"), component: PropertyInfoStep },
    { title: t("steps.parking.title"), component: ParkingInfoStep },
    { title: t("steps.charger.title"), component: ChargerInfoStep },
    { title: t("steps.documents.title"), component: DocumentsUploadStep },
  ]

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (): boolean => {
    const newErrors: FormErrors = {}

    if (step === 0) {
      if (!formData.fullName) newErrors.fullName = t("errors.required")
      if (!formData.personalCode) newErrors.personalCode = t("errors.required")
      else if (!/^\d{11}$/.test(formData.personalCode)) newErrors.personalCode = t("errors.invalidPersonalCode")
      if (!formData.phone) newErrors.phone = t("errors.required")
      else if (!/^\+?370\s?\d{8}$/.test(formData.phone.replace(/\s/g, ""))) newErrors.phone = t("errors.invalidPhone")
      if (!formData.email) newErrors.email = t("errors.required")
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t("errors.invalidEmail")
    } else if (step === 1) {
      if (!formData.address) newErrors.address = t("errors.required")
      if (!formData.propertyType) newErrors.propertyType = t("errors.required")
      if (!formData.ownership) newErrors.ownership = t("errors.required")
      if (formData.propertyType === "apartment" && !formData.apartmentNumber)
        newErrors.apartmentNumber = t("errors.required")
    } else if (step === 2) {
      if (!formData.parkingLocation) newErrors.parkingLocation = t("errors.required")
      // parkingSpot is now optional - no validation needed
    } else if (step === 3) {
      if (!formData.chargerType) newErrors.chargerType = t("errors.required")
      if (!formData.power) newErrors.power = t("errors.required")
    } else if (step === 4) {
      if (formData.propertyType === "apartment" && !formData.hasCoOwnerConsent)
        newErrors.hasCoOwnerConsent = t("errors.required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (step < steps.length - 1) {
        setStep(step + 1)
      } else {
        setIsComplete(true)
      }
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleReset = () => {
    setStep(0)
    setIsComplete(false)
    setFormData({
      fullName: "",
      personalCode: "",
      phone: "",
      email: "",
      address: "",
      apartmentNumber: "",
      propertyType: "",
      ownership: "",
      parkingSpot: "",
      parkingLocation: "",
      chargerType: "",
      power: "",
      connectors: "1",
      chargerModel: "",
      hasCoOwnerConsent: "",
    })
    setErrors({})
  }

  if (isComplete) {
    return <DocumentResult formData={formData} onReset={handleReset} />
  }

  const CurrentStepComponent = steps[step].component
  const progress = ((step + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>
                  {t("stepLabel")} {step + 1} {t("of")} {steps.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
              {steps.map((s, idx) => (
                <div key={idx} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                      idx <= step
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background text-muted-foreground"
                    }`}
                  >
                    {idx < step ? "✓" : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-8 h-0.5 ${idx < step ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm font-medium mt-4">{steps[step].title}</p>
          </CardContent>
        </Card>

        {/* Form Step */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {steps[step].title}
            </CardTitle>
            <CardDescription>{t(`steps.${["personal", "property", "parking", "charger", "documents"][step]}.description`)}</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent formData={formData} updateFormData={updateFormData} errors={errors} />

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 0 && (
                <Button variant="outline" onClick={handlePrev} className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t("back")}
                </Button>
              )}
              <Button onClick={handleNext} className="flex-1">
                {step === steps.length - 1 ? t("generate") : t("next")}
                {step < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">{t("info.title")}</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">{t("info.description")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
