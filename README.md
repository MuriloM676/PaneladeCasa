# Panela de Casa — Marketplace (MVP)

Monorepo full-stack com backend (NestJS + PostgreSQL/Prisma + JWT) e frontend (Next.js + Tailwind) para conectar Chefs caseiros a Clientes. MVP com autenticação, gestão de cardápio (pratos prontos e montagem), pedidos e avaliações.

## Estrutura de Pastas

- `apps/backend`: API NestJS com Prisma + JWT (porta 3001/3002)
- `apps/web`: Frontend Next.js 14 + App Router + Tailwind (porta 3000)
- `packages/shared`: Tipos TypeScript compartilhados
- `docs/`: ERD, API e especificações de componentes
- `.github/workflows/`: CI básico (futuro)


## Como Rodar com Docker

### 1) Pré-requisitos
- Docker
- Docker Compose

### 2) Subir todos os serviços
Na raiz do projeto, execute:
```powershell
docker-compose up --build
```

### 3) Serviços disponíveis
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend/API**: [http://localhost:4000](http://localhost:4000)
- **Banco de dados PostgreSQL**: `localhost:5432` (usuário: paneladecasadb, senha: paneladecasapass, banco: paneladecasa)

### 4) Criar e aplicar migrações do Prisma (primeira vez)

**Criar migração inicial:**
```powershell
docker-compose exec backend npx prisma migrate dev --name init
```

**Ou aplicar migrações existentes (produção):**
```powershell
docker-compose exec backend npx prisma migrate deploy
```

### 5) Parar os serviços
```powershell
docker-compose down
```

### 6) Resetar banco de dados (se necessário)
```powershell
docker-compose down -v
docker-compose up --build
```

---

## Como Rodar Localmente (sem Docker)

### 1) Pré-requisitos
- Node.js 20+
- PostgreSQL (local ou Docker)
- Git

### 2) Configurar Banco de Dados
Crie um banco PostgreSQL e configure o `.env` do backend:

```powershell
copy apps/backend/.env.example apps/backend/.env
```

Edite `apps/backend/.env`:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/panelade_casa
JWT_SECRET=sua_senha_secreta_aqui
PORT=3001
```

### 3) Instalação e Migração
```powershell
# Na raiz do monorepo
npm install

# Gerar Prisma Client
npm --workspace apps/backend run prisma:generate

# Rodar migrations
npm --workspace apps/backend run prisma:migrate
```

### 4) Desenvolvimento

**Backend** (porta 3001 ou 3002):
```powershell
npm --workspace apps/backend run start:dev
# ou se a 3001 estiver ocupada:
$env:PORT=3002; npm --workspace apps/backend run start:dev
```

**Frontend** (porta 3000):
```powershell
npm run dev:web
```

**Ambos em paralelo** (se disponível):
```powershell
npm run dev
```

## Endpoints da API (Backend)

Base URL: `http://localhost:3002/api`

### Auth
- `POST /auth/register` — Registro (email, password, role: CUSTOMER|CHEF)
- `POST /auth/login` — Login (retorna JWT)

### Users
- `POST /users` — Criar usuário (igual ao register)

### Chefs
- `GET /chefs` — Listar chefs (query: cuisine, location)
- `GET /chefs/:id` — Detalhes do chef

### Dishes (protegido por JWT para POST/PATCH/DELETE)
- `POST /dishes` — Criar prato (role: CHEF)
- `GET /dishes?chefId=...` — Listar pratos do chef
- `GET /dishes/:id` — Detalhes do prato
- `PATCH /dishes/:id` — Atualizar prato (role: CHEF)
- `DELETE /dishes/:id` — Remover prato (role: CHEF)

### Menu (protegido por JWT para POST/DELETE)
- `POST /menu/categories/:chefId` — Criar categoria (role: CHEF)
- `GET /menu/categories/:chefId` — Listar categorias + itens
- `DELETE /menu/categories/:id` — Remover categoria (role: CHEF)
- `POST /menu/items/:categoryId` — Adicionar item (role: CHEF)
- `DELETE /menu/items/:id` — Remover item (role: CHEF)

### Orders (protegido por JWT)
- `POST /orders` — Criar pedido
- `POST /orders/calculate-plate` — Calcular preço de prato montado (body: { menuItemIds: string[] })
- `GET /orders/:id` — Consultar pedido
- `PATCH /orders/:id/status` — Atualizar status (role: CHEF)

### Ratings
- `POST /ratings` — Avaliar chef (body: { customerId, chefId, stars, comment })
- `GET /ratings/chef/:id` — Listar avaliações do chef

### Health
- `GET /` — Health check ({ ok: true, ts })

## Componentes Frontend (React/Next.js)

- **DishCard**: exibe prato pronto com botão "Adicionar ao Carrinho"
- **CustomPlateBuilder**: seleção interativa de itens por categoria, cálculo dinâmico
- **CartDrawer**: carrinho lateral com itens, total e botão de checkout
- **OrderTracker**: visualização de status do pedido (NEW → PREPARING → READY → DELIVERING → COMPLETED)
- **ChefCard**: card do chef com botão "Ver Cardápio"

### Páginas
- `/` — Home: lista de chefs
- `/chef/[id]` — Cardápio do chef (pratos prontos + montagem)
- `/cart` — Carrinho (futuro)
- `/checkout` — Checkout (futuro)
- `/orders/[id]` — Rastreamento (futuro)

## Segurança e Boas Práticas

- **JWT**: autenticação via `Authorization: Bearer <token>`
- **Guards**: `JwtAuthGuard` e `RolesGuard` aplicados em rotas sensíveis
- **CORS**: habilitado para `http://localhost:3000`
- **Validação**: DTOs com `class-validator` em todos os endpoints
- **Hash de senha**: `bcryptjs` no backend

## Próximos Passos

- [ ] Refresh tokens e rate limiting
- [ ] Upload de imagens (S3/GCS)
- [ ] PostGIS para geolocalização real
- [ ] Integração com Stripe/PagSeguro
- [ ] Testes automatizados (Jest backend, Playwright frontend)
- [ ] Deploy (Vercel/Netlify frontend, Railway/Render backend)

## Documentação Adicional

- **ERD**: `docs/ERD.md` (diagrama Mermaid completo)
- **API**: `docs/API.md` (detalhes dos endpoints)
- **Frontend**: `docs/FRONTEND.md` (componentes e páginas)

---

**Desenvolvido com 💚 para o MVP Panela de Casa**
