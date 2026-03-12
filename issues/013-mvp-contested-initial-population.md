# [MVP-013] Split Initial Population in Contested Colonization

## Objective
Distribute the initial colonizing population among competing factions when a star system is successfully settled.

## Why
When multiple factions exert passive colonization pressure on a single destination, the settlement represents a combined effort. Granting the entire initial population to the faction that merely triggered the colonization threshold ignores the demographic contribution of rivals and removes strategic pressure dynamics.

## Scope
- When a target system's gathered pressure completes colonization, identify all factions that contributed to the pressure pool up to that point.
- Calculate the proportional contribution of each faction based on their stored `accumulatedPressure`.
- Apportion the randomized 10k-50k initial settlers into separate `starSystemPopulations` records, matching the calculated factional allegiance proportions.
- Ownership of the system is still determined by the faction whose pressure pushes past the threshold, but the population demographic reflects the reality of a contested settlement.

## Out of Scope
- Dynamic political revolts based on minority populations.
- Changing system ownership once established via demographic shifts.

## Acceptance Criteria
1. System colonization triggers correctly and assigns ownership to the faction breaking the threshold.
2. The initial randomized colonist population is divided proportionally among all factions with active colonization pressure at the moment of threshold break.
3. Appropriate `starSystemPopulations` entries are explicitly created for all contributing factions.
4. Existing passive colonization tests are expanded to verify contested settlement outcomes.

## Dependencies
- Builds on [MVP-009] Passive Colonization Simulation.
