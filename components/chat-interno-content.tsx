"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  Plus,
  Send,
  MoreVertical,
  Edit,
  Trash2,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  X,
  Users,
  MessageCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface User {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "away"
  lastSeen?: string
}

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: string
  edited?: boolean
  editedAt?: string
  status: "sent" | "delivered" | "read"
  type: "text" | "file" | "image"
}

interface Conversation {
  id: string
  title: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

const users: User[] = [
  {
    id: "1",
    name: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "2",
    name: "Webster",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "3",
    name: "Maria Silva",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    lastSeen: "5 min atrás",
  },
  {
    id: "4",
    name: "João Santos",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastSeen: "2 horas atrás",
  },
  {
    id: "5",
    name: "Ana Costa",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
]

const initialConversations: Conversation[] = [
  {
    id: "1",
    title: "TEste",
    participants: ["1", "2"],
    unreadCount: 0,
    createdAt: "2025-01-07T08:37:00",
    updatedAt: "2025-01-07T08:37:00",
    createdBy: "1",
    lastMessage: {
      id: "msg-1",
      content: "Oi, tudo bem?",
      senderId: "2",
      timestamp: "2025-01-07T08:37:00",
      status: "read",
      type: "text",
    },
  },
  {
    id: "2",
    title: "Erro",
    participants: ["1", "3"],
    unreadCount: 2,
    createdAt: "2025-01-06T10:22:00",
    updatedAt: "2025-01-07T10:22:00",
    createdBy: "1",
    lastMessage: {
      id: "msg-2",
      content: "Preciso de ajuda com o sistema",
      senderId: "3",
      timestamp: "2025-01-07T10:22:00",
      status: "delivered",
      type: "text",
    },
  },
]

const initialMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "msg-1",
      content: "Oi pessoal! Como vocês estão?",
      senderId: "1",
      timestamp: "2025-01-07T08:30:00",
      status: "read",
      type: "text",
    },
    {
      id: "msg-2",
      content: "Tudo bem por aqui! E você?",
      senderId: "2",
      timestamp: "2025-01-07T08:32:00",
      status: "read",
      type: "text",
    },
    {
      id: "msg-3",
      content: "Ótimo! Vamos começar a reunião em 5 minutos",
      senderId: "1",
      timestamp: "2025-01-07T08:35:00",
      status: "read",
      type: "text",
    },
    {
      id: "msg-4",
      content: "Perfeito, já estou preparado!",
      senderId: "2",
      timestamp: "2025-01-07T08:37:00",
      status: "read",
      type: "text",
    },
  ],
  "2": [
    {
      id: "msg-5",
      content: "Estou com um problema no sistema",
      senderId: "3",
      timestamp: "2025-01-07T10:20:00",
      status: "delivered",
      type: "text",
    },
    {
      id: "msg-6",
      content: "Qual é o erro que está aparecendo?",
      senderId: "1",
      timestamp: "2025-01-07T10:21:00",
      status: "delivered",
      type: "text",
    },
    {
      id: "msg-7",
      content: "Preciso de ajuda com o sistema",
      senderId: "3",
      timestamp: "2025-01-07T10:22:00",
      status: "delivered",
      type: "text",
    },
  ],
}

export function ChatInternoContent() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>(initialMessages)
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1")
  const [messageInput, setMessageInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [newConversation, setNewConversation] = useState({
    title: "",
    participants: [] as string[],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = "1" // Simulating current user as Admin

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedConversation])

  const getUser = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-gray-400"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoje"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem"
    } else {
      return date.toLocaleDateString("pt-BR")
    }
  }

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: messageInput.trim(),
      senderId: currentUserId,
      timestamp: new Date().toISOString(),
      status: "sent",
      type: "text",
    }

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }))

    // Update conversation's last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? { ...conv, lastMessage: newMessage, updatedAt: new Date().toISOString() }
          : conv,
      ),
    )

    setMessageInput("")

    // Simulate message delivery after 1 second
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
        ),
      }))
    }, 1000)
  }

  const editMessage = (messageId: string) => {
    if (!editContent.trim() || !selectedConversation) return

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: prev[selectedConversation].map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              content: editContent.trim(),
              edited: true,
              editedAt: new Date().toISOString(),
            }
          : msg,
      ),
    }))

    setEditingMessage(null)
    setEditContent("")
  }

  const deleteMessage = (messageId: string) => {
    if (!selectedConversation) return

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: prev[selectedConversation].filter((msg) => msg.id !== messageId),
    }))
  }

  const createConversation = () => {
    if (!newConversation.title.trim() || newConversation.participants.length === 0) return

    const conversation: Conversation = {
      id: Date.now().toString(),
      title: newConversation.title,
      participants: [currentUserId, ...newConversation.participants],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUserId,
    }

    setConversations([conversation, ...conversations])
    setMessages((prev) => ({ ...prev, [conversation.id]: [] }))
    setNewConversation({ title: "", participants: [] })
    setIsCreatingConversation(false)
    setSelectedConversation(conversation.id)
  }

  const deleteConversation = (conversationId: string) => {
    setConversations(conversations.filter((conv) => conv.id !== conversationId))
    if (selectedConversation === conversationId) {
      setSelectedConversation(null)
    }
    // Remove messages for this conversation
    const newMessages = { ...messages }
    delete newMessages[conversationId]
    setMessages(newMessages)
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const currentConversation = conversations.find((conv) => conv.id === selectedConversation)
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : []

  const getConversationParticipants = (conversation: Conversation) => {
    return conversation.participants
      .filter((id) => id !== currentUserId)
      .map((id) => getUser(id))
      .filter(Boolean)
  }

  return (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Chat Interno</h1>
            <Dialog open={isCreatingConversation} onOpenChange={setIsCreatingConversation}>
              <DialogTrigger asChild>
                <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Conversa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={newConversation.title}
                      onChange={(e) => setNewConversation({ ...newConversation, title: e.target.value })}
                      placeholder="Nome da conversa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="participants">Filtro por Users</Label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (!newConversation.participants.includes(value)) {
                          setNewConversation({
                            ...newConversation,
                            participants: [...newConversation.participants, value],
                          })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione usuários" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter((user) => user.id !== currentUserId)
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {newConversation.participants.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newConversation.participants.map((userId) => {
                        const user = getUser(userId)
                        return (
                          <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                            {user?.name}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={() =>
                                setNewConversation({
                                  ...newConversation,
                                  participants: newConversation.participants.filter((id) => id !== userId),
                                })
                              }
                            />
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreatingConversation(false)}>
                      Fechar
                    </Button>
                    <Button onClick={createConversation} className="bg-[#00183E] hover:bg-[#00183E]/90">
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar conversas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedConversation === conversation.id ? "ring-2 ring-[#00183E] ring-opacity-50 bg-blue-50" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 truncate">{conversation.title}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessage
                              ? formatTime(conversation.lastMessage.timestamp)
                              : formatTime(conversation.createdAt)}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteConversation(conversation.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conversation.lastMessage?.content || "Nenhuma mensagem ainda"}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {getConversationParticipants(conversation)
                              .map((user) => user?.name)
                              .join(", ")}
                          </span>
                        </div>

                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-[#00183E] text-white text-xs">{conversation.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation && currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {getConversationParticipants(currentConversation)
                      .slice(0, 3)
                      .map((user, index) => (
                        <div key={user?.id} className="relative">
                          <Avatar className="w-10 h-10 border-2 border-white">
                            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-[#00183E] text-white">{user?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user?.status || "offline")}`}
                            />
                          )}
                        </div>
                      ))}
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">{currentConversation.title}</h2>
                    <p className="text-sm text-gray-500">
                      {getConversationParticipants(currentConversation)
                        .map((user) => user?.name)
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentMessages.map((message, index) => {
                  const isCurrentUser = message.senderId === currentUserId
                  const sender = getUser(message.senderId)
                  const showDate =
                    index === 0 || formatDate(message.timestamp) !== formatDate(currentMessages[index - 1].timestamp)

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex justify-center mb-4">
                          <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}

                      <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? "order-2" : "order-1"}`}>
                          {!isCurrentUser && (
                            <div className="flex items-center space-x-2 mb-1">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={sender?.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-[#00183E] text-white text-xs">
                                  {sender?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">{sender?.name}</span>
                            </div>
                          )}

                          <div
                            className={`relative group px-4 py-2 rounded-lg ${
                              isCurrentUser
                                ? "bg-[#00183E] text-white rounded-br-sm"
                                : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                            }`}
                          >
                            {editingMessage === message.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="min-h-[60px] resize-none"
                                />
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingMessage(null)
                                      setEditContent("")
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button size="sm" onClick={() => editMessage(message.id)}>
                                    Salvar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                {message.edited && (
                                  <span
                                    className={`text-xs ${isCurrentUser ? "text-blue-200" : "text-gray-500"} italic`}
                                  >
                                    editado
                                  </span>
                                )}
                              </>
                            )}

                            {isCurrentUser && editingMessage !== message.id && (
                              <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setEditingMessage(message.id)
                                        setEditContent(message.content)
                                      }}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => deleteMessage(message.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </div>

                          <div
                            className={`flex items-center mt-1 space-x-1 ${
                              isCurrentUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span className={`text-xs ${isCurrentUser ? "text-gray-500" : "text-gray-500"}`}>
                              {formatTime(message.timestamp)}
                            </span>
                            {isCurrentUser && (
                              <div className="flex space-x-1">
                                {message.status === "sent" && <Check className="w-3 h-3 text-gray-400" />}
                                {message.status === "delivered" && <CheckCheck className="w-3 h-3 text-gray-400" />}
                                {message.status === "read" && <CheckCheck className="w-3 h-3 text-blue-500" />}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    placeholder="Digite uma mensagem..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    className="pr-12"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-transparent"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-[#00183E] hover:bg-[#00183E]/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
              <p className="text-gray-500">Escolha uma conversa da lista para começar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
