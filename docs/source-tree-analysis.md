# Source Tree Analysis

## Top-Level Structure
```text
space/
|- packages/
|  |- frontend/      # React + Vite web app
|  |- backend/       # GraphQL API service
|  |- data/          # Drizzle schema + migrations
|  |- gameloop/      # Turn/simulation domain logic
|  |- ai/            # AI helper library
|  `- integration/   # Playwright integration tests
|- helm/             # Kubernetes Helm chart and templates
|- docs/             # Generated project documentation
|- .github/workflows/# CI/CD pipeline definitions
|- _bmad/            # BMAD framework assets and workflows
|- package.json      # Workspace scripts and orchestration
`- tsconfig.json     # Root TypeScript baseline
```

## Critical Folders
- `packages/frontend/src/routes`: Route-based navigation and page boundaries.
- `packages/frontend/src/features`: Feature-level UI modules.
- `packages/backend/src/schema`: GraphQL schema modules and resolver mappings.
- `packages/backend/src/observables`: Event/reactive flow logic.
- `packages/data/src/schema`: Table and model definitions.
- `packages/data/drizzle`: SQL migrations and snapshots.
- `packages/gameloop/src/tick`: Tick/update logic for game state progression.
- `packages/integration/tests`: End-to-end behavior checks.
- `helm/templates`: Deployment resources (deployments, service, ingress, secrets, migrations).

## Entry Points
- Backend: `packages/backend/src/main.ts`
- Frontend: `packages/frontend/src/main.tsx`
- Gameloop package export: `packages/gameloop/src/main.ts`
- Playwright test runner entry: `packages/integration/playwright.config.ts`

## Integration Paths
- Frontend <-> Backend: GraphQL over `/graphql`.
- Backend <-> Data: workspace package import (`@space/data`).
- Backend <-> Gameloop: workspace package import (`@space/gameloop`).
- CI/CD <-> Runtime: GitHub workflow builds images and deploys Helm chart.
