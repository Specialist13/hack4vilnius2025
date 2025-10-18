"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "@/components/forum/search-bar"
import { PostCard, type ForumPost } from "@/components/forum/post-card"
import { CreatePostButton } from "@/components/forum/create-post-button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslations } from "next-intl"
import { forumAPI, APIError } from "@/lib/api"

export default function ForumPage() {
  const t = useTranslations()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNearestMessage, setShowNearestMessage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch forums from API
        const response = await forumAPI.getForums(currentPage, 10)
        
        // Transform API response to match ForumPost interface
        const transformedPosts: ForumPost[] = response.forums.map(forum => ({
          id: forum.code,
          title: forum.title,
          content: forum.body,
          author: {
            name: "Forum User", // API doesn't provide author details in list view
            avatar: "/man.jpg",
          },
          address: "Vilnius", // API doesn't provide address
          createdAt: forum.createdAt,
          likes: forum.approvalCount,
          replies: 0, // API doesn't provide reply count in list view
          status: "open", // Default status
          language: "en",
        }))

        setPosts(transformedPosts)
        setFilteredPosts(transformedPosts)
        setTotalPages(response.pagination.totalPages)
      } catch (err) {
        console.error("Error fetching forums:", err)
        setError(err instanceof APIError ? `Failed to load forums: ${err.data?.error || err.statusText}` : "Failed to load forums. Please try again later.")
        
        // Fall back to mock data on error
        const mockPosts: ForumPost[] = [
          {
            id: "1",
            title: "Need EV charging at Gedimino pr. 20",
            content:
              "Our building has 45 apartments and at least 8 residents with electric vehicles. We desperately need charging infrastructure. Has anyone successfully advocated for this in their building?",
            author: {
              name: "Jonas Petraitis",
              avatar: "/man.jpg",
            },
            address: "Gedimino pr. 20, Vilnius",
            createdAt: "2025-01-15T10:30:00Z",
            likes: 24,
            replies: 12,
            status: "open",
            language: "en",
          },
          {
            id: "2",
            title: "Success story: Installed 4 charging points in Žvėrynas",
            content:
              "After 6 months of work with our building management, we finally got approval and installed 4 Type 2 charging points. Happy to share our experience and documentation!",
            author: {
              name: "Rūta Kazlauskienė",
              avatar: "/diverse-woman-portrait.png",
            },
            address: "Kęstučio g. 15, Vilnius",
            createdAt: "2025-01-14T14:20:00Z",
            likes: 56,
            replies: 28,
            status: "resolved",
            language: "en",
          },
          {
            id: "3",
            title: "Ieškau kaimynų Konstitucijos pr. bendram darbui",
            content:
              "Gyvenu Konstitucijos pr. 12 ir noriu pradėti peticiją dėl EV įkrovimo. Ieškau kaimynų iš gretimų pastatų, kad sukurtume stipresnį argumentą savivaldybei.",
            author: {
              name: "Tomas Jankauskas",
              avatar: "/man-with-stylish-glasses.png",
            },
            address: "Konstitucijos pr. 12, Vilnius",
            createdAt: "2025-01-13T09:15:00Z",
            likes: 18,
            replies: 9,
            status: "open",
            language: "lt",
          },
          {
            id: "4",
            title: "Meeting with Vilnius municipality scheduled",
            content:
              "Great news! Our building committee has scheduled a meeting with city officials to discuss EV charging infrastructure grants. Will update after the meeting.",
            author: {
              name: "Laura Mockutė",
              avatar: "/woman-blonde.jpg",
            },
            address: "Saltoniškių g. 9, Vilnius",
            createdAt: "2025-01-12T16:45:00Z",
            likes: 42,
            replies: 15,
            status: "in-progress",
            language: "en",
          },
          {
            id: "5",
            title: "Įkrovimo stočių įrengimo kainų sąmata",
            content:
              "Surinkau pasiūlymus iš 3 skirtingų rangovų dėl EV įkrovimo įrengimo mūsų požeminėje aikštelėje. Dalinuosi detalia kainų sąmata, kad padėčiau kitiems planuoti biudžetus.",
            author: {
              name: "Mindaugas Vasiliauskas",
              avatar: "/man-beard.jpg",
            },
            address: "Ozo g. 25, Vilnius",
            createdAt: "2025-01-11T11:30:00Z",
            likes: 67,
            replies: 34,
            status: "resolved",
            language: "lt",
          },
        ]

        setPosts(mockPosts)
        setFilteredPosts(mockPosts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [currentPage])

  const handleSearch = (query: string) => {
    console.log("[v0] Searching posts by address:", query)

    setSearchQuery(query)

    if (!query.trim()) {
      setFilteredPosts(posts)
      setShowNearestMessage(false)
      return
    }

    const exactMatches = posts.filter((post) => post.address.toLowerCase().includes(query.toLowerCase()))

    if (exactMatches.length > 0) {
      setFilteredPosts(exactMatches)
      setShowNearestMessage(false)
    } else {
      setFilteredPosts(posts)
      setShowNearestMessage(true)
    }
  }

  const filterByStatus = (status: string) => {
    setActiveTab(status)
    setSearchQuery("")
    setShowNearestMessage(false)

    if (status === "all") {
      setFilteredPosts(posts)
      return
    }

    const filtered = posts.filter((post) => post.status === status)
    setFilteredPosts(filtered)
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-balance">{t("forum.title")}</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{t("home.hero.subtitle")}</p>
          </div>
          <CreatePostButton />
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <Tabs value={activeTab} onValueChange={filterByStatus} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              {t("forum.tabs.all")}
            </TabsTrigger>
            <TabsTrigger value="open" className="text-xs sm:text-sm">
              {t("forum.tabs.active")}
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="text-xs sm:text-sm">
              {t("forum.tabs.planning")}
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-xs sm:text-sm">
              {t("forum.tabs.completed")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {error && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        {showNearestMessage && searchQuery && (
          <Alert className="mb-6 border-primary/50 bg-primary/5">
            <MapPin className="h-4 w-4 text-primary" />
            <AlertDescription>{t("forum.noExactMatch")}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found. Be the first to create one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
