# [MVP-002] Industrial Expansion Projects and Production Capacity

DONE

## Objective
Create concrete industrial investment actions that improve a star system's industrial capacity over time.

## Why
Players need to make tradeoffs between short-term spending and long-term fleet/economy strength.

## Scope
- Add industrial projects that consume industrial capacity and complete over multiple turns.
- Apply industrial capacity bonuses on completion.
- Surface project queue and ETA in star system details.

## Out of Scope
- Complex supply chain simulation.
- Building damage and sabotage mechanics.

## Acceptance Criteria
1. Players can queue at least one industrial project in owned systems if prerequisites are met.
2. Project completion is deterministic and updates industrial capacity in the next resolution step.
3. UI shows queued projects, turns remaining, and completed bonuses.
4. Illegal orders (non-owned system) are rejected with typed errors.

## Dependencies
- Requires [MVP-001] development decision model.

## Suggested Order
- Early, before full task-force scaling.
