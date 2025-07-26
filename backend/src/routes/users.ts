import type { FastifyInstance } from "fastify"

export async function userRoutes(fastify: FastifyInstance) {
  // Get users
  fastify.get("/", async (request, reply) => {
    const users = await fastify.prisma.user.findMany({
      include: {
        queues: {
          include: { queue: true },
        },
        _count: {
          select: {
            conversations: {
              where: { status: "ATTENDING" },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return { users }
  })

  // Create user
  fastify.post("/", async (request, reply) => {
    const { name, email, phone, role = "AGENT" } = request.body as any

    const user = await fastify.prisma.user.create({
      data: {
        name,
        email,
        phone,
        role,
      },
    })

    return { user }
  })

  // Update user
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as any
    const { name, email, phone, role, isActive } = request.body as any

    const user = await fastify.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        role,
        isActive,
      },
    })

    return { user }
  })

  // Get user statistics
  fastify.get("/:id/stats", async (request, reply) => {
    const { id } = request.params as any

    const [attending, resolved, totalMessages] = await Promise.all([
      fastify.prisma.conversation.count({
        where: { userId: id, status: "ATTENDING" },
      }),
      fastify.prisma.conversation.count({
        where: { userId: id, status: "RESOLVED" },
      }),
      fastify.prisma.message.count({
        where: { userId: id, direction: "OUTBOUND" },
      }),
    ])

    return {
      stats: {
        attending,
        resolved,
        totalMessages,
      },
    }
  })
}
