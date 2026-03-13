# Game Design Document (GDD) Index

Welcome to the autonomous GDD for **Space**. This directory is structured to provide AI agents and human developers with isolated, strictly scoped domain rules.

## Table of Contents

### 1. Game Flow
- [Core Loop & Tick Architecture](./core_loop.md) - How turns resolve and the order of operations.

### 2. Entities
- [Star Systems & Economy](./entities/star_systems.md) - Industry, discoveries, resources, and development stances.
- [Task Forces](./entities/task_forces.md) - Fleets, movement vectors, and orders.
- [Ships & Components](./entities/ships.md) - Ship design stats, resource costs, and capacities.

### 3. Mechanics
- [Combat Resolution](./mechanics/combat.md) - The deck-building tactical combat phase.
- [Colonization & Population](./mechanics/colonization.md) - Colonization pressure, migration, and growth rules.

> **AI Instruction:** When tasked with a feature, only read the specific files related to your domain. For database schema references, check `packages/data/src/schema/`.
