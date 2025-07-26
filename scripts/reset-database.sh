#!/bin/bash

echo "🔄 Resetando banco de dados PostgreSQL..."

# Verificar se Docker Compose está rodando
if ! docker-compose ps postgres | grep -q "Up"; then
    echo "❌ PostgreSQL não está rodando. Execute primeiro: docker-compose up -d"
    exit 1
fi

# Confirmação do usuário
echo "⚠️  ATENÇÃO: Esta operação irá:"
echo "   - Remover TODOS os dados do banco"
echo "   - Recriar todas as tabelas"
echo "   - Inserir dados de exemplo"
echo ""
read -p "Tem certeza que deseja continuar? (digite 'RESET' para confirmar): " -r
if [[ $REPLY != "RESET" ]]; then
    echo "❌ Operação cancelada."
    exit 1
fi

echo "🗑️  Removendo dados existentes..."

# Parar containers
docker-compose down

# Remover volumes
docker-compose down -v
docker volume prune -f

# Reiniciar containers
echo "🐳 Reiniciando containers..."
docker-compose up -d

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
timeout=60
counter=0
while ! docker-compose exec -T postgres pg_isready -U whatsapp_user -d postgres > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout: PostgreSQL não ficou pronto em ${timeout}s"
        exit 1
    fi
    echo "⏳ Aguardando PostgreSQL... (${counter}s)"
    sleep 2
    counter=$((counter + 2))
done

echo "✅ PostgreSQL está pronto!"

# Executar scripts de criação
echo "📝 Executando scripts de reset..."

echo "1️⃣  Criando banco de dados..."
docker-compose exec -T postgres psql -U postgres -f /docker-entrypoint-initdb.d/01-create-database.sql

echo "2️⃣  Criando tabelas..."
docker-compose exec -T postgres psql -U whatsapp_user -d whatsapp_erp -f /docker-entrypoint-initdb.d/02-create-tables.sql

echo "3️⃣  Inserindo dados iniciais..."
docker-compose exec -T postgres psql -U whatsapp_user -d whatsapp_erp -f /docker-entrypoint-initdb.d/03-seed-data.sql

echo "4️⃣  Verificando integridade..."
docker-compose exec -T postgres psql -U whatsapp_user -d whatsapp_erp -f /docker-entrypoint-initdb.d/04-verify-database.sql

# Regenerar Prisma Client se existir
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    echo "🔄 Regenerando Prisma Client..."
    cd backend
    npx prisma generate
    cd ..
fi

echo ""
echo "✅ Reset do banco de dados concluído com sucesso!"
echo ""
echo "📊 Dados inseridos:"
echo "   - 5 usuários (1 admin, 1 supervisor, 3 agentes)"
echo "   - 4 filas de atendimento"
echo "   - 5 contatos de exemplo"
echo "   - 5 conversas com diferentes status"
echo "   - 12 mensagens realistas"
echo "   - 1 conexão WhatsApp configurada"
echo ""
echo "🚀 Sistema pronto para uso!"
