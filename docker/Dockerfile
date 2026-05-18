FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY tsconfig.json svelte.config.js vite.config.ts ./
COPY src ./src

RUN bun run build

FROM joseluisq/static-web-server:2-alpine AS runtime

ENV SERVER_HOST=0.0.0.0 \
    SERVER_PORT=3000 \
    SERVER_ROOT=/var/public \
    SERVER_FALLBACK_PAGE=/var/public/index.html \
    SERVER_LOG_LEVEL=info

COPY --from=builder --chown=sws:sws /app/dist/ /var/public/

EXPOSE 3000
