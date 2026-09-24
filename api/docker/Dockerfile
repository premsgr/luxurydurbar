FROM node:22-bookworm-slim AS build

WORKDIR /app

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.34.5 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY api/package.json api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --frozen-lockfile --filter @luxurydurbar/api...

COPY packages/shared packages/shared
COPY api api

RUN pnpm --filter @luxurydurbar/shared build \
  && pnpm --filter @luxurydurbar/api run db:generate \
  && pnpm --filter @luxurydurbar/api build

FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/shared ./packages/shared
COPY --from=build /app/api/package.json ./api/package.json
COPY --from=build /app/api/node_modules ./api/node_modules
COPY --from=build /app/api/dist ./api/dist
COPY --from=build /app/api/prisma ./api/prisma

WORKDIR /app/api

EXPOSE 33000

CMD ["node", "dist/src/main.js"]
