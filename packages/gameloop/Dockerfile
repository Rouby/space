FROM node:24-alpine AS base


FROM base AS build

WORKDIR /space

ADD package.json yarn.lock .yarnrc.yml ./
ADD ./packages/gameloop/package.json ./packages/gameloop/package.json
ADD ./packages/data/package.json ./packages/data/package.json
ADD ./packages/ai/package.json ./packages/ai/package.json
COPY .yarn/ ./.yarn/

RUN yarn config set nodeLinker node-modules
RUN yarn workspaces focus @space/gameloop --production

ADD ./packages/gameloop/src ./packages/gameloop/src
ADD ./packages/data/src ./packages/data/src
ADD ./packages/ai/src ./packages/ai/src

FROM node:24-alpine

WORKDIR /space

ENV NODE_ENV=production
ENV TZ="Europe/Berlin"
ENV NODE_OPTIONS="--enable-source-maps"
ENV NODE_NO_WARNINGS=1

COPY --from=build /space/node_modules /space/node_modules
COPY --from=build /space/packages /space/packages

CMD ["node", "--experimental-strip-types", "packages/gameloop/src/main.ts"]
