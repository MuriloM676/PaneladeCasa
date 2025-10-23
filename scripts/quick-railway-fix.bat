@echo off
REM Script para configurar Supabase + Railway rapidamente

echo 🚀 Configuracao Rapida Railway + Supabase
echo =========================================
echo.
echo 1️⃣ Criar conta/projeto no Supabase:
echo    → Acesse: https://supabase.com
echo    → Clique em 'Start your project'
echo    → Crie uma nova organizacao ou use existente
echo    → Crie um novo projeto
echo    → Aguarde criacao (2-3 minutos)
echo.
echo 2️⃣ Obter Connection String:
echo    → No dashboard do Supabase
echo    → Va em Settings → Database
echo    → Copie 'Connection string'
echo    → Exemplo: postgresql://postgres.[ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
echo.
echo 3️⃣ Configurar no Railway:
echo    → Acesse railway.app
echo    → Abra projeto PaneladeCasa
echo    → Clique no servico 'backend'
echo    → Aba 'Variables'
echo    → Adicione:
echo.
echo DATABASE_URL=sua_connection_string_do_supabase
echo JWT_SECRET=panela_de_casa_jwt_production_2024
echo NODE_ENV=production
echo PORT=8080
echo CORS_ORIGIN=https://seu-frontend.vercel.app
echo.
echo 4️⃣ Redeploy:
echo    → No Railway, clique em 'Deploy'
echo    → Aguarde 2-3 minutos
echo    → Verifique logs (sem erros DATABASE_URL)
echo.
echo ✅ Tempo total estimado: 5-10 minutos
echo.
echo 🆘 Problemas?
echo    → Verifique se a CONNECTION_STRING esta correta
echo    → Teste conexao no Supabase SQL Editor
echo    → Logs do Railway devem mostrar 'Connected to database'
echo.
pause