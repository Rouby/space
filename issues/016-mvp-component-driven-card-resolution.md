# [MVP-016] Component-Driven Card Resolution and Battle Subsystems

DONE

## Objective
Make combat cards resolve against ship-component-derived battle stats so ship designs materially change combat outcomes.

## Why
Deck restrictions alone are not enough. Ship designs and components only become strategically meaningful when the same card plays differently depending on the hardware behind it. Existing component stats already describe armor, shields, structure, sensors, thrusters, and weapons; combat needs to actually consume those values.

## Scope
- Seed battle state from task-force ship designs using existing component-derived values such as structural integrity, armor, shields, sensor precision, thrusters, and weapon characteristics.
- Update card-effect resolution so core card families interact with those battle subsystems instead of only applying generic flat hull damage.
- Define a compact MVP combat-subsystem model that maps cleanly to current component data without requiring full per-component destruction simulation.
- Expand battle logs and result summaries so players can understand which component-driven interactions decided the fight.

## Out of Scope
- Full hit-location simulation or permanent destruction of individual installed components.
- Fighter bays, boarding actions, ammunition logistics, or advanced range-band simulation.
- Post-battle refit and repair minigames beyond whatever existing readiness or damage systems already support.

## Acceptance Criteria
1. Two task forces using the same deck can produce materially different combat outcomes when their ship designs have different component-derived combat stats.
2. Core MVP combat cards read from or modify battle subsystems derived from ship components rather than only operating on generic flat HP.
3. Battle logs and post-battle summaries clearly identify the subsystem interactions that influenced the outcome.
4. Deterministic combat tests cover at least two contrasting ship-design archetypes using the same deck and verify stable resolution parity for equivalent inputs.

## Dependencies
- Builds on [MVP-005], [MVP-007], [MVP-008], and [MVP-015].
