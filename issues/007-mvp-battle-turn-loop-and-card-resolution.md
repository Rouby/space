# [MVP-007] Battle Turn Loop and Card Reveal Resolution

DONE

## Objective
Implement the battle-internal turn loop where each side plays cards, reveals effects, and resolves buffs/counters per combat round.

## Why
This is the core requested battle gameplay: multiple battle-turns with simultaneous strategic card decisions.

## Scope
- Per-round action submission from each side.
- Reveal phase and effect resolution ordering.
- Buff/counter interactions and rule validation.
- Battle log output for player clarity.

## Out of Scope
- Animation-heavy cinematic combat.
- Advanced timing windows beyond MVP.

## Acceptance Criteria
1. Each battle round accepts legal card actions from participants before reveal.
2. Reveal and effect resolution follow deterministic ordering with clear buff/counter handling.
3. Illegal card actions are rejected with specific rule errors.
4. Battle log includes played cards, resolved effects, and resulting unit state changes.

## Dependencies
- Requires [MVP-005] and [MVP-006].

## Suggested Order
- Core combat implementation step.
