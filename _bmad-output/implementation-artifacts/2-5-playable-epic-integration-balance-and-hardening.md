# Story 2.5: Playable Epic Integration, Balance Pass, and Hardening

Status: done

## Story

As an MVP release owner,
I want one deterministic end-to-end scenario that validates the full gameplay loop and records key telemetry outcomes,
so that release sign-off can be based on playable quality rather than feature completeness alone.

## Acceptance Criteria Coverage

1. Deterministic E2E scenario across multiple turns:
- Added in [packages/integration/tests/ingame.spec.ts](../../packages/integration/tests/ingame.spec.ts) as `runs a deterministic multi-turn MVP loop with telemetry checkpoints`.
- Flow covered: `develop -> build/deck -> move -> battle -> colonization -> end turn`.

2. Major balance outliers documented and adjusted:
- Combat burst lethality adjusted by increasing starting engagement HP from `6` to `7` in [packages/gameloop/src/tick/taskForceCombat.ts](../../packages/gameloop/src/tick/taskForceCombat.ts).
- Growth and engagement frequency reviewed in telemetry checkpoints from turn reports in the same E2E test.

3. No P0/P1 blockers remain for core loop sign-off:
- Current implementation does not include a dedicated severity-labeled bug tracker in-repo.
- Hardening gate for this story is represented by deterministic E2E coverage plus engagement lifecycle verification in the new scenario.

4. Release readiness checklist completed with known issues:
- Checklist and known issues are documented below.

## Telemetry Checkpoints Captured

The new E2E scenario verifies:
- population telemetry present: `turnReports.populationChanges`
- fleet construction telemetry present: `turnReports.taskForceConstructionChanges`
- engagement telemetry present: `turnReports.taskForceEngagements`
- colonization telemetry present: `turnReports.colonizationCompleted`
- combat lifecycle gate behavior:
- engagement starts after opposing move orders are resolved
- engagement reaches `completed` after both players submit retreat actions

## Balance Pass Summary

- Growth:
- No multiplier changes in this pass.
- Verified that growth telemetry is emitted in deterministic E2E.

- Deck power:
- Adjusted combat opening durability by raising `STARTING_HP` from `6` to `7`.
- Goal: reduce first-round snowball and allow more tactical interaction before forced retreat.

- Engagement frequency:
- No near-miss geometry changes in this pass.
- Existing deterministic engagement matching remains unchanged; telemetry verifies engagements are visible and tracked in turn reports.

## Release Readiness Checklist

- [x] Full loop deterministic scenario exists and runs across multiple turns.
- [x] Loop includes development, fleet build/deck, movement, engagement, colonization, and turn closure.
- [x] Major loop telemetry checkpoints are asserted in integration coverage.
- [x] Balance adjustment applied for deck combat lethality.
- [x] Engagement lifecycle from active to completed is validated in-loop.
- [x] Known issues list documented.

## Known Issues (MVP Sign-off Scope)

- Engagement outcome balance is still card-pool constrained to MVP starter cards; broader card-meta balancing is deferred.
- No in-repo automated severity taxonomy (`P0`/`P1`) is currently enforced; blocker classification remains procedural.
- This pass validates one deterministic scenario; additional scenario breadth remains recommended before release candidate freeze.

## Changed Files

- [packages/integration/tests/ingame.spec.ts](../../packages/integration/tests/ingame.spec.ts)
- [packages/gameloop/src/tick/taskForceCombat.ts](../../packages/gameloop/src/tick/taskForceCombat.ts)
- [issues/012-mvp-playable-epic-integration-and-balance-pass.md](../../issues/012-mvp-playable-epic-integration-and-balance-pass.md)

## Validation Commands

- `yarn workspace @space/integration playwright test tests/ingame.spec.ts --grep "deterministic multi-turn MVP loop"`
- `yarn workspace @space/gameloop vitest run`
