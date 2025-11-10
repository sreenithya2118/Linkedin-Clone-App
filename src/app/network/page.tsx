"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/linkedin/Header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/sonner"
import { Users, UserPlus } from "lucide-react"
import { toast } from "sonner"

interface Connection {
  id: number
  connectedUser: {
    id: number
    name: string
    headline: string | null
    avatar: string | null
    location: string | null
    company: string | null
  }
}

interface ConnectionRequest {
  id: number
  requester: {
    id: number
    name: string
    headline: string | null
    avatar: string | null
    location: string | null
    company: string | null
  }
}

export default function NetworkPage() {
  const router = useRouter()
  const [connections, setConnections] = useState<Connection[]>([])
  const [requests, setRequests] = useState<ConnectionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({})

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("bearer_token")
      if (!token) {
        router.push("/login")
        return
      }

      // Fetch connections
      const connectionsResponse = await fetch("/api/connections", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (connectionsResponse.ok) {
        const connectionsData = await connectionsResponse.json()
        setConnections(connectionsData.connections)
      }

      // Fetch pending requests
      const requestsResponse = await fetch("/api/connections/requests", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        setRequests(requestsData.requests)
      }
    } catch (error) {
      console.error("Failed to fetch network data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAccept = async (connectionId: number) => {
    setActionLoading((prev) => ({ ...prev, [connectionId]: true }))
    try {
      const token = localStorage.getItem("bearer_token")
      if (!token) {
        toast.error("Please log in")
        return
      }

      const response = await fetch("/api/connections/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ connectionId }),
      })

      if (!response.ok) {
        throw new Error("Failed to accept connection")
      }

      toast.success("Connection accepted!")
      fetchData()
    } catch (error) {
      console.error("Failed to accept connection:", error)
      toast.error("Failed to accept connection")
    } finally {
      setActionLoading((prev) => ({ ...prev, [connectionId]: false }))
    }
  }

  const handleReject = async (connectionId: number) => {
    setActionLoading((prev) => ({ ...prev, [connectionId]: true }))
    try {
      const token = localStorage.getItem("bearer_token")
      if (!token) {
        toast.error("Please log in")
        return
      }

      const response = await fetch("/api/connections/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ connectionId }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject connection")
      }

      toast.success("Connection rejected")
      fetchData()
    } catch (error) {
      console.error("Failed to reject connection:", error)
      toast.error("Failed to reject connection")
    } finally {
      setActionLoading((prev) => ({ ...prev, [connectionId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />

      <div className="mx-auto max-w-4xl px-4 py-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">My Network</h1>
          </div>

          <Tabs defaultValue="connections" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connections">
                Connections ({connections.length})
              </TabsTrigger>
              <TabsTrigger value="requests">
                Requests ({requests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="connections" className="mt-6">
              {connections.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start connecting with professionals to grow your network
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {connections.map((connection) => (
                    <Card key={connection.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Avatar
                          className="h-14 w-14 cursor-pointer"
                          onClick={() => router.push(`/profile/${connection.connectedUser.id}`)}
                        >
                          <AvatarImage
                            src={connection.connectedUser.avatar || undefined}
                            alt={connection.connectedUser.name}
                          />
                          <AvatarFallback>
                            {connection.connectedUser.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-sm truncate cursor-pointer hover:underline hover:text-primary"
                            onClick={() => router.push(`/profile/${connection.connectedUser.id}`)}
                          >
                            {connection.connectedUser.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {connection.connectedUser.headline || "Professional"}
                          </p>
                          {connection.connectedUser.location && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {connection.connectedUser.location}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => router.push(`/profile/${connection.connectedUser.id}`)}
                      >
                        View Profile
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll see connection requests here when people want to connect with you
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <Card key={request.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar
                          className="h-14 w-14 cursor-pointer"
                          onClick={() => router.push(`/profile/${request.requester.id}`)}
                        >
                          <AvatarImage
                            src={request.requester.avatar || undefined}
                            alt={request.requester.name}
                          />
                          <AvatarFallback>{request.requester.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3
                            className="font-semibold cursor-pointer hover:underline hover:text-primary"
                            onClick={() => router.push(`/profile/${request.requester.id}`)}
                          >
                            {request.requester.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {request.requester.headline || "Professional"}
                          </p>
                          {request.requester.company && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {request.requester.company}
                            </p>
                          )}
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => handleAccept(request.id)}
                              disabled={actionLoading[request.id]}
                            >
                              {actionLoading[request.id] ? "..." : "Accept"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(request.id)}
                              disabled={actionLoading[request.id]}
                            >
                              {actionLoading[request.id] ? "..." : "Ignore"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
