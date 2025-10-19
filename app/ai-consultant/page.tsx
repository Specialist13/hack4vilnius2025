"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Bot, Send, MapPin, BarChart3, Lightbulb, TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { aiAPI, userAPI, APIError, isAuthenticated } from "@/lib/api"
import { Markdown } from "@/components/ui/markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIConsultantPage() {
  const t = useTranslations("aiConsultant")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: t("welcome"),
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)

  // Fetch user profile on mount to get address
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated()) {
        console.log("[AI Consultant] User not authenticated")
        return
      }

      try {
        const profile = await userAPI.getProfile()
        if (profile.address) {
          setUserAddress(profile.address)
          console.log("[AI Consultant] User address loaded:", profile.address)
        }
      } catch (error) {
        console.error("[AI Consultant] Failed to fetch user profile:", error)
      }
    }

    fetchUserProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Build the prompt with user address if available
      let fullPrompt = input
      if (userAddress) {
        fullPrompt = `User's address: ${userAddress}\n\nUser's question: ${input}`
      }

      // Call AI Agent API - matches OpenAPI spec
      const response = await aiAPI.generate({
        prompt: fullPrompt,
      })

      console.log("[AI Consultant] Response:", response)

      // Create assistant message from response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response || "I received your message. How can I help you further?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[AI Consultant] Error:", error)
      
      let errorContent = "Sorry, I encountered an error. Please try again later."
      
      if (error instanceof APIError) {
        console.error("[AI Consultant] API Error Details:", {
          status: error.status,
          statusText: error.statusText,
          data: error.data,
          url: error.url
        })

        if (error.status === 404) {
          // API endpoint not implemented yet - show coming soon message
          errorContent = `${t("comingSoonDescription")}\n\n${t("promptToStart")}`
        } else if (error.status === 401) {
          errorContent = "Please log in to use the AI consultant."
        } else if (error.status === 500) {
          // Check if the error data contains a message
          const errorMessage = error.data?.error || error.data?.message
          if (errorMessage) {
            errorContent = `AI service error: ${errorMessage}\n\nThis usually means the AI service is not properly configured on the backend.`
          } else {
            errorContent = "AI service is not configured. Please contact support or try again later."
          }
        } else {
          const errorMessage = error.data?.error || error.data?.message
          errorContent = errorMessage || "An error occurred while processing your request."
        }
      } else if (error instanceof Error) {
        console.error("[AI Consultant] General Error:", error.message)
        errorContent = `Error: ${error.message}`
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Bot className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="flex flex-col h-[700px]">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  {t("title")}
                </CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8 bg-primary/10">
                        <AvatarFallback>
                          <Bot className="w-4 h-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="text-sm">
                          <Markdown content={message.content} />
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="w-8 h-8 bg-secondary">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8 bg-primary/10">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{t("thinking")}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("inputPlaceholder")}
                    className="resize-none"
                    rows={1}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* User Address Info */}
            {userAddress && (
              <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-green-700 mb-1">{t("userAddress.title")}</p>
                      <p className="text-xs text-muted-foreground">{userAddress}</p>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        {t("userAddress.description")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("features.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t("features.proximity")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t("features.recommendation")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t("features.statistics")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t("features.guidance")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("exampleQuestions.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 px-3 whitespace-normal"
                  onClick={() => setInput(t("exampleQuestions.q1"))}
                  disabled={isLoading}
                >
                  <span className="text-sm break-words">{t("exampleQuestions.q1")}</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 px-3 whitespace-normal"
                  onClick={() => setInput(t("exampleQuestions.q2"))}
                  disabled={isLoading}
                >
                  <span className="text-sm break-words">{t("exampleQuestions.q2")}</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 px-3 whitespace-normal"
                  onClick={() => setInput(t("exampleQuestions.q3"))}
                  disabled={isLoading}
                >
                  <span className="text-sm break-words">{t("exampleQuestions.q3")}</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
