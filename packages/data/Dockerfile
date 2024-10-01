FROM node:22-alpine as base


FROM base as build

WORKDIR /space

ADD package.json yarn.lock .yarnrc.yml ./
ADD ./packages/data/package.json ./packages/data/package.json
COPY .yarn/ ./.yarn/

RUN yarn config set nodeLinker node-modules
RUN yarn workspaces focus @space/data --production

ADD ./packages/data/src ./packages/data/src
ADD ./packages/data/drizzle ./packages/data/drizzle

FROM node:22-alpine

WORKDIR /space

ENV NODE_ENV production
ENV NODE_OPTIONS --enable-source-maps
ENV NODE_NO_WARNINGS 1

COPY --from=build /space/node_modules /space/node_modules
COPY --from=build /space/packages /space/packages

CMD ["node", "--experimental-strip-types", "packages/data/src/migrate.ts"]
