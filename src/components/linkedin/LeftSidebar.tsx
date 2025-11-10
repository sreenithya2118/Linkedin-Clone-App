"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface User {
  id: string
  name: string
  email: string
  headline: string | null
  avatar: string | null
}

interface ConnectionsData {
  count: number
}

export const LeftSidebar = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [connectionsCount, setConnectionsCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("bearer_token")
        if (!token) return

        // Fetch user data
        const userResponse = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData.user)
        }

        // Fetch connections count
        const connectionsResponse = await fetch("/api/connections", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (connectionsResponse.ok) {
          const connectionsData: ConnectionsData = await connectionsResponse.json()
          setConnectionsCount(connectionsData.count || 0)
        }
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="relative h-16 bg-gradient-to-r from-primary/20 to-primary/10" />
        <div className="px-4 pb-4">
          <div className="relative -mt-8 mb-4">
            <Skeleton className="h-16 w-16 rounded-full border-4 border-card" />
          </div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-16 bg-gradient-to-r from-primary/20 to-primary/10" />
      
      {/* Profile Section */}
      <div className="px-4 pb-4">
        {/* Avatar */}
        <div className="relative -mt-8 mb-4">
          <Avatar 
            className="h-16 w-16 border-4 border-card cursor-pointer"
            onClick={() => router.push(`/profile/${user?.id}`)}
          >
            <AvatarImage src={user?.avatar || undefined} alt={user?.name || "User"} />
            <AvatarFallback className="text-2xl bg-accent">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Info */}
        <div 
          className="cursor-pointer hover:underline"
          onClick={() => router.push(`/profile/${user?.id}`)}
        >
          <h3 className="font-semibold text-sm">{user?.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {user?.headline || "Add a headline to introduce yourself"}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-3" />

        {/* Stats */}
        <div 
          className="space-y-2 cursor-pointer hover:bg-accent/50 -mx-4 px-4 py-2 rounded"
          onClick={() => router.push("/network")}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Connections</span>
            <span className="font-semibold text-primary">{connectionsCount}</span>
          </div>
          <p className="text-xs font-semibold text-foreground">
            Grow your network
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-3" />

        {/* Premium CTA */}
        <div className="text-xs">
          <p className="text-muted-foreground mb-2">Access exclusive tools & insights</p>
          <div className="flex items-center gap-1.5 text-foreground font-semibold">
            <div className="h-3 w-3 rounded-sm bg-amber-500" />
            <span>Try Premium for free</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-3" />

        {/* My Items */}
        <div className="text-xs space-y-2">
          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 4h10v1H3V4zm0 3h10v1H3V7zm0 3h10v1H3v-1z" />
            </svg>
            <span className="font-semibold">My items</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
