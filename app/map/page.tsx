"use client"

import {ArcGISMap} from "@/components/map/arcgis-map"
import {MapStats} from "@/components/map/map-stats"
import {useTranslations} from "next-intl"

export default function MapPage() {
    const t = useTranslations()

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-balance mb-2">{t("map.title")}</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">{t("map.subtitle")}</p>
                </div>


                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-muted/50 rounded-lg border">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {t("map.description")}
                    </p>
                </div>

                <div className="mt-6 sm:mt-8">
                    <div className="h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden border shadow-sm">
                        <ArcGISMap/>
                    </div>
                </div>

                <MapStats/>


            </div>
        </div>
    )
}
