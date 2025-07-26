# 🗃️ Configuração do Banco de Dados PostgreSQL

Este documento descreve como configurar e verificar o banco de dados PostgreSQL para o sistema WhatsApp ERP.

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ e npm
- Git

## 🚀 Configuração Rápida

### 1. Clonar e Configurar

\`\`\`bash
# Clonar o repositório
git clone <seu-repositorio>
cd whatsapp-erp

# Dar permissões aos scripts
chmod +x scripts/*.sh

# Executar configuração automática
./scripts/setup-database.sh
\`\`\`

### 2. Configurar Backend

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas configurações
npm run setup
\`\`\`

### 3. Iniciar Sistema

\`\`\`bash
# Backend
cd backend && npm run dev

# Frontend (em outro terminal)
npm run dev
\`\`\`

## 🐳 Docker Compose

O sistema usa Docker Compose com os seguintes serviços:

### PostgreSQL
- **Porta**: 5432
- **Usuário**: whatsapp_user
- **Senha**: whatsapp_password
- **Banco**: whatsapp_erp
- **Volume**: postgres_data

### Redis
- **Porta**: 6379
- **Volume**: redis_data

### PgAdmin
- **Porta**: 8080
- **Email**: admin@whatsapp-erp.com
- **Senha**: admin123

## 📊 Estrutura do Banco

### Tabelas Principais

1. **users** - Usuários do sistema (agentes, supervisores, admin)
2. **contacts** - Contatos do WhatsApp
3. **queues** - Filas de atendimento
4. **queue_users** - Relacionamento usuário-fila
5. **conversations** - Conversas/tickets
6. **messages** - Mensagens das conversas
7. **whatsapp_connections** - Conexões com WhatsApp Business API

### Enums

- **UserRole**: ADMIN, SUPERVISOR, AGENT
- **ConversationStatus**: WAITING, ATTENDING, RESOLVED, CLOSED
- **Priority**: LOW, MEDIUM, HIGH, URGENT
- **MessageType**: TEXT, IMAGE, DOCUMENT, AUDIO, VIDEO, LOCATION, CONTACT
- **Direction**: INBOUND, OUTBOUND
- **MessageStatus**: PENDING, SENT, DELIVERED, READ, FAILED

## 🔧 Scripts Disponíveis

### setup-database.sh
Configuração inicial completa do banco de dados.

\`\`\`bash
./scripts/setup-database.sh
\`\`\`

### check-database.sh
Verificação do status e integridade do banco.

\`\`\`bash
./scripts/check-database.sh
\`\`\`

### reset-database.sh
Reset completo do banco (remove todos os dados).

\`\`\`bash
./scripts/reset-database.sh
\`\`\`

### Scripts SQL

1. **01-create-database.sql** - Cria banco e usuário
2. **02-create-tables.sql** - Cria tabelas e índices
3. **03-seed-data.sql** - Insere dados iniciais
4. **04-verify-database.sql** - Verifica integridade

## 📈 Dados Iniciais (Seed)

O sistema vem com dados de exemplo:

- **5 usuários**: 1 admin, 1 supervisor, 3 agentes
- **4 filas**: Suporte, Vendas, Financeiro, Geral
- **5 contatos** com diferentes perfis
- **5 conversas** com status variados
- **12 mensagens** realistas
- **1 conexão WhatsApp** configurada

## 🔍 Verificação e Troubleshooting

### Verificar Status dos Containers

\`\`\`bash
docker-compose ps
\`\`\`

### Ver Logs

\`\`\`bash
# Todos os serviços
docker-compose logs -f

# Apenas PostgreSQL
docker-compose logs -f postgres
\`\`\`

### Acessar Banco Diretamente

\`\`\`bash
docker-compose exec postgres psql -U whatsapp_user -d whatsapp_erp
\`\`\`

### Comandos SQL Úteis

\`\`\`sql
-- Listar tabelas
\dt

-- Descrever tabela
\d+ users

-- Contar registros
SELECT COUNT(*) FROM conversations;

-- Ver conversas ativas
SELECT * FROM conversations WHERE status IN ('WAITING', 'ATTENDING');
\`\`\`

## 🚨 Problemas Comuns

### Container não inicia
\`\`\`bash
# Verificar logs
docker-compose logs postgres

# Remover volumes e reiniciar
docker-compose down -v
docker-compose up -d
\`\`\`

### Erro de conexão
\`\`\`bash
# Verificar se está rodando
docker-compose ps

# Testar conectividade
docker-compose exec postgres pg_isready -U whatsapp_user -d whatsapp_erp
\`\`\`

### Prisma não conecta
\`\`\`bash
# Regenerar client
cd backend
npx prisma generate

# Verificar .env
cat .env | grep DATABASE_URL
\`\`\`

## 🔐 Segurança

### Produção
- Alterar senhas padrão
- Usar SSL/TLS
- Configurar firewall
- Backup regular
- Monitoramento

### Variáveis de Ambiente
\`\`\`env
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="seu-jwt-secret-super-seguro"
WHATSAPP_ACCESS_TOKEN="seu-token-whatsapp"
\`\`\`

## 📊 Monitoramento

### Métricas Importantes
- Conexões ativas
- Queries lentas
- Uso de disco
- Backup status

### Comandos de Monitoramento
\`\`\`sql
-- Conexões ativas
SELECT * FROM pg_stat_activity;

-- Tamanho das tabelas
SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size 
FROM pg_tables WHERE schemaname='public';
\`\`\`

## 🔄 Backup e Restore

### Backup
\`\`\`bash
docker exec whatsapp-erp-postgres pg_dump -U whatsapp_user whatsapp_erp > backup.sql
\`\`\`

### Restore
\`\`\`bash
docker exec -i whatsapp-erp-postgres psql -U whatsapp_user whatsapp_erp < backup.sql
\`\`\`

## 📞 Suporte

Para problemas ou dúvidas:
1. Verificar logs: `docker-compose logs`
2. Executar verificação: `./scripts/check-database.sh`
3. Consultar documentação do Prisma
4. Abrir issue no repositório
