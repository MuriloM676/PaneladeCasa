#!/bin/sh
set -e

echo "🔍 Aguardando banco de dados..."

# Aguardar até o banco estar realmente pronto
max_attempts=30
attempt=0
until npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || [ $attempt -eq $max_attempts ]; do
  attempt=$((attempt + 1))
  echo "⏳ Tentativa $attempt/$max_attempts - Aguardando PostgreSQL..."
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Falha ao conectar ao banco de dados após $max_attempts tentativas"
  exit 1
fi

echo "✅ Banco de dados conectado!"

echo "📦 Gerando Prisma Client..."
npx prisma generate

echo "🔄 Sincronizando schema do banco..."
npx prisma db push --skip-generate --accept-data-loss

echo "🌱 Populando banco de dados..."
npm run prisma:seed || echo "⚠️  Seed falhou ou já foi executado"

echo "🚀 Iniciando aplicação..."
exec npm run start
