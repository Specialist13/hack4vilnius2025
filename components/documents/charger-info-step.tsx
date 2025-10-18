import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb } from "lucide-react"
import { useTranslations } from "next-intl"
import type { FormData, FormErrors } from "@/app/documents/page"

type Props = {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: FormErrors
}

export function ChargerInfoStep({ formData, updateFormData, errors }: Props) {
  const t = useTranslations("documents.steps.charger")

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t("type")} *</Label>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={formData.chargerType === "wall" ? "default" : "outline"}
            onClick={() => updateFormData("chargerType", "wall")}
            className="h-auto py-4"
          >
            🔌 {t("wall")}
          </Button>
          <Button
            type="button"
            variant={formData.chargerType === "ground" ? "default" : "outline"}
            onClick={() => updateFormData("chargerType", "ground")}
            className="h-auto py-4"
          >
            ⚡ {t("ground")}
          </Button>
        </div>
        {errors.chargerType && <p className="text-sm text-destructive">{errors.chargerType}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t("power")} *</Label>
        <div className="grid grid-cols-3 gap-4">
          <Button
            type="button"
            variant={formData.power === "7.4" ? "default" : "outline"}
            onClick={() => updateFormData("power", "7.4")}
            className="h-auto py-4"
          >
            7.4 kW
          </Button>
          <Button
            type="button"
            variant={formData.power === "11" ? "default" : "outline"}
            onClick={() => updateFormData("power", "11")}
            className="h-auto py-4"
          >
            11 kW
          </Button>
          <Button
            type="button"
            variant={formData.power === "22" ? "default" : "outline"}
            onClick={() => updateFormData("power", "22")}
            className="h-auto py-4"
          >
            22 kW
          </Button>
        </div>
        {errors.power && <p className="text-sm text-destructive">{errors.power}</p>}

        <Alert className="mt-2">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>{t("powerRecommendation")}</AlertDescription>
        </Alert>
      </div>

      <div className="space-y-2">
        <Label htmlFor="connectors">{t("connectors")} *</Label>
        <Select value={formData.connectors} onValueChange={(value) => updateFormData("connectors", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{t("oneConnector")}</SelectItem>
            <SelectItem value="2">{t("twoConnectors")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="chargerModel">{t("model")}</Label>
        <Input
          id="chargerModel"
          value={formData.chargerModel}
          onChange={(e) => updateFormData("chargerModel", e.target.value)}
          placeholder={t("modelPlaceholder")}
        />
        <p className="text-sm text-muted-foreground">{t("modelOptional")}</p>
      </div>
    </div>
  )
}
