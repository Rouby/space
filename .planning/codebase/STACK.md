# Technology Stack

**Analysis Date:** 2025-04-08

## Languages & Runtime

**Primary Language:**
- TypeScript 6.0.2 - All source code
- JavaScript (ESM modules)

**Runtime Environment:**
- Node.js - Backend and integration tests
- Browser (Chrome/Chromium) - Frontend via Vite dev server and built distribution

## Package Management

**Manager:**
- Yarn 4.13.0 in PnP loose mode (`.yarnrc.yml` configured with `pnpMode: loose`)
- Workspace monorepo with 6 packages in `packages/`
- Lockfile: `yarn.lock` committed

**Key Configuration:**
- Default semver range prefix: "" (exact versions)
- Enable global cache: false
- PnP fallback mode: all
- Package extensions defined for pixi/react, drizzle-orm, debug, vite, framer-motion

## Core Frameworks

**Backend (Node.js/HTTP):**
- GraphQL Yoga 5.18.1 - GraphQL server with plugin system
  - Location: `packages/backend/src/main.ts`
  - Plugins: JWT, cookies, schema middleware
- Node.js http module - Native server foundation

**Frontend (React/SPA):**
- React 19.2.4 - UI library
- React DOM 19.2.4 - DOM rendering
- Vite 8.0.3 - Build tool and dev server
  - Config: `packages/frontend/vite.config.ts`
  - Uses `@vitejs/plugin-react-swc` for JSX compilation
  - Proxy to backend at /graphql endpoint
  - Sourcemaps enabled in build

**State Management & Data:**
- URQL 5.0.1 - GraphQL client
  - Exchanges: devtools, cache (graphcache), auth, fetch
  - Subscriptions enabled via fetchSubscriptions
  - Request policy: cache-and-network
  - Location: `packages/frontend/src/urql.ts`
- @urql/exchange-graphcache 9.0.0 - Client-side caching with schema awareness
- @urql/exchange-auth 3.0.0 - Token refresh handling

**UI Components:**
- Mantine 9.0.0 - Component library
  - @mantine/core, @mantine/hooks, @mantine/modals, @mantine/notifications
  - @mantine/nprogress, @mantine/dates, @mantine/charts
  - @mantine/tiptap - Rich text editor integration
- TanStack Router 1.167.0 - Client-side routing
  - Router devtools included
  - Plugin-based architecture

**Canvas/Graphics:**
- Pixi.js 8.17.0 - 2D WebGL renderer
- @pixi/react 8.0.5 - React bindings for Pixi
- pixi-filters 6.1.5 - Filter effects library

**Rich Text Editing:**
- @tiptap/core 3.22.1, @tiptap/react 3.22.1, @tiptap/starter-kit 3.22.1
- TipTap link extension

**Data Visualization:**
- Recharts 3.8.0 - React charts library
- @tabler/icons-react 3.41.1 - Icon library

**Styling & Theming:**
- Emotion/react 11.14.0 - CSS-in-JS
- tss-react 4.9.20 - TypeScript styled components
- PostCSS 8.5.8 with mantine preset

**Game Logic:**
- @space/gameloop (workspace) - Game simulation engine
- @space/data (workspace) - Shared database layer

**Date/Time:**
- dayjs 1.11.20 - Lightweight date library
- dayjs plugins: duration, relativeTime

## Database

**Primary Database:**
- PostgreSQL via node-postgres driver
- Drizzle ORM 0.45.1 - TypeScript ORM
  - Connection string: `DB_CONNECTION_STRING` env var
  - Default: `postgres://postgres:password@localhost:5432/postgres`
  - Casing: camelCase
  - Location: `packages/data/src/index.ts`
- drizzle-kit 0.31.9 - Migration and schema management tool
  - Config: `packages/data/drizzle.config.ts`

**Database Client:**
- pg 8.20.0 - PostgreSQL client for Node.js
- Connection pooling via Client class in `packages/data/src/index.ts`

## Build & Compilation

**Transpilation:**
- SWC (@swc/cli 0.7.10, @swc/core 1.15.18) - Fast JS/TS transpiler
- tsx 4.21.0 - TypeScript executor for Node

**Linting & Formatting:**
- Biome 2.4.6 - Rust-based linter and formatter (replaces ESLint/Prettier)
  - Config: `biome.json`
  - Covers: src/, tests/ directories
  - Excludes: gql/, dist/, generated files, .pnp.cjs
  - Rules: recommended ruleset with overrides for backend/data/gameloop packages
  - Enforces import extensions (.ts) for selected packages

**Type Checking:**
- TypeScript 6.0.2 - tsconfig.json configured
  - strict mode, noEmit, moduleResolution: Bundler, target: ESNext

**GraphQL:**
- GraphQL 16.13.1 - GraphQL runtime
- graphql-codegen cli 6.2.1 - Schema code generation
  - Generator: @eddeee888/gcg-typescript-resolver-files 0.15.0
  - Location: `packages/backend/src/schema/`
  - Generates resolvers and type definitions
- graphql-scalars 1.25.0 - Custom scalar types (DateTime, JSON, etc.)
- vite-plugin-graphql-codegen 3.8.0 - Codegen plugin for dev server
- .graphqlrc config points to schema at `packages/backend/src/schema/**/schema.graphql`

## Testing & QA

**Unit Testing:**
- Vitest 4.1.2 - Vite-native test runner
  - Backend config: `packages/backend/vitest.config.ts` (default)
  - Gameloop config: `packages/gameloop/vitest.config.ts` (with test DB string)

**Integration & E2E Testing:**
- Playwright 1.58.2 (@playwright/test)
  - Config: `packages/integration/playwright.config.ts`
  - Single browser project: chromium (Desktop Chrome)
  - Runs tests in parallel
  - Base URL: http://127.0.0.1:5173
  - Spins up backend (port 3000) and frontend (port 5173) before tests
  - Captures screenshots and videos on failure
  - Trace collection on first retry
  - Location: `packages/integration/tests/`

## Authentication & Security

**JWT/Token Management:**
- jose 6.2.1 - JOSE (JSON Object Signing and Encryption)
  - Token signing: `packages/backend/src/schema/user/resolvers/Mutation/token.ts`
  - Algorithm: HS256
  - Claims namespace: `urn:space:*`
  - Env var: `JWT_SECRET` (default: "electric-kitten")

**Password Hashing:**
- bcrypt 6.0.0 - Password hashing library
  - Used in registerWithPassword and loginWithPassword resolvers

**Cookies:**
- @whatwg-node/server-plugin-cookies 1.0.5 - Cookie parser/setter for GraphQL Yoga
  - Access token stored in httpOnly "accessToken" cookie

**HTTP Security:**
- GraphQL Yoga plugin: @graphql-yoga/plugin-jwt 3.12.1
  - Extracts JWT from cookies
  - Validates issuer, audience, algorithms
  - Extend context with user claims

## Streaming & Real-time

**Reactive Streams:**
- RxJS 7.8.2 - Reactive extensions for JavaScript
  - Observables for game events and state changes
  - Location: `packages/backend/src/observables/`
  - Used in GraphQL subscriptions for real-time updates

**Subscriptions:**
- GraphQL Yoga subscriptions
- Custom async iterable converter: `packages/backend/src/toAsyncIterable.ts`
- Subscription resolvers in schema modules (trackGalaxy, trackStarSystem, trackGame, trackTaskForceEngagement)

**Deferred & Streaming:**
- @graphql-yoga/plugin-defer-stream 3.18.1 - Defer/stream directives for progressive results

## Environment Configuration

**Runtime Configuration:**
- Environment variables via process.env
- `.env` files supported (--env-file-if-exists flag in nodemon)
- Key env vars:
  - `JWT_SECRET` - Token signing key (default: "electric-kitten")
  - `DB_CONNECTION_STRING` - PostgreSQL connection
  - `PORT` - Backend server port (default: 3000)
  - `APP_ORIGIN` - CORS origin (used in config.ts)

**Build-time Configuration:**
- TypeScript configuration: `tsconfig.json` at root
- Each package has its own scripts

## Deployment & Infrastructure

**Container Orchestration:**
- Kubernetes Helm charts present at `helm/` directory
- Chart.yaml, templates/, values.yaml for K8s deployment

**CI/CD:**
- GitHub Actions workflows at `.github/workflows/`
- copilot-setup-steps.yml, deploy.yml
- Dependabot configured for dependency updates

**Development Tools:**
- VSCode settings in `.vscode/`
- DevContainer config in `.devcontainer/`
- EditorConfig at `.editorconfig`

## Development Server

**Backend Dev:**
- nodemon 3.1.14 with tsx execution
- Watches: src/*.ts, schema/**/*.ts, gameloop/src/**, data/src/functions/**
- Executes: node --import=tsx --env-file-if-exists=.env
- Signal: SIGHUP, delay 500ms

**Frontend Dev:**
- Vite dev server with hot module replacement
- TanStack Router plugin for route code generation
- GraphQL codegen plugin for client query generation

---

*Stack analysis completed 2025-04-08*
