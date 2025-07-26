-- Criar banco de dados WhatsApp ERP
CREATE DATABASE whatsapp_erp;

-- Criar usuário específico
CREATE USER whatsapp_user WITH ENCRYPTED PASSWORD 'whatsapp_password';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE whatsapp_erp TO whatsapp_user;

-- Conectar ao banco
\c whatsapp_erp;

-- Conceder privilégios no schema public
GRANT ALL ON SCHEMA public TO whatsapp_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO whatsapp_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO whatsapp_user;

-- Configurar timezone
SET timezone = 'America/Campo_Grande';

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
