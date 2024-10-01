FROM node:22 as base


FROM base as build

WORKDIR /space

ADD package.json yarn.lock .yarnrc.yml ./
ADD ./packages/backend/package.json ./packages/backend/package.json
COPY .yarn/ ./.yarn/
RUN yarn install


ADD ./packages/backend ./packages/backend
RUN yarn config set nodeLinker node-modules
RUN yarn workspaces focus @space/backend --production


FROM node:22-alpine

ENV NODE_ENV production
ENV TZ "Europe/Berlin"
ENV PORT 3000
ENV NODE_OPTIONS --enable-source-maps
ENV NODE_NO_WARNINGS 1

WORKDIR /space

COPY --from=build /space/node_modules /space/node_modules
COPY --from=build /space/packages/backend/src /space
# replace `.js';` with `.ts'; inside /space/schema/resolvers.generated.ts
RUN sed -i s/.js\'\;/.ts\'\;/ /space/schema/resolvers.generated.ts

CMD ["node", "--experimental-strip-types", "main.ts"]
