#!/bin/bash

echo "🔍 Verificando status do banco de dados..."

# Verificar se Docker Compose está rodando
if ! docker-compose ps postgres | grep -q "Up"; then
    echo "❌ PostgreSQL não está rodando."
    echo "💡 Execute: docker-compose up -d"
    exit 1
fi

echo "✅ PostgreSQL está rodando!"

# Verificar conectividade
echo "🔌 Testando conectividade..."
if docker-compose exec -T postgres pg_isready -U whatsapp_user -d whatsapp_erp > /dev/null 2>&1; then
    echo "✅ Conexão com banco estabelecida!"
else
    echo "❌ Não foi possível conectar ao banco"
    exit 1
fi

# Executar verificação completa
echo "📊 Executando verificação completa..."
docker-compose exec -T postgres psql -U whatsapp_user -d whatsapp_erp -f /docker-entrypoint-initdb.d/04-verify-database.sql

# Verificar logs recentes
echo ""
echo "📝 Logs recentes do PostgreSQL:"
docker-compose logs --tail=10 postgres

echo ""
echo "🎯 Verificação concluída!"
echo ""
echo "💡 Comandos úteis:"
echo "   docker-compose logs postgres     # Ver logs completos"
echo "   docker-compose exec postgres psql -U whatsapp_user -d whatsapp_erp  # Acessar banco"
echo "   ./scripts/reset-database.sh      # Reset completo"
