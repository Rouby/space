# Story 1.4: Stabilize Async Turn Submission, Resolution, and Host Monitoring

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a player or host,
I want turn submission and resolution cycles to be reliable and observable,
so that campaign progression and participation health remain trustworthy.

## Acceptance Criteria

1. Given an open turn window, when a player submits a turn, then the turn is durably recorded and queued for deterministic resolution, and duplicate/late submissions are handled by explicit policy.
2. Given a turn resolution cycle completes, when host views campaign status, then progression and participation indicators reflect the latest resolved state, and failures are surfaced with diagnostics for follow-up.

## Tasks / Subtasks

- [x] Harden end-turn submission boundaries and explicit policy behavior (AC: 1)
- [x] Ensure `endTurn` enforces membership and unresolved-dilemma checks with stable typed error codes and non-leaky messages.
- [x] Define and enforce explicit duplicate/late submission semantics (idempotent waiting state vs typed rejection), including behavior once turn already ended.
- [x] Ensure turn submission writes are durable and monotonic (`turnEndedAt` set once per turn, safe retries).
- [x] Stabilize deterministic resolution handoff and completion signals (AC: 1, 2)
- [x] Verify worker loop tick trigger (`all players turnEndedAt`) remains deterministic and race-safe for active games.
- [x] Validate `turnReports` persistence and `games.turnNumber` advancement happen atomically in the tick transaction.
- [x] Ensure event emission (`game:turnEnded`, `game:newTurnCalculated`) is consistent with persisted state and safe for subscribers.
- [x] Strengthen host/player monitoring surfaces for progression health (AC: 2)
- [x] Ensure UI state transitions in `InGameMenu` reflect waiting/new-turn states correctly under subscription updates.
- [x] Ensure `TurnReportsPanel` and detailed reports reflect newly resolved turn summaries and remain usable when no reports exist.
- [x] Surface actionable diagnostics on failed end-turn/resolution paths (typed GraphQL errors + user-safe messaging).
- [x] Add regression tests for async turn lifecycle and host monitoring (AC: 1, 2)
- [x] Add backend Vitest coverage for `endTurn` policy cases (membership, unresolved dilemmas, already-ended/late behavior).
- [x] Add backend resolver/subscription coverage for `trackGame` authorization and event-to-payload mapping integrity.
- [x] Add integration Playwright coverage for multi-player turn completion -> resolution -> host monitoring update path.
- [x] Validate quality gates for touched packages and integration paths.

## Dev-Story Execution Checklist

- [ ] Review and update GraphQL game lifecycle contract/resolvers:
- [ ] `packages/backend/src/schema/game/schema.graphql`
- [ ] `packages/backend/src/schema/game/resolvers/Mutation/endTurn.ts`
- [ ] `packages/backend/src/schema/game/resolvers/Subscription/trackGame.ts`
- [ ] `packages/backend/src/schema/game/resolvers/Game.ts`
- [ ] `packages/backend/src/schema/game/resolvers/Player.ts`
- [ ] Review worker and deterministic tick execution:
- [ ] `packages/backend/src/workers.ts`
- [ ] `packages/backend/src/events.ts`
- [ ] `packages/gameloop/src/main.ts`
- [ ] `packages/gameloop/src/tick/tick.ts`
- [ ] Review and update host/player monitoring UX:
- [ ] `packages/frontend/src/features/InGameMenu/InGameMenu.tsx`
- [ ] `packages/frontend/src/features/TurnReportsPanel/TurnReportsPanel.tsx`
- [ ] `packages/frontend/src/features/TurnReportsDetails/TurnReportsDetails.tsx`
- [ ] `packages/frontend/src/routes/games/_authenticated.$id/turn-reports.lazy.tsx`
- [ ] Add/extend backend tests:
- [ ] `packages/backend/src/schema/game/resolvers/__tests__/lifecycle.spec.ts`
- [ ] `packages/backend/src/schema/game/resolvers/__tests__/authorization.spec.ts`
- [ ] Add/extend integration tests:
- [ ] `packages/integration/tests/ingame.spec.ts`
- [ ] If frontend GraphQL operations change, run `yarn workspace @space/frontend graphql-codegen`.
- [ ] Validate with:
- [ ] `yarn lint`
- [ ] `yarn typecheck`
- [ ] `yarn workspace @space/backend vitest run src/schema/game/resolvers/__tests__/lifecycle.spec.ts src/schema/game/resolvers/__tests__/authorization.spec.ts`
- [ ] `yarn workspace @space/integration playwright test tests/ingame.spec.ts`

## Dev Notes

- This is a brownfield stabilization story. Do not re-scaffold or alter workspace package boundaries.
- Build on Story 1.1-1.3 guardrails: explicit claim checks, deny-by-default authorization, stable typed errors, and regression-first hardening.
- Current async flow is functional but fragile under race/timing pressure (`endTurn` write timing, worker polling loop, subscription/UI synchronization). Story 1.4 closes those reliability gaps while preserving deterministic resolution.

### Technical Requirements

- Preserve TypeScript strict mode and existing ESM import conventions per package.
- Keep resolver auth at boundary with `context.throwWithoutClaim("urn:space:claim")` and explicit membership checks.
- Use stable GraphQL `extensions.code` values for turn submission failures (`NOT_AUTHORIZED`, validation/lifecycle errors).
- Keep deterministic turn lifecycle semantics:
- Submission writes and resolution transitions must be idempotent or explicitly rejected with stable policy.
- Tick transaction must preserve atomicity for report generation, player reset, and turn increment.
- Subscription payloads must reflect persisted state and remain authorization-safe.

### Architecture Compliance

- Maintain package ownership:
- campaign lifecycle contract/enforcement: `packages/backend/src/schema/game/**`
- event plumbing and worker orchestration: `packages/backend/src/workers.ts`, `packages/backend/src/events.ts`
- deterministic resolution core: `packages/gameloop/src/**`
- host/player monitoring UX: `packages/frontend/src/features/**`
- integration verification: `packages/integration/tests/**`
- Keep single-writer deterministic resolution assumptions; avoid introducing non-deterministic side effects in turn progression.
- Keep observability expectations aligned with architecture: campaign/turn progression should be diagnosable for host follow-up.

### Library/Framework Requirements

- Backend: GraphQL Yoga resolver style with generated resolver types and typed error shaping.
- Data: Drizzle/PostgreSQL for authoritative state transitions (`players.turnEndedAt`, `games.turnNumber`, `turnReports`).
- Frontend: `urql` + inline `graphql(...)` operations for turn status, subscription updates, and report surfaces.
- Integration: Playwright for cross-service async lifecycle behavior; Vitest for resolver/policy edge cases.

### File Structure Requirements

- Keep gameplay lifecycle changes under:
- `packages/backend/src/schema/game/**`
- `packages/backend/src/workers.ts`
- `packages/gameloop/src/**`
- Keep monitoring UI changes under:
- `packages/frontend/src/features/InGameMenu/**`
- `packages/frontend/src/features/TurnReportsPanel/**`
- `packages/frontend/src/features/TurnReportsDetails/**`
- Keep regression tests in:
- `packages/backend/src/schema/game/resolvers/__tests__/**`
- `packages/integration/tests/ingame.spec.ts`
- Do not hand-edit generated artifacts (`packages/frontend/src/gql/*`, `*.generated.ts`, `*.gen.ts`).

### Testing Requirements

- Backend Vitest:
- `endTurn` policy coverage: non-member rejection, unresolved-dilemma rejection, already-ended/late submission semantics.
- `trackGame` authorization and event mapping coverage.
- resolver-level regression for stable error codes and deterministic state updates.
- Integration Playwright:
- multi-player scenario where all players end turn and host/player UI observes new turn progression.
- failed end-turn path visibility (typed errors and non-broken UI state).
- turn report availability and consistency after resolution.
- Validation commands:
- `yarn lint`
- `yarn typecheck`
- `yarn workspace @space/backend vitest run src/schema/game/resolvers/__tests__/lifecycle.spec.ts src/schema/game/resolvers/__tests__/authorization.spec.ts`
- `yarn workspace @space/integration playwright test tests/ingame.spec.ts`

### Previous Story Intelligence

- Story 1.3 established host-only controls and deterministic settings persistence patterns; apply the same explicit authorization and deterministic-write principles to turn lifecycle endpoints.
- Story 1.3 also stabilized idempotent behavior under DB uniqueness races (`joinGame`); reuse this mindset for duplicate/late `endTurn` interactions.
- Existing integration suite (`packages/integration/tests/ingame.spec.ts`) is already the baseline for lifecycle security/regression checks; extend it rather than creating disconnected test paths.

### Git Intelligence Summary

Recent commits show a hardening-first trajectory in Epic 1:

- `e9e6b3f`: host ownership (`hostUserId`) and authorization-focused lifecycle tests.
- `bec7c7e`: player-scoped authorization and visibility regressions.
- `320808a`: typed auth GraphQL error hardening.

Story 1.4 should continue this pattern by prioritizing deterministic turn pipeline integrity, explicit policy semantics, and regression tests around async progression behavior.

### Latest Tech Information

- External web research was not performed in this run.
- Repository-pinned versions in `_bmad-output/project-context.md` are authoritative for implementation.

### Project Structure Notes

- Existing game navigation already exposes end-turn controls and turn-report monitoring in `InGameMenu` + turn-report features; story scope should deepen reliability and observability without introducing parallel UX flows.
- Maintain current monorepo boundaries (`frontend`, `backend`, `gameloop`, `integration`) and avoid cross-package deep imports.

### References

- Story definition and ACs: [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4: Stabilize Async Turn Submission, Resolution, and Host Monitoring]
- Epic scope context: [Source: _bmad-output/planning-artifacts/epics.md#Epic 1: Identity, Access, and Campaign Participation Foundation]
- Campaign lifecycle and determinism constraints: [Source: _bmad-output/planning-artifacts/architecture.md]
- Monitoring/logging and single-writer guidance: [Source: _bmad-output/planning-artifacts/architecture.md]
- UX confidence/readiness and continuity requirements: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Core User Experience]
- Project guardrails and critical rules: [Source: _bmad-output/project-context.md#Critical Don't-Miss Rules]
- GraphQL lifecycle contract: [Source: packages/backend/src/schema/game/schema.graphql]
- End-turn mutation boundary: [Source: packages/backend/src/schema/game/resolvers/Mutation/endTurn.ts]
- Track subscription authorization/events: [Source: packages/backend/src/schema/game/resolvers/Subscription/trackGame.ts]
- Worker orchestration: [Source: packages/backend/src/workers.ts]
- Turn event types: [Source: packages/backend/src/events.ts]
- Deterministic tick and report persistence: [Source: packages/gameloop/src/tick/tick.ts]
- Worker polling and resolution trigger: [Source: packages/gameloop/src/main.ts]
- Host/player monitoring surface: [Source: packages/frontend/src/features/InGameMenu/InGameMenu.tsx]
- Turn reports summary panel: [Source: packages/frontend/src/features/TurnReportsPanel/TurnReportsPanel.tsx]
- Turn reports details surface: [Source: packages/frontend/src/features/TurnReportsDetails/TurnReportsDetails.tsx]
- Turn reports route integration: [Source: packages/frontend/src/routes/games/_authenticated.$id/turn-reports.lazy.tsx]
- Integration lifecycle baseline tests: [Source: packages/integration/tests/ingame.spec.ts]
- Previous story intelligence: [Source: _bmad-output/implementation-artifacts/1-3-validate-campaign-join-and-host-configuration-controls.md]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Workflow execution: dev-story (BMAD prompt instructions)
- Story selection source: `_bmad-output/implementation-artifacts/sprint-status.yaml` first `ready-for-dev` story (`1-4-stabilize-async-turn-submission-resolution-and-host-monitoring`)
- Context analysis sources: story dev notes, project-context, current game lifecycle resolvers, worker/tick pipeline, and integration baselines
- Test run (red phase): `yarn workspace @space/backend vitest run src/schema/game/resolvers/__tests__/lifecycle.spec.ts src/schema/game/resolvers/__tests__/authorization.spec.ts` (expected failures)
- Test run (green): `yarn workspace @space/backend vitest run src/schema/game/resolvers/__tests__/lifecycle.spec.ts src/schema/game/resolvers/__tests__/authorization.spec.ts` (pass)
- Test run: `yarn workspace @space/integration playwright test tests/ingame.spec.ts --workers=1 --reporter=line` (pass)
- Validation run: `yarn lint` (pass with pre-existing non-story warnings)
- Validation run: `yarn typecheck` (pass)
- Regression run: `yarn test` (no workspace root tests configured)
- Regression run: `yarn workspace @space/integration playwright test --workers=1 --reporter=line` (pass)

### Completion Notes List

- Implemented explicit `endTurn` lifecycle policy with stable typed errors for unauthorized access, game-not-started, unresolved dilemmas, and duplicate turn submissions.
- Made submission write monotonic by updating `players.turnEndedAt` only when null and returning typed `TURN_ALREADY_ENDED` on duplicate/race conditions.
- Hardened `trackGame` resolver mapping to reject unsupported event payloads with `INVALID_GAME_EVENT` instead of silently coercing event types.
- Improved `InGameMenu` end-turn diagnostics by mapping typed backend error codes to actionable player-facing messages.
- Added backend regression tests for end-turn policy semantics and subscription event validation.
- Added integration test verifying multi-player turn completion advances turn state and surfaces host/player monitoring updates (`turnNumber`, report availability, player reset status).
- Added explicit turn-window contract binding for `endTurn` (`expectedTurnNumber`) to reject stale/late submissions with stable `TURN_WINDOW_MISMATCH` diagnostics.
- Added subscription-level monitoring diagnostics in `InGameMenu` so track-game failures are surfaced with actionable user-safe messaging.
- Extended integration verification to assert host UI monitoring state remains actionable after async turn resolution.
- Verified deterministic worker/tick/report pipeline behavior through resolver/integration regressions; no direct worker/tick source changes were required for this hardening pass.

### File List

- _bmad-output/implementation-artifacts/1-4-stabilize-async-turn-submission-resolution-and-host-monitoring.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- packages/backend/src/schema/game/resolvers/Mutation/endTurn.ts
- packages/backend/src/schema/game/resolvers/Subscription/trackGame.ts
- packages/backend/src/schema/game/resolvers/__tests__/authorization.spec.ts
- packages/backend/src/schema/game/resolvers/__tests__/lifecycle.spec.ts
- packages/backend/src/schema/game/schema.graphql
- packages/backend/src/schema/schema.generated.graphqls
- packages/backend/src/schema/typeDefs.generated.ts
- packages/backend/src/schema/types.generated.ts
- packages/frontend/src/features/InGameMenu/InGameMenu.tsx
- packages/frontend/src/gql/gql.ts
- packages/frontend/src/gql/graphql.ts
- packages/frontend/src/gql/introspection.json
- packages/integration/tests/ingame.spec.ts

## Change Log

- 2026-03-08: Implemented Story 1.4 async turn lifecycle hardening (typed end-turn policy, duplicate/late handling semantics, subscription event guardrails), improved host/player diagnostics, and added backend + integration regression coverage. Story moved to review.
- 2026-03-08: Code review remediation applied: enforced explicit turn-window submission policy, surfaced subscription diagnostics in host/player monitoring UI, refreshed GraphQL generated artifacts, and validated with backend Vitest + integration Playwright suites. Story moved to done.
