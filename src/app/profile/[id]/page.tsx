"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/linkedin/Header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PostCard } from "@/components/linkedin/PostCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/sonner"
import { MapPin, Building2, Mail, UserPlus, UserCheck, Clock, Pencil } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: number
  name: string
  email: string
  headline: string | null
  bio: string | null
  avatar: string | null
  location: string | null
  company: string | null
  position: string | null
}

interface Post {
  id: number
  userId: number
  content: string
  imageUrl: string | null
  likesCount: number
  commentsCount: number
  createdAt: string
  isLiked: boolean
  user: {
    id: number
    name: string
    headline: string | null
    avatar: string | null
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("bearer_token")
      if (!token) {
        router.push("/login")
        return
      }

      // Fetch current user
      const currentUserResponse = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!currentUserResponse.ok) {
        router.push("/login")
        return
      }

      const currentUserData = await currentUserResponse.json()
      setCurrentUser(currentUserData.user)

      // Fetch profile user with connection status
      const profileResponse = await fetch(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfileUser(profileData.user)
        setConnectionStatus(profileData.connectionStatus)
      }

      // Fetch user's posts
      const postsResponse = await fetch("/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        // Filter posts by this user
        const userPosts = postsData.posts.filter((post: Post) => post.userId === parseInt(userId))
        setPosts(userPosts)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchData()
    }
  }, [userId])

  const handleConnect = async () => {
    if (!profileUser || actionLoading) return

    setActionLoading(true)
    try {
      const token = localStorage.getItem("bearer_token")
      if (!token) {
        toast.error("Please log in")
        return
      }

      const response = await fetch("/api/connections/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ connectedUserId: profileUser.id }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to send connection request")
      }

      toast.success("Connection request sent!")
      setConnectionStatus("pending_sent")
    } catch (error) {
      console.error("Failed to send connection request:", error)
      toast.error((error as Error).message || "Failed to send connection request")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  const isOwnProfile = connectionStatus === "self"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />

      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex items-start justify-between -mt-16 mb-4">
              <Avatar className="h-32 w-32 border-4 border-card">
                <AvatarImage src={profileUser?.avatar || undefined} alt={profileUser?.name} />
                <AvatarFallback className="text-4xl">{profileUser?.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {isOwnProfile ? (
                <Button variant="outline" className="mt-16">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="mt-16">
                  {connectionStatus === "connected" ? (
                    <Button variant="outline" disabled>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Connected
                    </Button>
                  ) : connectionStatus === "pending_sent" ? (
                    <Button variant="outline" disabled>
                      <Clock className="h-4 w-4 mr-2" />
                      Pending
                    </Button>
                  ) : connectionStatus === "pending_received" ? (
                    <Button variant="outline">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Accept Request
                    </Button>
                  ) : (
                    <Button onClick={handleConnect} disabled={actionLoading}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {actionLoading ? "Connecting..." : "Connect"}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{profileUser?.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">
                {profileUser?.headline || "Professional"}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                {profileUser?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileUser.location}</span>
                  </div>
                )}
                {profileUser?.company && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>{profileUser.company}</span>
                  </div>
                )}
                {!isOwnProfile && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <button className="text-primary hover:underline">Contact info</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* About Section */}
        {profileUser?.bio && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-sm text-foreground whitespace-pre-wrap">{profileUser.bio}</p>
          </Card>
        )}

        {/* Experience Section */}
        {profileUser?.position && profileUser?.company && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded bg-accent flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{profileUser.position}</h3>
                <p className="text-sm text-muted-foreground">{profileUser.company}</p>
                <p className="text-xs text-muted-foreground mt-1">Present</p>
              </div>
            </div>
          </Card>
        )}

        {/* Activity Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Activity</h2>
            <span className="text-sm text-primary">{posts.length} {posts.length === 1 ? "post" : "posts"}</span>
          </div>

          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No posts yet</p>
              </div>
            ) : (
              posts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} onUpdate={fetchData} />
              ))
            )}
          </div>

          {posts.length > 3 && (
            <Button variant="outline" className="w-full mt-4">
              Show all posts →
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}
