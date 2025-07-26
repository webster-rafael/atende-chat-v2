import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Limpar dados existentes
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.queueUser.deleteMany()
  await prisma.whatsAppConnection.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.queue.deleteMany()
  await prisma.user.deleteMany()

  // Criar usuários
  const users = await prisma.user.createMany({
    data: [
      {
        id: "admin-001",
        name: "Administrador",
        email: "admin@whatsapp-erp.com",
        phone: "+5511999999999",
        role: "ADMIN",
      },
      {
        id: "supervisor-001",
        name: "Supervisor Geral",
        email: "supervisor@whatsapp-erp.com",
        phone: "+5511888888888",
        role: "SUPERVISOR",
      },
      {
        id: "agent-001",
        name: "Agente João",
        email: "joao@whatsapp-erp.com",
        phone: "+5511777777777",
        role: "AGENT",
      },
      {
        id: "agent-002",
        name: "Agente Maria",
        email: "maria@whatsapp-erp.com",
        phone: "+5511666666666",
        role: "AGENT",
      },
      {
        id: "agent-003",
        name: "Agente Pedro",
        email: "pedro@whatsapp-erp.com",
        phone: "+5511555555555",
        role: "AGENT",
      },
    ],
  })

  // Criar filas
  const queues = await prisma.queue.createMany({
    data: [
      {
        id: "queue-suporte",
        name: "Suporte Técnico",
        description: "Fila para atendimento de suporte técnico",
        color: "#EF4444",
        priority: 1,
      },
      {
        id: "queue-vendas",
        name: "Vendas",
        description: "Fila para atendimento de vendas",
        color: "#10B981",
        priority: 2,
      },
      {
        id: "queue-financeiro",
        name: "Financeiro",
        description: "Fila para questões financeiras",
        color: "#F59E0B",
        priority: 3,
      },
      {
        id: "queue-geral",
        name: "Atendimento Geral",
        description: "Fila para atendimento geral",
        color: "#3B82F6",
        priority: 4,
      },
    ],
  })

  // Associar usuários às filas
  await prisma.queueUser.createMany({
    data: [
      { userId: "agent-001", queueId: "queue-suporte" },
      { userId: "agent-001", queueId: "queue-geral" },
      { userId: "agent-002", queueId: "queue-vendas" },
      { userId: "agent-002", queueId: "queue-geral" },
      { userId: "agent-003", queueId: "queue-financeiro" },
      { userId: "agent-003", queueId: "queue-geral" },
      { userId: "supervisor-001", queueId: "queue-suporte" },
      { userId: "supervisor-001", queueId: "queue-vendas" },
      { userId: "supervisor-001", queueId: "queue-financeiro" },
      { userId: "supervisor-001", queueId: "queue-geral" },
    ],
  })

  // Criar contatos
  const contacts = await prisma.contact.createMany({
    data: [
      {
        id: "contact-001",
        name: "Cliente João Silva",
        phone: "+5511987654321",
        email: "joao.silva@email.com",
        tags: ["cliente", "vip"],
      },
      {
        id: "contact-002",
        name: "Cliente Maria Santos",
        phone: "+5511876543210",
        email: "maria.santos@email.com",
        tags: ["cliente", "novo"],
      },
      {
        id: "contact-003",
        name: "Prospect Pedro Lima",
        phone: "+5511765432109",
        email: "pedro.lima@email.com",
        tags: ["prospect", "interessado"],
      },
      {
        id: "contact-004",
        name: "Cliente Ana Costa",
        phone: "+5511654321098",
        email: "ana.costa@email.com",
        tags: ["cliente", "recorrente"],
      },
      {
        id: "contact-005",
        name: "Suporte Carlos Oliveira",
        phone: "+5511543210987",
        email: "carlos.oliveira@email.com",
        tags: ["suporte", "urgente"],
      },
    ],
  })

  // Criar conversas
  const conversations = await prisma.conversation.createMany({
    data: [
      {
        id: "conv-001",
        contactId: "contact-001",
        userId: "agent-002",
        queueId: "queue-vendas",
        status: "ATTENDING",
        priority: "HIGH",
        subject: "Interesse em produto premium",
        lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      },
      {
        id: "conv-002",
        contactId: "contact-002",
        userId: "agent-001",
        queueId: "queue-suporte",
        status: "WAITING",
        priority: "MEDIUM",
        subject: "Problema com login",
        lastMessageAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
      },
      {
        id: "conv-003",
        contactId: "contact-003",
        queueId: "queue-geral",
        status: "WAITING",
        priority: "LOW",
        subject: "Dúvidas sobre serviços",
        lastMessageAt: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
      },
      {
        id: "conv-004",
        contactId: "contact-004",
        userId: "agent-003",
        queueId: "queue-financeiro",
        status: "RESOLVED",
        priority: "MEDIUM",
        subject: "Cobrança duplicada",
        lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
        closedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
      },
      {
        id: "conv-005",
        contactId: "contact-005",
        userId: "agent-001",
        queueId: "queue-suporte",
        status: "ATTENDING",
        priority: "URGENT",
        subject: "Sistema fora do ar",
        lastMessageAt: new Date(Date.now() - 5 * 60 * 1000), // 5 min atrás
      },
    ],
  })

  // Criar mensagens
  await prisma.message.createMany({
    data: [
      // Conversa 1
      {
        conversationId: "conv-001",
        content: "Olá! Gostaria de saber mais sobre o produto premium.",
        messageType: "TEXT",
        direction: "INBOUND",
        status: "READ",
        isRead: true,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        conversationId: "conv-001",
        userId: "agent-002",
        content: "Olá! Claro, posso te ajudar. O produto premium oferece recursos avançados...",
        messageType: "TEXT",
        direction: "OUTBOUND",
        status: "DELIVERED",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
      },
      {
        conversationId: "conv-001",
        content: "Interessante! Qual o valor?",
        messageType: "TEXT",
        direction: "INBOUND",
        status: "READ",
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 60 * 1000),
      },
      {
        conversationId: "conv-001",
        userId: "agent-002",
        content: "O valor é R$ 299,90 por mês. Posso fazer uma demonstração?",
        messageType: "TEXT",
        direction: "OUTBOUND",
        status: "READ",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },

      // Conversa 2
      {
        conversationId: "conv-002",
        content: "Não estou conseguindo fazer login no sistema",
        messageType: "TEXT",
        direction: "INBOUND",
        status: "READ",
        isRead: true,
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        conversationId: "conv-002",
        userId: "agent-001",
        content: "Vou te ajudar! Qual mensagem de erro aparece?",
        messageType: "TEXT",
        direction: "OUTBOUND",
        status: "DELIVERED",
        createdAt: new Date(Date.now() - 55 * 60 * 1000),
      },
      {
        conversationId: "conv-002",
        content: 'Aparece "usuário ou senha inválidos"',
        messageType: "TEXT",
        direction: "INBOUND",
        status: "READ",
        isRead: true,
        createdAt: new Date(Date.now() - 50 * 60 * 1000),
      },
      {
        conversationId: "conv-002",
        userId: "agent-001",
        content: "Vou resetar sua senha. Aguarde um momento.",
        messageType: "TEXT",
        direction: "OUTBOUND",
        status: "SENT",
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },

      // Conversa 3
      {
        conversationId: "conv-003",
        content: "Boa tarde! Vocês trabalham com que tipo de serviços?",
        messageType: "TEXT",
        direction: "INBOUND",
        status: "PENDING",
        createdAt: new Date(Date.now() - 20 * 60 * 1000),
      },

      // Conversa 5
      {
        conversationId: "conv-005",
        content: "URGENTE: O sistema está fora do ar!",
        messageType: "TEXT",
        direction: "INBOUND",
        status: "READ",
        isRead: true,
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        conversationId: "conv-005",
        userId: "agent-001",
        content: "Já estamos verificando. Obrigado pelo aviso!",
        messageType: "TEXT",
        direction: "OUTBOUND",
        status: "DELIVERED",
        createdAt: new Date(Date.now() - 8 * 60 * 1000),
      },
      {
        conversationId: "conv-005",
        userId: "agent-001",
        content: "Sistema normalizado. Pode testar novamente.",
        messageType: "TEXT",
        direction: "OUTBOUND",
        status: "SENT",
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
      },
    ],
  })

  // Criar conexão WhatsApp
  await prisma.whatsAppConnection.create({
    data: {
      id: "wa-conn-001",
      name: "WhatsApp Principal",
      phoneNumberId: "1234567890",
      accessToken: "EAAxxxxxxxxxxxxxxx",
      verifyToken: "meu_verify_token_123",
      webhookUrl: "https://seu-dominio.com/api/whatsapp/webhook",
    },
  })

  console.log("✅ Seed concluído com sucesso!")
  console.log(`📊 Criados:`)
  console.log(`   - ${users.count} usuários`)
  console.log(`   - ${queues.count} filas`)
  console.log(`   - ${contacts.count} contatos`)
  console.log(`   - ${conversations.count} conversas`)
  console.log(`   - 12 mensagens`)
  console.log(`   - 1 conexão WhatsApp`)
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
