/**
 * Google Maps API Loader
 * Ensures the Google Maps JavaScript API is only loaded once
 */

let isLoaded = false
let isLoading = false
let loadPromise: Promise<void> | null = null

export function loadGoogleMapsAPI(apiKey: string): Promise<void> {
  // If already loaded, return resolved promise
  if (isLoaded && typeof window.google !== "undefined") {
    return Promise.resolve()
  }

  // If currently loading, return existing promise
  if (isLoading && loadPromise) {
    return loadPromise
  }

  // Check if script already exists in the DOM
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
  if (existingScript && typeof window.google !== "undefined") {
    isLoaded = true
    return Promise.resolve()
  }

  // Start loading
  isLoading = true

  loadPromise = new Promise((resolve, reject) => {
    // Clean up any existing callback
    if (window.initGoogleMaps) {
      delete window.initGoogleMaps
    }

    // Create callback function
    window.initGoogleMaps = () => {
      isLoaded = true
      isLoading = false
      resolve()
    }

    // Create and append script
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true

    script.onerror = () => {
      isLoading = false
      loadPromise = null
      reject(new Error("Failed to load Google Maps API"))
    }

    document.head.appendChild(script)
  })

  return loadPromise
}

// Extend window interface
declare global {
  interface Window {
    initGoogleMaps?: () => void
    google?: any
  }
}

