import type { FastifyInstance } from "fastify"

export async function conversationRoutes(fastify: FastifyInstance) {
  // Get conversations
  fastify.get("/", async (request, reply) => {
    const { status, queueId, page = 1, limit = 20 } = request.query as any

    const where: any = {}
    if (status) where.status = status
    if (queueId) where.queueId = queueId

    const conversations = await fastify.prisma.conversation.findMany({
      where,
      include: {
        contact: true,
        user: true,
        queue: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: { isRead: false, direction: "INBOUND" },
            },
          },
        },
      },
      orderBy: { lastMessageAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await fastify.prisma.conversation.count({ where })

    return {
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  })

  // Get conversation by ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as any

    const conversation = await fastify.prisma.conversation.findUnique({
      where: { id },
      include: {
        contact: true,
        user: true,
        queue: true,
        messages: {
          include: { user: true },
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!conversation) {
      return reply.code(404).send({ error: "Conversation not found" })
    }

    return { conversation }
  })

  // Assign conversation to user
  fastify.post("/:id/assign", async (request, reply) => {
    const { id } = request.params as any
    const { userId } = request.body as any

    const conversation = await fastify.prisma.conversation.update({
      where: { id },
      data: {
        userId,
        status: "ATTENDING",
      },
      include: {
        contact: true,
        user: true,
        queue: true,
      },
    })

    return { conversation }
  })

  // Update conversation status
  fastify.patch("/:id/status", async (request, reply) => {
    const { id } = request.params as any
    const { status } = request.body as any

    const updateData: any = { status }
    if (status === "CLOSED" || status === "RESOLVED") {
      updateData.closedAt = new Date()
    }

    const conversation = await fastify.prisma.conversation.update({
      where: { id },
      data: updateData,
      include: {
        contact: true,
        user: true,
        queue: true,
      },
    })

    return { conversation }
  })

  // Get conversation statistics
  fastify.get("/stats/overview", async (request, reply) => {
    const [waiting, attending, resolved, total] = await Promise.all([
      fastify.prisma.conversation.count({ where: { status: "WAITING" } }),
      fastify.prisma.conversation.count({ where: { status: "ATTENDING" } }),
      fastify.prisma.conversation.count({ where: { status: "RESOLVED" } }),
      fastify.prisma.conversation.count(),
    ])

    return {
      stats: {
        waiting,
        attending,
        resolved,
        total,
      },
    }
  })
}
