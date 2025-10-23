# 🚂 Railway Deploy - Configuração Urgente

## ❌ Erro Atual
```
Error: Environment variable not found: DATABASE_URL
```

## ✅ Solução: Configurar Variáveis de Ambiente

### 1. Acesse seu projeto Railway
1. Vá para [railway.app](https://railway.app)
2. Abra seu projeto "PaneladeCasa"
3. Clique no serviço **backend**

### 2. Configure as Variáveis de Ambiente
Na aba **Variables**, adicione:

```bash
DATABASE_URL=postgresql://[usuário]:[senha]@[host]:[porta]/[database]
JWT_SECRET=sua_senha_jwt_super_secreta_production
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://seu-frontend.vercel.app
```

### 3. Obter DATABASE_URL do Railway

#### Opção A: PostgreSQL Plugin (Recomendado)
1. No seu projeto Railway, clique em **"+ New"**
2. Selecione **"Database" → "PostgreSQL"**
3. Aguarde a criação
4. Copie a `DATABASE_URL` gerada

#### Opção B: Banco Externo
Use um serviço como:
- **Supabase** (grátis): https://supabase.com
- **Neon** (grátis): https://neon.tech
- **PlanetScale** (grátis): https://planetscale.com

### 4. Exemplo de Configuração Completa

```bash
# Obrigatórias
DATABASE_URL=postgresql://postgres:senha123@monorail.proxy.rlwy.net:12345/railway
JWT_SECRET=minha_chave_jwt_super_secreta_2024
NODE_ENV=production

# Opcionais
PORT=8080
CORS_ORIGIN=https://panela-de-casa.vercel.app
MAX_FILE_SIZE=5242880
```

### 5. Redeploy
Após configurar as variáveis:
1. Clique em **"Deploy"** ou
2. Faça um novo commit no GitHub

---

## 🔧 Quick Fix com Supabase (5 minutos)

1. **Criar banco no Supabase**:
   - Acesse https://supabase.com
   - Crie nova conta/projeto
   - Vá em Settings → Database
   - Copie a "Connection string"

2. **Configurar no Railway**:
   ```bash
   DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   JWT_SECRET=panela_de_casa_jwt_secret_2024
   NODE_ENV=production
   PORT=8080
   ```

3. **Redeploy** e tudo funcionará! 🎉

---

## 📝 Checklist Rápido

- [ ] PostgreSQL criado no Railway/Supabase
- [ ] `DATABASE_URL` configurada
- [ ] `JWT_SECRET` configurada
- [ ] `NODE_ENV=production` configurada
- [ ] Redeploy realizado
- [ ] Logs verificados (sem erros DATABASE_URL)

**Tempo estimado: 5-10 minutos** ⏱️