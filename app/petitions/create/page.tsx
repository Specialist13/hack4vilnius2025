"use client"
import { useState } from "react"
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

export default function CreatePetitionPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
  })

  const handleAddressSelect = (address: string, coordinates?: { lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, address }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      await petitionsAPI.createPetition({
        name: formData.name,
        description: formData.description,
        address: formData.address || undefined,
      })
      toast({
        title: "Success",
        description: "Petition created successfully",
      })
      router.push("/petitions")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.error || "Failed to create petition",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
              <h1 className="text-4xl font-bold tracking-tight">Create Petition</h1>
              <p className="text-muted-foreground">
                Start a petition to make a difference in your community
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Petition Details</CardTitle>
                <CardDescription>
                  Provide clear information about your petition
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
                    Creating...
                  </>
                ) : (
                  "Create Petition"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

