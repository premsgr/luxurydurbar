set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

[default]
dev: env install docker migrate seed-if-empty shared
    pnpm dev

[private]
env:
    #!/usr/bin/env bash
    set -euo pipefail
    copy_if_missing() {
      if [[ ! -f "$2" ]]; then
        cp "$1" "$2"
        echo "Created $2"
      fi
    }
    copy_if_missing api/.env.example api/.env
    copy_if_missing admin/.env.example admin/.env
    copy_if_missing services/.env.example services/.env

[private]
install:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ ! -d node_modules ]]; then
      pnpm install
    fi

docker:
    docker compose --project-directory services up -d --wait

api:
    pnpm dev:api

website:
    pnpm dev:website

admin:
    pnpm dev:admin

down:
    docker compose --project-directory services down

migrate:
    pnpm db:generate
    pnpm db:migrate

seed:
    pnpm db:seed

[private]
seed-if-empty:
    #!/usr/bin/env bash
    set -euo pipefail
    count="$(docker exec luxurydurbar-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT COUNT(*) FROM \"Hall\""')"
    count="${count//[[:space:]]/}"
    if [[ "$count" == "0" ]]; then
      pnpm db:seed
    fi

shared:
    pnpm --filter @luxurydurbar/shared build

lint:
    pnpm lint

typecheck:
    pnpm typecheck

build:
    pnpm build
