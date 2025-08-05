import type { FastifyInstance } from "fastify"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "SUPERVISOR", "AGENT"]).default("AGENT"),
  phone: z.string().optional(),
})

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "SUPERVISOR", "AGENT"]).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function userRoutes(fastify: FastifyInstance) {
  // Get users
  fastify.get("/", async (request, reply) => {
    const { page = 1, limit = 20, role, search } = request.query as any

    const where: any = {}
    if (role) where.role = role
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    const users = await fastify.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            conversations: true,
            messages: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await fastify.prisma.user.count({ where })

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  })

  // Get user by ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as any

    const user = await fastify.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        queues: {
          include: {
            queue: true,
          },
        },
        conversations: {
          include: {
            contact: true,
            queue: true,
          },
          orderBy: { lastMessageAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            conversations: true,
            messages: true,
          },
        },
      },
    })

    if (!user) {
      return reply.code(404).send({ error: "User not found" })
    }

    return { user }
  })

  // Create user
  fastify.post("/", async (request, reply) => {
    try {
      const { name, email, password, role, phone } = createUserSchema.parse(request.body)

      // Check if email already exists
      const existingUser = await fastify.prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return reply.code(400).send({ error: "Email already exists" })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await fastify.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          phone,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      })

      return { user }
    } catch (error: any) {
      if (error.code === "P2002") {
        return reply.code(400).send({ error: "Email already exists" })
      }
      throw error
    }
  })

  // Update user
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as any
    const data = updateUserSchema.parse(request.body)

    // Check if email already exists (if updating email)
    if (data.email) {
      const existingUser = await fastify.prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: id },
        },
      })

      if (existingUser) {
        return reply.code(400).send({ error: "Email already exists" })
      }
    }

    const user = await fastify.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { user }
  })

  // Delete user
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as any

    await fastify.prisma.user.delete({
      where: { id },
    })

    return { success: true }
  })

  // Login
  fastify.post("/login", async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body)

      const user = await fastify.prisma.user.findUnique({
        where: { email },
      })

      if (!user || !user.isActive) {
        return reply.code(401).send({ error: "Invalid credentials" })
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return reply.code(401).send({ error: "Invalid credentials" })
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      )

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      }
    } catch (error) {
      console.error("Login error:", error)
      return reply.code(500).send({ error: "Internal server error" })
    }
  })

  // Change password
  fastify.post("/:id/change-password", async (request, reply) => {
    const { id } = request.params as any
    const { currentPassword, newPassword } = request.body as any

    if (!currentPassword || !newPassword) {
      return reply.code(400).send({ error: "Current password and new password are required" })
    }

    if (newPassword.length < 6) {
      return reply.code(400).send({ error: "New password must be at least 6 characters" })
    }

    const user = await fastify.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return reply.code(404).send({ error: "User not found" })
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return reply.code(400).send({ error: "Current password is incorrect" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await fastify.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })

    return { success: true }
  })

  // Assign user to queues
  fastify.post("/:id/queues", async (request, reply) => {
    const { id } = request.params as any
    const { queueIds } = request.body as any

    if (!Array.isArray(queueIds)) {
      return reply.code(400).send({ error: "queueIds must be an array" })
    }

    // Remove existing queue assignments
    await fastify.prisma.queueUser.deleteMany({
      where: { userId: id },
    })

    // Add new queue assignments
    if (queueIds.length > 0) {
      await fastify.prisma.queueUser.createMany({
        data: queueIds.map((queueId: string) => ({
          userId: id,
          queueId,
        })),
      })
    }

    const user = await fastify.prisma.user.findUnique({
      where: { id },
      include: {
        queues: {
          include: {
            queue: true,
          },
        },
      },
    })

    return { user }
  })

  // Get user statistics
  fastify.get("/:id/stats", async (request, reply) => {
    const { id } = request.params as any
    const { startDate, endDate } = request.query as any

    const where: any = { userId: id }
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const [totalConversations, activeConversations, totalMessages, avgResponseTime] = await Promise.all([
      fastify.prisma.conversation.count({ where }),
      fastify.prisma.conversation.count({
        where: { ...where, status: "ATTENDING" },
      }),
      fastify.prisma.message.count({
        where: { ...where, direction: "OUTBOUND" },
      }),
      // Calculate average response time (simplified)
      fastify.prisma.message.aggregate({
        where: { ...where, direction: "OUTBOUND" },
        _avg: {
          createdAt: true,
        },
      }),
    ])

    return {
      stats: {
        totalConversations,
        activeConversations,
        totalMessages,
        avgResponseTime: avgResponseTime._avg?.createdAt || 0,
      },
    }
  })
}
