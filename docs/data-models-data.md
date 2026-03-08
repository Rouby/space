# Data Models - Data Package

## Storage Technology
- ORM: Drizzle ORM
- Dialect: PostgreSQL
- Drizzle config: `packages/data/drizzle.config.ts`
- Migration output directory: `packages/data/drizzle`

## Schema Files (Quick Scan)
Detected table/model modules:
- `packages/data/src/schema/games.ts`
- `packages/data/src/schema/users.ts`
- `packages/data/src/schema/starSystems.ts`
- `packages/data/src/schema/taskForces.ts`
- `packages/data/src/schema/resources.ts`
- `packages/data/src/schema/shipComponents.ts`
- `packages/data/src/schema/shipDesigns.ts`
- `packages/data/src/schema/dilemmas.ts`
- `packages/data/src/schema/turnReports.ts`
- `packages/data/src/schema/visibility.ts`
- `packages/data/src/schema/lastKnownStates.ts`

## Migration Files
- `packages/data/drizzle/0000_flowery_gunslinger.sql`
- `packages/data/drizzle/0001_late_beast.sql`

## ERD Reference
`packages/data/README.md` contains a Mermaid ERD with entities around game, star systems, players, and task forces.

## Model Completeness
This document was generated in quick-scan mode. Deep/exhaustive scan is required for full field lists, key constraints, and relationship cardinality per table.
