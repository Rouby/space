# [MVP-012] Playable Epic Integration, Balance Pass, and Hardening

DONE

## Objective
Deliver a cohesive playable MVP pass by validating end-to-end loop quality and tuning major balance outliers.

## Why
Feature-complete does not guarantee playable; this ticket ensures the loop is reliable and strategically meaningful.

## Scope
- End-to-end test scenarios covering develop -> build/deck -> move -> battle -> colonization -> end turn.
- Telemetry checkpoints for major loop outcomes.
- Initial balance pass on growth, deck power, and engagement frequency.
- Bug triage and blocking-fix sweep for MVP sign-off.

## Out of Scope
- Long-term live-ops balancing framework.
- Full competitive matchmaking balancing.

## Acceptance Criteria
1. At least one deterministic E2E scenario validates the full MVP loop across multiple turns.
2. Major balance outliers are documented and adjusted to acceptable ranges.
3. No P0/P1 blockers remain for core MVP loop sign-off.
4. Release readiness checklist is completed with explicit known-issues list.

## Dependencies
- Depends on [MVP-001] through [MVP-011].

## Suggested Order
- Final ticket before release candidate.

## Implementation Notes
- Deterministic full-loop integration scenario added in `packages/integration/tests/ingame.spec.ts`:
	- `runs a deterministic multi-turn MVP loop with telemetry checkpoints`
	- Covers: develop -> build/deck -> move -> battle -> colonization -> end turn
- Balance pass adjustment applied in `packages/gameloop/src/tick/taskForceCombat.ts`:
	- Increased combat `STARTING_HP` from 6 to 7 to reduce early burst lethality
- Release readiness checklist and known-issues list completed in:
	- `_bmad-output/implementation-artifacts/2-5-playable-epic-integration-balance-and-hardening.md`
