# Integrations & External Services

**Analysis Date:** 2025-04-08

## Databases

**PostgreSQL (Primary):**
- Provider: Self-hosted or cloud PostgreSQL
- ORM: Drizzle ORM 0.45.1
- Client: node-postgres (pg 8.20.0)
- Connection String Env Var: `DB_CONNECTION_STRING`
- Default Dev Connection: `postgres://postgres:password@localhost:5432/postgres`
- Test Connection: `postgres://postgres:password@localhost:5432/testing`
  - Used in: `packages/gameloop/vitest.config.ts`, `packages/integration/playwright.config.ts`
- Schema Management: drizzle-kit 0.31.9
  - Migrations stored in: `packages/data/drizzle/` (generated)
  - Schema definition: `packages/data/src/schema.ts`
- Connection Pooling: pg.Client class in `packages/data/src/index.ts`
  - Exported methods: `getConnection()`, `getDrizzle(client)`

## Data Storage

**File Storage:** 
- Not detected - No S3, GCS, or cloud storage integration found

**Cache/Session Store:**
- Not detected - No Redis or Memcached integration

## Authentication & Identity

**Auth Type:** Custom JWT-based with password credentials

**JWT Provider:**
- Library: jose 6.2.1
- Token Generation: `packages/backend/src/schema/user/resolvers/Mutation/token.ts`
  - Algorithm: HS256
  - Signing Key Env Var: `JWT_SECRET` (default: "electric-kitten")
  - Payload Claims Namespace: `urn:space:*`
  - Standard Claims: sub (subject/userId), iat (issued at), iss (issuer), aud (audience), exp (expiration)
  - Issuer: `urn:space:issuer`
  - Audience: `urn:space:audience`

**Password Management:**
- Hashing: bcrypt 6.0.0
- Salt rounds: Default bcrypt settings
- Used in: 
  - `packages/backend/src/schema/user/resolvers/Mutation/registerWithPassword.ts` (genSalt, hash)
  - `packages/backend/src/schema/user/resolvers/Mutation/loginWithPassword.ts` (compare)

**Auth Flow:**
1. Frontend: `packages/frontend/src/Auth.tsx` manages auth context
2. JWT decoding: `decodeJwt()` from jose
3. Token storage: httpOnly cookie named "accessToken"
4. Token refresh: loginWithRefreshToken mutation with refresh token cookie
5. GraphQL Auth: @graphql-yoga/plugin-jwt 3.12.1 plugin
   - Extracts token from cookie
   - Validates issuer, audience, algorithms (HS256, RS256)
   - Extends context with JWT claims
   - Location: `packages/backend/src/main.ts`

## GraphQL API

**Server:**
- Framework: GraphQL Yoga 5.18.1
- Location: `packages/backend/src/main.ts`
- Schema Location: `packages/backend/src/schema/`
  - Generated types: `packages/backend/src/schema/types.generated.ts`
  - Resolvers: `packages/backend/src/schema/resolvers.generated.ts`
  - Type definitions: `packages/backend/src/schema/typeDefs.generated.ts`
- Port: 3000 (env var: `PORT`)
- Plugins:
  - Cookies: @whatwg-node/server-plugin-cookies 1.0.5
  - JWT: @graphql-yoga/plugin-jwt 3.12.1
  - Defer/Stream: @graphql-yoga/plugin-defer-stream 3.18.1
  - Context Extension: useExtendContext hook

**Client:**
- Framework: URQL 5.0.1 (`packages/frontend/src/urql.ts`)
- URL: `/graphql` (proxied via Vite)
- Exchanges:
  - devtoolsExchange - Browser devtools integration
  - cacheExchange (graphcache 9.0.0) - Client-side schema-aware caching
  - authExchange 3.0.0 - Automatic token refresh on 401
  - fetchExchange - HTTP transport
- Features:
  - Suspense: enabled
  - Subscriptions: fetchSubscriptions enabled
  - Request Policy: cache-and-network
- Introspection: `packages/frontend/src/gql/introspection.json` (for local caching)
- Code Generation:
  - Tool: @graphql-codegen/cli 6.2.1
  - Preset: @graphql-codegen/client-preset 5.2.4
  - Generates: `packages/frontend/src/gql/` (queries, mutations, subscriptions, types)
  - Config: `.graphqlrc` points to schema and documents

## Real-time & Subscriptions

**Architecture:**
- GraphQL subscriptions via Yoga
- RxJS 7.8.2 observables for event streams
- Observable factories: `packages/backend/src/observables/`
  - starSystems$ - Star system events
  - taskForces$ - Task force events
  - taskForceEngagements$ - Combat engagement events
- Async iterable converter: `packages/backend/src/toAsyncIterable.ts` (RxJS observable → AsyncIterable)

**Subscription Resolvers:**
- trackGalaxy - Galaxy map updates (taskForces, starSystems, engagements)
- trackStarSystem - Star system details
- trackGame - Game state updates
- trackTaskForceEngagement - Combat engagement events

**Event System:**
- Worker-based event bus: `packages/backend/src/workers.ts`
- Per-game event Subjects (RxJS)
- Event types: GameEvent (game simulation events)
- Start/stop worker lifecycle management

**Frontend Subscription Handling:**
- URQL subscription cache updates: `packages/frontend/src/urql.ts`
- Subscription.trackGalaxy cache logic (lines 70-107)
  - Handles PositionableApppearsEvent and PositionableDisappearsEvent
  - Maintains cache consistency with entity removal/addition

## Logging & Observability

**Logging:**
- Console-based (console.warn, console.log)
- Security events logged as JSON: `packages/backend/src/context.ts`
  - Event type: "security.authorization.denied"
  - Logs: code, reason, userId, timestamp, details
- No centralized logging service detected

**Error Handling:**
- GraphQL errors with extensions (code, message)
- Error codes: NOT_AUTHORIZED, MISSING_CLAIM, MISSING_REFRESH_TOKEN, INVALID_REFRESH_TOKEN
- Error details passed via GraphQL extensions

**Monitoring:**
- Not detected - No Sentry, DataDog, New Relic, or similar service

**Performance Tracing:**
- Not detected

## Webhooks & Event Callbacks

**Incoming Webhooks:** None detected

**Outgoing Webhooks:** None detected

**External Event Processing:**
- Game event simulation via @space/gameloop package (internal)
- No external webhook callbacks or message queue integrations

## Testing Integrations

**Test Database:**
- Separate test database instance
- Connection: `postgres://postgres:password@localhost:5432/testing`
- Test setup: `packages/integration/tests/fixture.ts` (Playwright fixtures)
  - Creates users, games, players, resources, star systems, task forces
  - Manages test data with Drizzle ORM

**Integration Test Data Prep:**
- Script: `packages/integration/prepare-test-db.mjs`
- Run in playwright.config.ts via `yarn prepare:db`
- Runs before all integration tests

**Test Database Migrations:**
- Command: `yarn --cwd ../.. db:push --config=drizzle.config.test.ts`
- Uses test-specific drizzle config at `packages/data/drizzle.config.test.ts`

## Environment Configuration

**Required Environment Variables:**
- `JWT_SECRET` - Token signing secret (default: "electric-kitten")
- `DB_CONNECTION_STRING` - PostgreSQL connection URL (required for production)
- `PORT` - Backend server port (default: 3000)
- `APP_ORIGIN` - CORS/origin configuration (used in config.ts)
- `CI` - Flag for CI environment (Playwright uses this)

**Optional Environment Variables:**
- `DB_CONNECTION_STRING` - Can be overridden for different environments

**Secrets Management:**
- `.env` file support via --env-file-if-exists flag
- Secrets file location: Not committed (in .gitignore)

## No Integrations

**Not Found:**
- Email service (SendGrid, Mailgun, AWS SES)
- SMS service (Twilio)
- Cloud storage (AWS S3, Google Cloud Storage, Azure Blob)
- CDN (Cloudflare, CloudFront)
- Payment processing (Stripe, PayPal)
- Analytics (Google Analytics, Segment, Amplitude)
- Error tracking (Sentry, Rollbar, Bugsnag)
- Centralized logging (ELK, Datadog, New Relic, Splunk)
- Message queue (RabbitMQ, SQS, PubSub)
- Redis/caching service
- OAuth2 providers (GitHub, Google, etc.)
- Webhook management services
- ML/AI APIs (OpenAI, Anthropic, etc.)

---

*Integration audit completed 2025-04-08*
