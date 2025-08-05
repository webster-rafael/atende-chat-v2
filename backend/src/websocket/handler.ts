import type { SocketStream } from "@fastify/websocket"
import type { FastifyRequest } from "fastify"

interface WebSocketClient {
  id: string
  userId?: string
  role?: string
  socket: SocketStream
  lastPing: Date
}

const clients = new Map<string, WebSocketClient>()

export async function websocketHandler(connection: SocketStream, request: FastifyRequest) {
  const clientId = generateClientId()
  
  console.log(`WebSocket client connected: ${clientId}`)

  const client: WebSocketClient = {
    id: clientId,
    socket: connection,
    lastPing: new Date(),
  }

  clients.set(clientId, client)

  // Send welcome message
  connection.socket.send(JSON.stringify({
    type: "connected",
    clientId,
    timestamp: new Date().toISOString(),
  }))

  // Handle incoming messages
  connection.socket.on("message", async (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString())
      await handleWebSocketMessage(client, message)
    } catch (error) {
      console.error("WebSocket message error:", error)
      connection.socket.send(JSON.stringify({
        type: "error",
        message: "Invalid message format",
      }))
    }
  })

  // Handle client disconnect
  connection.socket.on("close", () => {
    console.log(`WebSocket client disconnected: ${clientId}`)
    clients.delete(clientId)
  })

  // Handle errors
  connection.socket.on("error", (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error)
    clients.delete(clientId)
  })

  // Ping interval to keep connection alive
  const pingInterval = setInterval(() => {
    if (clients.has(clientId)) {
      connection.socket.send(JSON.stringify({
        type: "ping",
        timestamp: new Date().toISOString(),
      }))
    } else {
      clearInterval(pingInterval)
    }
  }, 30000) // 30 seconds
}

async function handleWebSocketMessage(client: WebSocketClient, message: any) {
  const { type, data } = message

  switch (type) {
    case "auth":
      await handleAuth(client, data)
      break

    case "pong":
      client.lastPing = new Date()
      break

    case "join_conversation":
      await handleJoinConversation(client, data)
      break

    case "leave_conversation":
      await handleLeaveConversation(client, data)
      break

    case "typing":
      await handleTyping(client, data)
      break

    case "message_read":
      await handleMessageRead(client, data)
      break

    default:
      client.socket.send(JSON.stringify({
        type: "error",
        message: `Unknown message type: ${type}`,
      }))
  }
}

async function handleAuth(client: WebSocketClient, data: any) {
  try {
    const { token } = data

    if (!token) {
      client.socket.send(JSON.stringify({
        type: "auth_error",
        message: "Token is required",
      }))
      return
    }

    // Here you would verify the JWT token
    // For now, we'll simulate authentication
    client.userId = "user-123" // Extract from token
    client.role = "AGENT" // Extract from token

    client.socket.send(JSON.stringify({
      type: "auth_success",
      userId: client.userId,
      role: client.role,
    }))

    console.log(`Client ${client.id} authenticated as user ${client.userId}`)
  } catch (error) {
    client.socket.send(JSON.stringify({
      type: "auth_error",
      message: "Invalid token",
    }))
  }
}

async function handleJoinConversation(client: WebSocketClient, data: any) {
  const { conversationId } = data

  if (!conversationId) {
    client.socket.send(JSON.stringify({
      type: "error",
      message: "conversationId is required",
    }))
    return
  }

  // Add client to conversation room (in a real implementation, you'd use Redis or similar)
  client.socket.send(JSON.stringify({
    type: "joined_conversation",
    conversationId,
  }))

  // Notify other clients in the conversation
  broadcastToConversation(conversationId, {
    type: "user_joined",
    userId: client.userId,
    conversationId,
  }, client.id)

  console.log(`Client ${client.id} joined conversation ${conversationId}`)
}

async function handleLeaveConversation(client: WebSocketClient, data: any) {
  const { conversationId } = data

  if (!conversationId) {
    client.socket.send(JSON.stringify({
      type: "error",
      message: "conversationId is required",
    }))
    return
  }

  client.socket.send(JSON.stringify({
    type: "left_conversation",
    conversationId,
  }))

  // Notify other clients in the conversation
  broadcastToConversation(conversationId, {
    type: "user_left",
    userId: client.userId,
    conversationId,
  }, client.id)

  console.log(`Client ${client.id} left conversation ${conversationId}`)
}

async function handleTyping(client: WebSocketClient, data: any) {
  const { conversationId, isTyping } = data

  if (!conversationId) {
    client.socket.send(JSON.stringify({
      type: "error",
      message: "conversationId is required",
    }))
    return
  }

  // Broadcast typing status to other clients in the conversation
  broadcastToConversation(conversationId, {
    type: "typing",
    userId: client.userId,
    conversationId,
    isTyping,
  }, client.id)
}

async function handleMessageRead(client: WebSocketClient, data: any) {
  const { conversationId, messageId } = data

  if (!conversationId || !messageId) {
    client.socket.send(JSON.stringify({
      type: "error",
      message: "conversationId and messageId are required",
    }))
    return
  }

  // Broadcast message read status
  broadcastToConversation(conversationId, {
    type: "message_read",
    userId: client.userId,
    conversationId,
    messageId,
  }, client.id)
}

function broadcastToConversation(conversationId: string, message: any, excludeClientId?: string) {
  const messageStr = JSON.stringify({
    ...message,
    timestamp: new Date().toISOString(),
  })

  for (const [clientId, client] of clients) {
    if (clientId !== excludeClientId && client.socket.readyState === 1) {
      // In a real implementation, you'd check if the client is in the conversation
      client.socket.send(messageStr)
    }
  }
}

export function broadcastNewMessage(conversationId: string, message: any) {
  broadcastToConversation(conversationId, {
    type: "new_message",
    conversationId,
    message,
  })
}

export function broadcastConversationUpdate(conversationId: string, conversation: any) {
  broadcastToConversation(conversationId, {
    type: "conversation_updated",
    conversationId,
    conversation,
  })
}

export function broadcastUserStatusChange(userId: string, status: string) {
  const messageStr = JSON.stringify({
    type: "user_status_changed",
    userId,
    status,
    timestamp: new Date().toISOString(),
  })

  for (const [clientId, client] of clients) {
    if (client.socket.readyState === 1) {
      client.socket.send(messageStr)
    }
  }
}

function generateClientId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Cleanup inactive clients
setInterval(() => {
  const now = new Date()
  const timeout = 5 * 60 * 1000 // 5 minutes

  for (const [clientId, client] of clients) {
    if (now.getTime() - client.lastPing.getTime() > timeout) {
      console.log(`Removing inactive client: ${clientId}`)
      client.socket.close()
      clients.delete(clientId)
    }
  }
}, 60000) // Check every minute
