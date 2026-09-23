# Luxury Durbar

Monorepo for the Luxury Durbar banquet website, staff admin app, and API.

## Stack

- **Website** — Nuxt 4 (SSR, SEO) at `website/`
- **Admin** — Vue 3 + Vite SPA at `admin/`
- **API** — NestJS + Prisma at `api/`
- **Shared** — types at `packages/shared`
- **Infra** — PostgreSQL 16, Mailpit, and Adminer via `services/docker-compose.yml`

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

Host ports are `33000` plus an offset: API `0`, website `1`, admin `2`, Postgres `5`, Mailpit UI `6`, Adminer `7`. Mailpit SMTP is `33016`.

| Service      | URL                                      |
| ------------ | ---------------------------------------- |
| API          | http://localhost:33000                   |
| Website      | http://localhost:33001                   |
| Admin        | http://localhost:33002                   |
| Postgres     | localhost:33005 (host) / 5432 (container) |
| Mailpit UI   | http://localhost:33006                   |
| Mailpit SMTP | localhost:33016                          |
| Adminer      | http://localhost:33007                   |

Env files (not committed):

- `api/.env` — database, JWT, SMTP, CORS, seed
- `admin/.env` — `VITE_API_BASE`
- `services/.env` — Postgres, Mailpit, and Adminer ports and credentials

Default staff login (from seed):

- Email: `admin@luxurydurbar.local`
- Password: `Admin123!`

## Scripts

- `pnpm lint` — lint all packages
- `pnpm typecheck` — TypeScript checks for all packages
- `pnpm docker:up` / `pnpm docker:down` — start/stop Postgres, Mailpit, and Adminer
