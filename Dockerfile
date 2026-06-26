FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json ./
RUN npm run build

FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/build ./build
COPY package*.json ./
RUN npm ci --omit=dev

ENTRYPOINT ["node", "build/index.js"]
