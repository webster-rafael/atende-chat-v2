# Configuração da API do WhatsApp Business

Este guia explica como configurar completamente a integração com a API oficial do WhatsApp Business.

## 📋 Pré-requisitos

1. **Conta Meta Business**: Conta verificada no Meta Business Manager
2. **Aplicativo WhatsApp Business**: Criado no Meta for Developers
3. **Número de telefone**: Número verificado para WhatsApp Business
4. **Webhook público**: URL pública para receber webhooks (use ngrok para desenvolvimento)

## 🚀 Passo a Passo

### 1. Configurar Meta for Developers

1. Acesse [Meta for Developers](https://developers.facebook.com/)
2. Crie um novo aplicativo ou use um existente
3. Adicione o produto "WhatsApp Business Platform"
4. Configure as permissões necessárias

### 2. Obter Credenciais

#### Access Token
\`\`\`bash
# Token temporário (24h) - para testes
YOUR_TEMP_ACCESS_TOKEN="EAAxxxxxxxxxx"

# Token permanente - para produção
# Gere através do Meta Business Manager
YOUR_PERMANENT_ACCESS_TOKEN="EAAxxxxxxxxxx"
\`\`\`

#### Phone Number ID
\`\`\`bash
# Encontre em: WhatsApp > API Setup > Phone numbers
YOUR_PHONE_NUMBER_ID="1234567890123456"
\`\`\`

#### Verify Token
\`\`\`bash
# Crie um token personalizado para verificação
YOUR_VERIFY_TOKEN="meu_token_super_secreto_123"
\`\`\`

### 3. Configurar Webhook

#### Desenvolvimento (com ngrok)
\`\`\`bash
# Instalar ngrok
npm install -g ngrok

# Expor porta local
ngrok http 3333

# URL do webhook será algo como:
# https://abc123.ngrok.io/api/whatsapp/webhook
\`\`\`

#### Produção
\`\`\`bash
# Use sua URL de produção
https://seu-dominio.com/api/whatsapp/webhook
\`\`\`

### 4. Configurar Variáveis de Ambiente

\`\`\`env
# backend/.env
WHATSAPP_ACCESS_TOKEN="EAAxxxxxxxxxx"
WHATSAPP_PHONE_NUMBER_ID="1234567890123456"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="meu_token_super_secreto_123"
WHATSAPP_API_VERSION="v18.0"
WHATSAPP_API_URL="https://graph.facebook.com"
WEBHOOK_URL="https://abc123.ngrok.io/api/whatsapp/webhook"
\`\`\`

### 5. Configurar Webhook no Meta

1. Acesse seu app no Meta for Developers
2. Vá em WhatsApp > Configuration
3. Configure o webhook:
   - **Callback URL**: `https://abc123.ngrok.io/api/whatsapp/webhook`
   - **Verify Token**: `meu_token_super_secreto_123`
   - **Webhook Fields**: Marque `messages` e `message_status`

### 6. Testar Configuração

\`\`\`bash
# 1. Iniciar o backend
cd backend
npm run dev

# 2. Verificar webhook
curl -X GET "https://abc123.ngrok.io/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test&hub.verify_token=meu_token_super_secreto_123"

# 3. Testar envio de mensagem
curl -X POST "http://localhost:3333/api/whatsapp/send-message" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5567999887766",
    "message": "Olá! Esta é uma mensagem de teste.",
    "type": "text"
  }'
\`\`\`

## 🔧 Funcionalidades Implementadas

### ✅ Recebimento de Mensagens
- Mensagens de texto
- Imagens com legenda
- Documentos
- Áudios
- Vídeos
- Localização

### ✅ Envio de Mensagens
- Mensagens de texto
- Imagens com legenda
- Documentos
- Templates (em desenvolvimento)

### ✅ Status de Mensagens
- Enviada (sent)
- Entregue (delivered)
- Lida (read)
- Falha (failed)

### ✅ Gestão de Contatos
- Criação automática de contatos
- Atualização de informações
- Histórico de conversas

### ✅ Sistema de Filas
- Distribuição automática
- Atribuição manual
- Priorização de atendimento

## 🛠️ Comandos Úteis

\`\`\`bash
# Verificar conexões ativas
curl http://localhost:3333/api/whatsapp/connections

# Criar nova conexão
curl -X POST http://localhost:3333/api/whatsapp/connections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Conexão Principal",
    "phoneNumberId": "1234567890123456",
    "accessToken": "EAAxxxxxxxxxx",
    "verifyToken": "meu_token_123",
    "webhookUrl": "https://abc123.ngrok.io/api/whatsapp/webhook"
  }'

# Testar conexão
curl -X POST http://localhost:3333/api/whatsapp/test-connection/CONNECTION_ID

# Ativar/desativar conexão
curl -X PATCH http://localhost:3333/api/whatsapp/connections/CONNECTION_ID/toggle
\`\`\`

## 🔍 Troubleshooting

### Webhook não está recebendo mensagens
1. Verifique se o ngrok está rodando
2. Confirme se a URL do webhook está correta no Meta
3. Verifique os logs do servidor
4. Teste a URL manualmente

### Erro ao enviar mensagens
1. Verifique se o Access Token está válido
2. Confirme se o Phone Number ID está correto
3. Verifique se o número de destino está no formato correto
4. Consulte os logs da API do WhatsApp

### Token expirado
1. Gere um novo token no Meta Business Manager
2. Atualize a variável de ambiente
3. Reinicie o servidor

## 📊 Monitoramento

### Logs importantes
\`\`\`bash
# Logs do webhook
tail -f logs/webhook.log

# Logs de mensagens
tail -f logs/messages.log

# Logs de erros
tail -f logs/error.log
\`\`\`

### Métricas
- Taxa de entrega de mensagens
- Tempo de resposta do webhook
- Número de conversas ativas
- Mensagens por minuto

## 🔒 Segurança

1. **Nunca exponha** tokens de acesso em logs
2. **Use HTTPS** sempre em produção
3. **Valide** todos os webhooks recebidos
4. **Implemente** rate limiting
5. **Monitore** tentativas de acesso não autorizadas

## 📈 Próximos Passos

- [ ] Implementar templates de mensagem
- [ ] Adicionar suporte a botões interativos
- [ ] Implementar chatbot com IA
- [ ] Adicionar métricas avançadas
- [ ] Implementar backup automático
