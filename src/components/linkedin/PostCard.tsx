"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageSquare, Repeat2, Send, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { normalizeComment } from "@/lib/normalizers"

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

interface Comment {
  id: string
  userId: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    headline: string | null
    avatar: string | null
  }
}

interface PostCardProps {
  post: Post
  onUpdate?: () => void
}

export const PostCard = ({ post, onUpdate }: PostCardProps) => {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState("")
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    
    setIsLiking(true)
    const previousLiked = isLiked
    const previousCount = likesCount

    // Optimistic update
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

    try {
      const token = localStorage.getItem("bearer_token")
      if (!token) {
        toast.error("Please log in to like posts")
        setIsLiked(previousLiked)
        setLikesCount(previousCount)
        return
      }

      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to like post")
      }

      const data = await response.json()
      setIsLiked(data.isLiked)
      setLikesCount(data.likesCount)
      onUpdate?.()
    } catch (error) {
      console.error("Failed to like post:", error)
      setIsLiked(previousLiked)
      setLikesCount(previousCount)
      toast.error("Failed to like post")
    } finally {
      setIsLiking(false)
    }
  }

  const loadComments = async () => {
    if (comments.length > 0) {
      setShowComments(!showComments)
      return
    }

    setIsLoadingComments(true)
    setShowComments(true)

    try {
      const response = await fetch(`/api/posts/${post.id}/comments`)
      if (!response.ok) throw new Error("Failed to load comments")

      const data = await response.json()
      const fetchedComments = Array.isArray(data.comments)
        ? data.comments.map((comment: any) => normalizeComment(comment, post.id))
        : []
      setComments(fetchedComments as Comment[])
    } catch (error) {
      console.error("Failed to load comments:", error)
      toast.error("Failed to load comments")
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleComment = async () => {
    if (!commentText.trim() || isCommenting) return

    setIsCommenting(true)
    try {
      const token = localStorage.getItem("bearer_token")
      if (!token) {
        toast.error("Please log in to comment")
        return
      }

      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText.trim() }),
      })

      if (!response.ok) throw new Error("Failed to post comment")

      const data = await response.json()
      setComments([
        ...comments,
        normalizeComment(data.comment, post.id) as Comment
      ])
      setCommentText("")
      toast.success("Comment posted!")
      onUpdate?.()
    } catch (error) {
      console.error("Failed to post comment:", error)
      toast.error("Failed to post comment")
    } finally {
      setIsCommenting(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar 
              className="h-12 w-12 cursor-pointer"
              onClick={() => router.push(`/profile/${post.user.id}`)}
            >
              <AvatarImage src={post.user.avatar || undefined} alt={post.user.name} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 
                className="font-semibold text-sm cursor-pointer hover:underline hover:text-primary"
                onClick={() => router.push(`/profile/${post.user.id}`)}
              >
                {post.user.name}
              </h3>
              <p className="text-xs text-muted-foreground">{post.user.headline || "Professional"}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="mt-3">
          <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Post Image */}
        {post.imageUrl && (
          <div className="mt-3 -mx-4">
            <img 
              src={post.imageUrl} 
              alt="Post image" 
              className="w-full object-cover max-h-96"
            />
          </div>
        )}

        {/* Engagement Stats */}
        {(likesCount > 0 || post.commentsCount > 0) && (
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {likesCount > 0 && (
                <button className="hover:underline hover:text-primary">
                  <span className="inline-flex items-center gap-1">
                    <div className="flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground">
                      <ThumbsUp className="h-2.5 w-2.5 fill-current" />
                    </div>
                    {likesCount}
                  </span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {post.commentsCount > 0 && (
                <button 
                  onClick={loadComments}
                  className="hover:underline hover:text-primary"
                >
                  {post.commentsCount} {post.commentsCount === 1 ? "comment" : "comments"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="border-t border-border px-2 py-1 flex items-center justify-around">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 ${isLiked ? "text-primary" : "text-muted-foreground"}`}
        >
          <ThumbsUp className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          <span className="hidden sm:inline">Like</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadComments}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="hidden sm:inline">Comment</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground"
        >
          <Repeat2 className="h-5 w-5" />
          <span className="hidden sm:inline">Repost</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground"
        >
          <Send className="h-5 w-5" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Comment Input */}
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.user.avatar || undefined} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[60px] resize-none text-sm"
              />
              <Button
                size="sm"
                onClick={handleComment}
                disabled={!commentText.trim() || isCommenting}
              >
                {isCommenting ? "..." : "Post"}
              </Button>
            </div>
          </div>

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              Loading comments...
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar 
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => router.push(`/profile/${comment.user.id}`)}
                  >
                    <AvatarImage src={comment.user.avatar || undefined} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-accent/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="font-semibold text-sm cursor-pointer hover:underline"
                          onClick={() => router.push(`/profile/${comment.user.id}`)}
                        >
                          {comment.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {comment.user.headline}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground px-3">
                      <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                      <button className="hover:underline">Like</button>
                      <button className="hover:underline">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
