import type { FastifyInstance } from "fastify"
import { WhatsAppService, WhatsAppWebhookData } from "../services/whatsapp"
import { z } from "zod"

const sendMessageSchema = z.object({
  to: z.string().min(10),
  message: z.string().min(1),
  type: z.enum(["text", "image", "document", "audio", "video"]).default("text"),
  mediaUrl: z.string().optional(),
  filename: z.string().optional(),
  caption: z.string().optional(),
})

const webhookVerifySchema = z.object({
  "hub.mode": z.string(),
  "hub.verify_token": z.string(),
  "hub.challenge": z.string(),
})

export async function whatsappRoutes(fastify: FastifyInstance) {
  // Webhook verification (GET)
  fastify.get("/webhook", async (request, reply) => {
    try {
      const query = webhookVerifySchema.parse(request.query)
      
      const mode = query["hub.mode"]
      const token = query["hub.verify_token"]
      const challenge = query["hub.challenge"]

      if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
        console.log("Webhook verified successfully")
        return reply.code(200).send(challenge)
      } else {
        console.log("Webhook verification failed")
        return reply.code(403).send("Forbidden")
      }
    } catch (error) {
      console.error("Webhook verification error:", error)
      return reply.code(400).send("Bad Request")
    }
  })

  // Webhook receiver (POST)
  fastify.post("/webhook", async (request, reply) => {
    try {
      const webhookData = request.body as WhatsAppWebhookData
      
      console.log("Received webhook:", JSON.stringify(webhookData, null, 2))

      // Get active WhatsApp connection
      const connection = await fastify.prisma.whatsAppConnection.findFirst({
        where: { isActive: true },
      })

      if (!connection) {
        console.error("No active WhatsApp connection found")
        return reply.code(500).send("No active connection")
      }

      const whatsappService = new WhatsAppService(connection.accessToken, connection.phoneNumberId)
      await whatsappService.processWebhook(webhookData)

      return reply.code(200).send("OK")
    } catch (error) {
      console.error("Webhook processing error:", error)
      return reply.code(500).send("Internal Server Error")
    }
  })

  // Send message
  fastify.post("/send-message", async (request, reply) => {
    try {
      const { to, message, type, mediaUrl, filename, caption } = sendMessageSchema.parse(request.body)

      // Get active WhatsApp connection
      const connection = await fastify.prisma.whatsAppConnection.findFirst({
        where: { isActive: true },
      })

      if (!connection) {
        return reply.code(404).send({ error: "No active WhatsApp connection found" })
      }

      const whatsappService = new WhatsAppService(connection.accessToken, connection.phoneNumberId)
      let result

      switch (type) {
        case "text":
          result = await whatsappService.sendTextMessage(to, message)
          break
        case "image":
          if (!mediaUrl) {
            return reply.code(400).send({ error: "mediaUrl is required for image messages" })
          }
          result = await whatsappService.sendImageMessage(to, mediaUrl, caption)
          break
        case "document":
          if (!mediaUrl || !filename) {
            return reply.code(400).send({ error: "mediaUrl and filename are required for document messages" })
          }
          result = await whatsappService.sendDocumentMessage(to, mediaUrl, filename, caption)
          break
        default:
          return reply.code(400).send({ error: "Unsupported message type" })
      }

      // Find or create contact
      let contact = await fastify.prisma.contact.findUnique({
        where: { phone: to },
      })

      if (!contact) {
        contact = await fastify.prisma.contact.create({
          data: {
            name: `Contato ${to}`,
            phone: to,
          },
        })
      }

      // Find or create conversation
      let conversation = await fastify.prisma.conversation.findFirst({
        where: {
          contactId: contact.id,
          status: { in: ["WAITING", "ATTENDING"] },
        },
      })

      if (!conversation) {
        const queue = await fastify.prisma.queue.findFirst({
          where: { isActive: true },
        })

        conversation = await fastify.prisma.conversation.create({
          data: {
            contactId: contact.id,
            queueId: queue?.id,
            status: "WAITING",
            priority: "MEDIUM",
            lastMessageAt: new Date(),
          },
        })
      }

      // Save message to database
      await fastify.prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: message,
          messageType: type.toUpperCase() as any,
          direction: "OUTBOUND",
          whatsappId: result.messages?.[0]?.id,
          status: "SENT",
          mediaUrl,
          sentAt: new Date(),
        },
      })

      return { success: true, result }
    } catch (error: any) {
      console.error("Send message error:", error)
      return reply.code(500).send({ error: error.message })
    }
  })

  // Get connections
  fastify.get("/connections", async (request, reply) => {
    const connections = await fastify.prisma.whatsAppConnection.findMany({
      orderBy: { createdAt: "desc" },
    })

    return { connections }
  })

  // Create connection
  fastify.post("/connections", async (request, reply) => {
    const { name, phoneNumberId, accessToken, verifyToken, webhookUrl } = request.body as any

    const connection = await fastify.prisma.whatsAppConnection.create({
      data: {
        name,
        phoneNumberId,
        accessToken,
        verifyToken,
        webhookUrl,
        isActive: true,
      },
    })

    return { connection }
  })

  // Update connection
  fastify.put("/connections/:id", async (request, reply) => {
    const { id } = request.params as any
    const { name, phoneNumberId, accessToken, verifyToken, webhookUrl, isActive } = request.body as any

    const connection = await fastify.prisma.whatsAppConnection.update({
      where: { id },
      data: {
        name,
        phoneNumberId,
        accessToken,
        verifyToken,
        webhookUrl,
        isActive,
        updatedAt: new Date(),
      },
    })

    return { connection }
  })

  // Delete connection
  fastify.delete("/connections/:id", async (request, reply) => {
    const { id } = request.params as any

    await fastify.prisma.whatsAppConnection.delete({
      where: { id },
    })

    return { success: true }
  })

  // Test connection
  fastify.post("/test-connection/:id", async (request, reply) => {
    try {
      const { id } = request.params as any

      const connection = await fastify.prisma.whatsAppConnection.findUnique({
        where: { id },
      })

      if (!connection) {
        return reply.code(404).send({ error: "Connection not found" })
      }

      const whatsappService = new WhatsAppService(connection.accessToken, connection.phoneNumberId)
      
      // Test by sending a test message to the business phone number
      const testResult = await whatsappService.sendTextMessage(
        connection.phoneNumberId,
        "🧪 Teste de conexão - Sistema WhatsApp ERP funcionando!"
      )

      // Update last ping
      await fastify.prisma.whatsAppConnection.update({
        where: { id },
        data: { lastSyncAt: new Date() },
      })

      return { success: true, result: testResult }
    } catch (error: any) {
      console.error("Test connection error:", error)
      return reply.code(500).send({ error: error.message })
    }
  })

  // Get media
  fastify.get("/media/:id", async (request, reply) => {
    try {
      const { id } = request.params as any

      const connection = await fastify.prisma.whatsAppConnection.findFirst({
        where: { isActive: true },
      })

      if (!connection) {
        return reply.code(404).send({ error: "No active connection found" })
      }

      const whatsappService = new WhatsAppService(connection.accessToken, connection.phoneNumberId)
      const mediaUrl = await whatsappService.getMediaUrl(id)
      const mediaBuffer = await whatsappService.downloadMedia(mediaUrl)

      reply.type("application/octet-stream")
      return reply.send(mediaBuffer)
    } catch (error: any) {
      console.error("Get media error:", error)
      return reply.code(500).send({ error: error.message })
    }
  })

  // Webhook status
  fastify.get("/webhook-status", async (request, reply) => {
    const connections = await fastify.prisma.whatsAppConnection.findMany({
      where: { isActive: true },
    })

    const status = connections.map(conn => ({
      id: conn.id,
      name: conn.name,
      phoneNumberId: conn.phoneNumberId,
      webhookUrl: conn.webhookUrl,
      lastSyncAt: conn.lastSyncAt,
      isActive: conn.isActive,
    }))

    return { status }
  })
}
