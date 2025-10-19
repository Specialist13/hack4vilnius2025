"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { PetitionCard } from "@/components/petitions/petition-card"
import { petitionsAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Petition {
  code: string
  userCode: string
  userName: string
  userImage?: string
  name: string
  description: string
  address?: string
  createdAt: string
  approvalCount: number
}

export default function PetitionsPage() {
  const t = useTranslations("petitions")
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPetitions()
  }, [currentPage])

  const fetchPetitions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await petitionsAPI.getPetitions(currentPage, 20)
      setPetitions(response.petitions)
      setTotalPages(response.pagination.totalPages)
    } catch (err: any) {
      setError(err?.message || "Failed to load petitions. Please try again later.")
      console.error("Error fetching petitions:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Peticijos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pasirašykite ir kurkite peticijas, kad skatintumėte pokyčius savo bendruomenėje
            </p>
          </div>

          {/* Create Button */}
          <div className="flex justify-end">
            <Button asChild size="lg">
              <Link href="/petitions/create">
                <Plus className="mr-2 h-5 w-5" />
                Create Petition
              </Link>
            </Button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-foreground/70">Loading petitions...</p>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : petitions.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold">No Petitions Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Be the first to create a petition and make a difference!
              </p>
              <Button asChild size="lg" className="mt-4">
                <Link href="/petitions/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Petition
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {petitions.map((petition) => (
                <PetitionCard key={petition.code} petition={petition} onUpdate={fetchPetitions} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-muted-foreground flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

