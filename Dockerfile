FROM node:20-alpine

WORKDIR /app

# 第一層：npm 依賴（變動最少，快取命中率最高）
COPY package*.json ./
RUN apk add --no-cache openssl && npm install

# 第二層：Prisma schema 變了才重新 generate
COPY prisma ./prisma
RUN npx prisma generate

# 第三層：src 改最頻繁，放最後
COPY src ./src

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/app.js"]
