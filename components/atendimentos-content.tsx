"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Clock,
  UserIcon,
  Send,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  UserCheck,
  MessageSquare,
} from "lucide-react"
import { api } from "@/lib/api"
import { websocket } from "@/lib/websocket"
import { useToast } from "@/hooks/use-toast"

interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  isBlocked: boolean
  lastSeenAt?: string
}

interface Message {
  id: string
  content: string
  messageType: string
  direction: "INBOUND" | "OUTBOUND"
  status: string
  isRead: boolean
  createdAt: string
  user?: any
}

interface Conversation {
  id: string
  status: "WAITING" | "ATTENDING" | "RESOLVED" | "CLOSED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  lastMessageAt: string
  contact: Contact
  user?: any
  messages: Message[]
  _count: {
    messages: number
  }
}

const statusColors = {
  WAITING: "bg-yellow-500",
  ATTENDING: "bg-blue-500",
  RESOLVED: "bg-green-500",
  CLOSED: "bg-gray-500",
}

const priorityColors = {
  LOW: "bg-gray-500",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-500",
}

export function AtendimentosContent() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [stats, setStats] = useState({
    waiting: 0,
    attending: 0,
    resolved: 0,
    total: 0,
  })
  const [currentUser] = useState({ id: "user-1", name: "Agente Atual" }) // Mock user
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadConversations()
    loadStats()

    // Connect to WebSocket
    websocket.connect()

    // Listen for new messages
    websocket.on("new_message", (data: any) => {
      if (selectedConversation && data.message.conversationId === selectedConversation.id) {
        setMessages((prev) => [...prev, data.message])
        scrollToBottom()
      }
      // Update conversation list
      loadConversations()
    })

    websocket.on("conversation_updated", (data: any) => {
      setConversations((prev) => prev.map((conv) => (conv.id === data.conversation.id ? data.conversation : conv)))
    })

    return () => {
      websocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      websocket.joinConversation(selectedConversation.id)

      // Mark messages as read
      api.markMessagesAsRead(selectedConversation.id, currentUser.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = async () => {
    try {
      const params: any = {}
      if (filter !== "all") params.status = filter.toUpperCase()

      const response = await api.getConversations(params)
      setConversations(response.conversations)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar conversas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await api.getMessages(conversationId)
      setMessages(response.messages)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar mensagens",
        variant: "destructive",
      })
    }
  }

  const loadStats = async () => {
    try {
      const response = await api.getConversations({ page: 1, limit: 1 })
      // This is a simplified stats loading - in real app you'd have a dedicated endpoint
      const waiting = await api.getConversations({ status: "WAITING", page: 1, limit: 1 })
      const attending = await api.getConversations({ status: "ATTENDING", page: 1, limit: 1 })
      const resolved = await api.getConversations({ status: "RESOLVED", page: 1, limit: 1 })

      setStats({
        waiting: waiting.pagination?.total || 0,
        attending: attending.pagination?.total || 0,
        resolved: resolved.pagination?.total || 0,
        total: response.pagination?.total || 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return

    setSending(true)
    try {
      const response = await api.sendMessage({
        conversationId: selectedConversation.id,
        content: newMessage,
        userId: currentUser.id,
      })

      setMessages((prev) => [...prev, response.message])
      setNewMessage("")
      scrollToBottom()

      toast({
        title: "Sucesso",
        description: "Mensagem enviada com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const assignConversation = async (conversationId: string) => {
    try {
      await api.assignConversation(conversationId, currentUser.id)
      loadConversations()

      toast({
        title: "Sucesso",
        description: "Conversa atribuída com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atribuir conversa",
        variant: "destructive",
      })
    }
  }

  const updateConversationStatus = async (conversationId: string, status: string) => {
    try {
      await api.updateConversationStatus(conversationId, status)
      loadConversations()

      toast({
        title: "Sucesso",
        description: "Status da conversa atualizado",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      })
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.contact.name.toLowerCase().includes(search.toLowerCase()) || conv.contact.phone.includes(search)
    const matchesFilter = filter === "all" || conv.status.toLowerCase() === filter
    return matchesSearch && matchesFilter
  })

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00183E] mx-auto mb-4"></div>
          <p>Carregando atendimentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Aguardando</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.waiting}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Em Atendimento</p>
                <p className="text-2xl font-bold text-blue-600">{stats.attending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Resolvidos</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-600">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        {/* Lista de Conversas */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversas</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Filtros */}
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="text-xs">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="waiting" className="text-xs">
                  Aguardando
                </TabsTrigger>
                <TabsTrigger value="attending" className="text-xs">
                  Atendendo
                </TabsTrigger>
                <TabsTrigger value="resolved" className="text-xs">
                  Resolvidas
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-500px)]">
              <div className="space-y-1 p-4">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.contact.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{conversation.contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{conversation.contact.name}</p>
                          <div className="flex items-center space-x-1">
                            <Badge className={`${statusColors[conversation.status]} text-white text-xs`}>
                              {conversation.status}
                            </Badge>
                            <Badge className={`${priorityColors[conversation.priority]} text-white text-xs`}>
                              {conversation.priority}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 truncate">{conversation.contact.phone}</p>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-400">{formatTime(conversation.lastMessageAt)}</p>
                          {conversation._count.messages > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {conversation._count.messages}
                            </Badge>
                          )}
                        </div>

                        {conversation.user && (
                          <div className="flex items-center mt-1">
                            <UserIcon className="h-3 w-3 text-gray-400 mr-1" />
                            <p className="text-xs text-gray-500">{conversation.user.name}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {conversation.status === "WAITING" && (
                      <div className="mt-2 flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            assignConversation(conversation.id)
                          }}
                        >
                          Atender
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {filteredConversations.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma conversa encontrada</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              {/* Header do Chat */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.contact.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedConversation.contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.contact.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Phone className="h-3 w-3" />
                        <span>{selectedConversation.contact.phone}</span>
                        {selectedConversation.contact.email && (
                          <>
                            <Mail className="h-3 w-3 ml-2" />
                            <span>{selectedConversation.contact.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={`${statusColors[selectedConversation.status]} text-white`}>
                      {selectedConversation.status}
                    </Badge>

                    {selectedConversation.status === "ATTENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateConversationStatus(selectedConversation.id, "RESOLVED")}
                      >
                        Resolver
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <Separator />

              {/* Mensagens */}
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-600px)] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.direction === "OUTBOUND" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.direction === "OUTBOUND" ? "bg-[#00183E] text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs opacity-70">{formatTime(message.createdAt)}</p>
                            {message.direction === "OUTBOUND" && (
                              <div className="flex items-center space-x-1">
                                {message.status === "SENT" && <CheckCircle2 className="h-3 w-3" />}
                                {message.status === "DELIVERED" && (
                                  <div className="flex">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <CheckCircle2 className="h-3 w-3 -ml-1" />
                                  </div>
                                )}
                                {message.status === "READ" && (
                                  <div className="flex text-blue-400">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <CheckCircle2 className="h-3 w-3 -ml-1" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          {message.user && message.direction === "OUTBOUND" && (
                            <p className="text-xs opacity-70 mt-1">{message.user.name}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input de mensagem */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      disabled={sending || selectedConversation.status === "CLOSED"}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={sending || !newMessage.trim() || selectedConversation.status === "CLOSED"}
                    >
                      {sending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Selecione uma conversa para começar</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
