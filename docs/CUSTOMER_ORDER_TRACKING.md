# Feature: Customer Order Tracking Interface

## 📋 Descrição

Interface visual de rastreamento de pedidos para clientes (`/customer/orders/[id]`), com timeline interativa mostrando a progressão do status do pedido em tempo real.

## ✨ Funcionalidades Implementadas

### 1. **Timeline Visual de Status**
- **Desktop**: Timeline horizontal com 5 etapas (NEW → PREPARING → READY → DELIVERING → COMPLETED)
- **Mobile**: Timeline vertical responsiva
- **Feedback Visual**:
  - Ícones emoji para cada etapa (📋, 👨‍🍳, ✅, 🚚, 🎉)
  - Cores dinâmicas conforme o status atual
  - Barra de progresso animada
  - Animação pulse no status atual
  - Checkmarks verdes para etapas concluídas

### 2. **Atualização em Tempo Real**
- Auto-refresh a cada 10 segundos
- Busca status via endpoint `GET /api/orders/:id/status`
- Feedback visual durante carregamento

### 3. **Informações do Pedido**
- Header destacado com:
  - Número do pedido (8 primeiros caracteres do ID)
  - Valor total
  - Nome do chef
  - Data/hora do pedido
- Lista de itens do pedido com:
  - Fotos dos pratos (quando disponível)
  - Nome do prato
  - Quantidade

### 4. **Sistema de Avaliação**
- Aparece automaticamente quando status = COMPLETED
- Formulário com:
  - Seleção de estrelas (1 a 5) com UI interativa
  - Campo de comentário opcional
  - Envio via POST /api/ratings
- Mensagem de sucesso após enviar

### 5. **Estados Especiais**
- **Cancelado**: Layout dedicado com ícone ❌ e mensagem clara
- **Erro**: Tratamento de erros com opção de voltar
- **Acesso Negado**: Validação de role CUSTOMER
- **Loading**: Spinner animado

### 6. **Responsividade**
- Layout adaptado para mobile e desktop
- Timeline muda de horizontal (desktop) para vertical (mobile)
- Grid responsivo nas informações do pedido

## 🎨 Design System

### Cores por Status
```typescript
NEW: 'bg-blue-500'       // Azul - Novo pedido
PREPARING: 'bg-orange-500' // Laranja - Preparando
READY: 'bg-yellow-500'    // Amarelo - Pronto
DELIVERING: 'bg-purple-500' // Roxo - Em entrega
COMPLETED: 'bg-green-500'  // Verde - Concluído
CANCELLED: 'bg-red-500'    // Vermelho - Cancelado
```

### Ícones e Descrições
| Status | Ícone | Descrição |
|--------|-------|-----------|
| NEW | 📋 | Pedido recebido |
| PREPARING | 👨‍🍳 | Chef está preparando |
| READY | ✅ | Pedido pronto para entrega |
| DELIVERING | 🚚 | A caminho |
| COMPLETED | 🎉 | Pedido concluído |

## 🔌 Integrações Backend

### Endpoints Utilizados
1. **GET /api/orders/:id/status**
   - Retorna status atual do pedido
   - Requer autenticação JWT
   - Campos retornados: `id`, `status`, `createdAt`, `total`, `chef`, `customer`, `items`

2. **POST /api/ratings**
   - Envia avaliação do cliente
   - Requer autenticação JWT
   - Body: `{ orderId, stars, comment }`

## 📱 Fluxo do Usuário

1. Cliente acessa `/customer/orders/[id]` após fazer um pedido
2. Visualiza timeline com status atual destacado
3. Aguarda progressão (atualização automática a cada 10s)
4. Quando status = COMPLETED, aparece botão "Avaliar Chef"
5. Cliente clica e preenche formulário de avaliação
6. Avaliação é enviada e confirmação é exibida

## 🧪 Como Testar

### 1. Criar um pedido de teste
```bash
# Login como cliente
POST /api/auth/login
{
  "email": "carlos@cliente.com",
  "password": "123456"
}

# Criar pedido
POST /api/orders
{
  "chefId": "...",
  "items": [...]
}
```

### 2. Acessar página de rastreio
```
http://localhost:3000/customer/orders/[orderId]
```

### 3. Simular mudança de status (como chef)
```bash
# Login como chef
POST /api/auth/login
{
  "email": "maria@chef.com",
  "password": "123456"
}

# Atualizar status do pedido
PUT /api/chefs/orders/[orderId]/status
{
  "status": "PREPARING"
}
```

### 4. Observar atualização automática
- A página deve atualizar sozinha em até 10 segundos
- Timeline deve refletir novo status

### 5. Testar avaliação
- Mudar status para COMPLETED
- Clicar em "Avaliar Chef"
- Preencher estrelas e comentário
- Enviar avaliação

## 🚀 Melhorias Futuras

- [ ] Notificações push quando status mudar
- [ ] Tempo estimado para cada etapa
- [ ] Chat com o chef
- [ ] Histórico de mudanças de status
- [ ] Mapa de rastreamento em tempo real (quando DELIVERING)
- [ ] Compartilhamento do rastreio (link público)
- [ ] Download de recibo/nota fiscal

## 📸 Screenshots

### Desktop
```
┌────────────────────────────────────────────────────────┐
│  Rastreamento do Pedido              Total: R$ 45,00   │
│  Pedido #ABC12345                                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  📋 ━━━━ 👨‍🍳 ━━━━ ✅ ──── 🚚 ──── 🎉                │
│  Novo   Preparando  Pronto  Entrega  Concluído        │
│                                                        │
│  Status atual: Chef está preparando                    │
├────────────────────────────────────────────────────────┤
│  Itens do Pedido                                       │
│  🍽️ Feijoada Completa (x1)                            │
│  🥗 Salada Caesar (x1)                                 │
└────────────────────────────────────────────────────────┘
```

### Mobile
```
┌──────────────────┐
│  Pedido #ABC123  │
│  R$ 45,00        │
├──────────────────┤
│                  │
│  📋 Novo         │
│   ✓ Concluído    │
│                  │
│  👨‍🍳 Preparando  │
│   → Em progresso │
│                  │
│  ✅ Pronto       │
│                  │
│  🚚 Entrega      │
│                  │
│  🎉 Concluído    │
│                  │
└──────────────────┘
```

## 🏗️ Estrutura de Arquivos

```
apps/web/app/customer/orders/[id]/
└── page.tsx (448 linhas)
    ├── Interfaces e types
    ├── Componente principal
    ├── Hooks (useEffect para fetch e auto-refresh)
    ├── Handlers (submit rating)
    ├── Render condicional (loading, error, access denied)
    ├── Timeline desktop/mobile
    ├── Order items
    └── Rating form
```

## 🔐 Segurança

- Validação de role (apenas CUSTOMER)
- Autenticação JWT obrigatória
- Token armazenado em localStorage
- Validação de pedido existente
- Proteção contra acesso não autorizado

## ⚡ Performance

- Auto-refresh limitado a 10 segundos (evita sobrecarga)
- Cleanup de interval no unmount
- Lazy loading de imagens
- Render otimizado com estados condicionais

---

**Branch**: `feature/customer-order-tracking`  
**Commit**: `feat: implement visual order tracking interface for customers`  
**Developed with** 💚 **for Panela de Casa**
