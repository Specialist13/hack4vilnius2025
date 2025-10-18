"use client"

import { ArcGISMap } from "@/components/map/arcgis-map"
import { MapLegend } from "@/components/map/map-legend"
import { MapStats } from "@/components/map/map-stats"
import { useTranslations } from "next-intl"

export default function MapPage() {
  const t = useTranslations()

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-balance mb-2">{t("map.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("map.subtitle")}</p>
        </div>

        <MapStats />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6 sm:mt-8">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden border shadow-sm">
              <ArcGISMap />
            </div>
          </div>
          <div className="lg:col-span-1 order-1 lg:order-2">
            <MapLegend />
          </div>
        </div>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-muted/50 rounded-lg border">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">{t("map.howToUse.title")}</h2>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>{t("map.howToUse.step1")}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>{t("map.howToUse.step2")}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>{t("map.howToUse.step3")}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary flex-shrink-0">•</span>
              <span>{t("map.howToUse.step4")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
