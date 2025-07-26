#!/bin/bash

echo "🚀 Configurando WhatsApp Business API..."

# Verificar se as variáveis de ambiente estão definidas
if [ -z "$WHATSAPP_ACCESS_TOKEN" ]; then
    echo "❌ WHATSAPP_ACCESS_TOKEN não definido"
    echo "Configure no arquivo backend/.env"
    exit 1
fi

if [ -z "$WHATSAPP_PHONE_NUMBER_ID" ]; then
    echo "❌ WHATSAPP_PHONE_NUMBER_ID não definido"
    echo "Configure no arquivo backend/.env"
    exit 1
fi

if [ -z "$WHATSAPP_WEBHOOK_VERIFY_TOKEN" ]; then
    echo "❌ WHATSAPP_WEBHOOK_VERIFY_TOKEN não definido"
    echo "Configure no arquivo backend/.env"
    exit 1
fi

echo "✅ Variáveis de ambiente configuradas"

# Verificar se o servidor está rodando
if ! curl -s http://localhost:3333/health > /dev/null; then
    echo "❌ Servidor não está rodando na porta 3333"
    echo "Execute: cd backend && npm run dev"
    exit 1
fi

echo "✅ Servidor está rodando"

# Testar webhook
echo "🔍 Testando webhook..."
WEBHOOK_TEST=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3333/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test&hub.verify_token=$WHATSAPP_WEBHOOK_VERIFY_TOKEN")

if [ "$WEBHOOK_TEST" = "200" ]; then
    echo "✅ Webhook funcionando corretamente"
else
    echo "❌ Webhook não está funcionando (HTTP $WEBHOOK_TEST)"
    exit 1
fi

# Criar conexão WhatsApp se não existir
echo "🔗 Verificando conexões WhatsApp..."
CONNECTIONS=$(curl -s http://localhost:3333/api/whatsapp/connections | jq -r '.connections | length')

if [ "$CONNECTIONS" = "0" ]; then
    echo "📱 Criando conexão WhatsApp..."
    
    curl -X POST http://localhost:3333/api/whatsapp/connections \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"Conexão Principal\",
            \"phoneNumberId\": \"$WHATSAPP_PHONE_NUMBER_ID\",
            \"accessToken\": \"$WHATSAPP_ACCESS_TOKEN\",
            \"verifyToken\": \"$WHATSAPP_WEBHOOK_VERIFY_TOKEN\",
            \"webhookUrl\": \"$WEBHOOK_URL\"
        }" > /dev/null
    
    echo "✅ Conexão WhatsApp criada"
else
    echo "✅ Conexão WhatsApp já existe"
fi

# Testar envio de mensagem (opcional)
read -p "🧪 Deseja testar o envio de mensagem? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    read -p "📱 Digite o número de telefone (com código do país, ex: 5567999887766): " PHONE_NUMBER
    
    if [ ! -z "$PHONE_NUMBER" ]; then
        echo "📤 Enviando mensagem de teste..."
        
        SEND_RESULT=$(curl -s -X POST http://localhost:3333/api/whatsapp/send-message \
            -H "Content-Type: application/json" \
            -d "{
                \"to\": \"$PHONE_NUMBER\",
                \"message\": \"🤖 Teste de conexão WhatsApp Business API - Sistema funcionando perfeitamente!\",
                \"type\": \"text\"
            }")
        
        if echo "$SEND_RESULT" | jq -e '.success' > /dev/null; then
            echo "✅ Mensagem enviada com sucesso!"
        else
            echo "❌ Erro ao enviar mensagem:"
            echo "$SEND_RESULT" | jq -r '.error'
        fi
    fi
fi

echo ""
echo "🎉 Configuração do WhatsApp concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o webhook no Meta for Developers"
echo "2. URL do webhook: $WEBHOOK_URL"
echo "3. Verify token: $WHATSAPP_WEBHOOK_VERIFY_TOKEN"
echo "4. Marque os campos: messages, message_status"
echo ""
echo "🔗 URLs importantes:"
echo "- API: http://localhost:3333/api"
echo "- Webhook: http://localhost:3333/api/whatsapp/webhook"
echo "- Conexões: http://localhost:3333/api/whatsapp/connections"
echo ""
echo "📖 Documentação completa: docs/WHATSAPP_SETUP.md"
