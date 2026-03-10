# [MVP-003] Population Growth Policies and Migration Pressure

SKIPPED

## Objective
Enable players to influence local population growth via policy choices with clear economic consequences.

## Why
Population is core to expansion and productivity; players need control over growth pace versus output efficiency.

## Scope
- Add population policy choices per system (growth-focused, balanced, productivity-focused).
- Apply policy modifiers in deterministic population update stage.
- Expose growth forecast and policy impact in UI.

## Out of Scope
- Detailed demographics.
- Planet-class specific fertility simulation.

## Acceptance Criteria
1. Policy can be set only on owned systems and is stored in turn intent.
2. Population progression changes according to selected policy at turn resolution.
3. Growth forecast updates in UI before turn submission.
4. Policy changes are auditable in turn history for debugging and balance.

## Dependencies
- Requires [MVP-001] development decision model.

## Suggested Order
- Parallel with [MVP-002].
