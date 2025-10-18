"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, MessageSquare, Users, TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"

export function MapStats() {
  const t = useTranslations()

  // TODO: Fetch real statistics from backend
  // GET /api/map/stats
  // Expected response: { totalLocations, totalPosts, totalUsers, growthRate }

  const stats = [
    {
      label: t("map.stats.activeDiscussions"),
      value: "47",
      icon: MapPin,
      change: t("map.stats.activeChange"),
    },
    {
      label: t("map.stats.buildings"),
      value: "156",
      icon: MessageSquare,
      change: t("map.stats.buildingsChange"),
    },
    {
      label: t("map.stats.residents"),
      value: "342",
      icon: Users,
      change: t("map.stats.residentsChange"),
    },
    {
      label: "Success Rate",
      value: "68%",
      icon: TrendingUp,
      change: "Buildings with charging",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
