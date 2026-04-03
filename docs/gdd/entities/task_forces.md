# Task Forces

## Overview (`packages/data/src/schema/taskForces.ts`)
Individual ships are rarely tracked alone on the map; instead, they are grouped into **Task Forces**. Think of a Task Force as a composite fleet.
- Task Forces are composed of multiple **Ship Designs**, each with a specific `quantity` (tracked in the `taskForceShipDesigns` junction table).
- The overall stats of the Task Force (combat strength, scanning, move speed) are an aggregate of all the ships present.

### Movement & Position
- Task Forces have a fixed `position` (X, Y).
- Their `movementVector` dictates their frame-to-frame translation toward their objective.
- Their maximum movement speed is bound by the lowest `ftlSpeed` of the ships inside the Task Force.

### Missions & Orders
Task Forces act on JSON-based `orders` (e.g., `move` to an X,Y destination). However, they can also be assigned a **Mission**, which acts as a high-level stance. The server gameloop evaluates the mission state and dynamically injects automated orders into the fleet's queue:
- **Manual**: Standard manual point-and-click movement.
- **Patrol**: Actively scans for and moves toward enemy fleets that enter its Sensor Range.
- **Scout**: Automatically computes an inverse movement vector to run away from enemy fleets within its Sensor Range.
- **Siege**: Evaluates global ranges and automatically moves to the nearest enemy-owned Star System.
- **Intercept**: Similar to patrol, actively seeking tactical combat.

### Construction Phase
A Task Force enters a "construction phase" (`constructionDone` vs `constructionTotal`) when new ships are queued at a Starport. The fleet becomes targetable but generally cannot execute orders until it has finished assembling.
