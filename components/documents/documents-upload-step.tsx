import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import type { FormData, FormErrors } from "@/app/documents/page"

type Props = {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: FormErrors
}

export function DocumentsUploadStep({ formData, updateFormData, errors }: Props) {
  const t = useTranslations("documents.steps.documents")

  if (formData.propertyType === "apartment") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>{t("coOwnerConsent")} *</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={formData.hasCoOwnerConsent === "yes" ? "default" : "outline"}
              onClick={() => updateFormData("hasCoOwnerConsent", "yes")}
              className="h-auto py-4 flex-col gap-2"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>{t("hasConsent")}</span>
            </Button>
            <Button
              type="button"
              variant={formData.hasCoOwnerConsent === "no" ? "default" : "outline"}
              onClick={() => updateFormData("hasCoOwnerConsent", "no")}
              className="h-auto py-4 flex-col gap-2"
            >
              <XCircle className="w-6 h-6" />
              <span>{t("needsTemplate")}</span>
            </Button>
          </div>
          {errors.hasCoOwnerConsent && <p className="text-sm text-destructive">{errors.hasCoOwnerConsent}</p>}
        </div>

        {formData.hasCoOwnerConsent === "yes" && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <AlertTitle>{t("hasConsentTitle")}</AlertTitle>
            <AlertDescription>{t("hasConsentDescription")}</AlertDescription>
          </Alert>
        )}

        {formData.hasCoOwnerConsent === "no" && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
            <AlertTitle>{t("needsTemplateTitle")}</AlertTitle>
            <AlertDescription>{t("needsTemplateDescription")}</AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>{t("houseTitle")}</AlertTitle>
      <AlertDescription>{t("houseDescription")}</AlertDescription>
    </Alert>
  )
}

