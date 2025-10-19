"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { MapPin, ThumbsUp, User, Edit, Trash2, MoreVertical, Loader2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { petitionsAPI } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PetitionCardProps {
  petition: {
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
  onUpdate: () => void
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "recently"
    }
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return "recently"
  }
}

export function PetitionCard({ petition, onUpdate }: PetitionCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSigning, setIsSigning] = useState(false)
  const [isUnsigning, setIsUnsigning] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSign = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSigning(true)
    
    try {
      await petitionsAPI.approvePetition(petition.code)
      toast({ title: "Petition signed successfully!" })
      onUpdate() // Refresh the list to get updated signature count
    } catch (error: any) {
      let errorMessage = "Failed to sign petition"
      if (error?.status === 409) {
        errorMessage = "You have already signed this petition"
      } else if (error?.status === 403) {
        errorMessage = "You cannot sign your own petition"
      } else if (error?.data?.error) {
        errorMessage = error.data.error
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSigning(false)
    }
  }

  const handleUnsign = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsUnsigning(true)
    
    try {
      await petitionsAPI.removeApproval(petition.code)
      toast({ title: "Signature removed successfully!" })
      onUpdate() // Refresh the list to get updated signature count
    } catch (error: any) {
      let errorMessage = "Failed to remove signature"
      if (error?.status === 404) {
        errorMessage = "You haven't signed this petition yet"
      } else if (error?.data?.error) {
        errorMessage = error.data.error
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUnsigning(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/petitions/edit/${petition.code}`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await petitionsAPI.deletePetition(petition.code)
      toast({ 
        title: "Petition deleted",
        description: "Your petition has been deleted successfully"
      })
      onUpdate()
    } catch (error: any) {
      let errorMessage = "Failed to delete petition"
      if (error?.status === 403) {
        errorMessage = "You don't have permission to delete this petition"
      } else if (error?.data?.error) {
        errorMessage = error.data.error
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="h-11 w-11 ring-2 ring-background flex-shrink-0">
                <AvatarImage src={petition.userImage} alt={petition.userName} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate text-foreground">{petition.userName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(petition.createdAt)}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Petition
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteDialog(true)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Petition
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold line-clamp-2">
              {petition.name}
            </h3>
            {petition.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary/70" />
                <span className="truncate">{petition.address}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed whitespace-pre-wrap">
            {petition.description}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1.5 rounded-full bg-primary/10">
              <ThumbsUp className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-medium">{petition.approvalCount}</span>
            <span className="text-xs">signatures</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSign}
              disabled={isSigning || isUnsigning}
            >
              {isSigning ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <ThumbsUp className="mr-2 h-3.5 w-3.5" />
              )}
              Sign
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUnsign}
              disabled={isSigning || isUnsigning}
            >
              {isUnsigning ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : null}
              Remove
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Petition</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this petition? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

