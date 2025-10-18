"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, MessageSquare } from "lucide-react"
import { useTranslations } from "next-intl"

export function MapLegend() {
  const t = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("map.legend.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-primary rounded-full" />
          <span className="text-sm">{t("map.legend.activeLocation")}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm">{t("map.legend.buildingWithPosts")}</span>
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm">{t("map.legend.multipleResidents")}</span>
        </div>
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-sm">{t("map.legend.clickMarker")}</span>
        </div>
      </CardContent>
    </Card>
  )
}
