"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("bearer_token")
    
    if (token) {
      // If logged in, redirect to feed
      router.push("/feed")
    } else {
      // If not logged in, redirect to login
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-2">
        <div className="h-12 w-12 animate-pulse rounded bg-primary" />
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}