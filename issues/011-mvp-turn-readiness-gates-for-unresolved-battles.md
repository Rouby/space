# [MVP-011] Turn Readiness Gate for Unresolved Engagements

DONE

## Objective
Prevent end-turn submission when a player still has unresolved mandatory battles or missing battle actions.

## Why
This enforces the requirement that engagements are fully resolved within the turn.

## Scope
- Readiness checks for unresolved engagements.
- Blockers list in UI with deep links to each battle.
- Typed backend validation to reject invalid turn submission.

## Out of Scope
- Generic advisor system for all gameplay warnings.

## Acceptance Criteria
1. Attempting to end turn with unresolved engagements fails with explicit blocker reasons.
2. UI shows unresolved battle blockers and navigation affordances.
3. End turn succeeds once all required battle actions are completed.
4. Integration tests cover blocked and unblocked submission paths.

## Dependencies
- Requires [MVP-006], [MVP-007], [MVP-008].

## Suggested Order
- After battle loop and end conditions.
