"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2 } from "lucide-react"
import { loadGoogleMapsAPI } from "@/lib/google-maps-loader"

interface AddressPickerProps {
  onAddressSelect: (address: string, coordinates?: { lat: number; lng: number }) => void
  initialAddress?: string
  placeholder?: string
}

export function AddressPicker({ onAddressSelect, initialAddress = "", placeholder }: AddressPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const markerRef = useRef<any | null>(null)
  const autocompleteRef = useRef<any | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [selectedAddress, setSelectedAddress] = useState(initialAddress)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setError(
        "Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.",
      )
      setIsLoading(false)
      return
    }

    const initializeMap = async () => {
      try {
        await loadGoogleMapsAPI(apiKey)

        if (!mapRef.current) return

        const vilniusCenter = { lat: 54.6872, lng: 25.2797 }

        const map = new window.google.maps.Map(mapRef.current, {
          center: vilniusCenter,
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        })

        mapInstanceRef.current = map

        const marker = new window.google.maps.Marker({
          map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        })

        markerRef.current = marker

        map.addListener("click", (event: any) => {
          if (event.latLng) {
            handleLocationSelect(event.latLng)
          }
        })

        marker.addListener("dragend", () => {
          const position = marker.getPosition()
          if (position) {
            handleLocationSelect(position)
          }
        })

        if (inputRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: "lt" },
            fields: ["formatted_address", "geometry", "name"],
          })

          autocomplete.bindTo("bounds", map)
          autocompleteRef.current = autocomplete

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace()

            if (!place.geometry || !place.geometry.location) {
              setError("No details available for this address")
              return
            }

            const location = place.geometry.location
            const address = place.formatted_address || place.name || ""

            setSelectedAddress(address)
            onAddressSelect(address, {
              lat: location.lat(),
              lng: location.lng(),
            })

            map.setCenter(location)
            map.setZoom(17)
            marker.setPosition(location)
            marker.setVisible(true)
          })
        }

        if (initialAddress) {
          geocodeAddress(initialAddress)
        }

        setIsLoading(false)
        setError(null)
      } catch (err) {
        console.error("Error initializing Google Maps:", err)
        setError("Failed to load Google Maps. Please check your API key and internet connection.")
        setIsLoading(false)
      }
    }

    initializeMap()

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
    }
  }, [initialAddress])

  const handleLocationSelect = (location: any) => {
    const lat = location.lat()
    const lng = location.lng()

    if (markerRef.current) {
      markerRef.current.setPosition(location)
      markerRef.current.setVisible(true)
    }

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location }, (results: any, status: any) => {
      if (status === "OK" && results && results[0]) {
        const address = results[0].formatted_address
        setSelectedAddress(address)
        onAddressSelect(address, { lat, lng })
      } else {
        console.error("Geocoding failed:", status)
        setSelectedAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        onAddressSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, { lat, lng })
      }
    })
  }

  const geocodeAddress = (address: string) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address, componentRestrictions: { country: "LT" } }, (results: any, status: any) => {
      if (status === "OK" && results && results[0] && mapInstanceRef.current && markerRef.current) {
        const location = results[0].geometry.location
        mapInstanceRef.current.setCenter(location)
        mapInstanceRef.current.setZoom(17)
        markerRef.current.setPosition(location)
        markerRef.current.setVisible(true)
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address-input">Building Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            id="address-input"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            placeholder={placeholder || "Search for your address or click on the map..."}
            className="pl-10"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Type to search or click on the map to select your building's location
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="relative w-full h-[400px] bg-muted">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center max-w-md p-6">
                <MapPin className="w-12 h-12 text-destructive mx-auto mb-2" />
                <p className="text-sm font-medium text-destructive mb-2">Map Error</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          <div ref={mapRef} className="w-full h-full" />

          {!isLoading && !error && selectedAddress && (
            <div className="absolute top-4 left-4 bg-background/95 p-3 rounded-lg shadow-lg max-w-xs z-10">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">Selected Location</p>
                  <p className="text-xs text-muted-foreground">{selectedAddress}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

declare global {
  interface Window {
    initMap: () => void
  }
}
