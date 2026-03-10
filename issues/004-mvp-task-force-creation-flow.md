# [MVP-004] Task Force Creation and Assignment Flow

DONE

## Objective
Provide a reliable flow to create task forces from available assets and assign them to systems.

## Why
Deck-based combat and strategic movement require a stable unit-creation pipeline.

## Scope
- Create task force from eligible ships/components.
- Validate ownership and readiness constraints.
- Assign starting location and command context.
- Display task force roster and readiness state in UI.

## Out of Scope
- Complex formation templates.
- Commander/hero systems.

## Acceptance Criteria
1. Player can create a task force from eligible owned assets.
2. Task force receives a valid initial location and persists across turns.
3. Invalid creations return explicit rule violations.
4. Newly created task force appears in galaxy/system views and can receive orders.

## Dependencies
- Depends on existing fleet construction baseline.

## Suggested Order
- Before deckbuilder and combat tickets.
