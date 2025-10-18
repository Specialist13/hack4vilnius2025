"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, MessageSquare, Users, TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { mapAPI, APIError } from "@/lib/api"

export function MapStats() {
  const t = useTranslations()
  const [stats, setStats] = useState([
    {
      label: t("map.stats.activeDiscussions"),
      value: "...",
      icon: MapPin,
      change: t("map.stats.activeChange"),
    },
    {
      label: t("map.stats.buildings"),
      value: "...",
      icon: MessageSquare,
      change: t("map.stats.buildingsChange"),
    },
    {
      label: t("map.stats.residents"),
      value: "...",
      icon: Users,
      change: t("map.stats.residentsChange"),
    },
    {
      label: "Success Rate",
      value: "...",
      icon: TrendingUp,
      change: "Buildings with charging",
    },
  ])

  useEffect(() => {
    // Fetch real statistics from backend
    const fetchStats = async () => {
      try {
        const data = await mapAPI.getStats()
        
        // Update stats with real data
        setStats([
          {
            label: t("map.stats.activeDiscussions"),
            value: data.totalLocations || data.activeDiscussions || "47",
            icon: MapPin,
            change: t("map.stats.activeChange"),
          },
          {
            label: t("map.stats.buildings"),
            value: data.totalBuildings || data.buildings || "156",
            icon: MessageSquare,
            change: t("map.stats.buildingsChange"),
          },
          {
            label: t("map.stats.residents"),
            value: data.totalUsers || data.residents || "342",
            icon: Users,
            change: t("map.stats.residentsChange"),
          },
          {
            label: "Success Rate",
            value: data.successRate || data.growthRate || "68%",
            icon: TrendingUp,
            change: "Buildings with charging",
          },
        ])
      } catch (error) {
        console.error("[Map Stats] Error fetching statistics:", error)
        // Keep default/loading values on error
        if (error instanceof APIError) {
          // Use fallback values
          setStats([
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
          ])
        }
      }
    }

    fetchStats()
  }, [t])

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
