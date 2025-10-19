# Guia de Configuração de CI/CD - PaneladeCasa

## Visão Geral

Este documento descreve a configuração completa de CI/CD para o projeto PaneladeCasa, incluindo deploy automático para:
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (NestJS)

## Arquitetura do Pipeline

```mermaid
graph TD
    A[Push para main] --> B[GitHub Actions]
    B --> C[Test & Lint]
    B --> D[Build Backend]
    B --> E[Build Frontend]
    C --> F{Tests OK?}
    F -->|Sim| G[Deploy Backend - Railway]
    F -->|Sim| H[Deploy Frontend - Vercel]
    G --> I[Notificação de Status]
    H --> I
```

## Configuração de Secrets no GitHub

### Secrets Necessários

Configure os seguintes secrets no repositório GitHub em `Settings > Secrets and variables > Actions`:

#### Para Vercel:
- `VERCEL_TOKEN`: Token de deploy da Vercel
- `VERCEL_ORG_ID`: ID da organização Vercel
- `VERCEL_PROJECT_ID`: ID do projeto Vercel

#### Para Railway:
- `RAILWAY_TOKEN`: Token de deploy do Railway

#### Para Aplicação:
- `NEXT_PUBLIC_API_URL`: URL do backend em produção (ex: https://api.paneladecasa.com)

### Como Obter os Tokens

#### Vercel:
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em Settings > Tokens
3. Crie um novo token com escopo apropriado
4. Para obter ORG_ID e PROJECT_ID:
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Fazer login com o token
   vercel login
   
   # No diretório do frontend
   cd apps/web
   vercel link
   
   # Isso mostrará:
   # - Vercel Organization ID
   # - Vercel Project ID
   ```

#### Railway:
1. Acesse [Railway Dashboard](https://railway.app/dashboard)
2. Vá em Account Settings > Tokens
3. Crie um novo token

#### Configuração Rápida:
Se você já tem os tokens, adicione aos GitHub Secrets:
- `VERCEL_TOKEN`: Token da Vercel
- `RAILWAY_TOKEN`: Token do Railway
- `VERCEL_ORG_ID`: ID da organização (via `vercel link`)
- `VERCEL_PROJECT_ID`: ID do projeto (via `vercel link`)
- `NEXT_PUBLIC_API_URL`: URL do backend após deploy Railway

## Variáveis de Ambiente

### Backend (Railway)

```env
# Banco de Dados
DATABASE_URL=postgresql://username:password@host:port/database

# Autenticação
JWT_SECRET=sua_senha_jwt_super_secreta_aqui

# Configuração da Aplicação
NODE_ENV=production
PORT=3001

# Upload de Arquivos
UPLOAD_PATH=/uploads
MAX_FILE_SIZE=5242880

# CORS
CORS_ORIGIN=https://seudominio.vercel.app
```

### Frontend (Vercel)

```env
# API Backend
NEXT_PUBLIC_API_URL=https://backend-railway-url.railway.app

# Configurações do Next.js
NEXT_PUBLIC_APP_NAME=PaneladeCasa
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Configuração dos Serviços

### Vercel - Frontend

1. **Conectar Repositório**:
   - Acesse [Vercel Dashboard](https://vercel.com/dashboard)
   - Import project from GitHub
   - Selecione o repositório `PaneladeCasa`

2. **Configurar Build**:
   - Framework Preset: Next.js
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Variáveis de Ambiente**:
   - Adicione `NEXT_PUBLIC_API_URL` apontando para o backend Railway

### Railway - Backend

1. **Conectar Repositório**:
   - Acesse [Railway Dashboard](https://railway.app/dashboard)
   - New Project > Deploy from GitHub repo
   - Selecione o repositório `PaneladeCasa`

2. **Configurar Build**:
   - Root Directory: `apps/backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`

3. **Banco de Dados**:
   - Adicione PostgreSQL plugin
   - Configure a variável `DATABASE_URL` automaticamente

4. **Variáveis de Ambiente**:
   ```env
   NODE_ENV=production
   PORT=$PORT
   DATABASE_URL=$DATABASE_URL
   JWT_SECRET=sua_senha_jwt_aqui
   CORS_ORIGIN=https://seu-frontend.vercel.app
   ```

## Fluxo de Deploy

### Desenvolvimento
```bash
# Criar feature branch
git checkout -b feature/nova-funcionalidade

# Desenvolver e commitar
git add .
git commit -m "feat: nova funcionalidade"

# Push para review
git push origin feature/nova-funcionalidade

# Criar Pull Request para main
```

### Produção
```bash
# Merge para main aciona deploy automático
git checkout main
git merge feature/nova-funcionalidade
git push origin main

# Pipeline executará:
# 1. Testes e lint
# 2. Build dos apps
# 3. Deploy automático
```

## Monitoramento

### GitHub Actions
- Acesse `Actions` tab no repositório
- Monitore status dos workflows
- Visualize logs de deploy

### Vercel
- Dashboard mostra status dos deploys
- Logs detalhados disponíveis
- Preview deployments para branches

### Railway
- Dashboard com métricas da aplicação
- Logs em tempo real
- Monitoramento de recursos

## Troubleshooting

### Deploy Falha - Backend
1. Verifique variáveis de ambiente no Railway
2. Confirme se DATABASE_URL está correto
3. Verifique logs no Railway dashboard
4. Teste build local: `npm run build`

### Deploy Falha - Frontend
1. Verifique NEXT_PUBLIC_API_URL
2. Confirme se build settings estão corretos
3. Teste build local: `npm run build`
4. Verifique logs no Vercel dashboard

### Pipeline CI/CD Falha
1. Verifique se todos os secrets estão configurados
2. Confirme permissões do token
3. Verifique sintaxe do workflow YAML
4. Teste localmente antes do push

## Segurança

### Boas Práticas:
- Nunca commite secrets no código
- Use variáveis de ambiente para configurações
- Rotacione tokens periodicamente
- Monitore acessos aos serviços
- Configure CORS adequadamente

### Secrets Management:
- GitHub Secrets para CI/CD
- Vercel Environment Variables
- Railway Environment Variables
- Nunca compartilhe tokens publicamente

## Scripts Úteis

```bash
# Testar build local
npm run build

# Rodar em modo desenvolvimento
npm run dev

# Instalar dependências
npm install

# Executar migrações (local)
cd apps/backend && npm run prisma:migrate

# Gerar client Prisma
cd apps/backend && npm run prisma:generate
```