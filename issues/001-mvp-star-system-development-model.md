# [MVP-001] Star System Development Decision Model

DONE

## Objective
Define and implement the per-turn decision model that lets players shape each owned star system toward industry growth or population growth.

## Why
The MVP needs meaningful empire-level choices each turn. Without a clear development model, other systems (fleet production, colonization, and combat readiness) have weak strategic foundations.

## Scope
- Introduce development stances per owned star system (for example: `industrialize`, `balance`, `grow_population`).
- Persist player-selected stance as turn intent.
- Apply stance effects in deterministic turn resolution.
- Expose development stance and projected effect in API and UI.

## Out of Scope
- Deep policy trees, civics, or ideology systems.
- Random events that alter stance effects.

## Acceptance Criteria
1. Given a player owns a star system, when they choose a development stance, then the choice is saved as part of turn intent.
2. Given turn resolution runs, when stances are processed, then resource and population deltas are applied deterministically.
3. Given the player opens star system details, when a stance exists, then current stance and next-turn projection are shown.
4. Illegal stance changes (non-owner, invalid state) return stable typed errors.

## Dependencies
- None

## Suggested Order
- First ticket in this epic.
