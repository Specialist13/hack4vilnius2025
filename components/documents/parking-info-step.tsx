import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import type { FormData, FormErrors } from "@/app/documents/page"

type Props = {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: FormErrors
}

export function ParkingInfoStep({ formData, updateFormData, errors }: Props) {
  const t = useTranslations("documents.steps.parking")

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t("location")} *</Label>
        <div className="grid grid-cols-3 gap-4">
          <Button
            type="button"
            variant={formData.parkingLocation === "underground" ? "default" : "outline"}
            onClick={() => updateFormData("parkingLocation", "underground")}
            className="h-auto py-4"
          >
            {t("underground")}
          </Button>
          <Button
            type="button"
            variant={formData.parkingLocation === "yard" ? "default" : "outline"}
            onClick={() => updateFormData("parkingLocation", "yard")}
            className="h-auto py-4"
          >
            {t("yard")}
          </Button>
          <Button
            type="button"
            variant={formData.parkingLocation === "garage" ? "default" : "outline"}
            onClick={() => updateFormData("parkingLocation", "garage")}
            className="h-auto py-4"
          >
            {t("garage")}
          </Button>
        </div>
        {errors.parkingLocation && <p className="text-sm text-destructive">{errors.parkingLocation}</p>}
      </div>

      {formData.propertyType === "apartment" && (
        <div className="space-y-2">
          <Label htmlFor="parkingSpot">{t("spotNumber")}</Label>
          <Input
            id="parkingSpot"
            value={formData.parkingSpot}
            onChange={(e) => updateFormData("parkingSpot", e.target.value)}
            placeholder={t("spotNumberPlaceholder")}
            className={errors.parkingSpot ? "border-destructive" : ""}
          />
          {errors.parkingSpot && <p className="text-sm text-destructive">{errors.parkingSpot}</p>}
          <p className="text-sm text-muted-foreground">{t("spotNumberOptional") || "Optional - leave blank if not applicable"}</p>
        </div>
      )}
    </div>
  )
}
