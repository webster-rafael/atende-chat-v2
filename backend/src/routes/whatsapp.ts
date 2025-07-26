import type { FastifyInstance } from "fastify"
import { z } from "zod"
import { WhatsAppService, getActiveWhatsAppConnection } from "../services/whatsapp"

const webhookSchema = z.object({
  object: z.string(),
  entry: z.array(
    z.object({
      id: z.string(),
      changes: z.array(
        z.object({
          value: z.object({
            messaging_product: z.string(),
            metadata: z.object({
              display_phone_number: z.string(),
              phone_number_id: z.string(),
            }),
            contacts: z
              .array(
                z.object({
                  profile: z.object({
                    name: z.string(),
                  }),
                  wa_id: z.string(),
                }),
              )
              .optional(),
            messages: z.array(z.any()).optional(),
            statuses: z.array(z.any()).optional(),
          }),
          field: z.string(),
        }),
      ),
    }),
  ),
})

const sendMessageSchema = z.object({
  to: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(["text", "image", "document"]).default("text"),
  conversationId: z.string().uuid().optional(),
})

const connectionSchema = z.object({
  name: z.string().min(1),
  phoneNumberId: z.string().min(1),
  accessToken: z.string().min(1),
  verifyToken: z.string().min(1),
  webhookUrl: z.string().url().optional(),
})

export async function whatsappRoutes(fastify: FastifyInstance) {
  // Webhook verification (GET)
  fastify.get("/webhook", async (request, reply) => {
    const query = request.query as any
    const mode = query["hub.mode"]
    const token = query["hub.verify_token"]
    const challenge = query["hub.challenge"]

    console.log("Webhook verification request:", { mode, token, challenge })

    if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      console.log("Webhook verified successfully!")
      return challenge
    }

    console.log("Webhook verification failed")
    reply.code(403).send("Forbidden")
  })

  // Webhook for receiving messages (POST)
  fastify.post("/webhook", async (request, reply) => {
    try {
      console.log("Received webhook:", JSON.stringify(request.body, null, 2))

      const webhookData = webhookSchema.parse(request.body)

      if (webhookData.object === "whatsapp_business_account") {
        const whatsappService = await getActiveWhatsAppConnection()
        await whatsappService.processWebhook(webhookData)
      }

      reply.code(200).send("OK")
    } catch (error: any) {
      console.error("Webhook processing error:", error)
      reply.code(500).send({ error: "Internal server error" })
    }
  })

  // Get WhatsApp connections
  fastify.get("/connections", async (request, reply) => {
    try {
      const connections = await fastify.prisma.whatsAppConnection.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          phoneNumberId: true,
          webhookUrl: true,
          isActive: true,
          status: true,
          lastPingAt: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return { connections }
    } catch (error: any) {
      console.error("Error fetching connections:", error)
      reply.code(500).send({ error: "Failed to fetch connections" })
    }
  })

  // Create WhatsApp connection
  fastify.post("/connections", async (request, reply) => {
    try {
      const data = connectionSchema.parse(request.body)

      // Deactivate other connections if this is the first one
      const existingConnections = await fastify.prisma.whatsAppConnection.count()
      const isActive = existingConnections === 0

      const connection = await fastify.prisma.whatsAppConnection.create({
        data: {
          name: data.name,
          phoneNumberId: data.phoneNumberId,
          accessToken: data.accessToken,
          verifyToken: data.verifyToken,
          webhookUrl: data.webhookUrl,
          isActive,
        },
      })

      return { connection }
    } catch (error: any) {
      console.error("Error creating connection:", error)
      reply.code(500).send({ error: "Failed to create connection" })
    }
  })

  // Update WhatsApp connection
  fastify.put("/connections/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const data = connectionSchema.partial().parse(request.body)

      const connection = await fastify.prisma.whatsAppConnection.update({
        where: { id },
        data,
      })

      return { connection }
    } catch (error: any) {
      console.error("Error updating connection:", error)
      reply.code(500).send({ error: "Failed to update connection" })
    }
  })

  // Activate/Deactivate connection
  fastify.patch("/connections/:id/toggle", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const connection = await fastify.prisma.whatsAppConnection.findUnique({
        where: { id },
      })

      if (!connection) {
        return reply.code(404).send({ error: "Connection not found" })
      }

      // If activating, deactivate all others
      if (!connection.isActive) {
        await fastify.prisma.whatsAppConnection.updateMany({
          where: { id: { not: id } },
          data: { isActive: false },
        })
      }

      const updatedConnection = await fastify.prisma.whatsAppConnection.update({
        where: { id },
        data: { isActive: !connection.isActive },
      })

      return { connection: updatedConnection }
    } catch (error: any) {
      console.error("Error toggling connection:", error)
      reply.code(500).send({ error: "Failed to toggle connection" })
    }
  })

  // Delete connection
  fastify.delete("/connections/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      await fastify.prisma.whatsAppConnection.delete({
        where: { id },
      })

      return { success: true }
    } catch (error: any) {
      console.error("Error deleting connection:", error)
      reply.code(500).send({ error: "Failed to delete connection" })
    }
  })

  // Send message
  fastify.post("/send-message", async (request, reply) => {
    try {
      const data = sendMessageSchema.parse(request.body)

      const whatsappService = await getActiveWhatsAppConnection()
      let result

      switch (data.type) {
        case "text":
          result = await whatsappService.sendTextMessage(data.to, data.message)
          break
        case "image":
          result = await whatsappService.sendImageMessage(data.to, data.message)
          break
        case "document":
          result = await whatsappService.sendDocumentMessage(data.to, data.message, "document.pdf")
          break
        default:
          return reply.code(400).send({ error: "Invalid message type" })
      }

      // If conversationId is provided, save the message to database
      if (data.conversationId) {
        await fastify.prisma.message.create({
          data: {
            conversationId: data.conversationId,
            content: data.message,
            messageType: data.type.toUpperCase() as any,
            direction: "OUTBOUND",
            whatsappId: result.messages?.[0]?.id,
            status: "SENT",
            sentAt: new Date(),
          },
        })
      }

      return { success: true, result }
    } catch (error: any) {
      console.error("Error sending message:", error)
      reply.code(500).send({ error: error.message || "Failed to send message" })
    }
  })

  // Test connection
  fastify.post("/test-connection/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const connection = await fastify.prisma.whatsAppConnection.findUnique({
        where: { id },
      })

      if (!connection) {
        return reply.code(404).send({ error: "Connection not found" })
      }

      const whatsappService = new WhatsAppService(connection.accessToken, connection.phoneNumberId)

      // Try to send a test message to the business phone number
      const testMessage = "🤖 Teste de conexão WhatsApp Business API - Conexão funcionando!"

      const result = await whatsappService.sendTextMessage(connection.phoneNumberId, testMessage)

      // Update last ping
      await fastify.prisma.whatsAppConnection.update({
        where: { id },
        data: {
          lastPingAt: new Date(),
          status: "CONNECTED",
        },
      })

      return { success: true, result }
    } catch (error: any) {
      console.error("Error testing connection:", error)

      // Update connection status to error
      const { id } = request.params as { id: string }
      await fastify.prisma.whatsAppConnection.update({
        where: { id },
        data: { status: "ERROR" },
      })

      reply.code(500).send({ error: error.message || "Connection test failed" })
    }
  })

  // Get media URL
  fastify.get("/media/:mediaId", async (request, reply) => {
    try {
      const { mediaId } = request.params as { mediaId: string }

      const whatsappService = await getActiveWhatsAppConnection()
      const mediaUrl = await whatsappService.getMediaUrl(mediaId)

      return { mediaUrl }
    } catch (error: any) {
      console.error("Error getting media URL:", error)
      reply.code(500).send({ error: "Failed to get media URL" })
    }
  })
}
