import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import { PostGraphileOptions } from 'postgraphile';

export const config: PostGraphileOptions = {
  subscriptions: true,
  retryOnInitFail: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  extendedErrors: ['errcode'],
  appendPlugins: [PgSimplifyInflectorPlugin],
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
  jwtPgTypeIdentifier: 'space.jwt_token',
  jwtSecret: 'supreme-kittens',
};
