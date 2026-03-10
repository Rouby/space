# [MVP-005] Task Force Deck Construction with Player-Driven Choices

DONE

## Objective
Allow each task force to have a configurable combat deck where player-selected cards materially affect battle behavior.

## Why
The user-requested combat model depends on meaningful deck composition choices, not fixed outcomes.

## Scope
- Deck edit API and UI per task force.
- Card pool constraints for MVP.
- Validation rules (size, duplicates, allowed set, ownership).
- Save/load deck presets per task force.

## Out of Scope
- Full collectible economy.
- Marketplace/trading features.

## Acceptance Criteria
1. Player can configure and persist deck composition for a selected task force.
2. Validation enforces MVP rules with typed errors for invalid decks.
3. Deck choices are visible in task force details and used in combat resolution.
4. Changes are blocked during active engagement to prevent exploitative mid-combat edits.

## Dependencies
- Requires [MVP-004] task force creation.

## Suggested Order
- Immediately after [MVP-004].
