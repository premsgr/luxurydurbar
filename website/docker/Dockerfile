FROM node:22-bookworm-slim AS build

WORKDIR /app

ARG NUXT_PUBLIC_API_BASE=http://localhost:33000
ARG NUXT_PUBLIC_SITE_URL=http://localhost:33001
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL

RUN corepack enable && corepack prepare pnpm@10.34.5 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/shared packages/shared
COPY website website

RUN pnpm install --frozen-lockfile --filter @luxurydurbar/website...
RUN pnpm --filter @luxurydurbar/shared build \
  && pnpm --filter @luxurydurbar/website build

FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=build /app/website/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
