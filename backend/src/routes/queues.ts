import type { FastifyInstance } from "fastify"

export async function queueRoutes(fastify: FastifyInstance) {
  // Get queues
  fastify.get("/", async (request, reply) => {
    try {
      const queues = await fastify.prisma.queue.findMany({
        include: {
          users: {
            include: { user: true },
          },
          _count: {
            select: {
              conversations: {
                where: { status: { in: ["WAITING", "ATTENDING"] } },
              },
            },
          },
        },
        orderBy: { priority: "desc" },
      })

      reply.send({ queues })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: "Failed to fetch queues" })
    }
  })

  // Create queue
  fastify.post("/", async (request, reply) => {
    try {
      const { name, description, color, priority = 0 } = request.body as any

      const queue = await fastify.prisma.queue.create({
        data: {
          name,
          description,
          color,
          priority,
        },
      })

      reply.send({ queue })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: "Failed to create queue" })
    }
  })

  // Update queue
  fastify.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as any
      const { name, description, color, priority, isActive } = request.body as any

      const queue = await fastify.prisma.queue.update({
        where: { id },
        data: {
          name,
          description,
          color,
          priority,
          isActive,
        },
      })

      reply.send({ queue })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: "Failed to update queue" })
    }
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
