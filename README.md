# Luxury Durbar

Monorepo for the Luxury Durbar banquet website, staff admin app, and API.

## Stack

- **Website** — Nuxt 4 (SSR, SEO) at `website/`
- **Admin** — Vue 3 + Vite SPA at `admin/`
- **API** — NestJS + Prisma at `api/`
- **Shared** — types at `packages/shared`
- **Infra** — PostgreSQL 16 + Mailpit via `services/docker-compose.yml`

## Prerequisites

- Node.js 20+
- pnpm 10+
- Docker / Docker Compose

## Quick start

```bash
cp api/.env.example api/.env
cp admin/.env.example admin/.env
cp services/.env.example services/.env
pnpm install
pnpm docker:up
pnpm db:migrate
pnpm db:seed
pnpm --filter @luxurydurbar/shared build
pnpm dev
```

| Service    | URL                        |
| ---------- | -------------------------- |
| Website    | http://localhost:3000      |
| Admin      | http://localhost:3001      |
| API        | http://localhost:4000      |
| Postgres   | localhost:5434 (host) / 5432 (container) |
| Mailpit UI | http://localhost:8025      |

Env files (not committed):

- `api/.env` — database, JWT, SMTP, CORS, seed
- `admin/.env` — `VITE_API_BASE`
- `services/.env` — Postgres / Mailpit ports and credentials

Default staff login (from seed):

- Email: `admin@luxurydurbar.local`
- Password: `Admin123!`

## Scripts

- `pnpm lint` — lint all packages
- `pnpm typecheck` — TypeScript checks for all packages
- `pnpm docker:up` / `pnpm docker:down` — start/stop Postgres + Mailpit
