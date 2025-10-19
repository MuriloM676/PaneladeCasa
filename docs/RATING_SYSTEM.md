# Feature: Sistema de Avaliação de Pedidos

## 📋 Descrição

Implementação completa do sistema de avaliação de chefs integrado ao rastreamento de pedidos. Os clientes podem avaliar o chef (nota de 1 a 5 estrelas + comentário) após o pedido ser marcado como COMPLETED.

## ✨ Funcionalidades Implementadas

### 1. **Interface de Avaliação no Frontend**
- ✅ Formulário aparece automaticamente quando pedido está COMPLETED
- ✅ Seleção interativa de estrelas (1 a 5)
- ✅ Campo de comentário opcional
- ✅ Botões de envio e cancelamento
- ✅ Feedback visual durante envio
- ✅ Mensagem de sucesso/erro
- ✅ Ativação condicional (apenas para status COMPLETED)

### 2. **Backend - Melhorias no Endpoint de Ratings**
- ✅ Autenticação JWT obrigatória (apenas CUSTOMER)
- ✅ Suporte a `orderId` (busca automática de chefId e customerId)
- ✅ Validações:
  - Pedido deve existir
  - Pedido deve pertencer ao cliente
  - Pedido deve estar COMPLETED
  - Não permitir avaliar o mesmo pedido duas vezes
- ✅ Retorna dados completos (customer, chef, order)

### 3. **Modelo de Dados - Prisma Schema**
- ✅ Adicionado campo `orderId` (opcional, único) no modelo `Rating`
- ✅ Relação `1:1` entre `Order` e `Rating`
- ✅ Migration SQL documentada

## 📦 Arquivos Modificados/Criados

### Backend
```
apps/backend/src/modules/ratings/
├── ratings.controller.ts      (JWT auth, aceita orderId)
├── ratings.service.ts         (validações, busca automática)
└── prisma/
    ├── schema.prisma          (campo orderId adicionado)
    └── migrations/
        └── add_order_id_to_rating.sql
```

### Frontend
```
apps/web/app/customer/orders/[id]/
└── page.tsx                   (interface já estava implementada)
```

## 🔄 Fluxo de Avaliação

### 1. Cliente faz pedido
```
POST /api/orders
{ chefId, items, ... }
```

### 2. Chef atualiza status
```
NEW → PREPARING → READY → DELIVERING → COMPLETED
```

### 3. Interface de avaliação aparece
- Quando `order.status === 'COMPLETED'`
- Botão "⭐ Avaliar Chef" é exibido

### 4. Cliente avalia
```typescript
POST /api/ratings
Authorization: Bearer <token>
{
  "orderId": "abc123",
  "stars": 5,
  "comment": "Comida deliciosa!"
}
```

### 5. Backend valida e salva
- ✅ Verifica autenticação
- ✅ Busca customer pelo userId do token
- ✅ Busca order e valida:
  - Pedido existe
  - Pertence ao customer
  - Status é COMPLETED
  - Ainda não foi avaliado
- ✅ Cria rating vinculado ao pedido

## 🔌 Endpoints

### POST /api/ratings
**Autenticação:** JWT (role: CUSTOMER)

**Body:**
```json
{
  "orderId": "uuid",    // Opcional (busca chefId automaticamente)
  "chefId": "uuid",     // Opcional (se orderId não fornecido)
  "stars": 5,           // 1-5
  "comment": "Ótimo!"   // Opcional
}
```

**Validações:**
- ✅ Token JWT válido
- ✅ Role = CUSTOMER
- ✅ `orderId` OU `chefId` obrigatório
- ✅ Se `orderId`:
  - Pedido existe
  - Pertence ao cliente
  - Status = COMPLETED
  - Não foi avaliado ainda

**Response (201):**
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "chefId": "uuid",
  "orderId": "uuid",
  "stars": 5,
  "comment": "Ótimo!",
  "createdAt": "2025-10-19T...",
  "customer": {
    "user": { "email": "cliente@example.com" }
  },
  "chef": {
    "kitchenName": "Cozinha da Maria"
  }
}
```

### GET /api/ratings/chef/:chefId
**Autenticação:** Não requerida

**Response (200):**
```json
[
  {
    "id": "uuid",
    "stars": 5,
    "comment": "Excelente!",
    "createdAt": "2025-10-19T...",
    "customer": {
      "user": { "email": "cliente@example.com" }
    }
  }
]
```

## 🗄️ Modelo de Dados

### Rating (Prisma Schema)
```prisma
model Rating {
  id         String   @id @default(uuid())
  customer   Customer @relation("UserRatings", fields: [customerId], references: [id])
  customerId String
  chef       Chef     @relation("ChefRatings", fields: [chefId], references: [id])
  chefId     String
  order      Order?   @relation("OrderRating", fields: [orderId], references: [id])
  orderId    String?  @unique    // ← NOVO: Vincula avaliação ao pedido
  stars      Int
  comment    String?
  createdAt  DateTime @default(now())
}
```

### Order (atualizado)
```prisma
model Order {
  // ...campos existentes
  rating     Rating?  @relation("OrderRating")  // ← NOVO: Relação 1:1
}
```

## 📊 Migration SQL

```sql
-- Adicionar coluna orderId
ALTER TABLE "Rating" ADD COLUMN "orderId" TEXT;

-- Criar índice único
CREATE UNIQUE INDEX "Rating_orderId_key" ON "Rating"("orderId");

-- Adicionar foreign key
ALTER TABLE "Rating" 
ADD CONSTRAINT "Rating_orderId_fkey" 
FOREIGN KEY ("orderId") 
REFERENCES "Order"("id") 
ON DELETE SET NULL 
ON UPDATE CASCADE;
```

**Para aplicar:**
```bash
# Com Docker
docker-compose exec backend npx prisma migrate deploy

# Ou criar migration
docker-compose exec backend npx prisma migrate dev --name add-order-id-to-rating

# Ou executar SQL manualmente no PostgreSQL
psql -U paneladecasadb -d paneladecasa < apps/backend/prisma/migrations/add_order_id_to_rating.sql
```

## 🧪 Como Testar

### 1. Fazer pedido como cliente
```bash
# Login
POST /api/auth/login
{ "email": "carlos@cliente.com", "password": "123456" }

# Criar pedido
POST /api/orders
{ "chefId": "...", "items": [...], ... }
# Anote o orderId retornado
```

### 2. Atualizar status para COMPLETED (como chef)
```bash
# Login como chef
POST /api/auth/login
{ "email": "maria@chef.com", "password": "123456" }

# Atualizar status
PUT /api/chefs/orders/{orderId}/status
{ "status": "COMPLETED" }
```

### 3. Acessar rastreio e avaliar (como cliente)
```bash
# Acessar: http://localhost:3000/customer/orders/{orderId}
# Botão "⭐ Avaliar Chef" deve aparecer
# Preencher estrelas e comentário
# Clicar em "Enviar Avaliação"
```

### 4. Verificar avaliação salva
```bash
GET /api/ratings/chef/{chefId}
# Deve retornar a avaliação criada
```

### 5. Testar validações
```bash
# Tentar avaliar pedido não COMPLETED (deve falhar)
# Tentar avaliar mesmo pedido duas vezes (deve falhar)
# Tentar avaliar pedido de outro cliente (deve falhar)
```

## ✅ Validações Implementadas

| Validação | Status | Mensagem de Erro |
|-----------|--------|------------------|
| JWT válido | ✅ | Unauthorized |
| Role CUSTOMER | ✅ | Forbidden |
| Cliente existe | ✅ | Cliente não encontrado |
| Pedido existe | ✅ | Pedido não encontrado |
| Pedido pertence ao cliente | ✅ | Este pedido não pertence a você |
| Status COMPLETED | ✅ | Só é possível avaliar pedidos concluídos |
| Não avaliado ainda | ✅ | Você já avaliou este pedido |
| chefId ou orderId fornecido | ✅ | chefId ou orderId é obrigatório |

## 🎨 Interface (Frontend)

### Estado Inicial (Pedido não COMPLETED)
- Interface de avaliação NÃO aparece
- Apenas timeline e informações do pedido

### Pedido COMPLETED + Sem avaliação
```
┌─────────────────────────────────┐
│ Pedido Entregue!                │
│ Como foi sua experiência?       │
│ [⭐ Avaliar Chef]               │
└─────────────────────────────────┘
```

### Formulário de Avaliação
```
┌─────────────────────────────────────────┐
│ Avaliar Cozinha da Maria                │
├─────────────────────────────────────────┤
│ Nota (1 a 5 estrelas)                   │
│ ★ ★ ★ ★ ★     5/5                       │
│                                         │
│ Comentário (opcional)                   │
│ ┌─────────────────────────────────────┐ │
│ │ Conte-nos sobre sua experiência...  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Enviar Avaliação]  [Cancelar]         │
└─────────────────────────────────────────┘
```

## 🚀 Próximas Melhorias (Futuro)

- [ ] Impedir cliente de avaliar após X dias
- [ ] Chef pode responder avaliações
- [ ] Filtrar/ordenar por avaliação na listagem de chefs
- [ ] Avaliação de pratos específicos (além do chef)
- [ ] Upload de fotos na avaliação
- [ ] Avaliação de entregador (se aplicável)
- [ ] Analytics de avaliações no dashboard do chef
- [ ] Notificação ao chef quando receber avaliação

## 📚 Referências

- Página de rastreio: `apps/web/app/customer/orders/[id]/page.tsx`
- Controller: `apps/backend/src/modules/ratings/ratings.controller.ts`
- Service: `apps/backend/src/modules/ratings/ratings.service.ts`
- Schema: `apps/backend/prisma/schema.prisma`

---

**Branch:** `OPS-8-formulario-de-avaliacao`  
**Feature:** Sistema de Avaliação de Pedidos  
**Status:** ✅ Implementado e documentado
