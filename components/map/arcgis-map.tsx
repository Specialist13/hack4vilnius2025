"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"

export function ArcGISMap() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Wait for the ArcGIS embeddable components to load
    const initializeMap = async () => {
      try {
        console.log("[ChargeVilnius] Initializing ArcGIS embedded map")

        // Wait a bit for the script to load
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Create the custom element if the container exists
        if (mapContainerRef.current && !mapContainerRef.current.querySelector('arcgis-embedded-map')) {
          const mapElement = document.createElement('arcgis-embedded-map')
          mapElement.setAttribute('item-id', 'fdcad931c33b4fd09efadcf3d52b7b92')
          mapElement.setAttribute('theme', 'light')
          mapElement.setAttribute('legend-enabled', 'true')
          mapElement.setAttribute('share-enabled', 'true')
          mapElement.setAttribute('center', '25.323621624154594,54.68983668653611')
          mapElement.setAttribute('scale', '288895.277144')
          mapElement.setAttribute('portal-url', 'https://licejus.maps.arcgis.com/')
          mapElement.style.height = '100%'
          mapElement.style.width = '100%'

          mapContainerRef.current.appendChild(mapElement)
        }

        setIsLoading(false)
        setError(null)
      } catch (err) {
        console.error("[ChargeVilnius] Error initializing map:", err)
        setError("Failed to load map. Please try again later.")
        setIsLoading(false)
      }
    }

    initializeMap()
  }, [])

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
          <div className="text-center p-6 bg-background rounded-lg shadow-lg max-w-md">
            <p className="text-destructive mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-primary hover:underline">
              Reload page
            </button>
          </div>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  )
}
