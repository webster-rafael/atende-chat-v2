-- Inserir planos no banco de dados
INSERT INTO plans (id, name, "displayName", description, price, features, "maxUsers", "maxQueues", "isActive", "createdAt", "updatedAt") VALUES
(
  'plan_ouro_001',
  'ouro',
  'Plano Ouro',
  'Ideal para pequenas empresas',
  97.00,
  ARRAY[
    'WhatsApp Business API',
    'Atendimento multiusuário',
    'Chatbot básico',
    'Relatórios essenciais',
    'Suporte por email'
  ],
  3,
  2,
  true,
  NOW(),
  NOW()
),
(
  'plan_safira_002',
  'safira',
  'Plano Safira',
  'Perfeito para empresas em crescimento',
  197.00,
  ARRAY[
    'Tudo do Plano Ouro',
    'Chatbot avançado com IA',
    'Integração com CRM',
    'Relatórios avançados',
    'Campanhas de marketing',
    'Suporte prioritário'
  ],
  10,
  5,
  true,
  NOW(),
  NOW()
),
(
  'plan_diamante_003',
  'diamante',
  'Plano Diamante',
  'Solução completa para grandes empresas',
  397.00,
  ARRAY[
    'Tudo do Plano Safira',
    'Usuários ilimitados',
    'Filas ilimitadas',
    'API personalizada',
    'Integrações customizadas',
    'Suporte 24/7 dedicado',
    'Treinamento personalizado'
  ],
  999,
  999,
  true,
  NOW(),
  NOW()
);

-- Verificar se os planos foram inseridos
SELECT 
  id,
  name,
  "displayName",
  description,
  price,
  "maxUsers",
  "maxQueues",
  "isActive"
FROM plans
ORDER BY price ASC;
