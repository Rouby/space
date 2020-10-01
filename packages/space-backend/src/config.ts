import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import PgPubSub from '@graphile/pg-pubsub';
import PgLiveQuerys from '@graphile/subscriptions-lds';
import { makePluginHook, PostGraphileOptions } from 'postgraphile';

const pluginHook = makePluginHook([PgPubSub]);

export const config: PostGraphileOptions = {
  pluginHook,
  live: true,
  ownerConnectionString: 'postgres://jonathan:@localhost:5432/space',
  subscriptions: true,
  simpleSubscriptions: true,
  retryOnInitFail: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  extendedErrors: ['errcode'],
  appendPlugins: [PgSimplifyInflectorPlugin, PgLiveQuerys],
  graphiql: false,
  enableQueryBatching: true,
  disableQueryLog: true,
  legacyRelations: 'omit',
  enableCors: true,

  ...(process.env.NODE_ENV !== 'production' && {
    extendedErrors: ['hint', 'detail', 'errcode'],
    watchPg: true,
    showErrorStack: 'json',
    exportGqlSchemaPath: 'dist/schema.gql',
    graphiql: true,
    enhanceGraphiql: true,
    disableQueryLog: false,
    allowExplain() {
      return true;
    },
  }),

  pgDefaultRole: 'space_anonymous',
  jwtPgTypeIdentifier: 'space.jwt',
  jwtSecret: 'supreme-kittens',
};
