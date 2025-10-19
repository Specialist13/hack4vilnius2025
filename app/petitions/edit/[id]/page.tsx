"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { petitionsAPI } from "@/lib/api"
import { AddressPicker } from "@/components/map/address-picker"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function EditPetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [petitionId, setPetitionId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
  })
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyChargers, setNearbyChargers] = useState<any | null>(null)

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setPetitionId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (petitionId) {
      fetchPetition()
    }
  }, [petitionId])

  const fetchPetition = async () => {
    if (!petitionId) return
    setIsLoading(true)
    setError(null)
    
    try {
      // Note: The API doesn't have a getPetition(code) endpoint, 
      // so we'll need to fetch all petitions and find the one we need
      // This is a limitation - ideally the backend should have GET /api/petitions/{code}
      const response = await petitionsAPI.getPetitions(1, 100)
      const petition = response.petitions.find(p => p.code === petitionId)
      
      if (!petition) {
        setError("Petition not found")
        return
      }

      setFormData({
        name: petition.name,
        description: petition.description,
        address: petition.address || "",
      })
    } catch (err: any) {
      setError(err?.data?.error || "Failed to load petition")
      console.error("Error fetching petition:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressSelect = (address: string, coordinates?: { lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, address }))
    if (!coordinates) return

    setCoordinates(coordinates)
    ;(async () => {
      try {
        const url = `https://web-production-46395.up.railway.app/predict/geojson?lat=${coordinates.lat}&lon=${coordinates.lng}&radius=0.2&top_n=5`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setNearbyChargers(data)
          console.log('ML suggested GeoJSON (petitions edit):', data)
        } else {
          console.error('ML API returned', res.status, res.statusText)
          setNearbyChargers(null)
        }
      } catch (err) {
        console.error('Error fetching ML suggestions:', err)
        setNearbyChargers(null)
      }
    })()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.description.trim() || !petitionId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      await petitionsAPI.updatePetition(petitionId, {
        name: formData.name,
        description: formData.description,
        address: formData.address || undefined,
      })
      toast({
        title: "Success",
        description: "Petition updated successfully",
      })
      router.push("/petitions")
    } catch (error: any) {
      let errorMessage = "Failed to update petition"
      if (error?.status === 403) {
        errorMessage = "You don't have permission to edit this petition"
      } else if (error?.data?.error) {
        errorMessage = error.data.error
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading petition...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Petitions
            </Button>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Edit Petition</h1>
              <p className="text-muted-foreground">
                Update your petition details
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Petition Details</CardTitle>
                <CardDescription>
                  Update the information about your petition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Petition Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Fix Neighborhood Park"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={isSubmitting}
                    className="text-base"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.name.length}/200 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base">
                    Location (Optional)
                  </Label>
                  <AddressPicker
                    onAddressSelect={handleAddressSelect}
                    initialAddress={formData.address}
                    placeholder="Enter location relevant to this petition"
                    geoJsonData={nearbyChargers}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you want to achieve and why it matters..."
                    rows={10}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={isSubmitting}
                    className="resize-none text-base"
                    maxLength={5000}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/5000 characters
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                size="lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.name.trim() || !formData.description.trim()}
                size="lg"
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Petition"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

