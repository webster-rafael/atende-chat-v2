-- Conectar ao banco whatsapp_erp
\c whatsapp_erp;

-- Limpar dados existentes (se houver)
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE conversations CASCADE;
TRUNCATE TABLE queue_users CASCADE;
TRUNCATE TABLE whatsapp_connections CASCADE;
TRUNCATE TABLE contacts CASCADE;
TRUNCATE TABLE queues CASCADE;
TRUNCATE TABLE users CASCADE;

-- Inserir usuários
INSERT INTO users (id, name, email, password, role, phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Admin Sistema', 'admin@whatsapp-erp.com', '$2b$10$rOzJKKJKJKJKJKJKJKJKJu', 'ADMIN', '+5567999999999'),
('550e8400-e29b-41d4-a716-446655440002', 'Supervisor Vendas', 'supervisor@whatsapp-erp.com', '$2b$10$rOzJKKJKJKJKJKJKJKJKJu', 'SUPERVISOR', '+5567888888888'),
('550e8400-e29b-41d4-a716-446655440003', 'Agente João', 'joao@whatsapp-erp.com', '$2b$10$rOzJKKJKJKJKJKJKJKJKJu', 'AGENT', '+5567777777777'),
('550e8400-e29b-41d4-a716-446655440004', 'Agente Maria', 'maria@whatsapp-erp.com', '$2b$10$rOzJKKJKJKJKJKJKJKJKJu', 'AGENT', '+5567666666666'),
('550e8400-e29b-41d4-a716-446655440005', 'Agente Pedro', 'pedro@whatsapp-erp.com', '$2b$10$rOzJKKJKJKJKJKJKJKJKJu', 'AGENT', '+5567555555555');

-- Inserir filas
INSERT INTO queues (id, name, description, color, greeting_message) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Suporte Técnico', 'Fila para atendimento de suporte técnico', '#EF4444', 'Olá! Você foi direcionado para o suporte técnico. Como posso ajudá-lo?'),
('660e8400-e29b-41d4-a716-446655440002', 'Vendas', 'Fila para atendimento de vendas', '#10B981', 'Olá! Bem-vindo ao nosso atendimento de vendas. Como posso ajudá-lo hoje?'),
('660e8400-e29b-41d4-a716-446655440003', 'Financeiro', 'Fila para questões financeiras', '#F59E0B', 'Olá! Você foi direcionado para o setor financeiro. Em que posso ajudá-lo?'),
('660e8400-e29b-41d4-a716-446655440004', 'Geral', 'Fila geral de atendimento', '#6366F1', 'Olá! Bem-vindo ao nosso atendimento. Como posso ajudá-lo?');

-- Associar usuários às filas
INSERT INTO queue_users (queue_id, user_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005');

-- Inserir contatos
INSERT INTO contacts (id, name, phone, email) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'João Silva', '+5567999887766', 'joao.silva@email.com'),
('770e8400-e29b-41d4-a716-446655440002', 'Maria Santos', '+5567888776655', 'maria.santos@email.com'),
('770e8400-e29b-41d4-a716-446655440003', 'Pedro Oliveira', '+5567777665544', 'pedro.oliveira@email.com'),
('770e8400-e29b-41d4-a716-446655440004', 'Ana Costa', '+5567666554433', 'ana.costa@email.com'),
('770e8400-e29b-41d4-a716-446655440005', 'Carlos Ferreira', '+5567555443322', 'carlos.ferreira@email.com');

-- Inserir conversas
INSERT INTO conversations (id, contact_id, user_id, queue_id, status, priority, last_message_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'ATTENDING', 'HIGH', NOW() - INTERVAL '5 minutes'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', NULL, '660e8400-e29b-41d4-a716-446655440001', 'WAITING', 'MEDIUM', NOW() - INTERVAL '10 minutes'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'RESOLVED', 'LOW', NOW() - INTERVAL '1 hour'),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440004', 'ATTENDING', 'URGENT', NOW() - INTERVAL '2 minutes'),
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', NULL, '660e8400-e29b-41d4-a716-446655440002', 'WAITING', 'MEDIUM', NOW() - INTERVAL '15 minutes');

-- Inserir mensagens
INSERT INTO messages (conversation_id, user_id, content, direction, status, sent_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', NULL, 'Olá, preciso de ajuda com meu pedido', 'INBOUND', 'DELIVERED', NOW() - INTERVAL '10 minutes'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Olá! Claro, posso ajudá-lo. Qual é o número do seu pedido?', 'OUTBOUND', 'READ', NOW() - INTERVAL '9 minutes'),
('880e8400-e29b-41d4-a716-446655440001', NULL, 'É o pedido #12345', 'INBOUND', 'DELIVERED', NOW() - INTERVAL '8 minutes'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Deixe-me verificar... Encontrei seu pedido! Qual é sua dúvida?', 'OUTBOUND', 'READ', NOW() - INTERVAL '7 minutes'),

('880e8400-e29b-41d4-a716-446655440002', NULL, 'Bom dia! Gostaria de informações sobre seus produtos', 'INBOUND', 'DELIVERED', NOW() - INTERVAL '15 minutes'),
('880e8400-e29b-41d4-a716-446655440002', NULL, 'Estou interessado em fazer uma compra', 'INBOUND', 'DELIVERED', NOW() - INTERVAL '14 minutes'),

('880e8400-e29b-41d4-a716-446655440003', NULL, 'Preciso alterar minha forma de pagamento', 'INBOUND', 'DELIVERED', NOW() - INTERVAL '2 hours'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Claro! Posso ajudá-lo com isso. Qual seria a nova forma de pagamento?', 'OUTBOUND', 'READ', NOW() - INTERVAL '1 hour 50 minutes'),
('880e8400-e29b-41d4-a716-446655440003', NULL, 'Gostaria de alterar para cartão de crédito', 'INBOUND', 'DELIVERED', NOW() - INTERVAL '1 hour 45 minutes'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Perfeito! Alteração realizada com sucesso. Mais alguma coisa?', 'OUTBOUND', 'READ', NOW() - INTERVAL '1 hour 40 minutes'),

('880e8400-e29b-41d4-a716-446655440004', NULL, 'URGENTE: Problema com entrega!', 'INBOUND', 'DELIVERED', NOW() - INTERVAL '5 minutes'),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'Olá! Vi que é urgente. Pode me explicar o que aconteceu com a entrega?', 'OUTBOUND', 'DELIVERED', NOW() - INTERVAL '3 minutes');

-- Inserir conexão WhatsApp
INSERT INTO whatsapp_connections (id, name, phone_number_id, access_token, verify_token, webhook_url, status) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Conexão Principal', 'YOUR_PHONE_NUMBER_ID', 'YOUR_ACCESS_TOKEN', 'YOUR_VERIFY_TOKEN', 'https://your-domain.com/api/whatsapp/webhook', 'CONNECTED');

-- Verificar dados inseridos
SELECT 'Dados inseridos com sucesso!' as status;
SELECT 'Usuários: ' || COUNT(*) as usuarios FROM users;
SELECT 'Filas: ' || COUNT(*) as filas FROM queues;
SELECT 'Contatos: ' || COUNT(*) as contatos FROM contacts;
SELECT 'Conversas: ' || COUNT(*) as conversas FROM conversations;
SELECT 'Mensagens: ' || COUNT(*) as mensagens FROM messages;
SELECT 'Conexões WhatsApp: ' || COUNT(*) as conexoes FROM whatsapp_connections;
