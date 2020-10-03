/// <reference types="./postgraphile-plugin-connection-filter" />
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import PgPubSub from '@graphile/pg-pubsub';
import PgLiveQuerys from '@graphile/subscriptions-lds';
import * as jwt from 'jsonwebtoken';
import { makePluginHook, PostGraphileOptions } from 'postgraphile';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';

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
  appendPlugins: [
    ConnectionFilterPlugin,
    PgSimplifyInflectorPlugin,
    PgLiveQuerys,
  ],
  graphiql: false,
  enableQueryBatching: true,
  disableQueryLog: true,
  legacyRelations: 'omit',
  enableCors: true,
  jwtPgTypeIdentifier: 'space.jwt',
  jwtSecret: 'supreme-kittens',
  pgSettings: async (req) => {
    const jwtToken = getJwtToken(req.headers.authorization);

    try {
      const claims = jwtToken
        ? await new Promise<any>((resolve, reject) => {
            jwt.verify(
              jwtToken,
              'supreme-kittens',
              {
                // ...jwtVerifyOptions,
                audience: ['postgraphile'],
              },
              (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
              },
            );
          })
        : {};

      return {
        role: claims?.role ?? 'space_anonymous',
        'jwt.game_id':
          req.headers['x-game-id'] ??
          (req as any).connectionParams?.['x-game-id'],
      };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        (err as any).statusCode = 401;
      } else {
        (err as any).statusCode = 403;
      }
      throw err;
    }
  },

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
};

function getJwtToken(authorization: string | undefined) {
  const result = /^\s*bearer\s+([a-z0-9\-._~+/]+=*)\s*$/i.exec(
    authorization ?? '',
  );

  return result && result[1];
}
