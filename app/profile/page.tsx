"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, Mail, User, Calendar, LogOut, Save } from "lucide-react"
import { userAPI, removeAuthToken, isAuthenticated, APIError } from "@/lib/api"
import { AddressPicker } from "@/components/map/address-picker"

interface UserProfile {
  code: string
  email: string
  name: string
  address?: string
  image?: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const t = useTranslations()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    image: "",
    coordinates: undefined as { lat: number; lng: number } | undefined,
  })

  // Check authentication and load profile
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login?redirect=/profile")
      return
    }

    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await userAPI.getProfile()
      setProfile(data)
      setEditForm({
        name: data.name,
        address: data.address || "",
        image: data.image || "",
        coordinates: undefined,
      })
    } catch (err) {
      console.error("[Profile] Error loading profile:", err)
      if (err instanceof APIError) {
        if (err.status === 401) {
          // Token expired or invalid, redirect to login
          removeAuthToken()
          router.push("/auth/login?redirect=/profile")
        } else {
          setError(err.data?.error || "Failed to load profile. Please try again.")
        }
      } else {
        setError("Failed to load profile. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccessMessage(null)

      const updateData: { name?: string; address?: string; image?: string } = {}
      if (editForm.name !== profile?.name) updateData.name = editForm.name
      if (editForm.address !== profile?.address) updateData.address = editForm.address
      if (editForm.image !== profile?.image) updateData.image = editForm.image

      if (Object.keys(updateData).length === 0) {
        setIsEditing(false)
        return
      }

      const updatedProfile = await userAPI.partialUpdateProfile(updateData)
      setProfile(updatedProfile)
      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error("[Profile] Error updating profile:", err)
      if (err instanceof APIError) {
        setError(err.data?.error || "Failed to update profile. Please try again.")
      } else {
        setError("Failed to update profile. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    router.push("/auth/login")
  }

  const handleAddressSelect = (address: string, coordinates?: { lat: number; lng: number }) => {
    setEditForm((prev) => ({ ...prev, address, coordinates }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertDescription>Failed to load profile. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={isEditing ? editForm.image : profile.image} />
                  <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </CardDescription>
                </div>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="pl-10"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Profile Image URL (optional)</Label>
                  <Input
                    id="image"
                    value={editForm.image}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <AddressPicker onAddressSelect={handleAddressSelect} initialAddress={editForm.address} />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setEditForm({
                        name: profile.name,
                        address: profile.address || "",
                        image: profile.image || "",
                        coordinates: undefined,
                      })
                      setError(null)
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-sm">Full Name</Label>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium">{profile.name}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-sm">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium">{profile.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-muted-foreground text-sm">Address</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium">{profile.address || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-sm">Member Since</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium">{formatDate(profile.createdAt)}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-sm">Last Updated</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium">{formatDate(profile.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

