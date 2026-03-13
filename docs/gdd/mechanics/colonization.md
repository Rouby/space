# Colonization & Population

## Overview
Space uses a passive, pressure-based colonization mechanic rather than a micromanagement "build colonist ship" approach. Over time, large populations organically extend pressure to nearby, undiscovered or uninhabited Star Systems.

## Population
Each Star System tracks its demographic size via `starSystemPopulations.amount` (stored as a BigInt).
- A system becomes a "Source System" for colonization pressure once its population exceeds **1 Billion** (`1_000_000_000n`).

## Colonization Pressure (`starSystemColonizationPressures`)
Every tick, populated source systems emit "outflow pressure".

1. **Emission Generation:** The amount of outflow a source system can generate is proportional to its population. (`TotalPopulation / 1B`).
2. **Target Evaluation:** The engine scans nearby unowned systems within a distance of 500 units.
3. **Scoring:** The game decides how much pressure to allocate to each viable target based on:
   - Distance (closer = higher score).
   - Discovery Slots (systems with more undiscovered resources = higher score).
   - Player Governance priorities.

### Player Settlement Directives (Governances)
Players can instruct their populations on how to prioritize targets using `playerColonizationGovernances`:
- `focus`: Multiplies the score of the target by 5, directing the majority of the population outflow to that system.
- `forbid`: Prevents any pressure from flowing to that system entirely.

## System Flipping Thresholds
A system is successfully colonized when the accumulated pressure from a player eclipses the threshold.
- The threshold is dynamic, calculated as `10 + (Distance to nearest owned system / 50)`.
- When the threshold is broken, the `ownerId` of the Star System changes to the victorious player.

### Colonist Distribution
When a system flips, an initial viable population of 10,000 to 50,000 colonists is seeded. If multiple players contributed colonization pressure, the initial population is split proportionally based on the pressure each player applied.

## Engine & API Files
- Gameloop resolution: `packages/gameloop/src/tick/colonization.ts`
- Schema structure: `packages/data/src/schema/starSystems.ts`
