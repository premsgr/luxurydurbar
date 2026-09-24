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

# Push the website image. Usage: just push-website 0.1.0 https://api.example.com https://luxurydurbar.example.com
push-website version nuxt_api_base nuxt_site_url:
    #!/usr/bin/env bash
    set -euo pipefail
    set -a
    source .github/variables/common.env
    set +a
    image="${GCP_ARTIFACT_REGISTRY}/${GCP_PROJECT_ID}/${GCP_PLATFORM_ARTIFACT_REPO}/website"
    gcloud auth configure-docker "${GCP_ARTIFACT_REGISTRY}" --quiet
    docker build \
      -f website/docker/Dockerfile \
      --build-arg "NUXT_PUBLIC_API_BASE={{nuxt_api_base}}" \
      --build-arg "NUXT_PUBLIC_SITE_URL={{nuxt_site_url}}" \
      -t "${image}:{{version}}" \
      -t "${image}:latest" \
      .
    docker push "${image}:{{version}}"
    docker push "${image}:latest"
