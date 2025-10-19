"use client"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Star, Euro, CheckCircle, Phone, Mail } from "lucide-react"
import { FormData, FormErrors } from "@/app/documents/page"
import { useTranslations } from "next-intl"

interface InstallerSelectionStepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: FormErrors
}

const installers = [
  {
    id: "ev-charging-pro",
    name: "EV Charging Pro",
    rating: 4.9,
    reviewCount: 127,
    basePrice: 1200,
    pricePerKW: 100,
    description: "Specialistai elektromobilių krovimo sprendimams",
    features: ["Garantija 3 metai", "Nemokama konsultacija", "Greitas montavimas"],
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
    description: "Ekologiški energetikos sprendimai jūsų namams",
    features: ["Garantija 5 metai", "24/7 palaikymas", "Sertifikuoti specialistai"],
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
    description: "Išmanieji įkrovimo sprendimai Vilniuje",
    features: ["Garantija 2 metai", "Nemokamas apžiūros vizitas", "Lankstus darbo laikas"],
    phone: "+370 600 98765",
    email: "info@smartcharge.lt",
  },
]

// Function to calculate price based on project parameters
function calculatePrice(
  installer: (typeof installers)[0],
  formData: FormData
): { min: number; max: number } {
  let basePrice = installer.basePrice

  // Add cost based on power (kW)
  const power = parseFloat(formData.power) || 11
  const powerCost = power * installer.pricePerKW

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

export function InstallerSelectionStep({ formData, updateFormData, errors }: InstallerSelectionStepProps) {
  const t = useTranslations("documents")

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>💡 {t("steps.installer.noteTitle")}</strong> {t("steps.installer.noteDescription")}
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          <strong>💰 {t("steps.installer.priceCalculation")}</strong> {t("steps.installer.priceNote")}
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">{t("steps.installer.selectInstaller")}</Label>
        <RadioGroup
          value={formData.selectedInstaller}
          onValueChange={(value: string) => updateFormData("selectedInstaller", value)}
        >
          <div className="space-y-4">
            {installers.map((installer) => {
              const price = calculatePrice(installer, formData)
              const priceRange = `${price.min.toLocaleString()} - ${price.max.toLocaleString()}`

              return (
                <Card
                  key={installer.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    formData.selectedInstaller === installer.id
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => updateFormData("selectedInstaller", installer.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <RadioGroupItem value={installer.id} id={installer.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{installer.name}</h3>
                            {formData.selectedInstaller === installer.id && (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {t("steps.installer.selected")}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-sm">{installer.rating}</span>
                              <span className="text-muted-foreground text-sm">
                                ({installer.reviewCount} {t("steps.installer.reviews")})
                              </span>
                            </div>
                          </div>
                          <CardDescription className="text-sm mb-3">{installer.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-primary font-bold">
                          <Euro className="w-4 h-4" />
                          <span>{priceRange}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{t("steps.installer.priceRange")}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {installer.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            ✓ {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{installer.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{installer.email}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </RadioGroup>
        {errors.selectedInstaller && <p className="text-sm text-destructive">{errors.selectedInstaller}</p>}
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          <strong>📋 {t("steps.installer.contactNote")}</strong> {t("steps.installer.contactDescription")}
        </p>
      </div>
    </div>
  )
}
