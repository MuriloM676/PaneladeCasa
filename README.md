# Panela de Casa — Marketplace (MVP)

Monorepo full-stack com backend (NestJS + PostgreSQL/Prisma + JWT) e frontend (Next.js + Tailwind) para conectar Chefs caseiros a Clientes. MVP com autenticação, gestão de cardápio (pratos prontos e montagem), pedidos, avaliações e **upload de imagens**.

## ✨ Funcionalidades Implementadas

- ✅ **Autenticação JWT** (Login, Registro, Proteção de rotas)
- ✅ **Gestão de Chefs** (Perfil, avaliações, localização)
- ✅ **Cardápio** (Pratos prontos + Menu customizável)
- ✅ **Pedidos** (Criação, acompanhamento, histórico)
- ✅ **Avaliações** (Rating de chefs)
- ✅ **Paginação e Filtros** (Listagens otimizadas)
- ✅ **Upload de Imagens** (Fotos de pratos, avatares) 📸 **NOVO!**
- ✅ **Docker** (Ambiente completo em 1 comando)
- ✅ **CI/CD Pipeline** (Deploy automático Vercel + Railway) 🚀 **NOVO!**

## Estrutura de Pastas

- `apps/backend`: API NestJS com Prisma + JWT + Multer (porta 4000)
- `apps/web`: Frontend Next.js 14 + App Router + Tailwind (porta 3000)
- `packages/shared`: Tipos TypeScript compartilhados
- `docs/`: ERD, API e especificações de componentes
- `.github/workflows/`: Pipeline CI/CD automatizado


## Como Rodar com Docker

### 🚀 Comando Único (Recomendado)

**Primeira vez ou após resetar o banco:**
```powershell
docker-compose up --build
```

✨ **Isso vai automaticamente:**
- ✅ Subir PostgreSQL e aguardar estar pronto
- ✅ Gerar Prisma Client para Linux
- ✅ Aplicar todas as migrações
- ✅ Popular banco com dados de teste (seed)
- ✅ Iniciar backend e frontend

**Próximas vezes (sem rebuild):**
```powershell
docker-compose up
```

### 📊 Dados de Teste Incluídos

Ao subir pela primeira vez, o banco será populado com:
- **3 chefs**: maria@chef.com, joao@chef.com, ana@chef.com
- **2 clientes**: carlos@cliente.com, lucia@cliente.com
- **5 pratos prontos**
- **Categorias e itens** de menu para montagem
- **2 pedidos** de exemplo
- **3 avaliações**

**🔑 Senha padrão para todos:** `123456`

### 🌐 Serviços Disponíveis

Após subir os containers:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend/API**: [http://localhost:4000](http://localhost:4000)
- **PostgreSQL**: `localhost:5432` (user: paneladecasadb, pass: paneladecasapass)

### 🛠️ Comandos Úteis

**Parar os serviços:**
```powershell
docker-compose down
```

**Resetar banco de dados (apaga tudo):**
```powershell
docker-compose down -v
docker-compose up --build
```

**Ver logs do backend:**
```powershell
docker-compose logs -f backend
```

**Acessar shell do container backend:**
```powershell
docker-compose exec backend sh
```

**Rodar seed manualmente (se necessário):**
```powershell
docker-compose exec backend npm run prisma:seed
```

### ⚠️ Troubleshooting

**Erro: "Prisma Client could not locate the Query Engine"**
- Solução: O `binaryTargets` já está configurado. Apenas rode `docker-compose up --build`

**Erro: "port 5432 already allocated"**
- Solução: Você tem um PostgreSQL rodando localmente. Pare-o ou mude a porta no docker-compose.yml

**Backend não inicia ou fica reiniciando:**
- Verifique logs: `docker-compose logs -f backend`
- Aguarde o PostgreSQL estar pronto (healthcheck automático já configurado)

**Seed não populou o banco:**
- Rode manualmente: `docker-compose exec backend npm run prisma:seed`
- Se já rodou antes, o seed pode falhar (é esperado)

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
- [ ] PostGIS para geolocalização real
- [ ] Integração com Stripe/PagSeguro
- [ ] Testes automatizados (Jest backend, Playwright frontend)
- [x] Deploy (Vercel/Netlify frontend, Railway/Render backend) ✅

## 🚀 Deploy e CI/CD

### Pipeline Automatizado

O projeto está configurado com CI/CD completo:

- **Frontend**: Deploy automático na Vercel
- **Backend**: Deploy automático no Railway
- **CI/CD**: GitHub Actions com testes e builds automatizados

**📋 Pipeline:**
1. Push para `main` → Trigger automático
2. Executar testes e lint
3. Build das aplicações
4. Deploy automático em produção
5. Notificação de status

### Configuração

Para configurar o deploy, consulte: **[📖 Guia Completo de CI/CD](docs/CI_CD_SETUP.md)**

**Serviços:**
- **Frontend**: [Vercel](https://vercel.com) - Zero config para Next.js
- **Backend**: [Railway](https://railway.app) - Deploy simples com PostgreSQL integrado
- **CI/CD**: GitHub Actions - Pipeline automatizado

**Ambientes:**
- **Produção**: Deploy automático na branch `main`
- **Preview**: Deploy automático em Pull Requests
- **Desenvolvimento**: `docker-compose up`

## Documentação Adicional

- **ERD**: `docs/ERD.md` (diagrama Mermaid completo)
- **API**: `docs/API.md` (detalhes dos endpoints)
- **Frontend**: `docs/FRONTEND.md` (componentes e páginas)
- **CI/CD**: `docs/CI_CD_SETUP.md` (configuração completa de deploy) 🚀

---

**Desenvolvido com 💚 para o MVP Panela de Casa**
