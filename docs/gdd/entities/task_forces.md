# Task Forces

## Overview (`packages/data/src/schema/taskForces.ts`)
Individual ships are rarely tracked alone on the map; instead, they are grouped into **Task Forces**. Think of a Task Force as a fleet.

### Movement & Position
- Task Forces have a fixed `position` (X, Y).
- Their `movementVector` dictates their frame-to-frame translation toward their objective.
- Their maximum movement speed is bound by the lowest `ftlSpeed` of the ships inside the Task Force.

### Orders
Task Forces act on JSON-based `orders`. Valid order types:
1. `move` (Proceed to an X,Y destination)
2. `follow` (Intercept/shadow another `taskForceId`)

### Construction Phase
A Task Force enters a "construction phase" (`constructionDone` vs `constructionTotal`) when new ships are queued at a Starport. The fleet becomes targetable but generally cannot execute orders until it has finished assembling.
