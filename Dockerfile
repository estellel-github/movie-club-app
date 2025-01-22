FROM node:20-alpine

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

RUN pnpm run build

EXPOSE 3000

CMD ["sh", "-c", "/usr/src/app/wait-for-it.sh ${POSTGRES_HOST} 5432 -- node dist/config/seed.js && pnpm start"]
