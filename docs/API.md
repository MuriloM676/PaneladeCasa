# API (NestJS) — Endpoints MVP

Base URL: `/api`

## Auth
- POST `/auth/register` — Registro (email, senha, role: customer|chef)
- POST `/auth/login` — Login (JWT)

## Chefs
- GET `/chefs` — Filtros: location, cuisine
- GET `/chefs/:id` — Detalhes
- GET `/chefs/:id/menu` — Pratos + categorias/itens
- POST `/chefs` — Criar perfil (JWT; approved=false)
- PATCH `/chefs/:id` — Atualizar (owner)

## Dishes & Menu
- POST `/dishes` — Criar prato
- PATCH `/dishes/:id` — Atualizar
- DELETE `/dishes/:id` — Remover
- CRUD `/menu/categories`
- CRUD `/menu/items`

## Orders
- POST `/orders` — Criar pedido (ready ou montagem)
- GET `/orders/:id` — Consultar status
- PATCH `/orders/:id/status` — Atualizar (chef)

## Ratings
- POST `/ratings` — Avaliar chef
- GET `/chefs/:id/ratings` — Listar

## Segurança
- JWT via `Authorization: Bearer <token>`
- Guardas de rota por perfil (customer/chef)
- Rate limiting básico e CORS restrito
