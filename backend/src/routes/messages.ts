import type { FastifyInstance } from "fastify"
import { WhatsAppService } from "../services/whatsapp"

export async function messageRoutes(fastify: FastifyInstance) {
  // Send message
  fastify.post("/send", async (request, reply) => {
    const { conversationId, content, userId, messageType = "TEXT" } = request.body as any

    try {
      // Get conversation with contact
      const conversation = await fastify.prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { contact: true },
      })

      if (!conversation) {
        return reply.code(404).send({ error: "Conversation not found" })
      }

      // Get WhatsApp connection (assuming first active connection for now)
      const connection = await fastify.prisma.whatsAppConnection.findFirst({
        where: { isActive: true },
      })

      if (!connection) {
        return reply.code(404).send({ error: "No active WhatsApp connection found" })
      }

      // Send via WhatsApp
      const whatsapp = new WhatsAppService(connection.accessToken, connection.phoneNumberId)
      const whatsappResult = await whatsapp.sendTextMessage(conversation.contact.phone, content)

      // Save message to database
      const message = await fastify.prisma.message.create({
        data: {
          conversationId,
          userId,
          content,
          messageType,
          direction: "OUTBOUND",
          whatsappId: whatsappResult.messages?.[0]?.id,
          status: "SENT",
          sentAt: new Date(),
        },
        include: { user: true },
      })

      // Update conversation
      await fastify.prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      })

      return { message }
    } catch (error: any) {
      console.error("Error sending message:", error)
      return reply.code(500).send({ error: error.message })
    }
  })

  // Get messages for conversation
  fastify.get("/conversation/:conversationId", async (request, reply) => {
    const { conversationId } = request.params as any
    const { page = 1, limit = 50 } = request.query as any

    const messages = await fastify.prisma.message.findMany({
      where: { conversationId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await fastify.prisma.message.count({
      where: { conversationId },
    })

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  })

  // Mark messages as read
  fastify.post("/mark-read", async (request, reply) => {
    const { conversationId, userId } = request.body as any

    await fastify.prisma.message.updateMany({
      where: {
        conversationId,
        direction: "INBOUND",
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return { success: true }
  })
}
