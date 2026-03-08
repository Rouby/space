# Integration Architecture

## System Context
The repository is a Yarn 4 monorepo with multiple TypeScript packages that together implement a browser-based game platform:
- Frontend (`@space/frontend`)
- Backend (`@space/backend`)
- Data (`@space/data`)
- Game logic (`@space/gameloop`)
- AI helpers (`@space/ai`)
- Integration tests (`@space/integration`)
- Infrastructure (`helm`)

## Integration Points
1. Frontend to Backend
- Type: GraphQL over HTTP
- Detail: Frontend Vite config proxies `/graphql` to `http://localhost:3000`.

2. Backend to Data
- Type: Workspace package import
- Detail: Backend depends on `@space/data` for DB schema and persistence utilities.

3. Backend to Gameloop
- Type: Workspace package import
- Detail: Backend depends on `@space/gameloop` for game simulation logic.

4. Integration Harness to App Runtime
- Type: Playwright webServer orchestration
- Detail: Integration config starts backend (port 3000) and frontend (port 5173) before tests.

5. CI/CD to Runtime Environment
- Type: GitHub Actions + Helm
- Detail: CI builds images and deploys Helm chart to staging/production namespaces.

## Runtime Data Flow (High Level)
1. Browser client loads frontend routes and features.
2. Frontend sends GraphQL operations to backend `/graphql`.
3. Backend executes resolvers, queries/mutates PostgreSQL through data package.
4. Backend invokes gameloop logic for turn progression and event updates.
5. Integration tests execute end-to-end flows against local backend/frontend processes.

## Security and Environment Touchpoints
- JWT and origin secrets are injected during Helm deployment.
- Integration tests inject DB connection and JWT secret in test environment.
