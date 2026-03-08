# Architecture - Gameloop

## Executive Summary
The gameloop package encapsulates simulation and turn-processing logic used by backend gameplay flows.

## Technology Stack
- TypeScript
- Internal dependency: `@space/data`
- Unit testing via Vitest

## Architecture Pattern
Domain engine package with focused modules for setup, ticking, reactions, and random content generation.

## Key Areas
- `src/setup`: bootstrap and starting conditions
- `src/tick`: progression/economy/discovery logic
- `src/react`: reaction handlers
- `src/main.ts`: primary export entry point

## Development Notes
- Typecheck: `yarn workspace @space/gameloop typecheck`
