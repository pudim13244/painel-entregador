# Sistema de Notificações - Rush Route Driver

## 📋 Visão Geral

O sistema de notificações foi implementado para fornecer uma experiência completa de comunicação entre o sistema e os entregadores. Ele inclui notificações em tempo real, configurações personalizáveis e uma interface moderna.

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas

1. **`notifications`** - Tabela principal de notificações
   - `id` - ID único da notificação
   - `title` - Título da notificação
   - `content` - Conteúdo da notificação
   - `type` - Tipo (ORDER, SYSTEM, PAYMENT, GENERAL)
   - `target_type` - Público-alvo (ALL, DELIVERY, ESTABLISHMENT, CUSTOMER)
   - `target_id` - ID específico do usuário (opcional)
   - `action_url` - URL para ação quando clicada
   - `priority` - Prioridade (LOW, MEDIUM, HIGH, URGENT)
   - `expires_at` - Data de expiração
   - `created_at` - Data de criação

2. **`user_notifications`** - Rastreamento de interações
   - `user_id` - ID do usuário
   - `notification_id` - ID da notificação
   - `read` - Se foi lida
   - `read_at` - Quando foi lida
   - `clicked` - Se foi clicada
   - `clicked_at` - Quando foi clicada

3. **`user_notification_settings`** - Configurações por usuário
   - `user_id` - ID do usuário
   - `order_notifications` - Notificações de pedidos
   - `system_notifications` - Notificações do sistema
   - `payment_notifications` - Notificações de pagamento
   - `push_notifications` - Notificações push
   - `email_notifications` - Notificações por email

## 🚀 Como Executar

### 1. Executar Migrações

```bash
cd backend-entregador
node run-migrations.js
```

### 2. Iniciar o Backend

```bash
cd backend-entregador
npm start
```

### 3. Iniciar o Frontend

```bash
cd rush-route-driver
npm run dev
```

## 📱 Funcionalidades Implementadas

### Frontend

1. **Página de Notificações** (`/notifications`)
   - Lista todas as notificações
   - Filtro por tipo e status (lida/não lida)
   - Marcar como lida/clicada
   - Marcar todas como lidas
   - Configurações personalizáveis

2. **Hook Personalizado** (`useNotifications`)
   - Gerenciamento centralizado de notificações
   - Funções para marcar como lida/clicada
   - Contador de não lidas
   - Configurações

3. **Componente Toast** (`NotificationToast`)
   - Notificações em tempo real
   - Auto-hide após 5 segundos
   - Ações rápidas (marcar como lida, ver detalhes)

4. **Integração no Dashboard**
   - Contador de notificações não lidas no footer
   - Atualização automática

### Backend

1. **Endpoints de Notificações**
   - `GET /notifications` - Listar notificações
   - `GET /notifications/unread-count` - Contar não lidas
   - `POST /notifications/:id/read` - Marcar como lida
   - `POST /notifications/:id/click` - Marcar como clicada
   - `POST /notifications/mark-all-read` - Marcar todas como lidas
   - `GET /notifications/settings` - Buscar configurações
   - `PUT /notifications/settings` - Atualizar configurações

2. **Sistema de Push Notifications**
   - Configuração VAPID
   - Endpoint para salvar subscriptions
   - Endpoint para enviar notificações

## 🎨 Interface do Usuário

### Página de Notificações

- **Aba "Todas"**: Lista todas as notificações com filtros
- **Aba "Não lidas"**: Apenas notificações não lidas
- **Aba "Configurações"**: Personalizar tipos de notificação

### Elementos Visuais

- **Ícones por tipo**:
  - 📦 Pedidos (azul)
  - 💰 Pagamentos (verde)
  - ⚠️ Sistema (laranja)
  - 💬 Geral (cinza)

- **Badges de prioridade**:
  - 🔴 URGENTE
  - 🟠 ALTA
  - 🔵 MÉDIA
  - ⚪ BAIXA

- **Indicadores de status**:
  - 🔵 Nova (não lida)
  - ✅ Visualizada (clicada)

## 🔧 Configurações

### Tipos de Notificação

1. **Pedidos** - Novos pedidos disponíveis
2. **Pagamentos** - Recebimentos e transações
3. **Sistema** - Manutenções e atualizações
4. **Geral** - Outras notificações

### Configurações por Usuário

- Ativar/desativar por tipo
- Notificações push
- Notificações por email

## 📊 Dados de Exemplo

O sistema inclui notificações de exemplo:

1. "Bem-vindo ao sistema!" (Sistema, Alta)
2. "Novo pedido disponível" (Pedido, Média)
3. "Pagamento recebido" (Pagamento, Alta)
4. "Manutenção programada" (Sistema, Baixa)

## 🔄 Atualizações em Tempo Real

O sistema está preparado para:

1. **WebSockets** - Para notificações instantâneas
2. **Service Workers** - Para notificações push
3. **Polling** - Para verificação periódica

## 🛠️ Próximos Passos

1. **Implementar WebSockets** para notificações em tempo real
2. **Adicionar Service Worker** para notificações push
3. **Criar notificações automáticas** baseadas em eventos
4. **Implementar notificações por email**
5. **Adicionar sons e vibração** para notificações importantes

## 🐛 Troubleshooting

### Problemas Comuns

1. **Tabelas não criadas**
   ```bash
   node run-migrations.js
   ```

2. **Erro de conexão com banco**
   - Verificar variáveis de ambiente
   - Verificar se o MySQL está rodando

3. **Notificações não aparecem**
   - Verificar se o usuário tem role 'DELIVERY'
   - Verificar configurações de notificação

### Logs

- Backend: `console.log` no terminal
- Frontend: DevTools Console
- Banco: Verificar tabelas diretamente

## 📝 Notas de Desenvolvimento

- O sistema é compatível com PWA
- Usa TypeScript para type safety
- Segue padrões de design modernos
- É responsivo para mobile
- Inclui tratamento de erros robusto 