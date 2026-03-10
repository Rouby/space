# [MVP-006] Engagement Detection and Mandatory Battle Lock

DONE

## Objective
Trigger combat automatically when opposing task forces cross paths and lock turn progression until battles are resolved.

## Why
Combat must be mandatory and in-turn resolved to preserve strategic integrity and prevent avoiding fights by ending turn.

## Scope
- Detect crossing/contested path encounters during movement resolution.
- Create engagement records with deterministic ordering.
- Mark unresolved engagements as turn blockers.

## Out of Scope
- Fog-of-war deception mechanics.
- Multi-party alliance battle rules.

## Acceptance Criteria
1. Opposing task force path intersection creates an engagement in the same turn.
2. Engagement participants, location, and start state are persisted and auditable.
3. Turn end is blocked while unresolved engagements exist for the player.
4. Equivalent movement inputs produce equivalent engagement creation results.

## Dependencies
- Requires [MVP-004].

## Suggested Order
- Before round-by-round combat interaction.
