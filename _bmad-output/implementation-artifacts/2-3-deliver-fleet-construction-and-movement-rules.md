# Story 2.3: Deliver Fleet Construction and Movement Rules

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a player,
I want to construct and move fleets within rules,
so that I can project power and explore effectively.

## Acceptance Criteria

1. Given required resources and constraints, when player creates fleet construction orders, then legal orders are accepted and persisted, and illegal orders return specific rule violations.
2. Given movement orders are submitted, when turn resolution executes movement, then fleet positions update deterministically, and movement outcomes are visible in campaign state.

## Tasks / Subtasks

- [x] Implement fleet construction order lifecycle with explicit rule validation (AC: 1)
- [x] Add/extend mutation contract for fleet construction orders scoped to authenticated player game membership.
- [x] Validate construction legality before persistence (ownership, build origin eligibility, design validity, resource affordability, duplicate/incompatible order checks).
- [ ] Persist accepted construction intents in a deterministic form consumable by gameloop tick processing.
- [x] Return stable typed GraphQL errors for illegal requests (`extensions.code` + actionable violation context).
- [x] Implement deterministic fleet movement resolution in gameloop tick flow (AC: 2)
- [x] Validate movement legality before/at resolve time (reachable target rules, queue semantics, stale-order handling).
- [x] Advance task-force positions deterministically per tick and update `movementVector` consistently.
- [x] Emit movement and visibility events (`taskForce:position`, `taskForce:appeared`, `taskForce:disappeared`) aligned with persisted state.
- [x] Keep authoritative state transitions atomic in transaction scope with clear ordering relative to colonization/economy/population processing.
- [x] Expose campaign-visible movement outcomes safely (AC: 2)
- [x] Ensure `Game.taskForces` and `StarSystem.taskForces` remain visibility-safe under fog-of-war and last-known-state behavior.
- [x] Keep frontend Galaxy/TaskForce rendering synchronized with backend event stream and last-known visibility transitions.
- [x] Add regression tests for construction and movement rule enforcement (AC: 1, 2)
- [x] Add backend resolver tests for authorization, legal/illegal construction submission, and stable error semantics.
- [x] Add gameloop tests for deterministic movement updates and event emission parity for equivalent inputs.
- [x] Add integration Playwright coverage for end-to-end order submission and post-resolution movement visibility.
- [x] Validate quality gates for touched packages and integration paths.

## Dev-Story Execution Checklist

- [x] Review and update task-force GraphQL contract/resolvers:
- [x] `packages/backend/src/schema/taskForce/schema.graphql`
- [x] `packages/backend/src/schema/taskForce/schema.mappers.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/Mutation/orderTaskForce.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/TaskForceOrder.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/TaskForceMoveOrder.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/TaskForceFollowOrder.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/TaskForceColonizeOrder.ts`
- [x] Review task-force query visibility behavior:
- [x] `packages/backend/src/schema/taskForce/resolvers/Game.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/StarSystem.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/TaskForce.ts`
- [x] Review event and observable mapping for movement outcomes:
- [x] `packages/backend/src/events.ts`
- [x] `packages/backend/src/observables/taskForces.ts`
- [x] `packages/backend/src/observables/__tests__/taskForceMovements.spec.ts`
- [x] Implement deterministic construction/movement in gameloop tick pipeline:
- [x] `packages/gameloop/src/tick/tick.ts`
- [x] (new) `packages/gameloop/src/tick/taskForceConstruction.ts`
- [x] (new) `packages/gameloop/src/tick/taskForceMovement.ts`
- [x] Validate data model support for fleet order persistence and movement state:
- [x] `packages/data/src/schema/taskForces.ts`
- [x] `packages/data/src/schema/shipDesigns.ts`
- [x] `packages/data/src/schema/shipComponents.ts`
- [x] `packages/data/src/schema/resources.ts`
- [x] Keep frontend fleet visibility and interaction surface aligned:
- [x] `packages/frontend/src/features/GalaxyView/TaskForce.tsx`
- [x] `packages/frontend/src/features/ShipDesigns/ShipDesigns.tsx`
- [x] `packages/frontend/src/features/ShipDesigns/ShipDesigner.tsx`
- [x] Add/extend backend tests:
- [x] `packages/backend/src/schema/taskForce/resolvers/__tests__/*.spec.ts` (create if missing)
- [x] Add/extend gameloop tests:
- [x] `packages/gameloop/src/__tests__/*.spec.ts`
- [x] Add/extend integration tests:
- [x] `packages/integration/tests/ingame.spec.ts`
- [x] If frontend inline GraphQL operations change, run `yarn workspace @space/frontend graphql-codegen`.
- [x] Validate with:
- [x] `yarn lint`
- [x] `yarn typecheck`
- [x] `yarn workspace @space/backend vitest run`
- [x] `yarn workspace @space/gameloop vitest run`
- [x] `yarn workspace @space/integration playwright test tests/ingame.spec.ts`

## Dev Notes

- This is a brownfield continuation story. Do not re-scaffold and preserve existing monorepo package boundaries.
- Fleet order ingestion already exists at API level via `orderTaskForce`, but deterministic simulation-side construction/movement rule execution is incomplete and must be implemented in gameloop tick flow.
- Ship design creation already exists (`createShipDesign`), so fleet construction should reuse existing ship-design and resource modeling rather than introducing parallel data models.
- Visibility and fog-of-war behavior are already implemented for task forces (visible + last-known state). Movement implementation must preserve those guarantees.

### Technical Requirements

- Preserve strict TypeScript and current ESM import conventions in each package.
- Keep resolver auth checks explicit (`throwWithoutClaim("urn:space:claim")`, ownership/membership checks) and deny-by-default on unauthorized access.
- Keep GraphQL error semantics stable and typed for illegal construction/movement orders.
- Maintain deterministic tick guarantees:
- Equivalent inputs must produce equivalent position outcomes and events.
- Avoid non-deterministic processing order for order resolution.
- Keep movement updates and related side effects in transaction scope.
- Preserve visibility-safe eventing for task-force updates and last-known-state transitions.

### Architecture Compliance

- Preserve package ownership and boundaries:
- API contracts and authorization in `packages/backend/src/schema/**`.
- Deterministic fleet simulation in `packages/gameloop/src/tick/**`.
- Schema/state model in `packages/data/src/schema/**`.
- Fleet visualization and command surfaces in `packages/frontend/src/features/**`.
- End-to-end behavior verification in `packages/integration/tests/**`.
- Keep generated files immutable by hand; regenerate with project scripts if schema/operations change.

### Library/Framework Requirements

- Backend: GraphQL Yoga resolver patterns with generated resolver types and explicit auth failure paths.
- Data: Drizzle/PostgreSQL schema changes in camelCase and migration-safe evolution.
- Gameloop: transactional tick orchestration in `packages/gameloop/src/tick/tick.ts`.
- Frontend: inline `graphql(...)` operations with urql hooks; preserve existing feature/route patterns.
- Integration: Playwright for end-to-end gameplay flow verification.

### File Structure Requirements

- Keep fleet construction/movement simulation logic under `packages/gameloop/src/tick/**`.
- Keep task-force order parsing and API enforcement in backend task-force resolvers.
- Keep movement event typing and observable mapping centralized in existing backend event/observable modules.
- Keep fleet rendering and command-related UX updates in existing GalaxyView and ShipDesign feature modules.
- Do not hand-edit generated artifacts:
- `packages/frontend/src/gql/*`
- `packages/backend/src/schema/schema.generated.graphqls`
- `packages/backend/src/schema/typeDefs.generated.ts`
- `packages/backend/src/schema/types.generated.ts`

### Testing Requirements

- Backend Vitest:
- `orderTaskForce` authorization and illegal-order rejection with stable error codes.
- Construction rule validation coverage (resource/design/ownership constraints).
- Task-force query visibility behavior remains safe during movement updates.
- Gameloop Vitest:
- deterministic task-force movement progression with equivalent inputs.
- construction completion progression and emitted event consistency.
- movement/vector persistence and queue semantics.
- Integration Playwright:
- submit construction/movement order flow as a valid player.
- observe visible task-force movement outcomes after turn resolution.
- verify unauthorized players cannot mutate/view hidden movement details.
- Validation commands:
- `yarn lint`
- `yarn typecheck`
- `yarn workspace @space/backend vitest run`
- `yarn workspace @space/gameloop vitest run`
- `yarn workspace @space/integration playwright test tests/ingame.spec.ts`

### Previous Story Intelligence

- Story 2.2 established deterministic delayed state progression patterns in gameloop tick (`tickColonization`) and should be reused for task-force construction/movement progression sequencing.
- Story 2.2 also reinforced visibility-safe event propagation and real-time subscription updates; Story 2.3 should follow the same event-to-state parity discipline for fleet movement.
- Story 2.2 implementation already updated integration flows for deterministic turn outcomes; extend existing `ingame.spec.ts` patterns instead of creating disconnected E2E paths.

### Git Intelligence Summary

Recent commits indicate a reliability and hardening trajectory:

- `cad99b1`: colonization feature delivered with GraphQL integration and deterministic progression.
- `3674ec3`, `e81690b`: host identity/data correctness hardening in games table.
- `abfb76e`: turn contract hardening (`expectedTurnNumber`) for deterministic lifecycle safety.

Story 2.3 should continue this pattern: explicit authorization, deterministic state transitions, and regression-first validation.

### Latest Tech Information

- External web research was not performed in this run.
- Repository-pinned versions in `_bmad-output/project-context.md` are authoritative for implementation.

### Project Context Reference

- Runtime/toolchain baseline: Node 22, Yarn 4.6.0, TypeScript strict mode.
- Frontend GraphQL convention: inline `graphql(...)` operations, regenerate types after changes.
- Generated files are not hand-edited; use codegen/migration scripts.

### Story Completion Status

- Story context prepared with implementation guardrails and concrete file-level execution map.
- Story status is set to `ready-for-dev` for developer execution.

## References

- Story definition and ACs: [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3: Deliver Fleet Construction and Movement Rules]
- Epic context: [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: Core Empire and Fleet Command Loop]
- Architecture constraints and boundaries: [Source: _bmad-output/planning-artifacts/architecture.md]
- UX desktop-first command/readiness model: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Core User Experience]
- Project guardrails: [Source: _bmad-output/project-context.md#Critical Don't-Miss Rules]
- Task-force GraphQL contract: [Source: packages/backend/src/schema/taskForce/schema.graphql]
- Task-force order mutation: [Source: packages/backend/src/schema/taskForce/resolvers/Mutation/orderTaskForce.ts]
- Task-force event union: [Source: packages/backend/src/events.ts]
- Task-force movement observable pipeline: [Source: packages/backend/src/observables/taskForces.ts]
- Task-force visibility resolver (game): [Source: packages/backend/src/schema/taskForce/resolvers/Game.ts]
- Task-force visibility resolver (star system): [Source: packages/backend/src/schema/taskForce/resolvers/StarSystem.ts]
- Task-force data model: [Source: packages/data/src/schema/taskForces.ts]
- Ship-design GraphQL contract: [Source: packages/backend/src/schema/shipDesign/schema.graphql]
- Ship-design creation mutation: [Source: packages/backend/src/schema/shipDesign/resolvers/Mutation/createShipDesign.ts]
- Ship-design frontend views: [Source: packages/frontend/src/features/ShipDesigns/ShipDesigns.tsx]
- Galaxy task-force rendering: [Source: packages/frontend/src/features/GalaxyView/TaskForce.tsx]
- Integration baseline tests: [Source: packages/integration/tests/ingame.spec.ts]
- Previous story intelligence: [Source: _bmad-output/implementation-artifacts/2-2-deliver-discovery-and-colonization-progression.md]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Workflow execution: `bmad-bmm-dev-story` via `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story status transition: `ready-for-dev -> in-progress -> review`
- GraphQL/schema generation: `yarn workspace @space/backend graphql-codegen`, `yarn workspace @space/frontend graphql-codegen`
- Test and validation runs:
- `yarn workspace @space/backend vitest run`
- `yarn workspace @space/gameloop vitest run`
- `yarn workspace @space/integration playwright test tests/ingame.spec.ts`
- `yarn lint`
- `yarn typecheck`

### Completion Notes List

- Implemented `constructTaskForce` mutation with membership/ownership/design/resource/name validation and deterministic persistence.
- Added movement legality validation in `orderTaskForce` (finite coordinates, range limit, and self-follow rejection) with stable typed error codes.
- Implemented deterministic movement processing in gameloop tick pipeline and propagated movement vectors through visibility and event payloads.
- Added backend resolver tests, gameloop unit tests, and integration Playwright coverage for construction and movement turn resolution.
- Stabilized observable disappearance semantics to distinguish hidden vs removed task forces and preserve last-known position behavior.
- Hardened movement queue validation by validating chained queued destinations against projected movement cursor state.
- Added resolve-time legality checks in tick movement processing and deterministic stale-order dropping.
- Made construction resource deduction transaction-safe by guarding debit updates against concurrent overspend.
- Added integration coverage for unauthorized task-force mutation and visibility-safe hidden fleet access behavior.
- Construction lifecycle remains command-time, not deferred tick-time; tracked as follow-up below.

### Review Follow-ups (AI)

- [ ] [AI-Review][High] Implement deferred construction intent processing in gameloop tick flow so construction lifecycle is fully tick-consumable (`packages/gameloop/src/tick/taskForceConstruction.ts`).

### File List

- _bmad-output/implementation-artifacts/2-3-deliver-fleet-construction-and-movement-rules.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- packages/backend/src/schema/taskForce/schema.graphql
- packages/backend/src/schema/taskForce/resolvers/Mutation/constructTaskForce.ts
- packages/backend/src/schema/taskForce/resolvers/Mutation/orderTaskForce.ts
- packages/backend/src/schema/taskForce/resolvers/__tests__/taskForceRules.spec.ts
- packages/backend/src/observables/taskForces.ts
- packages/backend/src/schema/starSystem/resolvers/__tests__/trackStarSystem.spec.ts
- packages/backend/src/schema/resolvers.generated.ts
- packages/backend/src/schema/schema.generated.graphqls
- packages/backend/src/schema/typeDefs.generated.ts
- packages/backend/src/schema/types.generated.ts
- packages/frontend/src/gql/graphql.ts
- packages/frontend/src/gql/gql.ts
- packages/frontend/src/gql/introspection.json
- packages/frontend/src/features/StarSystemDetails/StarSystemDetails.tsx
- packages/frontend/src/routes/games/_authenticated.$id/star-system.$starSystemId.lazy.tsx
- packages/gameloop/src/tick/tick.ts
- packages/gameloop/src/tick/taskForceConstruction.ts
- packages/gameloop/src/tick/taskForceMovement.ts
- packages/gameloop/src/__tests__/taskForceMovement.spec.ts
- packages/gameloop/src/__tests__/something.spec.ts
- packages/gameloop/src/config.ts
- packages/integration/tests/fixture.ts
- packages/integration/tests/ingame.spec.ts
- packages/integration/global-teardown.ts

## Change Log

- 2026-03-08: Created Story 2.3 implementation context file and set story status to ready-for-dev.
- 2026-03-08: Implemented Story 2.3 fleet construction and deterministic movement, added backend/gameloop/integration regression coverage, and validated lint/typecheck/test gates.
- 2026-03-08: Addressed AI review findings: queue-aware movement validation, resolve-time legality/stale-order handling, transaction-safe construction debits, and unauthorized mutation/visibility integration coverage; story kept in-progress for deferred construction-lifecycle follow-up.
