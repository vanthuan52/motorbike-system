FROM node:lts-alpine
LABEL maintainer="charlesdang.252@gmail.com"

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN set -x && pnpm install --frozen-lockfile

RUN touch .env

COPY . .

RUN pnpm db:generate

EXPOSE 3000

CMD [ "pnpm", "start:dev" ]
