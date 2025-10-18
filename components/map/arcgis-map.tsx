"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface MapLocation {
  id: string
  address: string
  latitude: number
  longitude: number
  postCount: number
}

export function ArcGISMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Initialize ArcGIS Map
    // 1. Load ArcGIS JavaScript API
    // 2. Create map centered on Vilnius (54.6872, 25.2797)
    // 3. Add markers for locations with active forum posts
    // 4. Add clustering for nearby locations
    // 5. Add popup on marker click showing post count and link to forum

    const initializeMap = async () => {
      try {
        console.log("[v0] Initializing ArcGIS map")

        // TODO: Load ArcGIS API
        // import Map from '@arcgis/core/Map'
        // import MapView from '@arcgis/core/views/MapView'
        // import Graphic from '@arcgis/core/Graphic'
        // import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'

        // Mock locations data - TODO: Fetch from backend
        // GET /api/map/locations
        // Expected response: { locations: MapLocation[] }

        const mockLocations: MapLocation[] = [
          {
            id: "1",
            address: "Gedimino pr. 20, Vilnius",
            latitude: 54.6872,
            longitude: 25.2797,
            postCount: 3,
          },
          {
            id: "2",
            address: "Kęstučio g. 15, Vilnius",
            latitude: 54.6916,
            longitude: 25.2659,
            postCount: 1,
          },
          {
            id: "3",
            address: "Konstitucijos pr. 12, Vilnius",
            latitude: 54.7104,
            longitude: 25.2797,
            postCount: 2,
          },
        ]

        console.log("[v0] Mock locations loaded:", mockLocations)

        // TODO: Create map instance
        // const map = new Map({
        //   basemap: 'streets-navigation-vector'
        // })

        // TODO: Create map view
        // const view = new MapView({
        //   container: mapRef.current,
        //   map: map,
        //   center: [25.2797, 54.6872], // Vilnius coordinates [longitude, latitude]
        //   zoom: 12
        // })

        // TODO: Add graphics layer for markers
        // const graphicsLayer = new GraphicsLayer()
        // map.add(graphicsLayer)

        // TODO: Add markers for each location
        // mockLocations.forEach(location => {
        //   const point = {
        //     type: 'point',
        //     longitude: location.longitude,
        //     latitude: location.latitude
        //   }
        //
        //   const markerSymbol = {
        //     type: 'simple-marker',
        //     color: [0, 102, 204],
        //     outline: {
        //       color: [255, 255, 255],
        //       width: 2
        //     }
        //   }
        //
        //   const popupTemplate = {
        //     title: location.address,
        //     content: `${location.postCount} active post(s)`
        //   }
        //
        //   const pointGraphic = new Graphic({
        //     geometry: point,
        //     symbol: markerSymbol,
        //     attributes: location,
        //     popupTemplate: popupTemplate
        //   })
        //
        //   graphicsLayer.add(pointGraphic)
        // })

        // Simulate loading time
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsLoading(false)
      } catch (err) {
        console.error("[v0] Error initializing map:", err)
        setError("Failed to load map. Please try again later.")
        setIsLoading(false)
      }
    }

    initializeMap()

    // TODO: Cleanup on unmount
    // return () => {
    //   if (view) {
    //     view.destroy()
    //   }
    // }
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
      <div ref={mapRef} className="w-full h-full bg-muted rounded-lg">
        {/* TODO: ArcGIS map will be rendered here */}
        {!isLoading && !error && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">ArcGIS Map Placeholder</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                The interactive map showing EV charging discussion locations in Vilnius will be rendered here once
                ArcGIS JavaScript API is integrated.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
