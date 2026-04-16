# 1. مرحلة التثبيت (Dependencies)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# 2. مرحلة البناء (Builder)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# بناء المشروع (سينتج مجلد .next)
RUN npm run build

# 3. مرحلة التشغيل (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# نسخ الملفات اللازمة فقط من مرحلة البناء
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]