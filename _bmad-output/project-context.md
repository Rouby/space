---
project_name: 'space'
user_name: 'Rouby'
date: '2026-03-08T02:37:32+01:00'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
existing_patterns_found: 8
status: 'complete'
rule_count: 43
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- Runtime/package manager: Node.js v22, Yarn 4.6.0 (`packageManager: yarn@4.6.0`)
- Language: TypeScript 5.9.2 (root and workspace packages)
- Workspace architecture: Yarn workspaces monorepo (`packages/*`)
- Lint/format: Biome 2.2.0 with `organizeImports` enabled
- Frontend: React 19.1.1, Vite 7.1.3, Mantine 8.2.5, TanStack Router 1.131.x, urql 5.0.0
- Frontend GraphQL typing/codegen: `@graphql-codegen/cli` 5.0.7, client-preset 4.8.3
- Backend API: GraphQL Yoga 5.15.1 + GraphQL 16.11.0
- Data layer: Drizzle ORM 0.44.4, drizzle-kit 0.31.4, pg 8.16.3
- Integration testing: Playwright 1.54.2
- Unit testing: Vitest 3.2.4 (backend, gameloop)

## Critical Implementation Rules

### Language-Specific Rules

- TypeScript is strict across the repo: keep code compatible with `strict: true` and `strictNullChecks: true`; do not introduce `any`-driven shortcuts when proper typing is feasible.
- Use ESM-style modules (`"type": "module"` in workspaces); prefer `import`/`export` only.
- Backend import convention is mixed by target:
	- Internal source imports commonly use `.ts` (example: `./workers.ts`).
	- Generated/type-context imports may use `.js` paths (example: `../../../../context.js`, `types.generated.js`).
	- Follow existing file-local convention; do not mass-normalize extensions in touched files.
- Keep `noEmit` TypeScript workflow assumptions: code should pass typecheck without relying on compiler output artifacts.
- Prefer explicit typed GraphQL resolver signatures in backend (for example `NonNullable<QueryResolvers["..."]>`) and typed context usage instead of implicit `any` context.
- Preserve async style consistency: use `async/await` and explicit error paths (`throw createGraphQLError(...)`) rather than silent null fallbacks for required entities.

### Framework-Specific Rules

- Frontend GraphQL operations should be colocated inline with components using `graphql(`...`)` instead of importing external document constants.
- After changing frontend inline GraphQL operations, run `yarn workspace @space/frontend graphql-codegen` to refresh generated typings.
- In frontend, use typed urql hooks (`useQuery`, `useMutation`) with generated types when needed; avoid untyped GraphQL responses.
- Preserve TanStack Router conventions (`Link` + route params shape) and avoid introducing ad hoc navigation helpers outside router patterns.
- Keep UI composition aligned with Mantine-first patterns already used in features; avoid mixing in competing UI frameworks.
- Backend GraphQL should follow schema/resolver separation under `src/schema/**` with resolver types sourced from generated `types.generated.*`.
- Keep resolver behavior explicit for auth/claims and missing entities (for example claim checks in context + GraphQL errors), rather than silent permissive defaults.

### Testing Rules

- Keep test types separated by package intent:
	- Unit/integration-at-code-level tests in backend and gameloop with Vitest (`*.spec.ts`).
	- End-to-end/browser integration tests in `packages/integration/tests` with Playwright.
- Follow existing naming/location patterns:
	- `src/**/__tests__/*.spec.ts` for backend/gameloop test files.
	- `packages/integration/tests/*.spec.ts` for Playwright scenarios.
- When modifying behavior in backend or gameloop logic, add or update nearby Vitest coverage instead of only relying on Playwright.
- Prefer deterministic tests with explicit setup/cleanup (DB state reset and controlled fixtures) over order-dependent tests.
- For stream/event behavior (RxJS), use scheduler-based or equivalent deterministic assertions instead of timing-based sleeps.
- Keep Playwright tests focused on user-visible flows and cross-service integration boundaries; avoid re-testing low-level pure logic there.
- Do not place new tests in generated-code folders; keep tests in source-controlled authored locations.

### Code Quality & Style Rules

- Run and satisfy repo quality gates relevant to changed code:
	- `yarn lint`
	- `yarn typecheck`
	- package-specific tests as needed (`yarn test`, `yarn integrate`).
- Respect Biome scope rules:
	- Lint/format targets primarily `**/src/**/*`.
	- Do not hand-edit generated files or rely on formatting in excluded generated paths (`**/gql/*.ts`, `*.generated.ts`, `*.gen.ts`, `dist`).
- Keep monorepo boundaries explicit:
	- Shared packages imported via workspace names (for example `@space/data`, `@space/gameloop`).
	- Avoid deep cross-package relative imports that bypass public package exports.
- Preserve existing naming/organization patterns:
	- Feature-oriented frontend folders under `packages/frontend/src/features/*`.
	- Backend schema organized by domain under `packages/backend/src/schema/*`.
- Prefer narrowly scoped, local changes over broad refactors when implementing a request; do not normalize unrelated style in untouched areas.
- Keep comments concise and high-signal; avoid obvious commentary and avoid adding noisy documentation blocks.
- Use ASCII by default in authored files unless existing file content requires Unicode.

### Development Workflow Rules

- Use root workspace scripts as the default operational entry points:
	- `yarn dev:backend`, `yarn dev:frontend`
	- `yarn lint`, `yarn typecheck`, `yarn test`, `yarn integrate`
	- `yarn db:generate`, `yarn db:push`, `yarn db:studio`
- For GraphQL schema/type evolution, use the established codegen flow instead of manual generated-file edits:
	- backend codegen via root `yarn codegen`
	- frontend typing refresh after inline operation changes via `yarn workspace @space/frontend graphql-codegen`
- Keep changes compatible with monorepo package ownership:
	- implement feature behavior in the owning package (`frontend`, `backend`, `data`, `gameloop`, `integration`) rather than introducing cross-cutting hacks.
- Validate changes at the narrowest effective scope first (targeted package command), then run broader root checks before finalizing.
- Do not alter generated artifacts as source-of-truth; regenerate them through project scripts.
- Preserve existing local development assumptions (Node 22 + Yarn 4) and avoid introducing alternative toolchain requirements without explicit request.

### Critical Don't-Miss Rules

- Do not hand-edit generated GraphQL outputs (`packages/frontend/src/gql/*`, backend generated schema/type artifacts); regenerate with project scripts.
- Do not replace inline frontend `graphql(`...`)` operations with imported document constants; keep operation colocation in feature code.
- Do not "fix" mixed backend import extensions globally (`.ts` and `.js` coexist by convention depending on source vs generated/type-context imports).
- Do not bypass auth/claim checks in backend resolvers or context paths; keep claim enforcement explicit.
- Do not silently return nullable success for required entities; throw explicit GraphQL errors on not-found/invalid states.
- Do not move logic into Playwright tests that belongs in package-level unit tests; preserve integration-vs-unit boundaries.
- Do not introduce cross-package deep relative imports that skip workspace package entry points.
- Do not include unrelated formatting/refactor churn in feature changes; keep edits scoped to requested behavior.
- Security baseline: avoid logging tokens/secrets/cookie values and avoid exposing sensitive auth material in client-visible paths.
- Performance baseline: avoid adding polling/timer-driven UI or backend loops when event/observable or subscription patterns already exist.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow all rules exactly as documented.
- When in doubt, prefer the more restrictive option.
- Update this file if new patterns emerge.

**For Humans:**

- Keep this file lean and focused on agent needs.
- Update when technology stack changes.
- Review quarterly for outdated rules.
- Remove rules that become obvious over time.

Last Updated: 2026-03-08T02:37:32+01:00
