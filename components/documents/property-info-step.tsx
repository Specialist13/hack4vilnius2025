import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Building2, Home } from "lucide-react"
import { useTranslations } from "next-intl"
import type { FormData, FormErrors } from "@/app/documents/page"
import { AddressPicker } from "@/components/map/address-picker"

type Props = {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: FormErrors
}

export function PropertyInfoStep({ formData, updateFormData, errors }: Props) {
  const t = useTranslations("documents.steps.property")

  const handleAddressSelect = (address: string) => {
    updateFormData("address", address)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <AddressPicker
          onAddressSelect={handleAddressSelect}
          initialAddress={formData.address}
        />
        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t("propertyType")} *</Label>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={formData.propertyType === "apartment" ? "default" : "outline"}
            onClick={() => updateFormData("propertyType", "apartment")}
            className="h-auto py-4 flex-col gap-2"
          >
            <Building2 className="w-8 h-8" />
            <span>{t("apartment")}</span>
          </Button>
          <Button
            type="button"
            variant={formData.propertyType === "house" ? "default" : "outline"}
            onClick={() => updateFormData("propertyType", "house")}
            className="h-auto py-4 flex-col gap-2"
          >
            <Home className="w-8 h-8" />
            <span>{t("house")}</span>
          </Button>
        </div>
        {errors.propertyType && <p className="text-sm text-destructive">{errors.propertyType}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t("ownership")} *</Label>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={formData.ownership === "owner" ? "default" : "outline"}
            onClick={() => updateFormData("ownership", "owner")}
            className="h-auto py-4"
          >
            {t("owner")}
          </Button>
          <Button
            type="button"
            variant={formData.ownership === "tenant" ? "default" : "outline"}
            onClick={() => updateFormData("ownership", "tenant")}
            className="h-auto py-4"
          >
            {t("tenant")}
          </Button>
        </div>
        {errors.ownership && <p className="text-sm text-destructive">{errors.ownership}</p>}
      </div>

      {formData.propertyType === "apartment" && (
        <div className="space-y-2">
          <Label htmlFor="apartmentNumber">{t("apartmentNumber")} *</Label>
          <Input
            id="apartmentNumber"
            value={formData.apartmentNumber}
            onChange={(e) => updateFormData("apartmentNumber", e.target.value)}
            placeholder={t("apartmentNumberPlaceholder")}
            className={errors.apartmentNumber ? "border-destructive" : ""}
          />
          {errors.apartmentNumber && <p className="text-sm text-destructive">{errors.apartmentNumber}</p>}
        </div>
      )}
    </div>
  )
}
