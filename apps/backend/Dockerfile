# Backend Dockerfile
FROM node:20-alpine
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
# Build do backend
WORKDIR /app/apps/backend
RUN npm run build
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["npm", "run", "start"]
