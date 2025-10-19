"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { SearchBar } from "@/components/forum/search-bar"
import { CreatePostButton } from "@/components/forum/create-post-button"
import { PostCard } from "@/components/forum/post-card"
import { forumAPI } from "@/lib/api"

interface ForumPost {
  code: string
  userCode: string
  userName: string
  userImage?: string
  title: string
  body: string
  address?: string
  language: "EN" | "LT"
  createdAt: string
  approvalCount: number
}

export default function ForumPage() {
  const t = useTranslations("forum")
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPosts()
  }, [currentPage])

  useEffect(() => {
    filterPosts()
  }, [posts, searchQuery])

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await forumAPI.getForums(currentPage, 20)
      setPosts(response.forums)
      setTotalPages(response.pagination.totalPages)
    } catch (err: any) {
      setError(err?.message || "Failed to load forum posts. Please try again later.")
      console.error("Error fetching posts:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = posts

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.address?.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query)
      )
    }

    setFilteredPosts(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* Search and Create */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
            </div>
            <CreatePostButton />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-foreground/70">{t("loading")}</p>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold">{t("noDiscussions")}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery ? t("noSearchResults") : t("noDiscussionsDesc")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.code} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("previous")}
              </button>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                {t("pageOf", { current: currentPage, total: totalPages })}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("next")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
