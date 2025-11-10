"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Users, Briefcase, MessageSquare, Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  headline: string | null
  avatar: string | null
}

export const Header = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("bearer_token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          localStorage.removeItem("bearer_token")
          router.push("/login")
          return
        }

        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error("Failed to fetch user:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("bearer_token")
    router.push("/login")
  }

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-lg">
            in
          </div>
        </Link>

        {/* Search */}
        <div className="relative hidden sm:block flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-9 bg-accent/50 border-accent"
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 items-center justify-end gap-1">
          <Link href="/feed">
            <Button variant="ghost" size="sm" className="flex flex-col h-auto py-2 px-3 gap-0.5">
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>

          <Link href="/network">
            <Button variant="ghost" size="sm" className="flex flex-col h-auto py-2 px-3 gap-0.5">
              <Users className="h-5 w-5" />
              <span className="text-xs">Network</span>
            </Button>
          </Link>

          <Button variant="ghost" size="sm" className="hidden sm:flex flex-col h-auto py-2 px-3 gap-0.5">
            <Briefcase className="h-5 w-5" />
            <span className="text-xs">Jobs</span>
          </Button>

          <Button variant="ghost" size="sm" className="hidden sm:flex flex-col h-auto py-2 px-3 gap-0.5">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Messaging</span>
          </Button>

          <Button variant="ghost" size="sm" className="hidden md:flex flex-col h-auto py-2 px-3 gap-0.5">
            <Bell className="h-5 w-5" />
            <span className="text-xs">Notifications</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex flex-col h-auto py-2 px-3 gap-0.5">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.name || "User"} />
                  <AvatarFallback className="text-xs bg-accent">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">Me</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.headline || "Professional"}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/profile/${user?.id}`)}>
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
