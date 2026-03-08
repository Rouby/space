# Architecture - Data

## Executive Summary
The data package centralizes schema definitions, migration artifacts, and DB-facing exports for the rest of the monorepo.

## Technology Stack
- TypeScript package
- Drizzle ORM
- PostgreSQL driver (`pg`)
- Drizzle Kit for migration generation/push

## Architecture Pattern
Shared persistence module exposing schema and helper entry points, consumed by backend and other packages.

## Data Architecture
- Schema entry: `packages/data/src/schema.ts`
- Table modules: `packages/data/src/schema/*.ts`
- Migrations: `packages/data/drizzle/*.sql`

## Development Notes
- Typecheck: `yarn workspace @space/data typecheck`
- Generate migrations: `yarn workspace @space/data drizzle-kit generate`
- Push schema: `yarn workspace @space/data drizzle-kit push`
