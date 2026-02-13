FROM node:20-alpine

WORKDIR /app

# 複製套件定義檔與 Prisma schema
COPY package*.json ./
COPY prisma ./prisma

# 安裝系統依賴 + Node 依賴 + 產生 Prisma Client
RUN apk add --no-cache openssl \
  && npm install \
  && npx prisma generate

# 複製應用程式原始碼
COPY src ./src

EXPOSE 3000

CMD ["node", "src/app.js"]
