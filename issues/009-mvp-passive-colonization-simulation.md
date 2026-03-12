# [MVP-009] Passive Colonization Simulation and Settler Drift

DONE

## Objective
Make colonization a passive process driven by settler drift and opportunity attraction rather than explicit one-click conquest orders.

## Why
The intended fantasy is decentralized expansion pressure from population behavior.

## Scope
- Simulate settler outflow from eligible source systems.
- Score target systems by habitability/opportunity/distance.
- Start and advance passive settlement processes automatically.
- Expose colonization pressure signals in UI.

## Out of Scope
- Full migration politics simulation.
- Inter-species cultural mechanics.

## Acceptance Criteria
1. At resolution, eligible systems emit colonization pressure based on deterministic rules.
2. Valid nearby targets can enter passive colonization without direct player launch action.
3. Colonization progress and expected completion are visible to owning player.
4. Equivalent world state produces equivalent passive colonization outcomes.

## Dependencies
- Builds on existing colonization progression baseline.

## Suggested Order
- After core combat loop is stable.
