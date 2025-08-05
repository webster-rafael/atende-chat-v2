import { type NextRequest, NextResponse } from "next/server"
import { registerSchema } from "@/lib/validations/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados com Zod
    const validatedData = registerSchema.parse(body)

    // Simular processamento
    console.log("Dados de cadastro recebidos:", {
      companyName: validatedData.companyName,
      email: validatedData.email,
      phone: validatedData.phone,
      planId: validatedData.planId,
    })

    // Simular delay de processamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simular verificação de email único
    if (validatedData.email === "admin@milliontech.com") {
      return NextResponse.json({ error: "Este email já está em uso" }, { status: 400 })
    }

    // Resposta de sucesso
    return NextResponse.json({
      success: true,
      message: "Cadastro realizado com sucesso!",
      user: {
        id: Math.random().toString(36).substr(2, 9),
        companyName: validatedData.companyName,
        email: validatedData.email,
        phone: validatedData.phone,
        planId: validatedData.planId,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Erro no cadastro:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos", details: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
