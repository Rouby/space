# Technical Concerns

**Analysis Date:** 2024-12-20

## Known Issues

**Docker Cache Layer Bug:**
- Issue: Docker buildkit cache handling requires manual workaround (moby/buildkit#1896)
- Files: `.github/workflows/deploy.yml`
- Current mitigation: Manual cache directory reset after build (`rm -rf /tmp/.buildx-*-cache && mv /tmp/.buildx-*-cache-new /tmp/.buildx-*-cache`)
- Impact: Extra I/O operations, slower CI/CD builds, cache reliability
- Fix approach: Monitor moby/buildkit for upstream fix; consider upgrading Docker buildkit when issue is resolved

**Playwright Browser Install Commented Out in Some Paths:**
- Issue: Browser install step exists in setup workflow but may not be consistently applied across all CI paths
- Files: `.github/workflows/copilot-setup-steps.yml` (has `playwright install --with-deps`), `.github/workflows/deploy.yml` integration tests (has the command)
- Impact: Integration tests could fail if browser dependencies are missing
- Fix approach: Ensure browser install is always executed before integration test runs; consider moving to a separate setup step

**Incomplete Starting Conditions Generator:**
- Issue: Starting condition setup only checks if system is already taken, doesn't validate distance or other conditions
- Files: `packages/gameloop/src/setup/startingConditions.ts:27` - `TODO: other conditions, like distance etc.`
- Impact: Starting players could be placed too close together, affecting game balance
- Fix approach: Implement distance validation in the player spawn selection loop

---

## Technical Debt

**Unstructured Logging Throughout Codebase:**
- Issue: Heavy use of `console.log` for logging instead of structured logging
- Files: 
  - `packages/gameloop/src/main.ts` (multiple console.log calls)
  - `packages/gameloop/src/setup/` (multiple setup logging statements)
  - `packages/backend/src/main.ts`
  - `packages/data/src/gameMigrations/index.ts`
- Impact: Difficult to parse logs in production, no log levels, cannot filter/aggregate
- Fix approach: Implement structured logging with a proper logger (e.g., pino, winston) with JSON output and log levels

**Hardcoded Default JWT Secret:**
- Issue: Default secret "electric-kitten" used when `JWT_SECRET` env var is missing
- Files:
  - `packages/backend/src/schema/user/resolvers/Mutation/token.ts:5`
  - `packages/backend/src/main.ts:23`
  - `packages/integration/tests/fixture.ts:89`
- Impact: Security risk if environment variable is not set in production; weak default key
- Fix approach: Make JWT_SECRET required at startup; throw error if not provided; update tests to use a test-specific secret

**Memory Leak Risk in Worker Management:**
- Issue: `eventsPerGame` and `workerPerGame` Maps in workers.ts are never cleaned up when games end
- Files: `packages/backend/src/workers.ts:5-6, 24-32`
- Impact: Long-running server will accumulate stale Subject instances and Worker references, increasing memory usage
- Fix approach: Add cleanup function called when game ends to remove entries from both Maps; implement reference counting or TTL-based cleanup

**Missing Error Handler for Worker Startup Failures:**
- Issue: If a Worker fails to start, no error event listener is attached
- Files: `packages/backend/src/workers.ts:8-22`
- Impact: Worker crashes will silently fail; worker.on("error") is not implemented
- Fix approach: Add worker.on("error") handler to log and potentially restart worker

**Incomplete Error Handling in React Component:**
- Issue: `react()` function in gameloop catches errors but only logs them without propagating or marking game state
- Files: `packages/gameloop/src/main.ts:17-19`
- Impact: Errors in game event handlers are silently swallowed; game could be left in inconsistent state
- Fix approach: Track error state in database; implement retry logic or game pause on errors

---

## Security Concerns

**HTTP-only Cookie Extraction in Frontend:**
- Issue: Frontend code attempts to manually extract JWT from `document.cookie` despite being HTTP-only
- Files: `packages/frontend/src/Auth.tsx:55-59`
- Current behavior: Manual cookie parsing tries to find "accessToken=" in document.cookie
- Problem: HTTP-only cookies cannot be accessed from JavaScript; this code will always fail silently
- Fix approach: Remove manual cookie extraction; rely on automatic cookie handling by URQL/HTTP client; verify JWT is being sent via HTTP headers on backend

**No CSRF Protection:**
- Issue: GraphQL mutations are not protected against CSRF attacks
- Files: `packages/backend/src/main.ts` (GraphQL server setup)
- Current mitigation: Relies on SameSite cookie policy
- Fix approach: Implement CSRF token validation or double-submit cookie pattern; ensure SameSite=Strict is enforced

**Weak Default App Origin Handling:**
- Issue: If `APP_ORIGIN` is not set, falls back to localhost; could allow unvalidated origins in development
- Files: `packages/backend/src/config.ts:1-23`
- Impact: CORS misconfiguration possible if APP_ORIGIN is not properly set
- Fix approach: Explicitly validate APP_ORIGIN is set in production mode; implement origin whitelist

**Type Safety Bypasses:**
- Issue: Code uses `@ts-expect-error` and generated files have `@ts-nocheck`
- Files: 
  - `packages/frontend/src/features/GalaxyView/coordinateToGrid.ts:22` (@ts-expect-error)
  - `packages/frontend/src/routeTree.gen.ts:3` (@ts-nocheck)
- Impact: Type safety gaps not properly documented; generated files may have hidden type issues
- Fix approach: Document why @ts-expect-error exists; regenerate routeTree.gen.ts to ensure it's properly typed

**142 Uses of `any` Type:**
- Issue: 142 instances of `any` type found in source code (excluding tests)
- Impact: Type safety severely compromised in multiple areas
- Fix approach: Systematic audit and replacement of `any` with proper types; use biome rule to prevent new `any` usage

---

## Performance Concerns

**Synchronous I/O in Gameloop Startup:**
- Issue: Game initialization reads from database in series without optimization
- Files: `packages/gameloop/src/main.ts:25-31`
- Impact: Slow startup; cascading I/O delays
- Fix approach: Parallelize independent queries; batch read operations

**Unbounded Loop in Worker Main Process:**
- Issue: Worker runs infinite `while (true)` loop with 1-second polling
- Files: `packages/gameloop/src/main.ts:40-58`
- Impact: Unnecessary CPU wake-ups every second even when no action needed; poor resource utilization
- Fix approach: Implement event-driven tick system using database notifications or pub/sub; move to interrupt-driven model

**Heavy Iteration in Starting Conditions:**
- Issue: Player spawn selection uses infinite loop with random selection until valid system found
- Files: `packages/gameloop/src/setup/startingConditions.ts:25-90`
- Impact: With many players and systems, could hit O(n²) behavior; unbounded retry loop
- Fix approach: Implement Fisher-Yates shuffle for system selection; validate constraints before loop

**No Database Connection Pooling Configuration Visible:**
- Issue: Drizzle database connections may not be pooled optimally for multiple workers
- Files: `packages/data/src/index.ts:8`
- Impact: Each worker could open multiple database connections; connection exhaustion under load
- Fix approach: Implement explicit connection pool configuration; verify pool settings for production

---

## Fragile Areas

**Incomplete Game State Validation in Mutations:**
- Issue: Many mutations check individual conditions but not the complete game state validity
- Files: 
  - `packages/backend/src/schema/starSystem/resolvers/Mutation/setColonizationGovernance.ts`
  - `packages/backend/src/schema/taskForce/resolvers/Mutation/configureTaskForceCombatDeck.ts`
  - `packages/backend/src/schema/shipDesign/resolvers/Mutation/createShipDesign.ts`
- Example: Ship design validates components individually but doesn't check combined properties
- Risk: State transitions could produce invalid game states
- Safe modification: Add comprehensive validation helper functions; add integration tests for multi-step workflows

**Race Conditions Between Player Actions and Game Tick:**
- Issue: No explicit locking mechanism between player mutations and game tick execution
- Files: 
  - `packages/backend/src/workers.ts` (tick initiated)
  - `packages/backend/src/schema/starSystem/resolvers/Mutation/` (player actions)
- Risk: Player action could be processed after tick calculation; calculation could race with action
- Mitigation: Database transactions provide some protection but not complete
- Safe modification: Add explicit game.isProcessing flag; queue mutations during tick

**Missing Cleanup in Failed Worker Initialization:**
- Issue: If game setup fails, worker doesn't clean up resources
- Files: `packages/gameloop/src/main.ts:25-36`
- Risk: Partial setup state persists; subsequent attempts may fail differently
- Safe modification: Wrap entire setup in try-catch; implement rollback on failure

**Test Coverage Gaps in Worker Threading:**
- Issue: Only 25 test files for large backend codebase (131 implementation files)
- Impact: Worker threading logic (spawn/shutdown) largely untested
- Test gaps: `packages/backend/src/workers.ts` has no dedicated tests
- Priority: HIGH - Worker lifecycle is critical to system stability

**Database Transaction Rollback Reliability:**
- Issue: While transactions are used, error handling after transaction failures is minimal
- Files: Multiple mutation resolvers use `ctx.drizzle.transaction()` but don't always validate rollback
- Risk: Partial updates could persist on transaction failure
- Safe modification: Add comprehensive transaction failure logging; test rollback scenarios

---

## Missing Features / Gaps

**No Observability/Monitoring Infrastructure:**
- Missing: Error tracking (Sentry/similar), distributed tracing, metrics collection
- Files: No telemetry code found in codebase
- Impact: Production issues are invisible; cannot debug performance problems
- Fix: Integrate error tracking service; add structured logging with correlation IDs

**No Rate Limiting:**
- Missing: API rate limiting for mutations
- Impact: Players could spam requests; no protection against abuse
- Fix: Implement GraphQL rate limiting middleware; per-player request limits

**No Game State Checkpoint/Restore:**
- Missing: Ability to save and restore game state for debugging
- Impact: Cannot replay game to debug issues; no crash recovery
- Fix: Implement savepoint system; implement game replay capability

**No Auth Refresh Token Rotation:**
- Missing: Refresh tokens are never rotated
- Impact: Stolen refresh token grants indefinite access
- Fix: Implement refresh token rotation on each use; add token versioning

---

## Dependency Risks

**Using Experimental Node.js Features:**
- Issue: Production code uses `--experimental-strip-types` flag
- Files: All Dockerfiles and gameloop worker invocation
- Impact: Node.js version constraints; potential breaking changes in future versions
- Status: Experimental feature became stable in Node 22+; current version is Node 24
- Fix approach: Monitor Node.js releases for feature stabilization; test beta versions early

**Tight Version Coupling:**
- Issue: Yarn v4 with PnP loose mode may have edge cases not fully documented
- Files: `.yarnrc.yml`, dependency configuration
- Fix approach: Maintain detailed deployment notes; test version upgrades thoroughly

**Biome Linter Strictness:**
- Issue: Code contains many `biome-ignore` comments suppressing rules (e.g., `suspicious/noExplicitAny`)
- Files: Test files and integration code
- Impact: Linting rules not being enforced; code quality gaps hidden
- Fix approach: Gradually eliminate suppressions; fix underlying issues instead of ignoring rules

---

## Summary of Critical Issues by Priority

### P0 (Critical - Fix Before Production)
1. **Hardcoded JWT secret** - Security vulnerability
2. **Memory leak in worker/events maps** - Affects long-running server stability
3. **Missing error handler on Worker** - Silent failures in critical system
4. **Worker main loop never exits cleanly** - Resource leak on graceful shutdown

### P1 (High - Fix in Near Term)
1. **HTTP-only cookie extraction in frontend** - Broken auth flow
2. **Unstructured logging** - Cannot debug/monitor production
3. **Race conditions between mutations and ticks** - Data consistency
4. **Test coverage for worker threading** - Critical system barely tested

### P2 (Medium - Plan for Next Phase)
1. **Docker cache workaround** - CI/CD slowness
2. **Incomplete validation in mutations** - Game state validity
3. **No observability infrastructure** - Production blindness
4. **Type safety gaps (142 `any` usages)** - Type checking unreliable

### P3 (Low - Improvements)
1. **Starting conditions incomplete** - Game balance issue
2. **No CSRF protection** - Best practice missing
3. **Connection pooling not explicit** - May scale poorly
4. **No rate limiting** - Not resilient to abuse

---

*Technical debt audit: 2024-12-20*
