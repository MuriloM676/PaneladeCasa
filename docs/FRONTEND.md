# Frontend (Next.js + Tailwind) — Componentes

## Componentes Principais
- Layout: `Navbar`, `Footer`, `ProtectedRoute`
- Busca/Descoberta: `ChefCard`, `ChefFilters`
- Cardápio: `DishCard`, `CategorySelector`, `CustomPlateBuilder`
- Pedido: `CartDrawer`, `CheckoutForm`, `OrderTracker`
- Perfil Chef: `ChefProfileForm`, `MenuManager`

## Páginas
- `/` — Busca por chefs
- `/chef/[id]` — Perfil do chef + cardápio
- `/cart` — Carrinho
- `/checkout` — Checkout
- `/orders/[id]` — Rastreamento de pedido
- `/login` / `/register` — Autenticação
- `/dashboard/chef` — Painel do chef

## Estado
- Zustand/Context para carrinho e auth
- Requisições via fetch/axios para `/api`

## Estilo
- Tailwind CSS + classes utilitárias
