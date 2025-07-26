import type { SocketStream } from "@fastify/websocket"
import type { FastifyRequest } from "fastify"

interface WebSocketClient {
  socket: SocketStream
  userId?: string
  conversationId?: string
}

const clients = new Map<string, WebSocketClient>()

export async function websocketHandler(connection: SocketStream, request: FastifyRequest) {
  const clientId = generateClientId()

  clients.set(clientId, { socket: connection })

  console.log(`WebSocket client connected: ${clientId}`)

  connection.socket.on("message", async (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString())
      await handleMessage(clientId, data, request)
    } catch (error) {
      console.error("Error handling WebSocket message:", error)
    }
  })

  connection.socket.on("close", () => {
    clients.delete(clientId)
    console.log(`WebSocket client disconnected: ${clientId}`)
  })

  // Send welcome message
  connection.socket.send(
    JSON.stringify({
      type: "connected",
      clientId,
      timestamp: new Date().toISOString(),
    }),
  )
}

async function handleMessage(clientId: string, data: any, request: FastifyRequest) {
  const client = clients.get(clientId)
  if (!client) return

  switch (data.type) {
    case "join_conversation":
      client.conversationId = data.conversationId
      client.userId = data.userId
      break

    case "typing":
      broadcastToConversation(
        data.conversationId,
        {
          type: "user_typing",
          userId: data.userId,
          conversationId: data.conversationId,
          timestamp: new Date().toISOString(),
        },
        clientId,
      )
      break

    case "stop_typing":
      broadcastToConversation(
        data.conversationId,
        {
          type: "user_stop_typing",
          userId: data.userId,
          conversationId: data.conversationId,
          timestamp: new Date().toISOString(),
        },
        clientId,
      )
      break

    case "ping":
      client.socket.send(
        JSON.stringify({
          type: "pong",
          timestamp: new Date().toISOString(),
        }),
      )
      break
  }
}

export function broadcastToConversation(conversationId: string, message: any, excludeClientId?: string) {
  clients.forEach((client, clientId) => {
    if (client.conversationId === conversationId && clientId !== excludeClientId && client.socket.readyState === 1) {
      client.socket.send(JSON.stringify(message))
    }
  })
}

export function broadcastToAll(message: any) {
  clients.forEach((client) => {
    if (client.socket.readyState === 1) {
      client.socket.send(JSON.stringify(message))
    }
  })
}

export function broadcastNewMessage(message: any) {
  broadcastToConversation(message.conversationId, {
    type: "new_message",
    message,
    timestamp: new Date().toISOString(),
  })
}

export function broadcastConversationUpdate(conversation: any) {
  broadcastToAll({
    type: "conversation_updated",
    conversation,
    timestamp: new Date().toISOString(),
  })
}

function generateClientId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
