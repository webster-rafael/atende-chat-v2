import type { FastifyInstance } from "fastify"

export async function contactRoutes(fastify: FastifyInstance) {
  // Get contacts
  fastify.get("/", async (request, reply) => {
    const { search, page = 1, limit = 20 } = request.query as any

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    const contacts = await fastify.prisma.contact.findMany({
      where,
      include: {
        conversations: {
          orderBy: { lastMessageAt: "desc" },
          take: 1,
        },
        _count: {
          select: { conversations: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await fastify.prisma.contact.count({ where })

    return {
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  })

  // Get contact by ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as any

    const contact = await fastify.prisma.contact.findUnique({
      where: { id },
      include: {
        conversations: {
          include: {
            user: true,
            queue: true,
            _count: {
              select: { messages: true },
            },
          },
          orderBy: { lastMessageAt: "desc" },
        },
      },
    })

    if (!contact) {
      return reply.code(404).send({ error: "Contact not found" })
    }

    return { contact }
  })

  // Update contact
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as any
    const { name, email, notes, tags } = request.body as any

    const contact = await fastify.prisma.contact.update({
      where: { id },
      data: {
        name,
        email,
        notes,
        tags,
      },
    })

    return { contact }
  })

  // Block/unblock contact
  fastify.patch("/:id/block", async (request, reply) => {
    const { id } = request.params as any
    const { isBlocked } = request.body as any

    const contact = await fastify.prisma.contact.update({
      where: { id },
      data: { isBlocked },
    })

    return { contact }
  })
}
