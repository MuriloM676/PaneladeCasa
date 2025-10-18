# Backend Dockerfile
FROM node:20-alpine

# Instalar OpenSSL para Prisma
RUN apk add --no-cache openssl

WORKDIR /app
# Copia package.json e lockfiles do root, backend e shared
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package-lock.json ./apps/backend/
# Copia prisma schema ANTES de instalar dependências
COPY apps/backend/prisma ./apps/backend/prisma
# Instala dependências do backend e shared
WORKDIR /app/apps/backend
RUN npm install --legacy-peer-deps
# Copia código fonte
WORKDIR /app
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared
# Copia script de inicialização
COPY apps/backend/docker-entrypoint.sh /app/apps/backend/
RUN chmod +x /app/apps/backend/docker-entrypoint.sh
# Build do backend
WORKDIR /app/apps/backend
RUN npm run build
# Criar pasta uploads
RUN mkdir -p /app/apps/backend/uploads
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
ENTRYPOINT ["/app/apps/backend/docker-entrypoint.sh"]
