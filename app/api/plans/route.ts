import { NextResponse } from "next/server"

// Dados estáticos dos planos
const plans = [
  {
    id: "1",
    name: "ouro",
    displayName: "Plano Ouro",
    description: "Ideal para pequenas empresas",
    price: 97,
    features: [
      "WhatsApp Business API",
      "Atendimento multiusuário",
      "Chatbot básico",
      "Relatórios essenciais",
      "Suporte por email",
    ],
    maxUsers: 3,
    maxQueues: 2,
    isPopular: false,
    active: true,
  },
  {
    id: "2",
    name: "safira",
    displayName: "Plano Safira",
    description: "Perfeito para empresas em crescimento",
    price: 197,
    features: [
      "Tudo do Plano Ouro",
      "Chatbot avançado com IA",
      "Integração com CRM",
      "Relatórios avançados",
      "Campanhas de marketing",
      "Suporte prioritário",
    ],
    maxUsers: 10,
    maxQueues: 5,
    isPopular: true,
    active: true,
  },
  {
    id: "3",
    name: "diamante",
    displayName: "Plano Diamante",
    description: "Solução completa para grandes empresas",
    price: 397,
    features: [
      "Tudo do Plano Safira",
      "Usuários ilimitados",
      "Filas ilimitadas",
      "API personalizada",
      "Integrações customizadas",
      "Suporte 24/7 dedicado",
      "Treinamento personalizado",
    ],
    maxUsers: 999,
    maxQueues: 999,
    isPopular: false,
    active: true,
  },
]

export async function GET() {
  try {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Filtrar apenas planos ativos
    const activePlans = plans.filter((plan) => plan.active)

    return NextResponse.json({
      success: true,
      data: activePlans,
      total: activePlans.length,
    })
  } catch (error) {
    console.error("Erro ao buscar planos:", error)

    return NextResponse.json({ error: "Erro ao carregar planos" }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 })
}
