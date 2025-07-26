import Fastify from "fastify"
import cors from "@fastify/cors"
import websocket from "@fastify/websocket"
import { PrismaClient } from "@prisma/client"
import { whatsappRoutes } from "./routes/whatsapp"
import { conversationRoutes } from "./routes/conversations"
import { messageRoutes } from "./routes/messages"
import { contactRoutes } from "./routes/contacts"
import { userRoutes } from "./routes/users"
import { queueRoutes } from "./routes/queues"
import { websocketHandler } from "./websocket/handler"

const prisma = new PrismaClient()
const fastify = Fastify({
  logger: true,
})

// Register plugins
fastify.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
})

fastify.register(websocket)

// Add prisma to fastify instance
fastify.decorate("prisma", prisma)

// Register routes
fastify.register(whatsappRoutes, { prefix: "/api/whatsapp" })
fastify.register(conversationRoutes, { prefix: "/api/conversations" })
fastify.register(messageRoutes, { prefix: "/api/messages" })
fastify.register(contactRoutes, { prefix: "/api/contacts" })
fastify.register(userRoutes, { prefix: "/api/users" })
fastify.register(queueRoutes, { prefix: "/api/queues" })

// WebSocket route
fastify.register(async (fastify) => {
  fastify.get("/ws", { websocket: true }, websocketHandler)
})

// Health check
fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() }
})

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3333, host: "0.0.0.0" })
    console.log("🚀 Server running on http://localhost:3333")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect()
  await fastify.close()
  process.exit(0)
})
