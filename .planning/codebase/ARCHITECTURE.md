# Architecture

**Analysis Date:** 2025-02-18

## Pattern Overview

**Overall:** Distributed multi-tiered monorepo with separate API, game simulation, and frontend packages. Server-Client architecture with real-time subscriptions.

**Key Characteristics:**
- GraphQL API layer serving a React frontend
- Node.js Worker Threads for isolated per-game simulation (gameloop)
- Shared data layer (Drizzle ORM) across backend and gameloop
- Yarn v4 PnP monorepo with workspace dependencies
- Real-time event streaming between backend and frontend via GraphQL subscriptions

## Layers

**Presentation Layer (Frontend):**
- Purpose: User-facing React application with real-time game visualization
- Location: `packages/frontend/src/`
- Contains: Routes, UI components, features, GraphQL client, canvas rendering
- Depends on: GraphQL API (backend), Mantine UI, Pixi.js, TanStack Router
- Used by: Web browsers

**GraphQL API Layer (Backend):**
- Purpose: Provides GraphQL schema, resolvers, authentication, and real-time subscriptions
- Location: `packages/backend/src/`
- Contains: Schema definitions, resolvers organized by domain, context, JWT auth, Worker management
- Depends on: Data layer, Gameloop package, GraphQL Yoga, JWT authentication
- Used by: Frontend, Gameloop (event subscriptions)

**Gameloop Layer (Game Simulation):**
- Purpose: Per-game isolated simulation running in Node.js Worker Threads
- Location: `packages/gameloop/src/`
- Contains: Setup phase, tick simulation, game reactions, random content generation
- Depends on: Data layer (database access), Game migrations
- Used by: Backend (started/managed by worker threads)

**Data Layer (Persistence & Shared Logic):**
- Purpose: Database schema, ORM bindings, and shared query functions
- Location: `packages/data/src/`
- Contains: Drizzle schema definitions, game migrations, helper functions
- Depends on: PostgreSQL via Drizzle ORM
- Used by: Backend, Gameloop

**Integration Tests:**
- Purpose: End-to-end testing with Playwright
- Location: `packages/integration/`
- Contains: Playwright tests, test database setup
- Used by: CI/CD pipeline

## Data Flow

**Game Creation & Initialization:**

1. Frontend calls `createGame` mutation → Backend resolver
2. Backend creates game record via Drizzle into PostgreSQL
3. Backend returns Game object with initial state to Frontend
4. Frontend transitions to game lobby

**Game Start:**

1. Frontend calls `startGame` mutation → Backend resolver
2. Backend marks game as started in database
3. Backend spawns Worker Thread with gameloop via `startWorker()`
4. Gameloop worker calls `setup()` to initialize game state (players, resources, star systems)
5. Gameloop applies migrations and enters main loop
6. Frontend immediately subscribes to game events via `trackGame` subscription

**Per-Turn Simulation:**

1. Gameloop worker runs `tick()` every 1000ms
2. Tick executes in order: colonization, development, industry, population, mining, research, discoveries, dilemmas, task forces, combat, migrations
3. Each tick phase reads from DB, calculates changes, writes results
4. Gameloop emits `TurnReport` events via `parentPort.postMessage()` 
5. Backend receives worker messages and converts to RxJS Subject events
6. Frontend receives events via GraphQL subscription `trackGame`
7. Frontend updates UI with new game state

**Player Actions:**

1. Frontend sends mutation (e.g., `setResearchFocus`) → Backend resolver
2. Backend validates authorization via context claims
3. Backend updates player state in database
4. If action affects simulation: Backend calls `notifyWorker(gameId, event)` 
5. Gameloop worker receives message via `parentPort.on("message")`
6. Gameloop processes event in `react()` function (e.g., `reactDilemmaChoice`)
7. Next tick includes updated state

**Subscriptions & Events:**

1. Backend manages per-game event streams via RxJS Subjects (map in `workers.ts`)
2. GraphQL Subscription resolvers return observable from `fromGameEvents(gameId)`
3. Gameloop Worker Thread and Backend can emit events via `emitGameEvent()`
4. Events stream to Frontend over WebSocket

**State Management:**

- **Authoritative state:** PostgreSQL database (source of truth)
- **Game simulation:** Cached in Worker Thread during tick execution
- **Frontend cache:** URQL with GraphQL Cache exchange for offline-first
- **Real-time sync:** GraphQL subscriptions push changes to clients

## Key Abstractions

**Context (Backend Authority):**
- Purpose: Request-scoped context passed to all resolvers
- Examples: `packages/backend/src/context.ts`
- Pattern: Extended Yoga context with Drizzle instance, user claims, helper methods (`denyAccess`, `throwWithoutClaim`, `hasVision`)

**GameEvent (Real-time Communication):**
- Purpose: Typed events flowing from gameloop to backend to frontend
- Examples: `TurnEndedEvent`, `NewTurnCalculatedEvent`, custom domain events
- Pattern: Union types in schema, discriminated by type field, published via RxJS Subject

**Transaction (Atomic Game Updates):**
- Purpose: Grouped database operations during tick phase
- Examples: Population changes, industrial projects, resource mining in single transaction
- Pattern: `drizzle.transaction((tx) => ...)` wrapping multiple SQL operations

**Resolver (GraphQL Operations):**
- Purpose: Domain-specific GraphQL operation handlers
- Examples: `packages/backend/src/schema/{domain}/resolvers/`
- Pattern: File-per-resolver organized by Query/Mutation/Subscription/Type, imports shared functions

**Migration (Game-Specific State):**
- Purpose: Versioned game logic applied after setup
- Examples: `packages/data/src/gameMigrations/`
- Pattern: Sequential migrations stored in database, applied on worker startup and after turns

**Tick Phase (Simulation Step):**
- Purpose: Isolated calculation phase in game loop
- Examples: `tickStarSystemPopulation`, `tickTaskForceCombat`, `tickResearch`
- Pattern: Pure functions taking transaction + game data, returning changes to report

## Entry Points

**Frontend Entry:**
- Location: `packages/frontend/src/main.tsx`
- Triggers: Page load/refresh
- Responsibilities: Initialize React root, setup Mantine theme, URQL client, Auth provider, Router

**Backend Entry:**
- Location: `packages/backend/src/main.ts`
- Triggers: `yarn dev:backend` or deployment
- Responsibilities: Create HTTP server with GraphQL Yoga, setup JWT auth, initialize database, spawn initial workers for active games, handle SIGTERM/SIGINT

**Gameloop Worker Entry:**
- Location: `packages/gameloop/src/main.ts`
- Triggers: `startWorker(gameId)` called from backend
- Responsibilities: Load game from database, run setup if needed, apply migrations, enter main loop, listen for parent port messages

**Frontend Routes (File-based Router):**
- Location: `packages/frontend/src/routes/`
- Pattern: TanStack Router file-based routing (`_authenticated.$id.tsx` for dynamic routes)
- Key routes: `/__root.tsx`, `/_dashboard.tsx`, `/games/_authenticated.$id`

## Error Handling

**Strategy:** Layered validation with graceful degradation

**Patterns:**

1. **Authorization Errors:** `context.denyAccess()` throws GraphQL error with code (NOT_AUTHORIZED, MISSING_CLAIM)
2. **Database Errors:** Caught as `DatabaseError` in mutations, logged, returned as GraphQL errors
3. **Worker Errors:** Logged to console, worker exits with error code, game becomes orphaned (cleanup handled by DB checks)
4. **Network Errors:** Frontend URQL cache falls back to last known good state, retry on reconnect
5. **Validation:** Implicit via TypeScript, GraphQL schema validation, database constraints

## Cross-Cutting Concerns

**Logging:** 
- Console.log for events (worker lifecycle, game start/stop)
- JSON-structured logs for security events (authorization denied)
- No structured logging framework integrated

**Validation:**
- GraphQL schema validation (types, required fields)
- TypeScript compile-time validation across monorepo
- Database constraints (NOT NULL, unique, foreign keys)
- No runtime schema validation library

**Authentication:**
- JWT tokens with claims (urn:space: prefix)
- Token extracted from `accessToken` cookie
- Algorithms: HS256 (sync dev), RS256 (asymmetric production)
- Claims determine player's visibility/control (`urn:space:gameId`, `urn:space:playerId`)

**Authorization:**
- Claim-based access control per resolver
- `context.throwWithoutClaim()` asserts user has required role
- Game vision query (`hasVision`) checks if player can see star system

---

*Architecture analysis: 2025-02-18*
