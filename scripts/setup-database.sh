#!/bin/bash

echo "🚀 Configurando banco de dados PostgreSQL..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover volumes antigos (opcional)
read -p "🗑️  Deseja remover dados antigos? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removendo volumes antigos..."
    docker-compose down -v
    docker volume prune -f
fi

# Iniciar containers
echo "🐳 Iniciando containers Docker..."
docker-compose up -d

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
timeout=60
counter=0
while ! docker-compose exec -T postgres pg_isready -U whatsapp_user -d whatsapp_erp > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout: PostgreSQL não ficou pronto em ${timeout}s"
        exit 1
    fi
    echo "⏳ Aguardando PostgreSQL... (${counter}s)"
    sleep 2
    counter=$((counter + 2))
done

echo "✅ PostgreSQL está pronto!"

# Verificar se os scripts SQL existem
if [ ! -f "scripts/01-create-database.sql" ]; then
    echo "❌ Script 01-create-database.sql não encontrado!"
    exit 1
fi

# Executar scripts SQL
echo "📝 Executando scripts de criação..."

echo "1️⃣  Criando banco de dados..."
docker-compose exec -T postgres psql -U whatsapp_user -d postgres -f /docker-entrypoint-initdb.d/01-create-database.sql

echo "2️⃣  Criando tabelas..."
docker-compose exec -T postgres psql -U whatsapp_user -d whatsapp_erp -f /docker-entrypoint-initdb.d/02-create-tables.sql

echo "3️⃣  Inserindo dados iniciais..."
docker-compose exec -T postgres psql -U whatsapp_user -d whatsapp_erp -f /docker-entrypoint-initdb.d/03-seed-data.sql

# Configurar backend
if [ -d "backend" ]; then
    echo "🔧 Configurando backend..."
    cd backend
    
    # Copiar arquivo de ambiente se não existir
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            echo "📋 Arquivo .env criado a partir do .env.example"
        else
            echo "⚠️  Arquivo .env.example não encontrado. Criando .env básico..."
            cat > .env << EOF
DATABASE_URL="postgresql://whatsapp_user:whatsapp_password@localhost:5432/whatsapp_erp"
REDIS_URL="redis://localhost:6379"
PORT=3333
NODE_ENV=development
WHATSAPP_ACCESS_TOKEN="your_access_token_here"
WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id_here"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="your_verify_token_here"
JWT_SECRET="your_jwt_secret_here_change_in_production"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3000"
WEBHOOK_URL="http://localhost:3333/api/whatsapp/webhook"
EOF
        fi
    fi
    
    # Instalar dependências se package.json existir
    if [ -f "package.json" ]; then
        echo "📦 Instalando dependências do backend..."
        npm install
        
        # Gerar Prisma Client
        echo "🔄 Gerando Prisma Client..."
        npx prisma generate
    fi
    
    cd ..
fi

# Configurar frontend
if [ -f "package.json" ]; then
    echo "🎨 Configurando frontend..."
    
    # Copiar arquivo de ambiente se não existir
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.local.example" ]; then
            cp .env.local.example .env.local
            echo "📋 Arquivo .env.local criado a partir do .env.local.example"
        else
            echo "⚠️  Arquivo .env.local.example não encontrado. Criando .env.local básico..."
            cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3333/api
NEXT_PUBLIC_WS_URL=ws://localhost:3333/ws
NEXT_PUBLIC_APP_NAME="WhatsApp ERP"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV=development
EOF
        fi
    fi
    
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

# Verificar status dos serviços
echo "🔍 Verificando status dos serviços..."
docker-compose ps

# Mostrar informações de acesso
echo ""
echo "🎉 Configuração concluída com sucesso!"
echo ""
echo "📊 Informações de acesso:"
echo "  🐘 PostgreSQL: localhost:5432"
echo "     - Banco: whatsapp_erp"
echo "     - Usuário: whatsapp_user"
echo "     - Senha: whatsapp_password"
echo ""
echo "  🔴 Redis: localhost:6379"
echo ""
echo "  🌐 PgAdmin: http://localhost:8080"
echo "     - Email: admin@whatsapp-erp.com"
echo "     - Senha: admin123"
echo ""
echo "🚀 Para iniciar o sistema:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: npm run dev"
echo ""
echo "📝 Comandos úteis:"
echo "  docker-compose logs -f    # Ver logs"
echo "  docker-compose down       # Parar containers"
echo "  docker-compose up -d      # Iniciar containers"
echo ""
