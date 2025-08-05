# 📱 Configuração da API do WhatsApp Business

Este guia completo mostra como configurar a integração com a API oficial do WhatsApp Business.

## 🎯 Pré-requisitos

### 1. Conta Meta for Developers
- Acesse [developers.facebook.com](https://developers.facebook.com/)
- Crie uma conta de desenvolvedor
- Verifique sua conta (pode levar até 24h)

### 2. Aplicativo WhatsApp Business
- Crie um novo aplicativo
- Adicione o produto "WhatsApp Business API"
- Configure as permissões necessárias

### 3. Número de Telefone
- Número de telefone comercial válido
- Não pode estar registrado no WhatsApp pessoal
- Deve ser capaz de receber SMS para verificação

## 🔧 Configuração Passo a Passo

### Passo 1: Configurar o Aplicativo Meta

1. **Criar Aplicativo:**
   \`\`\`
   - Acesse Meta for Developers
   - Clique em "Criar Aplicativo"
   - Escolha "Empresa" como tipo
   - Preencha os dados da empresa
   \`\`\`

2. **Adicionar WhatsApp Business API:**
   \`\`\`
   - No painel do aplicativo
   - Clique em "Adicionar Produto"
   - Selecione "WhatsApp Business API"
   - Configure as permissões básicas
   \`\`\`

3. **Obter Credenciais:**
   \`\`\`
   - App ID: Encontrado no painel principal
   - App Secret: Em Configurações > Básico
   - Access Token: Em WhatsApp > Introdução
   - Phone Number ID: Em WhatsApp > Introdução
   \`\`\`

### Passo 2: Configurar Webhook

1. **URL do Webhook:**
   \`\`\`
   https://seu-dominio.com/api/whatsapp/webhook
   \`\`\`

2. **Token de Verificação:**
   \`\`\`
   Crie um token secreto único (ex: meu_token_super_secreto_123)
   \`\`\`

3. **Campos de Assinatura:**
   \`\`\`
   ✅ messages
   ✅ message_status
   ✅ message_echoes (opcional)
   \`\`\`

### Passo 3: Configurar Variáveis de Ambiente

\`\`\`bash
# Copie o arquivo de exemplo
cp backend/.env.example backend/.env

# Configure as variáveis
nano backend/.env
\`\`\`

\`\`\`env
# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN="EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
WHATSAPP_PHONE_NUMBER_ID="1234567890123456"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="meu_token_super_secreto_123"
WHATSAPP_API_VERSION="v18.0"
WHATSAPP_API_URL="https://graph.facebook.com"

# Webhook Configuration
WEBHOOK_URL="https://seu-dominio.com/api/whatsapp/webhook"

# Database (Supabase)
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Server
PORT=3333
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
\`\`\`

### Passo 4: Configurar Supabase

1. **Criar Projeto Supabase:**
   \`\`\`
   - Acesse supabase.com
   - Crie um novo projeto
   - Anote a URL e as chaves da API
   \`\`\`

2. **Executar Migrações:**
   \`\`\`bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   npx prisma db seed
   \`\`\`

### Passo 5: Configurar Domínio (Produção)

Para produção, você precisa de um domínio HTTPS válido:

1. **Usando Vercel:**
   \`\`\`bash
   # Deploy automático
   vercel --prod
   
   # URL será: https://seu-app.vercel.app
   \`\`\`

2. **Usando Ngrok (Desenvolvimento):**
   \`\`\`bash
   # Instalar ngrok
   npm install -g ngrok
   
   # Expor porta local
   ngrok http 3333
   
   # URL será: https://abc123.ngrok.io
   \`\`\`

3. **Atualizar Webhook no Meta:**
   \`\`\`
   URL: https://seu-dominio.com/api/whatsapp/webhook
   Token: meu_token_super_secreto_123
   \`\`\`

## 🧪 Testando a Integração

### 1. Verificar Webhook

\`\`\`bash
# Testar verificação do webhook
curl -X GET "https://seu-dominio.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=meu_token_super_secreto_123&hub.challenge=CHALLENGE_ACCEPTED"

# Resposta esperada: CHALLENGE_ACCEPTED
\`\`\`

### 2. Enviar Mensagem de Teste

\`\`\`bash
# Via API
curl -X POST http://localhost:3333/api/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5567999887766",
    "message": "🧪 Teste de integração WhatsApp ERP!",
    "type": "text"
  }'
\`\`\`

### 3. Testar Recebimento

1. Envie uma mensagem para o número configurado
2. Verifique os logs do servidor
3. Confirme se a mensagem foi salva no banco

## 🔍 Monitoramento e Logs

### Logs do Sistema

\`\`\`bash
# Logs gerais
tail -f logs/app.log

# Logs do webhook
tail -f logs/webhook.log

# Logs de mensagens
tail -f logs/messages.log
\`\`\`

### Métricas Importantes

1. **Taxa de Entrega:**
   \`\`\`sql
   SELECT 
     status,
     COUNT(*) as total,
     ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
   FROM messages 
   WHERE direction = 'OUTBOUND'
   GROUP BY status;
   \`\`\`

2. **Tempo de Resposta:**
   \`\`\`sql
   SELECT 
     AVG(EXTRACT(EPOCH FROM (sent_at - created_at))) as avg_response_time_seconds
   FROM messages 
   WHERE direction = 'OUTBOUND';
   \`\`\`

## 🚨 Troubleshooting

### Problemas Comuns

1. **Webhook não recebe mensagens:**
   \`\`\`
   ✅ Verificar se a URL está acessível publicamente
   ✅ Confirmar se o token de verificação está correto
   ✅ Checar se os campos estão assinados corretamente
   ✅ Verificar logs de erro no servidor
   \`\`\`

2. **Erro ao enviar mensagens:**
   \`\`\`
   ✅ Verificar se o Access Token está válido
   ✅ Confirmar se o Phone Number ID está correto
   ✅ Checar se o número de destino está no formato correto
   ✅ Verificar limites de rate limiting
   \`\`\`

3. **Mensagens não aparecem no sistema:**
   \`\`\`
   ✅ Verificar conexão com banco de dados
   ✅ Confirmar se o webhook está processando corretamente
   ✅ Checar logs de erro no processamento
   ✅ Verificar se o contato foi criado corretamente
   \`\`\`

### Comandos de Diagnóstico

\`\`\`bash
# Testar conexão com banco
npm run db:test

# Verificar status do webhook
curl https://seu-dominio.com/api/whatsapp/webhook-status

# Testar conexão WhatsApp
npm run test:whatsapp

# Verificar logs em tempo real
npm run logs:watch
\`\`\`

## 📊 Limites e Quotas

### Limites da API WhatsApp

1. **Mensagens por Segundo:**
   - Desenvolvimento: 20 msg/s
   - Produção: 80-1000 msg/s (varia por tier)

2. **Mensagens por Dia:**
   - Tier 1: 1.000 mensagens
   - Tier 2: 10.000 mensagens
   - Tier 3: 100.000 mensagens

3. **Rate Limiting:**
   - 4.000 requests por hora por aplicativo
   - 200 requests por minuto por número

### Boas Práticas

1. **Implementar Retry Logic:**
   \`\`\`typescript
   const maxRetries = 3;
   const retryDelay = 1000; // 1 segundo
   
   async function sendWithRetry(message, retries = 0) {
     try {
       return await whatsappService.sendMessage(message);
     } catch (error) {
       if (retries < maxRetries) {
         await new Promise(resolve => setTimeout(resolve, retryDelay * (retries + 1)));
         return sendWithRetry(message, retries + 1);
       }
       throw error;
     }
   }
   \`\`\`

2. **Queue de Mensagens:**
   \`\`\`typescript
   // Implementar fila com Redis ou similar
   import Queue from 'bull';
   
   const messageQueue = new Queue('message processing');
   
   messageQueue.process(async (job) => {
     const { message } = job.data;
     return await whatsappService.sendMessage(message);
   });
   \`\`\`

## 🔐 Segurança

### Validação de Webhook

\`\`\`typescript
import crypto from 'crypto';

function validateWebhook(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WHATSAPP_APP_SECRET!)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expectedSignature}`)
  );
}
\`\`\`

### Sanitização de Dados

\`\`\`typescript
function sanitizePhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  return phone.replace(/\D/g, '');
}

function sanitizeMessage(message: string): string {
  // Remove caracteres perigosos
  return message
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}
\`\`\`

## 📈 Otimização de Performance

### Cache de Conexões

\`\`\`typescript
import NodeCache from 'node-cache';

const connectionCache = new NodeCache({ stdTTL: 3600 }); // 1 hora

async function getCachedConnection(phoneNumberId: string) {
  let connection = connectionCache.get(phoneNumberId);
  
  if (!connection) {
    connection = await prisma.whatsAppConnection.findFirst({
      where: { phoneNumberId, isActive: true }
    });
    
    if (connection) {
      connectionCache.set(phoneNumberId, connection);
    }
  }
  
  return connection;
}
\`\`\`

### Batch Processing

\`\`\`typescript
async function processBatchMessages(messages: any[]) {
  const batchSize = 10;
  const batches = [];
  
  for (let i = 0; i < messages.length; i += batchSize) {
    batches.push(messages.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    await Promise.all(batch.map(msg => processMessage(msg)));
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }
}
\`\`\`

## 🎉 Conclusão

Com esta configuração, você terá:

- ✅ **Integração completa** com WhatsApp Business API
- ✅ **Recebimento automático** de mensagens
- ✅ **Envio programático** de mensagens
- ✅ **Gestão de status** de entrega
- ✅ **Suporte a mídia** (imagens, documentos, etc.)
- ✅ **Sistema de filas** inteligente
- ✅ **Monitoramento** e logs detalhados
- ✅ **Segurança** robusta
- ✅ **Performance** otimizada

O sistema está pronto para uso em produção! 🚀
\`\`\`
