# Frontend Dockerfile
FROM node:20-alpine
WORKDIR /app
# Copia package.json e lockfiles do root, web e shared
COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package-lock.json ./apps/web/
# Instala dependências do frontend e shared
WORKDIR /app/apps/web
RUN npm install --legacy-peer-deps
# Copia código fonte
WORKDIR /app
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared
# Build do frontend
WORKDIR /app/apps/web
RUN npm run build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start"]
