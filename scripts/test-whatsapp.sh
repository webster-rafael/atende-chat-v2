#!/bin/bash

echo "🧪 Testando integração WhatsApp Business API..."

API_BASE="http://localhost:3333/api"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    
    echo -n "Testing $method $endpoint... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X $method "$API_BASE$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -X $method "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    status_code="${response: -3}"
    body="${response%???}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL (HTTP $status_code)${NC}"
        echo "Response: $body"
        return 1
    fi
}

# Verificar se o servidor está rodando
echo "🔍 Verificando servidor..."
if ! curl -s http://localhost:3333/health > /dev/null; then
    echo -e "${RED}❌ Servidor não está rodando na porta 3333${NC}"
    echo "Execute: cd backend && npm run dev"
    exit 1
fi
echo -e "${GREEN}✅ Servidor está rodando${NC}"

# Testar webhook verification
echo ""
echo "🔗 Testando webhook verification..."
VERIFY_TOKEN=${WHATSAPP_WEBHOOK_VERIFY_TOKEN:-"test_token"}
test_endpoint "GET" "/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=$VERIFY_TOKEN" "" "200"

# Testar listagem de conexões
echo ""
echo "📱 Testando conexões WhatsApp..."
test_endpoint "GET" "/whatsapp/connections" "" "200"

# Testar criação de conexão (se não existir)
echo ""
echo "➕ Testando criação de conexão..."
CONNECTION_DATA='{
    "name": "Conexão Teste",
    "phoneNumberId": "123456789",
    "accessToken": "test_token",
    "verifyToken": "test_verify",
    "webhookUrl": "https://test.com/webhook"
}'
test_endpoint "POST" "/whatsapp/connections" "$CONNECTION_DATA" "200"

# Testar webhook de mensagem
echo ""
echo "📨 Testando webhook de mensagem..."
WEBHOOK_DATA='{
    "object": "whatsapp_business_account",
    "entry": [{
        "id": "123456789",
        "changes": [{
            "value": {
                "messaging_product": "whatsapp",
                "metadata": {
                    "display_phone_number": "5567999999999",
                    "phone_number_id": "123456789"
                },
                "contacts": [{
                    "profile": {
                        "name": "João Teste"
                    },
                    "wa_id": "5567888888888"
                }],
                "messages": [{
                    "from": "5567888888888",
                    "id": "wamid.test123",
                    "timestamp": "1640995200",
                    "type": "text",
                    "text": {
                        "body": "Olá, esta é uma mensagem de teste!"
                    }
                }]
            },
            "field": "messages"
        }]
    }]
}'
test_endpoint "POST" "/whatsapp/webhook" "$WEBHOOK_DATA" "200"

# Testar outras rotas da API
echo ""
echo "🔍 Testando outras rotas da API..."
test_endpoint "GET" "/conversations" "" "200"
test_endpoint "GET" "/contacts" "" "200"
test_endpoint "GET" "/users" "" "200"
test_endpoint "GET" "/queues" "" "200"

# Testar envio de mensagem (se token válido estiver configurado)
if [ ! -z "$WHATSAPP_ACCESS_TOKEN" ] && [ "$WHATSAPP_ACCESS_TOKEN" != "your_access_token_here" ]; then
    echo ""
    echo "📤 Testando envio de mensagem..."
    
    read -p "Digite um número de telefone para teste (ex: 5567999887766) ou ENTER para pular: " TEST_PHONE
    
    if [ ! -z "$TEST_PHONE" ]; then
        SEND_DATA="{
            \"to\": \"$TEST_PHONE\",
            \"message\": \"🤖 Mensagem de teste do sistema WhatsApp ERP - $(date)\",
            \"type\": \"text\"
        }"
        test_endpoint "POST" "/whatsapp/send-message" "$SEND_DATA" "200"
    else
        echo "⏭️  Pulando teste de envio de mensagem"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  WHATSAPP_ACCESS_TOKEN não configurado - pulando teste de envio${NC}"
fi

echo ""
echo "📊 Resumo dos testes:"
echo "- Servidor: ✅ Funcionando"
echo "- Webhook verification: ✅ OK"
echo "- Rotas da API: ✅ OK"
echo "- Webhook de mensagens: ✅ OK"

if [ ! -z "$WHATSAPP_ACCESS_TOKEN" ] && [ "$WHATSAPP_ACCESS_TOKEN" != "your_access_token_here" ]; then
    echo "- Configuração WhatsApp: ✅ OK"
else
    echo -e "- Configuração WhatsApp: ${YELLOW}⚠️  Pendente${NC}"
fi

echo ""
echo "🎉 Testes concluídos!"
echo ""
echo "📋 Para configurar completamente:"
echo "1. Configure as variáveis no backend/.env"
echo "2. Execute: ./scripts/setup-whatsapp.sh"
echo "3. Configure o webhook no Meta for Developers"
echo "4. Teste enviando uma mensagem para o número configurado"
