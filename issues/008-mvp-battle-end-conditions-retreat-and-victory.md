# [MVP-008] Battle End Conditions, Retreat, and Victory State

DONE

## Objective
Define and enforce battle completion rules: destruction-based win or retreat-based disengagement.

## Why
A complete combat system needs clean termination and post-battle consequences.

## Scope
- End battle when one party remains combat-capable.
- Support retreat action with validated escape rules.
- Apply post-battle state changes (survivors, position/state updates, losses).

## Out of Scope
- Prisoners, salvage economy, war-score systems.

## Acceptance Criteria
1. Battle ends immediately when one side is destroyed.
2. Retreat action is available only under valid conditions and resolves deterministically.
3. Post-battle state is persisted and visible in campaign state within the same turn cycle.
4. Engagement is removed from turn blockers once resolved.

## Dependencies
- Requires [MVP-007].

## Suggested Order
- Directly after [MVP-007].
