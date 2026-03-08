# Architecture - Backend

## Executive Summary
The backend is a TypeScript Node.js GraphQL API using GraphQL Yoga. It organizes schema by domain modules and includes observables/event-driven game updates.

## Technology Stack
- Node.js + TypeScript
- GraphQL Yoga server
- JWT plugin and cookie plugin
- RxJS for reactive streams
- Internal dependencies: `@space/data`, `@space/gameloop`

## Architecture Pattern
Service/API-centric GraphQL backend with modular schema composition (`src/schema/*`) and domain event flows (`src/observables`).

## API Design
- Contract style: GraphQL
- Schema modules: base, game, user, starSystem, taskForce, resource, dilemma, shipComponent, shipDesign

## Data Access
Persistence is delegated to the shared data package.

## Development Notes
- Dev command: `yarn workspace @space/backend dev`
- Typecheck: `yarn workspace @space/backend typecheck`
- Tests: `vitest` config present (`packages/backend/vitest.config.ts`)
