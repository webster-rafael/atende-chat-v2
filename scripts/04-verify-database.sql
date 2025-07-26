-- Script para verificar se todas as tabelas foram criadas corretamente
\c whatsapp_erp;

-- Verificar se o banco existe e está acessível
SELECT current_database() as banco_atual, current_user as usuario_atual, now() as timestamp_verificacao;

-- Listar todas as tabelas criadas
SELECT 
    schemaname as schema,
    tablename as tabela,
    tableowner as proprietario
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar estrutura das tabelas principais
\d+ users
\d+ contacts  
\d+ queues
\d+ queue_users
\d+ conversations
\d+ messages
\d+ whatsapp_connections

-- Verificar enums criados
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname IN ('UserRole', 'ConversationStatus', 'Priority', 'MessageType', 'Direction', 'MessageStatus')
ORDER BY t.typname, e.enumsortorder;

-- Verificar índices criados
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verificar foreign keys
SELECT
    tc.table_name as tabela_origem,
    kcu.column_name as coluna_origem,
    ccu.table_name as tabela_destino,
    ccu.column_name as coluna_destino,
    tc.constraint_name as nome_constraint
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- Contar registros em cada tabela
SELECT 'users' as tabela, COUNT(*) as total_registros FROM users
UNION ALL
SELECT 'contacts' as tabela, COUNT(*) as total_registros FROM contacts
UNION ALL
SELECT 'queues' as tabela, COUNT(*) as total_registros FROM queues
UNION ALL
SELECT 'queue_users' as tabela, COUNT(*) as total_registros FROM queue_users
UNION ALL
SELECT 'conversations' as tabela, COUNT(*) as total_registros FROM conversations
UNION ALL
SELECT 'messages' as tabela, COUNT(*) as total_registros FROM messages
UNION ALL
SELECT 'whatsapp_connections' as tabela, COUNT(*) as total_registros FROM whatsapp_connections
ORDER BY tabela;

-- Verificar integridade referencial
SELECT 
    'Conversas sem contato' as verificacao,
    COUNT(*) as problemas
FROM conversations c
LEFT JOIN contacts ct ON c."contactId" = ct.id
WHERE ct.id IS NULL

UNION ALL

SELECT 
    'Mensagens sem conversa' as verificacao,
    COUNT(*) as problemas
FROM messages m
LEFT JOIN conversations c ON m."conversationId" = c.id
WHERE c.id IS NULL

UNION ALL

SELECT 
    'Queue_users sem usuário' as verificacao,
    COUNT(*) as problemas
FROM queue_users qu
LEFT JOIN users u ON qu."userId" = u.id
WHERE u.id IS NULL

UNION ALL

SELECT 
    'Queue_users sem fila' as verificacao,
    COUNT(*) as problemas
FROM queue_users qu
LEFT JOIN queues q ON qu."queueId" = q.id
WHERE q.id IS NULL;

-- Verificar permissões do usuário
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE grantee = 'whatsapp_user'
    AND table_schema = 'public'
ORDER BY table_name, privilege_type;

-- Status final
SELECT 
    CASE 
        WHEN COUNT(*) = 7 THEN '✅ Todas as 7 tabelas foram criadas com sucesso!'
        ELSE '❌ Algumas tabelas estão faltando. Esperado: 7, Encontrado: ' || COUNT(*)
    END as status_final
FROM pg_tables 
WHERE schemaname = 'public';
