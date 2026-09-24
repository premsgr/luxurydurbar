FROM node:22-bookworm-slim AS build

WORKDIR /app

ARG VITE_API_BASE=http://localhost:33000
ENV VITE_API_BASE=$VITE_API_BASE

RUN corepack enable && corepack prepare pnpm@10.34.5 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY admin/package.json admin/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --frozen-lockfile --filter @luxurydurbar/admin...

COPY packages/shared packages/shared
COPY admin admin

RUN pnpm --filter @luxurydurbar/shared build \
  && pnpm --filter @luxurydurbar/admin build

FROM nginx:1.27-alpine

COPY admin/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/admin/dist /usr/share/nginx/html

EXPOSE 80
