"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/linkedin/Header"
import { LeftSidebar } from "@/components/linkedin/LeftSidebar"
import { RightSidebar } from "@/components/linkedin/RightSidebar"
import { PostComposer } from "@/components/linkedin/PostComposer"
import { PostCard } from "@/components/linkedin/PostCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/sonner"
import { normalizePost, normalizeUser } from "@/lib/normalizers"

interface User {
  id: string
  name: string
  email: string
  headline: string | null
  avatar: string | null
}

interface Post {
  id: string
  userId: string
  content: string
  imageUrl: string | null
  likesCount: number
  commentsCount: number
  createdAt: string
  isLiked: boolean
  user: {
    id: string
    name: string
    headline: string | null
    avatar: string | null
  }
}

export default function FeedPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("bearer_token")
      if (!token) {
        router.push("/login")
        return
      }

      // Fetch user
      const userResponse = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!userResponse.ok) {
        localStorage.removeItem("bearer_token")
        router.push("/login")
        return
      }

      const userData = await userResponse.json()
      setUser(normalizeUser(userData.user))

      // Fetch posts
      const postsResponse = await fetch("/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        const normalizedPosts = Array.isArray(postsData.posts)
          ? (postsData.posts.map((post: any) => normalizePost(post)) as Post[])
          : []
        setPosts(normalizedPosts)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="hidden lg:block lg:col-span-3">
              <Skeleton className="h-64 w-full" />
            </aside>
            <main className="lg:col-span-6 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </main>
            <aside className="hidden lg:block lg:col-span-3">
              <Skeleton className="h-96 w-full" />
            </aside>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />
      
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <LeftSidebar />
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6 space-y-4">
            {user && (
              <PostComposer
                user={{ name: user.name, avatar: user.avatar }}
                onPostCreated={fetchData}
              />
            )}

            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-semibold mb-2">No posts yet</p>
                  <p className="text-sm">Be the first to share something!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onUpdate={fetchData} />
                ))
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}