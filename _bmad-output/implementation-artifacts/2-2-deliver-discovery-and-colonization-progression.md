# Story 2.2: Deliver Discovery and Colonization Progression

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a player,
I want to discover planet features and perform colonization decisions,
so that I can expand strategically based on opportunity and risk.

## Acceptance Criteria

1. Given exploration reveals new planetary information, when feature discovery resolves, then discovered attributes are stored and shown in player context, and visibility rules are respected.
2. Given colonization prerequisites are met, when player presses `Start colonization` on an eligible target system, then a colonization process is created and shown as in-progress.
3. Given colonization is in progress, when the required number of turns has elapsed, then ownership is applied deterministically and downstream empire effects are reflected in subsequent turns.
4. Given required colonization duration is computed, when colonization starts, then the number of turns is derived from distance to the nearest already-colonized system owned by the same player.

## Tasks / Subtasks

- [x] Complete discovery progression persistence and player-visible updates (AC: 1)
- [x] Validate discovery slot limits and uniqueness behavior per star system.
- [x] Ensure discovery progress updates remain deterministic and thresholded for subscription delivery.
- [x] Ensure discovery events only surface data visible to authorized players.
- [x] Implement simple colonization command flow (AC: 2, 4)
- [x] Add API mutation/input for `Start colonization` on an eligible star system.
- [x] Persist colonization job state (target system, owner, started turn, remaining turns or due turn).
- [x] Compute colonization duration from distance to nearest already-colonized system of that player.
- [x] Implement deterministic colonization progression in turn tick (AC: 3)
- [x] Decrement/advance in-progress colonization each turn.
- [x] Apply ownership transitions atomically when duration completes.
- [x] Emit owner-change/update events so live views and subscriptions refresh correctly.
- [x] Reflect downstream effects in subsequent turns (population/economy/discovery visibility continuity).
- [x] Harden GraphQL/API boundaries for colonization start commands (AC: 2)
- [x] Preserve deny-by-default authorization and non-leaky typed errors for non-members/non-owners.
- [x] Add regression tests for discovery + colonization behaviors (AC: 1, 2)
- [x] Add gameloop Vitest coverage for deterministic colonization resolution and event emission.
- [x] Add backend resolver/subscription coverage for star-system updates and access boundaries.
- [x] Add integration Playwright coverage for commanding colonization and observing state progression.
- [x] Validate quality gates for touched packages and integration paths.

## Dev-Story Execution Checklist

- [ ] Review and update star-system colonization command contract and resolver handling:
- [ ] `packages/backend/src/schema/starSystem/schema.graphql`
- [ ] `packages/backend/src/schema/starSystem/resolvers/Mutation/*.ts` (add `startColonization` mutation)
- [ ] `packages/backend/src/schema/starSystem/schema.mappers.ts`
- [ ] Review and update star system query/subscription behavior:
- [ ] `packages/backend/src/schema/starSystem/resolvers/Query/starSystem.ts`
- [ ] `packages/backend/src/schema/starSystem/resolvers/StarSystem.ts`
- [ ] `packages/backend/src/schema/base/resolvers/Subscription/trackStarSystem.ts`
- [ ] `packages/backend/src/observables/starSystems.ts`
- [ ] `packages/backend/src/events.ts`
- [ ] Implement deterministic colonization in gameloop tick pipeline:
- [ ] `packages/gameloop/src/tick/tick.ts`
- [ ] `packages/gameloop/src/tick/discoveries.ts`
- [ ] `packages/gameloop/src/tick/starSystemPopulation.ts`
- [ ] `packages/gameloop/src/tick/starSystemEconomy.ts`
- [ ] (new) `packages/gameloop/src/tick/colonization.ts` or equivalent module under `tick/`
- [ ] Validate setup assumptions used by tests and scenarios:
- [ ] `packages/gameloop/src/setup/startingConditions.ts`
- [ ] `packages/gameloop/src/setup/galaxy.ts`
- [ ] `packages/data/src/schema/starSystems.ts`
- [ ] `packages/data/src/schema/*` (add colonization job table/entity)
- [ ] Keep frontend command surface and detail views aligned:
- [ ] `packages/frontend/src/features/StarSystemDetails/StarSystemDetails.tsx`
- [ ] `packages/frontend/src/routes/games/_authenticated.$id/star-system.$starSystemId.lazy.tsx`
- [ ] Add/extend backend tests:
- [ ] `packages/backend/src/schema/starSystem/resolvers/__tests__/authorization.spec.ts` (create if missing)
- [ ] `packages/backend/src/schema/starSystem/resolvers/__tests__/*.spec.ts` (create if missing)
- [ ] Add/extend gameloop tests:
- [ ] `packages/gameloop/src/__tests__/*.spec.ts`
- [ ] Add/extend integration tests:
- [ ] `packages/integration/tests/ingame.spec.ts`
- [ ] If frontend inline GraphQL operations change, run `yarn workspace @space/frontend graphql-codegen`.
- [ ] Validate with:
- [ ] `yarn lint`
- [ ] `yarn typecheck`
- [ ] `yarn workspace @space/backend vitest run`
- [ ] `yarn workspace @space/gameloop vitest run`
- [ ] `yarn workspace @space/integration playwright test tests/ingame.spec.ts`

## Dev Notes

- This is a brownfield implementation story. Do not re-scaffold, and preserve monorepo package boundaries.
- Discovery progression already exists in the deterministic tick pipeline (`tickDiscoveries`) and should be extended/reused rather than replaced.
- This iteration uses a simplified colonization interaction: a player presses `Start colonization` on an eligible star system.
- Colonization resolves after a delay measured in turns; required turns are based on distance to the nearest already-colonized system owned by that player.
- Visibility and authorization constraints are mandatory for both reads and live updates; do not leak hidden star-system details.

### Technical Requirements

- Preserve strict TypeScript and existing ESM import conventions in each package.
- Keep resolver auth checks explicit (`throwWithoutClaim("urn:space:claim")`, membership checks, ownership/eligibility checks).
- Maintain stable GraphQL error semantics for invalid commands and unauthorized access.
- Keep deterministic tick guarantees:
- Process colonization progression in transaction with clear ordering relative to discovery/population/economy updates.
- Ensure equivalent inputs produce equivalent ownership outcomes and emitted events.
- Avoid introducing non-deterministic behavior in gameplay-critical paths (except existing weighted discovery RNG behavior already established by design).

### Architecture Compliance

- Preserve package ownership and boundaries:
- API contract and auth in `packages/backend/src/schema/**`.
- Deterministic simulation in `packages/gameloop/src/tick/**`.
- Schema/state model in `packages/data/src/schema/**`.
- UX command surfaces and live detail views in `packages/frontend/src/features/**`.
- Integration verification in `packages/integration/tests/**`.
- Keep generated files immutable by hand; regenerate with project scripts if schema/operations change.

### Library/Framework Requirements

- Backend: GraphQL Yoga resolvers with generated resolver types and explicit authorization failures.
- Data: Drizzle/PostgreSQL tables in camelCase (`starSystems`, discovery/population tables, and new colonization state table).
- Gameloop: tick pipeline transaction semantics in `packages/gameloop/src/tick/tick.ts`.
- Frontend: inline `graphql(...)` operations with urql hooks; maintain existing route/component patterns.
- Integration: Playwright for end-to-end command-to-resolution behavior.

### File Structure Requirements

- Keep colonization simulation logic under `packages/gameloop/src/tick/**` (new module preferred, composed from `tick.ts`).
- Keep colonization start command parsing and auth in backend star-system resolver modules.
- Keep star-system read/subscription visibility logic in existing star-system resolver/subscription modules.
- Keep UI command entry and player context rendering in `StarSystemDetails`.
- Do not hand-edit generated artifacts:
- `packages/frontend/src/gql/*`
- `packages/backend/src/schema/schema.generated.graphqls`
- `packages/backend/src/schema/typeDefs.generated.ts`
- `packages/backend/src/schema/types.generated.ts`

### Testing Requirements

- Gameloop Vitest:
- deterministic colonization progression and completion behavior
- rejection/no-op behavior for illegal `Start colonization` attempts (already owned, already in-progress, ineligible target)
- ownership/event side effects and colonization-state transitions
- Backend Vitest:
- `startColonization` authorization and invalid payload handling
- `trackStarSystem` membership/vision guardrails remain intact after event additions
- Integration Playwright:
- press `Start colonization` from star-system UI
- observe in-progress colonization status and delayed ownership transition after computed turns
- verify unauthorized players cannot view private colonization/discovery details
- Validation commands:
- `yarn lint`
- `yarn typecheck`
- `yarn workspace @space/backend vitest run`
- `yarn workspace @space/gameloop vitest run`
- `yarn workspace @space/integration playwright test tests/ingame.spec.ts`

### Git Intelligence Summary

Recent commits are hardening-focused (auth boundaries, host identity consistency, migration safety). Apply the same discipline here:

- keep explicit authorization around command submission and subscriptions
- prefer deterministic state transitions over implicit side effects
- keep schema/data changes backward-compatible and migration-safe

### Project Structure Notes

- Existing foundations relevant to this story:
- discovery progression events already emitted (`starSystem:discoveryProgress`)
- star-system subscriptions already throttle update streams and enforce vision checks
- colonization command should be exposed as a simple player action (`Start colonization`)
- Missing foundation to implement in this story:
- distance-based colonization duration computation and deterministic delayed ownership propagation pipeline

### References

- Story definition and ACs: [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2: Deliver Discovery and Colonization Progression]
- Epic context: [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: Core Empire and Fleet Command Loop]
- Architecture constraints and boundaries: [Source: _bmad-output/planning-artifacts/architecture.md]
- UX confidence/readiness and desktop-first command model: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Core User Experience]
- Project implementation guardrails: [Source: _bmad-output/project-context.md#Critical Don't-Miss Rules]
- Star-system schema and discovery model: [Source: packages/data/src/schema/starSystems.ts]
- Discovery tick implementation: [Source: packages/gameloop/src/tick/discoveries.ts]
- Tick transaction orchestration: [Source: packages/gameloop/src/tick/tick.ts]
- Starting condition ownership/discovery seeding: [Source: packages/gameloop/src/setup/startingConditions.ts]
- Star-system GraphQL contract/resolvers: [Source: packages/backend/src/schema/starSystem/*]
- Star-system query visibility boundary: [Source: packages/backend/src/schema/starSystem/resolvers/Query/starSystem.ts]
- Star-system field resolver behavior: [Source: packages/backend/src/schema/starSystem/resolvers/StarSystem.ts]
- Star-system subscription and throttled updates: [Source: packages/backend/src/schema/base/resolvers/Subscription/trackStarSystem.ts]
- Star-system observable owner-update stream: [Source: packages/backend/src/observables/starSystems.ts]
- Game event union for propagation: [Source: packages/backend/src/events.ts]
- Star-system command surface (`Start colonization`): [Source: packages/frontend/src/features/StarSystemDetails/StarSystemDetails.tsx]
- Star-system player context view: [Source: packages/frontend/src/features/StarSystemDetails/StarSystemDetails.tsx]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Workflow execution: create-story (BMAD prompt instructions)
- Story selection source: `_bmad-output/implementation-artifacts/sprint-status.yaml` first backlog story (`2-2-deliver-discovery-and-colonization-progression`)
- Context analysis sources: epics, architecture, UX specification, project-context, and existing discovery/colonization code paths
- Previous-story search in same epic: no `2-1-*` implementation artifact found in `_bmad-output/implementation-artifacts`
- Git pattern scan: `git log --oneline -n 5`
- Dev workflow execution: dev-story (BMAD prompt instructions)
- Validation commands run: `yarn lint`, `yarn typecheck`, `yarn workspace @space/backend vitest run`, `yarn workspace @space/gameloop vitest run`, `yarn workspace @space/integration playwright test tests/ingame.spec.ts`
- Follow-up fixes during validation: backend mapper nullability (`lastUpdate`), integration assertion for composite player ids, and gameloop `GAME_ID` fallback for non-worker tests

### Completion Notes List

- Created comprehensive implementation context for Story 2.2 with explicit technical guardrails.
- Mapped exact backend/data/gameloop/frontend integration points to prevent wrong-file or wrong-layer implementation.
- Highlighted the key scope for this iteration: simple `Start colonization` command with distance-based delayed resolution.
- Included deterministic, authorization, visibility, and test coverage requirements aligned with architecture and existing code patterns.
- Implemented `startColonization` end-to-end across data schema, backend GraphQL contract/resolvers, deterministic gameloop tick progression, and frontend command surface/status rendering.
- Added colonization progress events into `trackStarSystem` update flow so in-progress turns remaining can refresh in real time.
- Added targeted backend, gameloop, and integration tests covering authorization, colonization delay calculation, and delayed ownership transfer behavior.
- Regenerated migrations and GraphQL artifacts, then validated with lint/typecheck and focused test runs.

### File List

- _bmad-output/implementation-artifacts/2-2-deliver-discovery-and-colonization-progression.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- packages/data/src/schema/starSystems.ts
- packages/data/drizzle/0003_uneven_gargoyle.sql
- packages/data/drizzle/meta/_journal.json
- packages/data/drizzle/meta/0003_snapshot.json
- packages/backend/src/events.ts
- packages/backend/src/schema/starSystem/schema.graphql
- packages/backend/src/schema/starSystem/schema.mappers.ts
- packages/backend/src/schema/starSystem/resolvers/StarSystem.ts
- packages/backend/src/schema/starSystem/resolvers/StarSystemColonization.ts
- packages/backend/src/schema/starSystem/resolvers/Mutation/startColonization.ts
- packages/backend/src/schema/starSystem/resolvers/__tests__/startColonization.spec.ts
- packages/backend/src/schema/base/resolvers/Subscription/trackStarSystem.ts
- packages/backend/src/schema/schema.generated.graphqls
- packages/backend/src/schema/typeDefs.generated.ts
- packages/backend/src/schema/types.generated.ts
- packages/backend/src/schema/resolvers.generated.ts
- packages/gameloop/src/config.ts
- packages/gameloop/src/tick/tick.ts
- packages/gameloop/src/tick/colonization.ts
- packages/gameloop/src/__tests__/colonization.spec.ts
- packages/frontend/src/features/StarSystemDetails/StarSystemDetails.tsx
- packages/frontend/src/gql/gql.ts
- packages/frontend/src/gql/graphql.ts
- packages/frontend/src/gql/introspection.json
- packages/integration/tests/ingame.spec.ts

## Change Log

- 2026-03-08: Created Story 2.2 implementation context file and set story status to ready-for-dev.
- 2026-03-08: Updated Story 2.2 scope to simple `Start colonization` command with distance-based delayed resolution (no task-force dependency).
- 2026-03-08: Completed dev-story implementation; story moved to review after code, generated artifacts, and focused validations.
