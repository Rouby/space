# Codebase Structure

**Analysis Date:** 2025-02-18

## Directory Layout

```
/home/rouby/space/
├── packages/                    # Yarn workspace packages
│   ├── backend/                 # GraphQL API server
│   ├── data/                    # Drizzle ORM schema and shared functions
│   ├── frontend/                # React SPA with TanStack Router
│   ├── gameloop/                # Per-game simulation in Worker Threads
│   ├── generative/              # (Unused or future feature)
│   └── integration/             # Playwright E2E tests
├── .planning/                   # Analysis and planning documents
├── docs/                        # External documentation
├── helm/                        # Kubernetes Helm charts (deployment)
├── issues/                      # Issue tracking or specs
├── specs/                       # Game design specifications
├── tsconfig.json               # Root TypeScript config (shared)
├── biome.json                  # Code formatting/linting config
├── yarn.lock                   # Yarn v4 lock file (PnP mode)
├── .yarnrc.yml                 # Yarn configuration
├── .graphqlrc                  # GraphQL Code Generator config
├── package.json                # Root workspace definition
└── README.md                   # Project overview
```

## Package Breakdown

### `packages/backend` - GraphQL API Server

**Purpose:** Entry point for client requests. Manages game state, authentication, real-time subscriptions, and worker threads.

**Structure:**
```
packages/backend/
├── src/
│   ├── main.ts                 # Server entry: HTTP server, middleware, startup
│   ├── config.ts               # Configuration and constants
│   ├── context.ts              # Extended GraphQL context (authorization, helpers)
│   ├── workers.ts              # Worker Thread management (RxJS Subject per game)
│   ├── events.ts               # GameEvent type definitions
│   ├── schema/                 # GraphQL schema and resolvers
│   │   ├── typeDefs.generated.ts    # Auto-generated from .graphql files
│   │   ├── resolvers.generated.ts   # Auto-generated resolver index
│   │   ├── types.generated.ts       # Auto-generated TypeScript types
│   │   ├── game/               # Game domain
│   │   │   ├── schema.graphql  # Game types, Query, Mutation, Subscription
│   │   │   ├── resolvers/      # Resolvers for Game, Player, TurnReport types
│   │   │   └── schema.mappers.ts
│   │   ├── starSystem/         # Star system domain
│   │   │   ├── schema.graphql
│   │   │   ├── resolvers/
│   │   │   │   ├── Query/      # Star system queries
│   │   │   │   ├── Mutation/   # Star system mutations
│   │   │   │   └── *.ts        # Type resolvers (field mappings)
│   │   │   └── __tests__/
│   │   ├── taskForce/          # Task force domain
│   │   ├── shipDesign/         # Ship design domain
│   │   ├── resource/           # Resource domain
│   │   ├── shipComponent/      # Ship component domain
│   │   ├── dilemma/            # Dilemma domain
│   │   ├── user/               # User domain (auth)
│   │   ├── base/               # Base types (Vector, Positionable, Subscriptions)
│   │   │   └── resolvers/Subscription/  # trackStarSystem, trackGalaxy
│   │   └── schema.generated.graphqls   # Full merged schema
│   └── services/               # Business logic (optional layer)
│       └── __tests__/
├── vitest.config.ts            # Unit test config
├── codegen.ts                  # GraphQL Code Generator config
├── tsconfig.json
└── package.json
```

**Key Files:**
- `src/main.ts`: HTTP server initialization, JWT plugin, cookie plugin, context extension
- `src/context.ts`: Request authorization, error handling (`denyAccess`), game event subscription
- `src/workers.ts`: Maps gameId → Worker Thread → RxJS Subject for event streaming
- `src/schema/**/*.graphql`: Domain-driven schema files (merged into single schema)
- `src/schema/game/resolvers/Query/`: Root queries (games, game)
- `src/schema/game/resolvers/Mutation/`: Root mutations (createGame, joinGame, startGame, etc.)

### `packages/data` - Data Layer & Shared Functions

**Purpose:** Database schema, type-safe query builder, shared game logic functions.

**Structure:**
```
packages/data/
├── src/
│   ├── index.ts                # Exports connection, getDrizzle
│   ├── schema.ts               # Re-exports all schema tables for typed queries
│   ├── schema/                 # Drizzle ORM table definitions
│   │   ├── dilemmas.ts         # Dilemma choices and prompts
│   │   ├── games.ts            # Game and player state
│   │   ├── lastKnownStates.ts  # Cached entity positions
│   │   ├── research.ts         # Research state and outcomes
│   │   ├── researchMiniGame.ts # Research mini-game progress
│   │   ├── resources.ts        # Resource types and quantities
│   │   ├── shipComponents.ts   # Ship component definitions
│   │   ├── shipDesigns.ts      # Ship design compositions
│   │   ├── starSystems.ts      # Star system state
│   │   ├── taskForceEngagements.ts  # Combat engagement records
│   │   ├── taskForces.ts       # Task force units and positions
│   │   ├── turnReports.ts      # Detailed turn-by-turn changes
│   │   ├── users.ts            # User accounts and passwords
│   │   └── visibility.ts       # Vision/fog of war data
│   ├── functions/              # Pure query/calculation functions
│   │   └── index.ts            # Exports (userHasVision, industrialProjectCatalog, etc.)
│   ├── gameMigrations/         # Versioned game state changes
│   │   └── index.ts            # Migration runner (applied after setup, post-turn)
│   ├── drizzle.config.ts       # Drizzle CLI configuration
│   └── drizzle/                # Migration SQL files (auto-generated)
├── tsconfig.json
└── package.json
```

**Key Exports:**
- `packages/data` (default): `{ getConnection, getDrizzle }`
- `packages/data/schema`: All table definitions (games, players, starSystems, etc.)
- `packages/data/functions`: Helper functions (userHasVision, industrialProjectCatalog)
- `packages/data/game-migrations`: Migration system and data

**Database Tables (Select):**
- `games`: id, name, startedAt, setupCompleted, turnNumber
- `players`: id, gameId, userId, name, color, turnEnded
- `starSystems`: id, gameId, x, y, colonizingPlayerId, populationByPlayer (JSON)
- `taskForces`: id, gameId, playerId, x, y, health, completionProgress
- `taskForceEngagements`: id, taskForceAId, taskForceBId, status, winner
- `research`: id, playerId, category, phase, breakthroughCount, momentum
- `dilemmas`: id, gameId, activeForPlayerId, promptName, state (JSON)
- `turnReports`: id, gameId, turnNumber, changes (JSON arrays for each change type)
- `visibility`: id, gameId, playerId, x, y (tracks explored positions)
- `users`: id, email, passwordHash

### `packages/frontend` - React SPA

**Purpose:** User-facing web interface with real-time game visualization.

**Structure:**
```
packages/frontend/
├── src/
│   ├── main.tsx                # React entry point (createRoot/hydrateRoot)
│   ├── App.tsx                 # Root component (Provider setup)
│   ├── router.tsx              # TanStack Router instance
│   ├── Auth.tsx                # Authentication context (JWT from cookies)
│   ├── urql.ts                 # URQL GraphQL client configuration
│   ├── vite-env.d.ts           # Vite type definitions
│   ├── global.d.ts             # Global type overrides
│   ├── routes/                 # File-based routing (TanStack Router)
│   │   ├── __root.tsx          # Root layout (error boundary, nav)
│   │   ├── _dashboard.tsx      # Dashboard layout (authenticated wrapper)
│   │   ├── _dashboard/
│   │   │   ├── index.tsx       # Dashboard home (games list)
│   │   │   └── _authenticated.games/
│   │   │       └── index.tsx   # Games page
│   │   └── games/
│   │       └── _authenticated.$id/  # Game detail layout (dynamic param)
│   │           ├── index.tsx        # Game overview
│   │           ├── dilemmas.index.lazy.tsx  # Dilemmas view (lazy-loaded)
│   │           └── ...other game pages
│   ├── features/               # Feature-specific components (domain-driven)
│   │   ├── SignIn/             # Sign in form and flow
│   │   ├── CreateGame/         # Game creation dialog
│   │   ├── GameLobby/          # Game lobby (before start)
│   │   ├── GalaxyView/         # Pixi.js canvas rendering
│   │   ├── StarSystemDetails/  # Star system detail panel
│   │   ├── ResearchPanel/      # Research UI and mini-games
│   │   │   ├── EvidenceTriangulation/
│   │   │   └── BreakthroughIncident/
│   │   ├── DilemmasList/       # Dilemma prompts and choices
│   │   ├── InGameMenu/         # In-game settings menu
│   │   ├── UserButton/         # Profile/logout button
│   │   └── LearnPage/          # Tutorial/learn page
│   ├── components/             # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── gql/                    # Generated GraphQL hooks
│   │   └── index.ts            # Auto-generated URQL hooks
│   ├── theme/                  # Mantine theme configuration
│   │   └── index.ts            # Dark mode, colors, typography
│   ├── format/                 # Utility formatters
│   │   └── *.ts                # Number, date, resource formatters
│   ├── routeTree.gen.ts        # Auto-generated route tree (TanStack Router)
└── vite.config.ts             # Vite bundler configuration

package.json
tsconfig.json
vite.config.ts
index.html                      # HTML entry point
postcss.config.cjs             # PostCSS for Mantine styles
```

**Key Files:**
- `src/main.tsx`: Root React mount, hydration support
- `src/App.tsx`: Provider stack (URQL, Auth, Mantine, Router)
- `src/urql.ts`: GraphQL client with auth exchange, cache, devtools
- `src/Auth.tsx`: JWT-based auth context from `accessToken` cookie
- `src/routes/`: File-based routing convention (generated routeTree.gen.ts)
- `src/features/GalaxyView/`: Pixi.js 2D game rendering
- `src/features/ResearchPanel/`: Mini-game UI for research
- `src/gql/index.ts`: Generated hooks (useGameQuery, useStartGameMutation, etc.)

**Generated Files:**
- `routeTree.gen.ts`: Auto-generated route tree from file structure
- `src/gql/index.ts`: GraphQL hooks from codegen (runs on dev/build)

### `packages/gameloop` - Per-Game Simulation

**Purpose:** Isolated game tick simulation running in Node.js Worker Thread per game.

**Structure:**
```
packages/gameloop/
├── src/
│   ├── main.ts                 # Worker entry point (message handler, main loop)
│   ├── config.ts               # Worker configuration (gameId from workerData)
│   ├── db.ts                   # Database connection (separate from backend)
│   ├── randomGameContent.ts    # Content generation (dilemma choices, etc.)
│   ├── setup/                  # Game initialization phase
│   │   ├── setup.ts            # Orchestrates setup steps
│   │   ├── galaxy.ts           # Generate star systems and positions
│   │   ├── components.ts       # Initialize ship components catalog
│   │   ├── resources.ts        # Initialize resource types
│   │   └── startingConditions.ts  # Player starting resources/positions
│   ├── tick/                   # Per-turn simulation (1 second = 1 tick)
│   │   ├── tick.ts             # Orchestrates all tick phases
│   │   ├── colonization.ts     # Pressure accumulation → colonization completion
│   │   ├── developmentStance.ts # Industry/mining allocation stance effects
│   │   ├── starSystemPopulation.ts  # Population growth and consumption
│   │   ├── starSystemEconomy.ts    # Mining and industry calculations
│   │   ├── industrialProjects.ts   # Queue and complete projects
│   │   ├── taskForceMovement.ts    # Calculate positions from orders
│   │   ├── taskForceMissions.ts    # Mission execution (explore, suppress, etc.)
│   │   ├── taskForceCombat.ts      # Engagement resolution
│   │   ├── research.ts             # Momentum accumulation, breakthroughs
│   │   ├── discoveries.ts          # New resource discoveries
│   │   ├── dilemmas.ts             # Generate dilemma prompts
│   │   ├── populationMigration.ts  # Inter-system population movement
│   │   ├── economyBalance.ts       # Turn-end balancing
│   │   └── types.ts                # Type definitions for tick phases
│   ├── react/                  # Event reaction handlers
│   │   ├── react.ts            # Main event router
│   │   └── dilemmaChoice.ts    # Dilemma choice application
│   └── __tests__/              # Unit tests
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

**Key Files:**
- `src/main.ts`: Worker entry, message handler, main loop (tick every 1 second)
- `src/setup/setup.ts`: Initializes game if `setupCompleted` is false
- `src/tick/tick.ts`: Executes all tick phases in sequence, generates TurnReport
- `src/react/react.ts`: Handles async events from backend (dilemma choices)
- Each tick phase file exports a function taking `(tx: Transaction, gameId: string)` and returning change arrays

**Execution Flow:**
1. Worker spawned with `workerData: { gameId }`
2. Load game from database via `getConnection()`, `getDrizzle()`
3. If `game.setupCompleted === false`: run `setup()` once
4. Apply all pending migrations via `applyMigrations(tx, gameId)`
5. Main loop: every 1 second, call `tick()` inside transaction
6. Tick collects all changes into arrays, creates `TurnReport` record
7. Worker posts `TurnReport` to backend via `parentPort.postMessage()`
8. Worker listens for `parentPort.on("message")` for notifications (dilemma choices)

### `packages/integration` - E2E Tests

**Purpose:** End-to-end testing with Playwright.

**Structure:**
```
packages/integration/
├── tests/                      # Test files
│   ├── *.spec.ts               # Test suites
│   └── ...
├── tests-examples/             # Example tests (reference)
├── playwright.config.ts        # Playwright configuration
├── prepare-test-db.mjs         # Database setup script
├── playwright-report/          # Test report artifacts
├── test-results/               # Test results
└── tsconfig.json
```

## Key Locations

**Entry Points:**
- Frontend: `packages/frontend/src/main.tsx` (React root)
- Backend: `packages/backend/src/main.ts` (HTTP server)
- Gameloop: `packages/gameloop/src/main.ts` (Worker entry)

**GraphQL Schema Definition:**
- All `.graphql` files in `packages/backend/src/schema/` (domain-organized)
- Generated merged schema: `packages/backend/src/schema/schema.generated.graphqls`

**Database Schema:**
- Table definitions: `packages/data/src/schema/*.ts` (one file per domain)
- Type exports: `packages/data/src/schema.ts` (re-export all)

**API Resolvers (by domain):**
- Queries: `packages/backend/src/schema/{domain}/resolvers/Query/*.ts`
- Mutations: `packages/backend/src/schema/{domain}/resolvers/Mutation/*.ts`
- Subscriptions: `packages/backend/src/schema/base/resolvers/Subscription/*.ts` and `packages/backend/src/schema/{domain}/resolvers/Subscription/*.ts`

**Frontend Routes:**
- Root: `packages/frontend/src/routes/__root.tsx`
- Games dashboard: `packages/frontend/src/routes/_dashboard/`
- Game detail: `packages/frontend/src/routes/games/_authenticated.$id/`

**Generated Code:**
- Frontend GraphQL hooks: `packages/frontend/src/gql/index.ts` (URQL codegen)
- Frontend route tree: `packages/frontend/src/routeTree.gen.ts` (TanStack Router)
- Backend GraphQL types: `packages/backend/src/schema/typeDefs.generated.ts` (GraphQL codegen)
- Backend resolvers index: `packages/backend/src/schema/resolvers.generated.ts`

**Shared Game Logic:**
- Query functions: `packages/data/src/functions/` (userHasVision, industrialProjectCatalog, etc.)
- Game migrations: `packages/data/src/gameMigrations/index.ts`
- Domain types: `packages/data/src/schema/*.ts`

## Naming Conventions

**Files:**

- **GraphQL schema files:** `schema.graphql` (domain root)
- **GraphQL resolvers:** `{Type}.ts` (e.g., `Game.ts`, `StarSystem.ts`) or `{Operation}/{Name}.ts` (e.g., `Query/games.ts`, `Mutation/createGame.ts`)
- **Routes:** `[_dashboard].[_authenticated].$id.[lazy].tsx` (TanStack Router file convention)
- **Database tables:** `{pluralEntity}.ts` (games.ts, players.ts, starSystems.ts)
- **Test files:** `*.spec.ts` or `*.test.ts`
- **Generated files:** `*.generated.ts` or `*.gen.ts` (do not edit)

**Directories:**

- **Features:** `{FeatureName}/` (capitalized, e.g., `SignIn/`, `GalaxyView/`)
- **Domains:** `{domain}/` (lowercase, e.g., `game/`, `starSystem/`, `taskForce/`)
- **Utilities:** `{utilityName}/` (lowercase, e.g., `format/`)
- **Schemas (data layer):** `schema/` (contains all table definitions)
- **Resolvers:** `resolvers/` (contains Query, Mutation, Subscription subdirs)

**TypeScript Variables & Functions:**

- **camelCase:** Variables, functions, methods
- **PascalCase:** Types, interfaces, components, classes
- **UPPER_SNAKE_CASE:** Constants
- **Types with $:** GraphQL types (convention seen: `TrackGameEvent` type union, not `$`)

## Where to Add New Code

**New GraphQL Query/Mutation:**
1. Create `.graphql` schema file: `packages/backend/src/schema/{domain}/schema.graphql`
2. Create resolver: `packages/backend/src/schema/{domain}/resolvers/{Query or Mutation}/{operationName}.ts`
3. Extend schema if needed: `extend type Query { ... }` or `extend type Mutation { ... }`
4. Run `yarn codegen` to regenerate types and index

**New Database Table:**
1. Create table definition: `packages/data/src/schema/{entity}.ts` using Drizzle
2. Export from `packages/data/src/schema.ts`
3. Run `yarn db:generate` to create migration SQL
4. Run `yarn db:push` to apply to database

**New Frontend Feature:**
1. Create feature directory: `packages/frontend/src/features/{FeatureName}/`
2. Create route file if needed: `packages/frontend/src/routes/{path}.tsx`
3. Use GraphQL hooks from `src/gql/` for data
4. Mantine components for UI, Pixi for 3D/canvas rendering

**New Frontend Route:**
1. Create file in `packages/frontend/src/routes/` following TanStack Router convention
2. Filename determines URL structure (e.g., `games/$id.tsx` → `/games/:id`)
3. Use `_authenticated` prefix for protected routes
4. Lazy-load with `.lazy.tsx` suffix if heavy component

**New Game Simulation Phase:**
1. Create function in `packages/gameloop/src/tick/{phaseName}.ts`
2. Function signature: `async function tick{PhaseName}(tx: Transaction, gameId: string): Promise<TypedChangeArray>`
3. Add to tick orchestration in `packages/gameloop/src/tick/tick.ts`
4. Return typed changes for turn report generation

**New Shared Function:**
1. Add to `packages/data/src/functions/` (or create new file)
2. Export from `packages/data/src/functions/index.ts`
3. Used by: Backend resolvers, Gameloop simulation

## Special Directories

**`packages/data/drizzle/`:**
- Purpose: Auto-generated SQL migration files
- Generated: `yarn db:generate` creates files here
- Committed: Yes (version control migrations)

**`packages/frontend/src/gql/`:**
- Purpose: Auto-generated URQL hooks from GraphQL schema
- Generated: On dev start and build via `vite-plugin-graphql-codegen`
- Committed: No (but codegen script committed)

**`packages/backend/src/schema/`:**
- Purpose: GraphQL schema definitions and resolvers
- Structure: Each domain gets subdirectory with `schema.graphql` and `resolvers/`
- Generated: `*.generated.ts` files (typeDefs, resolvers index, types)
- Committed: Yes (`.graphql` files), No (generated TS files)

**`packages/frontend/.tanstack/`:**
- Purpose: TanStack Router configuration and metadata
- Generated: On dev/build via `@tanstack/router-plugin`
- Committed: May be committed or generated

**`.env` file:**
- Location: Root or per-package (not committed)
- Required vars: `DB_CONNECTION_STRING`, `JWT_SECRET`
- Loaded by: nodemon in backend, vite env for frontend

---

*Structure analysis: 2025-02-18*
