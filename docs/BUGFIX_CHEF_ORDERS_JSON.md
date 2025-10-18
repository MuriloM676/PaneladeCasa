# Bug Fix: Chef Orders JSON Error

## 🐛 Problema

Ao acessar a página `/chef/orders` como chef autenticado, o usuário recebia o erro:
```
Failed to execute 'json' on 'Response': Unexpected end of JSON input
```

## 🔍 Causa Raiz

### 1. Ordem incorreta das rotas no Controller

No arquivo `chefs.controller.ts`, a rota genérica `GET /chefs/:id` estava **antes** da rota específica `GET /chefs/orders`.

**Comportamento incorreto:**
```typescript
// ❌ ERRADO
@Get(':id')           // Esta rota capturava TUDO, incluindo "orders"
get(@Param('id') id: string) { ... }

@Get('orders')        // Nunca era executada!
getChefOrders() { ... }
```

Quando o frontend fazia `GET /api/chefs/orders`, o NestJS interpretava "orders" como um `:id` e tentava buscar um chef com ID "orders", retornando vazio ou erro de JSON.

### 2. Tratamento de erro inadequado no Frontend

O código não verificava se a resposta era JSON válido antes de tentar fazer parse:
```typescript
// ❌ ERRADO
const res = await fetch('/api/chefs/orders');
const data = await res.json(); // Falha se resposta for vazia ou não-JSON
```

## ✅ Solução

### 1. Reordenar as rotas (Backend)

**Regra importante em NestJS/Express:**
> Rotas específicas devem vir ANTES de rotas com parâmetros dinâmicos

```typescript
// ✅ CORRETO
@Get('orders')        // Rota específica primeiro
getChefOrders() { ... }

@Get('profile/me')    // Outra rota específica
getMyProfile() { ... }

@Get(':id')           // Rota genérica por ÚLTIMO
get(@Param('id') id: string) { ... }
```

**Ordem correta das rotas:**
1. `GET /chefs` - Lista de chefs
2. `GET /chefs/profile/me` - Perfil do chef logado
3. `GET /chefs/orders` - Pedidos do chef logado
4. `PUT /chefs/profile` - Atualizar perfil
5. `PUT /chefs/orders/:id/status` - Atualizar status de pedido
6. `GET /chefs/:id` - Buscar chef específico (ÚLTIMO!)

### 2. Melhorar tratamento de erro (Frontend)

```typescript
// ✅ CORRETO
const res = await fetch('/api/chefs/orders');

// Verificar se é JSON antes de fazer parse
const contentType = res.headers.get('content-type');
if (!contentType || !contentType.includes('application/json')) {
  throw new Error('Resposta do servidor não é JSON válido');
}

if (!res.ok) {
  const errorData = await res.json().catch(() => ({ message: 'Erro' }));
  throw new Error(errorData.message);
}

const data = await res.json();
setOrders(Array.isArray(data) ? data : []); // Garantir que é array
```

## 📁 Arquivos Modificados

### Backend
- `apps/backend/src/modules/chefs/chefs.controller.ts`
  - Reordenadas as rotas (rotas específicas antes de `:id`)

### Frontend
- `apps/web/app/chef/orders/page.tsx`
  - Adicionada validação de content-type
  - Melhor tratamento de erro no parse JSON
  - Garantia de que `orders` é sempre um array

## 🧪 Como Testar

### 1. Reproduzir o bug (antes da correção)
```bash
# Checkout da main
git checkout main

# Fazer login como chef
POST /api/auth/login
{
  "email": "maria@chef.com",
  "password": "123456"
}

# Acessar /chef/orders
# ❌ Erro: Failed to execute 'json' on 'Response'
```

### 2. Verificar a correção
```bash
# Checkout da branch de correção
git checkout bugfix/chef-orders-json-error

# Rebuild
docker-compose up --build

# Fazer login como chef e acessar /chef/orders
# ✅ Deve funcionar!
```

### 3. Testar endpoints
```bash
# Verificar que todas as rotas funcionam
GET /api/chefs                    # ✅ Lista chefs
GET /api/chefs/orders             # ✅ Pedidos do chef (corrigido!)
GET /api/chefs/profile/me         # ✅ Perfil do chef logado
GET /api/chefs/[uuid-válido]      # ✅ Chef específico
```

## 📚 Lições Aprendidas

### 1. Ordem das rotas importa!
Em frameworks como NestJS e Express, a primeira rota que corresponder será executada.

**Sempre colocar:**
- Rotas literais/específicas PRIMEIRO (`/orders`, `/profile/me`)
- Rotas com parâmetros DEPOIS (`/:id`)

### 2. Validar tipo de resposta
Sempre verificar `content-type` antes de fazer `.json()`

### 3. Tratamento defensivo
- Sempre ter fallback para erros de parse
- Validar estrutura dos dados recebidos
- Usar `console.error` para debug

## 🎯 Resultado

✅ Rota `/chef/orders` agora funciona corretamente  
✅ JSON é parseado sem erros  
✅ Melhor tratamento de erro em caso de falha  
✅ Ordem das rotas corrigida no backend  

## 🔗 Referências

- [NestJS Route Order](https://docs.nestjs.com/controllers#route-order)
- [Express Route Precedence](https://expressjs.com/en/guide/routing.html)
- [MDN Response.json()](https://developer.mozilla.org/en-US/docs/Web/API/Response/json)

---

**Branch:** `bugfix/chef-orders-json-error`  
**Issue:** Failed to execute 'json' on 'Response'  
**Status:** ✅ Resolvido
