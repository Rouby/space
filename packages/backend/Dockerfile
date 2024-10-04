FROM node:22-alpine as base


FROM base as build

WORKDIR /space

ADD package.json yarn.lock .yarnrc.yml ./
ADD ./packages/backend/package.json ./packages/backend/package.json
ADD ./packages/data/package.json ./packages/data/package.json
ADD ./packages/gameloop/package.json ./packages/gameloop/package.json
COPY .yarn/ ./.yarn/

RUN yarn config set nodeLinker node-modules
RUN yarn workspaces focus @space/backend --production

ADD ./packages/backend/src ./packages/backend/src
ADD ./packages/data/src ./packages/data/src
ADD ./packages/gameloop/src ./packages/gameloop/src

FROM node:22-alpine

WORKDIR /space

ENV NODE_ENV production
ENV TZ "Europe/Berlin"
ENV PORT 3000
ENV NODE_OPTIONS --enable-source-maps
ENV NODE_NO_WARNINGS 1

COPY --from=build /space/node_modules /space/node_modules
COPY --from=build /space/packages /space/packages
# replace `.js';` with `.ts'; inside /space/schema/resolvers.generated.ts
RUN sed -i s/.js\'\;/.ts\'\;/ /space/packages/backend/src/schema/resolvers.generated.ts

CMD ["node", "--experimental-strip-types", "packages/backend/src/main.ts"]
