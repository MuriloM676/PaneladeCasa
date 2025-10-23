# 🔧 Railway Recovery Guide - Restaurar Configuração Funcionando

## ❓ O que aconteceu?
Se estava funcionando antes, provavelmente:
- ✅ Você tinha PostgreSQL configurado no Railway
- ❌ As variáveis de ambiente sumiram
- ❌ Ou o banco foi pausado/removido

## 🎯 Recovery em 3 Passos

### 1️⃣ Verificar Dashboard Railway
1. Acesse: https://railway.app
2. Entre no projeto "PaneladeCasa"  
3. **Procure pelos serviços:**
   - `backend` (NestJS)
   - `postgresql` ou `postgres` (Database)

### 2️⃣ Se o PostgreSQL EXISTE:
**Serviço PostgreSQL visível no dashboard:**

1. Clique no serviço **PostgreSQL**
2. Aba **"Variables"** ou **"Connect"**
3. Copie a **"DATABASE_URL"** ou **"Postgres Connection URL"**
4. Exemplo: `postgresql://postgres:senha@container-name.railway.internal:5432/railway`

5. Vá no serviço **backend**
6. Aba **"Variables"**
7. Adicione/atualize:
```
DATABASE_URL=postgresql://postgres:senha@container-name.railway.internal:5432/railway
JWT_SECRET=sua_senha_jwt_aqui
NODE_ENV=production
PORT=8080
```

### 3️⃣ Se o PostgreSQL NÃO EXISTE:
**Não há serviço PostgreSQL no dashboard:**

1. No projeto Railway, clique **"+ New"**
2. Selecione **"Database" → "PostgreSQL"**
3. Aguarde criação (2-3 minutos)
4. Clique no PostgreSQL criado
5. Copie a **CONNECTION URL**
6. Configure no backend (mesmo processo acima)

## 🔥 Quick Commands

### Se você tem Railway CLI instalado:
```bash
# Login
railway login

# Listar projetos
railway projects

# Conectar ao projeto
railway link [project-id]

# Ver variáveis atuais
railway variables

# Adicionar variável
railway variables set DATABASE_URL="postgresql://..."
railway variables set JWT_SECRET="sua_senha_jwt"
railway variables set NODE_ENV="production"
```

### Se não tem Railway CLI:
- Use o dashboard web: https://railway.app

## 📋 Checklist de Recuperação

- [ ] Acessei dashboard Railway
- [ ] Verifiquei serviços no projeto
- [ ] PostgreSQL existe? 
  - [ ] SIM: Copiei DATABASE_URL
  - [ ] NÃO: Criei novo PostgreSQL
- [ ] Configurei variáveis no backend:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET` 
  - [ ] `NODE_ENV=production`
- [ ] Redeploy realizado
- [ ] Logs verificados (sem erros)

## 🎯 Resultado Esperado

Após configurar, os logs do Railway devem mostrar:
```
✅ Prisma schema loaded
✅ Database connected
✅ Migrations applied
✅ Server running on port 8080
```

## 🆘 Se ainda não funcionar

**Logs ainda mostram erro DATABASE_URL?**
1. Verifique se a string de conexão está correta
2. Teste conexão no SQL Editor do Railway PostgreSQL
3. Certifique-se que não há espaços extras na variável

**PostgreSQL não conecta?**
1. Verifique se está na mesma região
2. Aguarde 5 minutos após criação
3. Recrear PostgreSQL se necessário

---

⏱️ **Tempo estimado**: 5-10 minutos  
🎯 **Meta**: Restaurar ambiente que funcionava antes