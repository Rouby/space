# Project Overview

## Summary
`space` is a TypeScript monorepo for a multiplayer/strategy game platform. It combines a React frontend, a GraphQL backend, a PostgreSQL data layer, simulation/game-loop logic, AI helper utilities, integration tests, and Helm-based deployment assets.

## Repository Classification
- Type: Monorepo (Yarn workspaces)
- Scan mode used: Quick Scan (pattern/config based)
- Root: `/home/rouby/space`

## Primary Technologies
- Package manager: Yarn 4 (`yarn@4.6.0`)
- Language: TypeScript (strict mode)
- Frontend: React 19, Vite 7, TanStack Router, Mantine, URQL
- Backend: Node.js, GraphQL Yoga, RxJS
- Data: Drizzle ORM, PostgreSQL (`pg`)
- Testing: Vitest, Playwright
- Infrastructure: Docker + Helm + GitHub Actions

## Project Parts
- `packages/frontend`: Web UI and route-driven client features
- `packages/backend`: GraphQL API and resolver orchestration
- `packages/data`: Database schema/migrations and data access exports
- `packages/gameloop`: Domain simulation/game update logic
- `packages/ai`: AI-oriented helper and prompt modules
- `packages/integration`: E2E/integration test harness
- `helm`: Kubernetes deployment manifests

## Existing Documentation Discovered
- `README.md`
- `packages/data/README.md`

## Related Generated Documentation
- See `docs/index.md` for full navigation.
