import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import type { FormData, FormErrors } from "@/app/documents/page"

type Props = {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: FormErrors
}

export function PersonalInfoStep({ formData, updateFormData, errors }: Props) {
  const t = useTranslations("documents.steps.personal")

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">{t("fullName")} *</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => updateFormData("fullName", e.target.value)}
          placeholder={t("fullNamePlaceholder")}
          className={errors.fullName ? "border-destructive" : ""}
        />
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="personalCode">{t("personalCode")} *</Label>
        <Input
          id="personalCode"
          value={formData.personalCode}
          onChange={(e) => updateFormData("personalCode", e.target.value)}
          placeholder={t("personalCodePlaceholder")}
          maxLength={11}
          className={errors.personalCode ? "border-destructive" : ""}
        />
        {errors.personalCode && <p className="text-sm text-destructive">{errors.personalCode}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t("phone")} *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData("phone", e.target.value)}
          placeholder={t("phonePlaceholder")}
          className={errors.phone ? "border-destructive" : ""}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("email")} *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          placeholder={t("emailPlaceholder")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>
    </div>
  )
}
