"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Image, Video, FileText, Calendar } from "lucide-react"
import { toast } from "sonner"

interface PostComposerProps {
  user: {
    name: string
    avatar: string | null
  }
  onPostCreated?: () => void
}

export const PostComposer = ({ user, onPostCreated }: PostComposerProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error("Please write something to post")
      return
    }

    setIsPosting(true)
    try {
      const token = localStorage.getItem("bearer_token")
      if (!token) {
        toast.error("Please log in to post")
        return
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      toast.success("Post created successfully!")
      setContent("")
      setIsExpanded(false)
      onPostCreated?.()
    } catch (error) {
      console.error("Failed to create post:", error)
      toast.error("Failed to create post. Please try again.")
    } finally {
      setIsPosting(false)
    }
  }

  if (!isExpanded) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 rounded-full border border-input bg-transparent px-4 py-3 text-left text-sm text-muted-foreground hover:bg-accent/50 transition-colors"
          >
            Start a post
          </button>
        </div>

        <div className="mt-3 flex items-center justify-around border-t border-border pt-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:bg-accent/50">
            <Image className="h-5 w-5 text-blue-500" />
            <span className="hidden sm:inline">Media</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:bg-accent/50">
            <Calendar className="h-5 w-5 text-orange-500" />
            <span className="hidden sm:inline">Event</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:bg-accent/50">
            <FileText className="h-5 w-5 text-red-500" />
            <span className="hidden sm:inline">Article</span>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar || undefined} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-sm mb-2">{user.name}</p>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about?"
            className="min-h-[120px] resize-none border-0 p-0 focus-visible:ring-0"
            autoFocus
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Image className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Video className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsExpanded(false)
              setContent("")
            }}
            disabled={isPosting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
            className="bg-primary hover:bg-primary/90"
          >
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
