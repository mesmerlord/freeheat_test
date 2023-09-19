FROM node:19-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app/frontend

COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./frontend .

FROM node:19-alpine AS runner

WORKDIR /app/frontend
COPY --from=deps /app/frontend .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

EXPOSE 3000
ENV PORT 3000

CMD ["yarn", "dev"]
