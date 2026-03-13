# Core Loop & Tick Architecture

## Overview
**Space** is a tick-based simulation. The game state is advanced via a Node.js Worker Thread located in `packages/gameloop/src/tick/tick.ts`.

## The Tick Phase Order
During each tick, the game processes changes in a deterministic order to ensure fair resolution. The current order of operations is evaluated across several distinct module sub-ticks:

1.  **Development Stance Resolution:** Players set development stances (`industrialize`, `balance`, `grow_population`) for their controlled Star Systems, updating resource prioritization.
2.  **Star System Economy:** Base logic for industry, resource depots, and discoveries is incremented.
3.  **Industrial Projects:** Star systems process their build queues (`starSystemIndustrialProjects`).
4.  **Ship / Task Force Construction:** Ship construction progress is updated. Task forces are assembled once construction completes.
5.  **Task Force Movement:** Fleets calculate movement along their vectors between standard X/Y coordinates in space.
6.  **Task Force Combat:** Engagements are created when hostile task forces meet. Each tick resolves exactly one round of the card-based engagement.
7.  **Population Growth & Migration:** Populations naturally grow and excess population migrates between systems.
8.  **Colonization:** Colonization pressures are calculated, potentially flipping star system ownership.
9.  **Economy Balance:** The global economy is reconciled.
10. **Discoveries:** Star system discovery slots are rolled to potentially find new resources.

## Schema Reference
- The tick system drives the data in `packages/data/src/schema/games.ts` and `lastKnownStates.ts`.
- The entry point for logic is `packages/gameloop/src/tick/`.
