# [MVP-015] Ship Design Combat Profiles and Deck Requirements

DONE

## Objective
Make ship designs define a deterministic combat profile that controls which combat cards a task force can field.

## Why
Task-force decks currently sit too far away from the ships that are supposedly using them. If a fragile missile boat, a shield wall, and a sensor-heavy raider can all run the same deck with the same reliability, ship design is mostly cosmetic optimization. Deck access needs to come from actual hull and component choices.

## Scope
- Derive a combat profile for each ship design and task force from existing component stats such as weapons, shields, armor, thrusters, sensors, crew, and power.
- Add combat-card requirement metadata so cards or card families can require matching ship capabilities before they are legal in a deck.
- Enforce deck validation against the derived combat profile during deck editing, task-force construction, and any later roster or design changes.
- Surface the combat profile and card-eligibility reasons in ship design, task force, and deck-management UI.

## Out of Scope
- Procedural generation of entirely new cards from arbitrary component combinations.
- Commander skill trees, faction-unique doctrine trees, or collectible rarity systems.
- Per-ship deck management inside a single task force.

## Acceptance Criteria
1. Each task force exposes a deterministic combat profile derived from its ship designs and components.
2. Combat deck construction rejects cards whose requirements are not satisfied by the task force combat profile, with explicit rule errors.
3. Players can see which ship-design traits unlocked or blocked a card when configuring a deck.
4. Regression tests cover profile derivation, deck validation, and revalidation after task-force composition or design changes.

## Dependencies
- Builds on [MVP-004] task force creation and [MVP-005] task force deck construction.
