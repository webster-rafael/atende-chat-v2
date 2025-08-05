import type { FastifyInstance } from "fastify"
import { z } from "zod"

const createQueueSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).default("#3B82F6"),
  isActive: z.boolean().default(true),
  autoAssign: z.boolean().default(false),
  maxConversations: z.number().int().min(1).default(5),
  greetingMessage: z.string().optional(),
})

const updateQueueSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  isActive: z.boolean().optional(),
  autoAssign: z.boolean().optional(),
  maxConversations: z.number().int().min(1).optional(),
  greetingMessage: z.string().optional(),
})

export async function queueRoutes(fastify: FastifyInstance) {
  // Get queues
  fastify.get("/", async (request, reply) => {
    const { page = 1, limit = 20, isActive } = request.query as any

    const where: any = {}
    if (isActive !== undefined) where.isActive = isActive === "true"

    const queues = await fastify.prisma.queue.findMany({
      where,
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
              },
            },
          },
        },
        _count: {
          select: {
            conversations: true,
            users: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await fastify.prisma.queue.count({ where })

    return {
      queues,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  })

  // Get queue by ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as any

    const queue = await fastify.prisma.queue.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
              },
            },
          },
        },
        conversations: {
          include: {
            contact: true,
            user: true,
          },
          orderBy: { lastMessageAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            conversations: true,
            users: true,
          },
        },
      },
    })

    if (!queue) {
      return reply.code(404).send({ error: "Queue not found" })
    }

    return { queue }
  })

  // Create queue
  fastify.post("/", async (request, reply) => {
    try {
      const data = createQueueSchema.parse(request.body)

      const queue = await fastify.prisma.queue.create({
        data,
        include: {
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  isActive: true,
                },
              },
            },
          },
          _count: {
            select: {
              conversations: true,
              users: true,
            },
          },
        },
      })

      return { queue }
    } catch (error: any) {
      if (error.code === "P2002") {
        return reply.code(400).send({ error: "Queue name already exists" })
      }
      throw error
    }
  })

  // Update queue
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as any
    const data = updateQueueSchema.parse(request.body)

    try {
      const queue = await fastify.prisma.queue.update({
        where: { id },
        data,
        include: {
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  isActive: true,
                },
              },
            },
          },
          _count: {
            select: {
              conversations: true,
              users: true,
            },
          },
        },
      })

      return { queue }
    } catch (error: any) {
      if (error.code === "P2002") {
        return reply.code(400).send({ error: "Queue name already exists" })
      }
      if (error.code === "P2025") {
        return reply.code(404).send({ error: "Queue not found" })
      }
      throw error
    }
  })

  // Delete queue
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as any

    try {
      // Check if queue has active conversations
      const activeConversations = await fastify.prisma.conversation.count({
        where: {
          queueId: id,
          status: { in: ["WAITING", "ATTENDING"] },
        },
      })

      if (activeConversations > 0) {
        return reply.code(400).send({
          error: `Cannot delete queue with ${activeConversations} active conversations`,
        })
      }

      await fastify.prisma.queue.delete({
        where: { id },
      })

      return { success: true }
    } catch (error: any) {
      if (error.code === "P2025") {
        return reply.code(404).send({ error: "Queue not found" })
      }
      throw error
    }
  })

  // Assign users to queue
  fastify.post("/:id/users", async (request, reply) => {
    const { id } = request.params as any
    const { userIds } = request.body as any

    if (!Array.isArray(userIds)) {
      return reply.code(400).send({ error: "userIds must be an array" })
    }

    // Remove existing user assignments
    await fastify.prisma.queueUser.deleteMany({
      where: { queueId: id },
    })

    // Add new user assignments
    if (userIds.length > 0) {
      await fastify.prisma.queueUser.createMany({
        data: userIds.map((userId: string) => ({
          queueId: id,
          userId,
        })),
        skipDuplicates: true,
      })
    }

    const queue = await fastify.prisma.queue.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
              },
            },
          },
        },
      },
    })

    return { queue }
  })

  // Get queue statistics
  fastify.get("/:id/stats", async (request, reply) => {
    const { id } = request.params as any
    const { startDate, endDate } = request.query as any

    const where: any = { queueId: id }
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const [waiting, attending, resolved, closed, totalMessages] = await Promise.all([
      fastify.prisma.conversation.count({
        where: { ...where, status: "WAITING" },
      }),
      fastify.prisma.conversation.count({
        where: { ...where, status: "ATTENDING" },
      }),
      fastify.prisma.conversation.count({
        where: { ...where, status: "RESOLVED" },
      }),
      fastify.prisma.conversation.count({
        where: { ...where, status: "CLOSED" },
      }),
      fastify.prisma.message.count({
        where: {
          conversation: where,
        },
      }),
    ])

    return {
      stats: {
        waiting,
        attending,
        resolved,
        closed,
        total: waiting + attending + resolved + closed,
        totalMessages,
      },
    }
  })

  // Auto-assign conversation to available agent
  fastify.post("/:id/auto-assign", async (request, reply) => {
    const { id } = request.params as any
    const { conversationId } = request.body as any

    if (!conversationId) {
      return reply.code(400).send({ error: "conversationId is required" })
    }

    // Get queue with users
    const queue = await fastify.prisma.queue.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: true,
          },
          where: {
            user: {
              isActive: true,
            },
          },
        },
      },
    })

    if (!queue || !queue.autoAssign) {
      return reply.code(400).send({ error: "Queue not found or auto-assign disabled" })
    }

    // Find user with least active conversations
    let selectedUser = null
    let minConversations = Infinity

    for (const queueUser of queue.users) {
      const activeConversations = await fastify.prisma.conversation.count({
        where: {
          userId: queueUser.user.id,
          status: "ATTENDING",
        },
      })

      if (activeConversations < queue.maxConversations && activeConversations < minConversations) {
        minConversations = activeConversations
        selectedUser = queueUser.user
      }
    }

    if (!selectedUser) {
      return reply.code(400).send({ error: "No available agents in queue" })
    }

    // Assign conversation
    const conversation = await fastify.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        userId: selectedUser.id,
        status: "ATTENDING",
      },
      include: {
        contact: true,
        user: true,
        queue: true,
      },
    })

    return { conversation, assignedUser: selectedUser }
  })

  // Add user to queue
  fastify.post("/:id/users", async (request, reply) => {
    try {
      const { id } = request.params as any
      const { userId } = request.body as any

      const queueUser = await fastify.prisma.queueUser.create({
        data: {
          queueId: id,
          userId,
        },
      })

      reply.send({ queueUser })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: "Failed to add user to queue" })
    }
  })

  // Remove user from queue
  fastify.delete("/:id/users/:userId", async (request, reply) => {
    try {
      const { id, userId } = request.params as any

      await fastify.prisma.queueUser.deleteMany({
        where: {
          queueId: id,
          userId,
        },
      })

      reply.send({ success: true })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: "Failed to remove user from queue" })
    }
  })
}
