# GitHub Secrets Configuration

## ⚠️ IMPORTANTE - CONFIGURAÇÃO DE TOKENS

Os tokens fornecidos devem ser adicionados aos GitHub Secrets do repositório. **NUNCA** commite tokens diretamente no código!

### Passos para Configurar GitHub Secrets:

1. **Acesse o repositório no GitHub**:
   - Vá para: https://github.com/MuriloM676/PaneladeCasa

2. **Navegue para Settings > Secrets and variables > Actions**

3. **Adicione os seguintes secrets**:

#### Tokens Fornecidos:
- **Name**: `VERCEL_TOKEN`
  - **Value**: `eMlDyDb3wKBs26TI26oqpWr1`

- **Name**: `RAILWAY_TOKEN`
  - **Value**: `fb038fd3-9e82-47f5-ac51-8ed99cbef3b6`

#### IDs da Vercel (Obtidos via vercel link):
- **Name**: `VERCEL_ORG_ID`
  - **Value**: `team_BJ8zMMsVKECY4AlzlHqyYzGC`

- **Name**: `VERCEL_PROJECT_ID`
  - **Value**: `prj_J8JCIlk8bHad7zD2F5U5RQXqbUBS`

#### URL do Backend (✅ OBTIDA):
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://paneladecasa-production.up.railway.app`

**🎯 AÇÃO NECESSÁRIA:**
1. ✅ Backend está rodando em: https://paneladecasa-production.up.railway.app
2. ✅ Testado com sucesso: /api retorna {"ok":true}
3. 🔄 Adicione este URL como secret `NEXT_PUBLIC_API_URL` no GitHub
4. 🚀 O frontend poderá se conectar ao backend em produção!#### Lista Completa de Secrets:

1. `VERCEL_TOKEN` ✅ (fornecido)
2. `RAILWAY_TOKEN` ✅ (fornecido)
3. `VERCEL_ORG_ID` (obtido via vercel link)
4. `VERCEL_PROJECT_ID` (obtido via vercel link)
5. `NEXT_PUBLIC_API_URL` (URL do backend Railway após deploy)

### Próximos Passos:

1. Adicionar os tokens aos GitHub Secrets
2. Configurar projetos no Vercel e Railway
3. Obter os IDs restantes
4. Fazer merge para main para ativar o pipeline

---

**🔒 Lembre-se**: Estes tokens são sensíveis e nunca devem ser compartilhados ou commitados no código!