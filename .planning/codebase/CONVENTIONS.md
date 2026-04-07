# Coding Conventions

**Analysis Date:** 2025-01-15

## Language & Style

**TypeScript 6.0.2** with strict mode enabled:
- `strict: true` (all strict checks active)
- `strictNullChecks: true` (mandatory null handling)
- `skipLibCheck: true` (skip library declaration checks)
- `moduleResolution: "Bundler"` (ESM module resolution)
- `target: "ESNext"` (modern JavaScript output)
- `module: "ESNext"` (ESM syntax)
- `noEmit: true` (type-checking only, no code generation)

**Biome 2.4.6** for formatting and linting:
- Formatter enabled on `**/src/**/*` and `**/tests/**/*`
- Linter with recommended rules and suspicious rules
- Generated files excluded (`.generated.ts`, `.gen.ts`, `gql/` directory)
- Backend packages (`backend`, `data`, `gameloop`) enforce explicit `.ts` extensions on imports

## Naming Patterns

**Variables & Constants:**
- camelCase for all variable and function names
- Example: `userId`, `memberships`, `findManyPlayers`, `denyAccess`
- Const declarations preferred: `const memberships = ...`

**Functions:**
- camelCase convention
- Use `function` keyword for named functions, arrow functions for inline definitions
- Example: `function createSelectChain(result: unknown[]) { ... }`

**Types & Interfaces:**
- PascalCase for types: `Context`, `CallableResolver`, `Types`
- Generic type parameters use single uppercase letters: `TArgs`, `TResult`
- Example from `packages/backend/src/schema/game/resolvers/__tests__/authorization.spec.ts`:
  ```typescript
  type CallableResolver<TArgs extends unknown[], TResult> =
    | ((...args: TArgs) => TResult)
    | { resolve: (...args: TArgs) => TResult };
  ```

**Files:**
- camelCase for source files: `createShipDesign.ts`, `authorization.spec.ts`
- Descriptive names matching exported symbol: `createShipDesign.ts` exports `createShipDesign`
- Test files use `.spec.ts` or `.test.ts` suffix
- `__tests__` directories co-located with source: `src/schema/game/resolvers/__tests__/`

## Import Organization

**Order of imports:**
1. Type imports from external packages: `import type { JWTExtendContextFields } from "@graphql-yoga/plugin-jwt"`
2. Regular imports from external packages: `import { userHasVision } from "@space/data/functions"`
3. Type imports from relative paths: `import type { Context } from "./config.js"`
4. Regular imports from relative paths: `import { fromGameEvents } from "./workers.ts"`

**Path Aliases:**
- Workspace packages use `@space/` prefix: `@space/data`, `@space/data/functions`, `@space/data/schema`
- Example: `import { userHasVision } from "@space/data/functions"`

**Extensions:**
- Backend, data, and gameloop packages **MUST** use explicit `.ts` extensions (Biome rule enforced)
- Example: `import { fromGameEvents } from "./workers.ts"` (not `"./workers"`)
- Extensions in generated/imported statements required per linter configuration in `biome.json`

**Separation of concerns:**
- Separate type imports using `import type` syntax
- Example mixing in single import: `import { createGraphQLError, type YogaInitialContext } from "graphql-yoga"`

## Error Handling

**Pattern:**
- Throw GraphQL errors using `createGraphQLError` from `graphql-yoga`
- Include error code in extensions object: `{ extensions: { code: "NOT_AUTHORIZED" } }`
- Example from `packages/backend/src/context.ts`:
  ```typescript
  throw createGraphQLError(message, {
    extensions: { code },
  });
  ```

**Error Codes:**
- Standardized codes: `"NOT_AUTHORIZED"`, `"MISSING_CLAIM"`, `"GAME_NOT_STARTED"`, `"INVALID_GAME_EVENT"`
- Include context metadata in logged errors when appropriate

**Authorization Errors:**
- Use `context.denyAccess()` method for authorization failures
- Include `code`, `reason`, and optional `details` object
- All authorization denials are logged with JSON structure including timestamp and userId

**Resolver Pattern:**
- Context assertion helpers like `context.throwWithoutClaim()` ensure type guards
- Example: `context.throwWithoutClaim("urn:space:claim")` asserts `userId` is defined
- Throws immediately if claim missing; no return statement needed

## Async Patterns

**Async/Await:**
- All resolver functions are `async`
- Use explicit `await` for promises
- Example: `const result = await callSetDevelopmentStance(...)`

**Database Transactions:**
- Use `ctx.drizzle.transaction()` for multi-step operations
- Example from `packages/backend/src/schema/shipDesign/resolvers/Mutation/createShipDesign.ts`:
  ```typescript
  return ctx.drizzle.transaction(async (tx) => {
    // transaction body with tx.query.*.findMany(), tx.insert(), etc.
  });
  ```

**Promises in Mocks:**
- Use `.mockResolvedValue()` for async mock returns
- Example: `vi.fn().mockResolvedValue([{ gameId: "game-1" }])`

**Observables:**
- RxJS observables used for event streams in backend
- TestScheduler used with `.cold()` and `.hot()` helpers for testing
- `testScheduler.run((helpers) => { ... })` pattern for observable tests

## Type Patterns

**Type Assertions:**
- Use `as` for explicit type casting when necessary
- Example: `const context: Context = ctx`
- Resolver type annotations: `export const games: NonNullable<QueryResolvers["games"]>`

**Union Types:**
- Used for flexible function signatures
- Example: `type CallableResolver<TArgs, TResult> = ((...args: TArgs) => TResult) | { resolve: (...args: TArgs) => TResult }`

**Generics:**
- Extensively used with constraint syntax: `<TArgs extends unknown[]>`
- Type parameter naming: `T` for simple types, `T<Domain>` for domain-specific

**Type Inference:**
- Leverage `ReturnType<typeof fn>` for deriving types from functions
- Example: `export type Context = YogaInitialContext & ReturnType<typeof extendContext>`

**Null Handling:**
- Strict null checking active; use `?? null` for explicit null coalescing
- Example: `userId: userId ?? null`
- Check `startedAt !== null` before accessing game state properties

## Component/Module Organization

**Backend Resolvers:**
- Located in `packages/backend/src/schema/[domain]/resolvers/`
- Subdirectories by resolver type: `Query/`, `Mutation/`, `Subscription/`, or field names
- Example structure:
  ```
  packages/backend/src/schema/
  ├── shipDesign/
  │   ├── resolvers/
  │   │   ├── Mutation/
  │   │   │   └── createShipDesign.ts
  │   │   ├── Game.ts
  │   │   ├── Player.ts
  │   │   └── __tests__/
  │   │       └── *.spec.ts
  │   └── schema.mappers.ts
  ```

**Gameloop Logic:**
- Pure business logic in `packages/gameloop/src/`
- Tick functions: `packages/gameloop/src/tick/[domain].ts`
- Example: `packages/gameloop/src/tick/taskForceMovement.ts`
- Accepts transaction (`tx`), context object, and posts events via `postMessage()`

**Test Structure:**
- Tests co-located in `__tests__/` subdirectory
- Mirror source structure within test directory
- No separate `tests/` directory for unit tests (co-location pattern)

## Comments & Documentation

**JSDoc/TSDoc:**
- No extensive JSDoc usage observed; rely on clear naming and type annotations
- Comments used sparingly for non-obvious business logic
- Tests use minimal comments; test names describe intent

**Logging:**
- Structured JSON logging for security/audit events
- Example: `console.warn(JSON.stringify({ event, code, reason, userId, timestamp, ...details }))`
- Three logging levels observed: `console.log()`, `console.warn()`
- Structured event names: `"security.authorization.denied"`

## Function Design

**Size & Scope:**
- Single responsibility; resolvers handle one domain operation
- Example resolver: `setDevelopmentStance` checks authorization, validates game state, executes mutation

**Parameters:**
- Resolver functions accept: `(parent, args, context, info)`
- Use destructuring for args and context
- Example: `async (_parent, { gameId, design }, ctx)`

**Return Values:**
- Return query results directly: `return ctx.drizzle.query.games.findMany({ ... })`
- Throw errors for failures; don't return error objects
- Mutations return affected domain objects
- Subscriptions return observable streams

**Helper Functions:**
- Extract inline test logic into typed helper functions
- Example from `packages/gameloop/src/__tests__/taskForceCombat.spec.ts`:
  ```typescript
  function createSelectChain(result: unknown[]) {
    const where = vi.fn().mockResolvedValue(result);
    const secondJoin = vi.fn().mockReturnValue({ where });
    // ...
  }
  ```

## Module Design

**Exports:**
- Named exports preferred: `export const games = ...`
- Type exports use `export type`: `export type Context = ...`
- Index/barrel files used minimally; direct imports preferred
- Example: `import { userHasVision } from "@space/data/functions"` (not from `"@space/data"`)

**Import Side Effects:**
- Side-effect-free modules
- Worker imports initialize message handlers but no global state
- Example: `import { fromGameEvents } from "./workers.ts"` - provides event stream function

**Workspace Dependencies:**
- Declared as `workspace:*` in package.json
- Example: `"@space/data": "workspace:*"`
- Allows cross-workspace imports without publishing

---

*Convention analysis: 2025-01-15*
