# Testing

**Analysis Date:** 2025-01-15

## Frameworks

**Unit Testing:**
- **Vitest 4.1.2** - Test runner for backend and gameloop packages
- Config: `packages/backend/vitest.config.ts`, `packages/gameloop/vitest.config.ts`
- Assertion library: Built-in `expect()` from Vitest
- Minimal config: `export default defineConfig({ test: {} })`

**E2E Testing:**
- **Playwright 1.58.2** - Browser automation for end-to-end tests
- Config: `packages/integration/playwright.config.ts`
- Runs against live backend and frontend during tests

**Observable Testing:**
- **RxJS TestScheduler** - Testing observable streams
- Used in `packages/backend/src/observables/__tests__/`
- Cold observables created with `helpers.cold(pattern, values)`
- Expectations via `helpers.expectObservable()`

## Test File Organization

**Location:**
- Unit tests co-located with source code in `__tests__/` directories
- Pattern: `src/[domain]/[resolver-type]/__tests__/[name].spec.ts`
- Examples:
  - `packages/backend/src/schema/game/resolvers/__tests__/authorization.spec.ts`
  - `packages/gameloop/src/__tests__/taskForceMovement.spec.ts`
  - `packages/backend/src/observables/__tests__/taskForceMovements.spec.ts`

**E2E Tests:**
- Location: `packages/integration/tests/`
- Files: `smoke.spec.ts`, `ingame.spec.ts`, `fixture.ts`

**Naming:**
- Unit/integration tests: `[component].spec.ts` or `[component].test.ts`
- E2E tests: `[feature].spec.ts`
- Fixture/helper files: `fixture.ts`, `prepare-test-db.mjs`

**Test Count:**
- 25 test files across the monorepo
- Primary focus: backend resolvers, gameloop logic, and E2E smoke tests

## Test Structure

**Unit Test Suite Organization:**
```typescript
import { describe, expect, it, vi } from "vitest";

describe("mutation name", () => {
  it("behavior 1", async () => {
    // Arrange: create mocks and context
    // Act: call resolver
    // Assert: verify results
  });

  it("behavior 2", async () => {
    // ...
  });
});
```

**Example from `packages/backend/src/schema/starSystem/resolvers/__tests__/setDevelopmentStance.spec.ts`:**
```typescript
describe("setDevelopmentStance mutation", () => {
  it("rejects non-owner with NOT_AUTHORIZED", async () => {
    const ctx = {
      userId: "user-1",
      throwWithoutClaim: vi.fn(),
      denyAccess: vi.fn(denyAccess),
      drizzle: {
        query: {
          starSystems: {
            findFirst: vi.fn().mockResolvedValue({
              id: "ss-1",
              gameId: "game-1",
              ownerId: "user-2",
            }),
          },
        },
      },
    };

    await expect(
      callSetDevelopmentStance(
        {},
        { starSystemId: "ss-1", stance: "industrialize" },
        ctx as never,
        {} as never,
      ),
    ).rejects.toMatchObject(
      createGraphQLError("Not authorized to set development stance for this star system", {
        extensions: { code: "NOT_AUTHORIZED" },
      }),
    );
  });
});
```

**Patterns:**
- Async test functions: `async () => { }`
- Context/service objects created inline with mocks
- GraphQL errors tested with `.toMatchObject()`
- Mock method chaining for database queries
- Resolver functions extracted via `resolverFn()` helper to handle both direct functions and `{ resolve }` objects

## Unit Tests

**Location & Scope:**
- Test resolver authorization and business logic
- Located in `__tests__/` directories alongside resolvers
- Examples:
  - `packages/backend/src/schema/starSystem/resolvers/__tests__/setDevelopmentStance.spec.ts`
  - `packages/backend/src/schema/game/resolvers/__tests__/authorization.spec.ts`

**Test Data:**
- Inline mock objects with required properties
- Example from mutation test:
  ```typescript
  const ctx = {
    userId: "user-1",
    throwWithoutClaim: vi.fn(),
    denyAccess: vi.fn(denyAccess),
    drizzle: { ... }
  };
  ```

**Database Query Testing:**
- Mock Drizzle ORM query chains
- Pattern: `vi.fn().mockResolvedValue(result)` for async operations
- Chain mocks to represent query builder: `select().from().where()`
- Example:
  ```typescript
  const returning = vi.fn().mockResolvedValue([movedTaskForce]);
  const where = vi.fn().mockReturnValue({ returning });
  const set = vi.fn().mockReturnValue({ where });
  const update = vi.fn().mockReturnValue({ set });
  const tx = { select, update };
  ```

**Gameloop Tests:**
- Test tick functions with mocked transaction objects
- Tick functions signature: `tickFn(tx, context)` where context provides `addIndustryChange()`, `postMessage()`, etc.
- Assert on mock calls and event emissions
- Example from `packages/gameloop/src/__tests__/taskForceMovement.spec.ts`:
  ```typescript
  const events: Array<{ type: string; ... }> = [];
  
  await tickTaskForceMovement(tx as never, {
    addIndustryChange() {},
    turn: 3,
    postMessage: (event: unknown) => events.push(event as never),
  });
  
  expect(set).toHaveBeenCalledWith({ position, movementVector });
  expect(events).toEqual([{ type: "taskForce:position", ... }]);
  ```

## Integration Tests

**Location:**
- Resolver cross-cutting concerns tested in single file per domain
- Example: `packages/backend/src/schema/game/resolvers/__tests__/authorization.spec.ts`
- Tests multiple resolvers (`games`, `game`, `orderTaskForce`, `trackGame`, `trackStarSystem`) in one suite

**Setup/Teardown:**
- No explicit setup/teardown hooks observed
- Test isolation via inline mock creation per test
- Each test creates fresh context and mocks

**Patterns:**
```typescript
describe("story 1.2 authorization boundaries", () => {
  it("returns only games the current player belongs to", async () => {
    const findManyPlayers = vi.fn().mockResolvedValue([{ gameId: "game-1" }]);
    const findManyGames = vi.fn().mockResolvedValue([{ id: "game-1" }]);

    const ctx = {
      userId: "user-1",
      drizzle: {
        query: {
          players: { findMany: findManyPlayers },
          games: { findMany: findManyGames },
        },
      },
    };

    const result = await callGames({}, {}, ctx as never, {} as never);

    expect(result).toEqual([{ id: "game-1" }]);
  });
});
```

## E2E Tests

**Framework & Config:**
- Playwright 1.58.2
- Configuration: `packages/integration/playwright.config.ts`
- Test directory: `packages/integration/tests/`
- Browser: Chromium only (Desktop Chrome device)

**WebServer Setup:**
```javascript
webServer: [
  {
    command: "yarn prepare:db && yarn db:push --config=drizzle.config.test.ts && yarn dev:backend",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  {
    command: "yarn dev:frontend --host 127.0.0.1 --port 5173 --strictPort",
    port: 5173,
    timeout: 120 * 1000,
  },
]
```

**Reporter:**
- HTML reporter in local development
- GitHub reporter in CI environment

**Recording:**
- Screenshots: captured on test failure only
- Video: retained only on failure
- Trace: collected on first retry

**Test Patterns:**

From `packages/integration/tests/smoke.spec.ts`:
```typescript
import { expect, test } from "./fixture";

test("landing page renders the core CTA", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /The async 4X strategy game built for long campaigns/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Start your campaign" }),
  ).toBeVisible();
});

test("guest users are redirected to sign in when opening games", async ({
  page,
}) => {
  await page.goto("/games");
  await expect(page).toHaveURL(/\/signin/);
});

test("invalid access token redirects to sign in without crashing", async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      url: "http://127.0.0.1:5173/",
      httpOnly: false,
      sameSite: "Lax",
      name: "accessToken",
      value: "invalid.jwt.value",
    },
  ]);

  await page.goto("/games");
  await expect(page).toHaveURL(/\/signin/);
});
```

**Fixture Pattern:**
- Custom `test` fixture extends Playwright's base test
- Provides database seeding and JWT token generation
- Example from `packages/integration/tests/fixture.ts`:
  ```typescript
  import { test as base, expect } from "@playwright/test";
  import { getConnection, getDrizzle } from "@space/data";
  
  type Types = { /* entity insert/select type pairs */ };
  
  const Tables = { /* table mappings */ };
  
  export const test = base.extend<TestFixtures>({
    // fixture definitions
  });
  ```

## Mocking Patterns

**Vitest vi Module:**
- Import: `import { ... , vi } from "vitest"`
- Create mock functions: `vi.fn()`
- Return values: `.mockResolvedValue()`, `.mockReturnValue()`
- Track calls: `.toHaveBeenCalled()`, `.toHaveBeenCalledWith()`, `.toHaveBeenCalledTimes()`

**Mock Functions:**
```typescript
const findManyPlayers = vi.fn().mockResolvedValue([{ gameId: "game-1" }]);
const where = vi.fn().mockReturnValue({ returning });
const select = vi.fn().mockReturnValue({ from });
```

**What to Mock:**
- Database query methods (via Drizzle ORM)
- Authorization/context methods (`throwWithoutClaim`, `denyAccess`)
- External service calls
- RxJS event streams (via `fromGameEvents` in observables)

**What NOT to Mock:**
- GraphQL error creation (`createGraphQLError`) - use real errors for comparison
- Helper utility functions for business logic
- Error constructors and message formatting

**Module Mocking:**
```typescript
vi.mock("../../workers.ts");

// Later:
vi.mocked(fromGameEvents).mockReturnValue(
  helpers.cold(pattern, values)
);
```

## Test Data

**Fixtures:**
- No separate fixture files for unit tests
- Test data created inline within each test
- Constants defined at file top for reusable test decks
- Example from `packages/gameloop/src/__tests__/taskForceCombat.spec.ts`:
  ```typescript
  const VALID_DECK_A = [
    "target_lock",
    "emergency_repairs",
    "laser_burst",
    // ...
  ] as const;
  ```

**Factories:**
- Helper functions for complex object creation
- Example from `packages/gameloop/src/__tests__/taskForceCombat.spec.ts`:
  ```typescript
  function createSelectChain(result: unknown[]) {
    const where = vi.fn().mockResolvedValue(result);
    const secondJoin = vi.fn().mockReturnValue({ where });
    // ... chains together query builders
  }
  
  function createTxWithTaskForcesAndComponents(
    taskForces: MockTaskForce[],
    components: MockComponentRow[],
  ) {
    // ... returns mocked transaction
  }
  ```

**E2E Fixtures:**
- Database seeding via Drizzle ORM directly in fixture
- JWT token generation with `SignJWT` from `jose`
- Fixture provides pre-authenticated `page` with cookies set

## Coverage

**Requirements:**
- No coverage targets enforced
- Coverage reporting not configured in vitest.config.ts

**Observable Testing with TestScheduler:**

From `packages/backend/src/observables/__tests__/taskForceMovements.spec.ts`:
```typescript
import { TestScheduler } from "rxjs/testing";
import { expect, it, vi } from "vitest";

it("should track taskforce movements", async () => {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toMatchObject(expected);
  });

  testScheduler.run((helpers) => {
    /**
     * a: taskForce:appeared
     * m: taskForce:position
     * n: taskForce:position
     * o: taskForce:position (not appeared for user)
     * d: taskForce:disappeared
     */
    const observed = "a--m-o-d--n";
    const expected = "a--m---d---";

    vi.mocked(fromGameEvents).mockReturnValue(
      helpers.cold(observed, {
        a: { type: "taskForce:appeared", id: "tf1", userId: "user", ... },
        m: { type: "taskForce:position", id: "tf1", ... },
        // ...
      }),
    );

    helpers
      .expectObservable(
        taskForces$({
          gameId: "game",
          userId: "user",
          initialTaskForces: [],
        }),
      )
      .toBe(expected, {
        a: { __typename: "PositionableApppearsEvent", ... },
        // ...
      });
  });
});
```

## Run Commands

**Unit Tests (Backend):**
```bash
yarn workspace @space/backend test     # Run backend unit tests
yarn workspace @space/gameloop test    # Run gameloop unit tests
```

**All Unit Tests:**
```bash
yarn test                              # Run all workspace unit tests
```

**E2E Tests:**
```bash
yarn workspace @space/integration integrate      # Run all E2E tests
yarn workspace @space/integration integrate:ui   # Interactive UI mode
yarn workspace @space/integration integrate:headed # Headed browser mode
```

**Type Checking:**
```bash
yarn typecheck                         # Type-check all packages
yarn workspace @space/backend typecheck
```

## Common Test Patterns

**Resolver Testing - Happy Path:**
```typescript
it("resolves query with results", async () => {
  const ctx = {
    userId: "user-1",
    throwWithoutClaim: vi.fn(),
    drizzle: {
      query: {
        games: { findMany: vi.fn().mockResolvedValue([...]) },
      },
    },
  };

  const result = await callGames({}, {}, ctx as never, {} as never);
  
  expect(result).toEqual([...]);
  expect(ctx.throwWithoutClaim).toHaveBeenCalledWith("urn:space:claim");
});
```

**Resolver Testing - Error Path:**
```typescript
it("rejects with authorization error", async () => {
  const ctx = {
    userId: "user-1",
    throwWithoutClaim: vi.fn(),
    denyAccess: vi.fn(denyAccess),
    drizzle: { ... },
  };

  await expect(
    callMutation({}, args, ctx as never, {} as never),
  ).rejects.toMatchObject(
    createGraphQLError("Error message", {
      extensions: { code: "ERROR_CODE" },
    }),
  );
});
```

**Async Error Testing:**
```typescript
await expect(asyncFn()).rejects.toMatchObject(
  createGraphQLError(message, { extensions: { code } }),
);
```

**Mock Verification:**
```typescript
expect(mockFn).toHaveBeenCalledWith(expectedArg);
expect(mockFn).toHaveBeenCalledTimes(1);
expect(result).toEqual(expectedValue);
```

**Observable Value Testing:**
```typescript
expect(events).toEqual([
  {
    type: "taskForce:position",
    id: "tf-1",
    position: { x: 10, y: 20 },
    movementVector: { x: 10, y: 20 },
  },
]);
```

---

*Testing analysis: 2025-01-15*
