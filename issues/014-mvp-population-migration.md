# [MVP-014] Inter-system Population Migration Mechanics

## Objective
Implement mechanics for established populations to migrate between colonized systems, facilitating demographic shifts and economic rebalancing.

## Why
Passive colonization shouldn't just be an early-game expansion tool; it should naturally transition into a dynamic migration system. Established colonies with high populations or poor conditions should organically leak citizens to high-opportunity destinations, bringing depth to demographic simulations and economy management.

## Scope
- Calculate "Migration Pressure" similar to colonization pressure, driven by population density, available un-developed resources, industry availability, and geographical distance.
- Enable populations to drift from owned "source" systems to other colonized "destination" systems.
- Deduct migrating populations from the source system and add them to the destination system over time.
- Support both intra-faction migration (between a player's own systems) and inter-faction migration (population shifting allegiance naturally across borders).
- Update turn reports to explicitly summarize population inflows and outflows.

## Out of Scope
- Direct player-issued commands to forcefully transfer specific population numbers (forced resettlement).
- Complex socio-political conflict stemming from immigrant majorities.

## Acceptance Criteria
1. Gameloop actively calculates and processes ongoing population drift between fully colonized systems each tick.
2. Source populations correctly decrease and destination populations correctly increase, maintaining absolute population conservation.
3. Populations migrating across borders result in fractional, multi-allegiance demographics at the destination system.
4. Players receive clear UI indicators or turn report entries describing significant migration changes in their systems.

## Dependencies
- Builds on [MVP-009] and the broader gameloop population dynamics.
