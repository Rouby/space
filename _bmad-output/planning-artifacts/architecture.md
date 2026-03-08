---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - /home/rouby/space/_bmad-output/planning-artifacts/prd.md
  - /home/rouby/space/_bmad-output/planning-artifacts/product-brief-space-2026-03-08.md
  - /home/rouby/space/_bmad-output/planning-artifacts/ux-design-specification.md
  - /home/rouby/space/_bmad-output/project-context.md
  - /home/rouby/space/docs/index.md
  - /home/rouby/space/docs/project-overview.md
  - /home/rouby/space/docs/source-tree-analysis.md
  - /home/rouby/space/docs/integration-architecture.md
  - /home/rouby/space/docs/api-contracts-backend.md
  - /home/rouby/space/docs/data-models-data.md
  - /home/rouby/space/docs/deployment-guide.md
  - /home/rouby/space/docs/component-inventory-frontend.md
  - /home/rouby/space/docs/architecture-frontend.md
  - /home/rouby/space/docs/architecture-backend.md
  - /home/rouby/space/docs/architecture-data.md
  - /home/rouby/space/docs/architecture-gameloop.md
  - /home/rouby/space/docs/architecture-ai.md
  - /home/rouby/space/docs/architecture-integration.md
  - /home/rouby/space/docs/architecture-infra.md
  - /home/rouby/space/docs/development-guide-backend.md
  - /home/rouby/space/docs/development-guide-frontend.md
  - /home/rouby/space/docs/development-guide-data.md
  - /home/rouby/space/docs/development-guide-integration.md
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-08'
project_name: 'space'
user_name: 'Rouby'
date: '2026-03-08'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The PRD defines 46 functional requirements spanning nine architectural capability areas:
- Identity and access control (account/session continuity, player-scoped visibility enforcement)
- Campaign lifecycle orchestration (join, async turn submit, resolve, host controls, participation visibility)
- Core empire systems (population/resources/discovery/colonization/strategy)
- Fleet and conflict systems (construction, movement, combat, outcome propagation)
- Dilemma-driven dynamics (consequential branching choices that shape pacing and strategic tension)
- Re-entry continuity (summary-first re-onboarding, unresolved decision focus, continuity after inactivity)
- Operations/support trust workflows (health monitoring, anomaly detection, investigation, auditable transitions)
- Product intelligence (completion/retention/balance/restart instrumentation)
- Internal integration contracts (evolvable APIs and traceability to requirements)

Architecturally, this implies a modular but tightly coordinated system: deterministic domain engine + stateful campaign services + contract-governed API + UX orchestration surfaces + operational telemetry pipelines.

**Non-Functional Requirements:**
The 22 NFRs are architecture-driving and non-negotiable:
- Performance: responsive turn flows and campaign-state interactions under normal and growth conditions
- Security: strict auth/session controls, player-level visibility boundaries, auditability, secure secret handling
- Scalability: support campaign/player growth with observable capacity limits and proactive mitigation
- Accessibility: keyboard operability, readable semantics, contrast/focus quality for strategic surfaces
- Integration stability: frontend-backend contract continuity and consistent analytics semantics
- Reliability/determinism: durable campaign state, deterministic turn resolution, recoverability, and bounded incident restoration windows

These NFRs require first-class treatment in service boundaries, data model design, event processing, deployment strategy, and observability.

**Scale & Complexity:**
This is a high-complexity, multi-package full-stack system with game-domain determinism constraints and long-lived asynchronous state.

- Primary domain: Full-stack async strategy game platform
- Complexity level: High
- Estimated architectural components: 12-16 major components/subsystems (API gateway/schema layer, auth/session, campaign orchestration, turn pipeline, deterministic gameloop, dilemma engine, combat subsystem, persistence layer, telemetry/analytics, admin/ops surfaces, integration contracts, deployment/runtime platform)

### Technical Constraints & Dependencies

- Existing monorepo and package boundaries (`frontend`, `backend`, `data`, `gameloop`, `integration`, `infra`) should be preserved.
- GraphQL contract is central and must evolve without breaking active campaign continuity.
- Deterministic simulation behavior is a core trust requirement and must remain reproducible across releases.
- UX requires desktop-first high-density strategic surfaces with constrained mobile quick-turn support.
- Infrastructure is Helm/Kubernetes based with CI/CD image promotion, requiring environment-safe config/secret handling.
- Existing stack conventions (TypeScript strict mode, generated GraphQL artifacts, Mantine/TanStack Router/urql patterns) constrain implementation choices.

### Cross-Cutting Concerns Identified

- Determinism and fairness integrity across turn resolution, combat outcomes, and dilemma effects
- Auth, claims, and fog-of-war visibility enforcement across all read/write paths
- Campaign durability, backup/recovery, and incident-safe operational workflows
- Observability for campaign health, imbalance detection, and support diagnostics
- Contract governance and compatibility strategy for GraphQL/schema evolution
- Performance engineering for late-campaign data growth and high-information UX surfaces
- Accessibility and usability consistency in high-density strategic interfaces
- Release safety mechanisms (staged rollout, migration discipline, regression detection) for active campaigns

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web platform (SPA frontend + GraphQL backend + deterministic gameloop + data/infra) based on project requirements analysis.

### Starter Options Considered

The project context and repository state indicate an existing brownfield monorepo with established package boundaries and conventions. Current starter ecosystems were reviewed via npm registry metadata to validate maintained options:

- `create-vite` (v8.3.0, actively maintained)
- `create-next-app` (v16.1.6, actively maintained)
- `create-remix` (v2.17.4)
- `create-t3-app` (v7.40.0)
- Backend alternatives: `@nestjs/cli` (v11.0.16), `fastify-cli` (v7.4.1)

Given existing architecture and constraints, replacing the foundation with a different starter would add migration risk and violate the requirement to preserve established package ownership and patterns.

### Selected Starter: Vite React TypeScript Baseline (Existing Workspace Foundation)

**Rationale for Selection:**
- Frontend already runs on React + Vite + TypeScript and aligns with UX/performance goals.
- Current monorepo structure and tooling are already integrated (Yarn workspaces, strict TS, GraphQL codegen flows, CI/Helm).
- Brownfield continuity is a hard architectural constraint; re-scaffolding would create churn without architectural benefit.
- Maintains consistency with project context rules for framework, codegen, and package boundaries.

**Initialization Command:**

```bash
npm create vite@latest <project-name> -- --template react-ts
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript-first React application baseline with modern ESM toolchain.

**Styling Solution:**
Neutral baseline; project-specific UI strategy remains Mantine-first with tokenized customization in feature code.

**Build Tooling:**
Vite dev/build pipeline with fast local iteration and modern bundling defaults.

**Testing Framework:**
Starter-level defaults are minimal; project-level testing is already established via Vitest and Playwright in workspace packages.

**Code Organization:**
Feature and route-driven SPA structure, compatible with existing TanStack Router patterns.

**Development Experience:**
Fast HMR/local dev loop and straightforward integration with existing monorepo scripts.

**Note:** This project is already initialized as a brownfield monorepo. No re-initialization should be performed; this command is retained as the canonical equivalent baseline for new sibling apps or future extraction work.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Deterministic data and migration strategy for active campaigns
- Authentication and authorization enforcement model
- GraphQL API contract and error semantics
- Frontend state/routing/component boundaries aligned to async turn UX
- Deployment and runtime scaling model preserving turn correctness

**Important Decisions (Shape Architecture):**
- Read-side projection and caching strategy
- Observability and incident diagnostics model
- Rate-limiting and API abuse controls
- Bundle/performance strategy for dense strategic surfaces

**Deferred Decisions (Post-MVP):**
- Advanced distributed cache topology beyond read-side projection caching
- Dedicated service extraction/microservice boundaries unless scale pressure proves need
- Specialized app-layer field encryption beyond baseline transport/at-rest controls

### Data Architecture

- Database: PostgreSQL with Drizzle ORM (existing stack).
- Modeling strategy: normalized write model + targeted denormalized/materialized read projections for heavy strategic overview queries.
- Validation strategy: layered validation
  - GraphQL/API boundary validation
  - Domain invariants in backend/gameloop
  - DB constraints as final guardrail
- Migration strategy: expand/contract, backward-compatible rollout for active campaigns; avoid destructive same-release transitions.
- Caching strategy: read-side and non-authoritative view caching only; no caching that can alter authoritative deterministic turn resolution.

### Authentication & Security

- Authentication method: JWT-based auth (`jose`) with GraphQL Yoga JWT integration and cookie-based browser session transport.
- Authorization pattern: resolver-level claims checks + resource-scoped visibility enforcement (including fog-of-war constraints).
- Security middleware: centralized auth context assembly and authorization helpers; deny-by-default for missing/invalid claims.
- Encryption model: TLS in transit + encrypted-at-rest storage; no custom field-level crypto unless compliance explicitly requires it.
- API security controls: per-identity/per-operation rate limiting, security-sensitive mutation audit logs, and strict error shaping to avoid secret leakage.

### API & Communication Patterns

- API style: GraphQL-first monolith boundary using domain-separated schema modules.
- API documentation: schema as source of truth + generated references + operation examples in docs.
- Error handling standard: typed domain error mapping with stable GraphQL error codes; no silent nullable fallbacks for required entities.
- Rate limiting strategy: tuned by operation class (auth-sensitive, mutation-heavy, introspection-sensitive).
- Service communication: in-process package boundaries (`@space/data`, `@space/gameloop`) with evented internals for observability and decoupling; no premature network microservice split.

### Frontend Architecture

- State management: `urql` for server-state + feature-local React state/hooks for UI state; avoid global client store until justified by concrete cross-feature pressure.
- Component architecture: feature-sliced modules with shared primitives; GraphQL operation colocation via inline `graphql(...)`.
- Routing strategy: TanStack Router typed route-module boundaries with loader usage where it improves data readiness.
- Performance optimization: prioritize decision-critical rendering paths, query shaping, route/code splitting, and measured hotspot optimization.
- Bundle optimization: Vite/ESM baseline; lazy-load heavy or secondary surfaces (deep drilldowns/admin tooling) and keep mobile quick-turn pathways minimal.

### Infrastructure & Deployment

- Hosting strategy: Kubernetes + Helm for staging/production with dedicated backend/frontend/migrations images.
- CI/CD approach: GitHub Actions quality gates (`lint`, `typecheck`, package tests, integration) before image publish and Helm release.
- Environment configuration: explicit env contracts per service, deploy-time secret injection, no committed secret values.
- Monitoring/logging: structured logs with campaign/turn correlation IDs plus metrics for participation health, turn-resolution latency, and balance anomaly indicators.
- Scaling strategy: horizontally scale stateless services; enforce single-writer execution boundaries (campaign shard/lock domain) for deterministic turn correctness.

### Decision Impact Analysis

**Implementation Sequence:**
1. Enforce auth/claims and visibility guardrails in API boundary and context.
2. Harden deterministic turn pipeline and migration compatibility rules.
3. Implement read-side projections and query shaping for strategic overview surfaces.
4. Build frontend decision-priority workflow with colocated GraphQL operations.
5. Integrate observability, auditability, and operational anomaly detection.
6. Apply deployment/runtime safeguards for campaign-safe scaling and rollout.

**Cross-Component Dependencies:**
- Auth/claims decisions directly constrain GraphQL resolver contracts and frontend data visibility assumptions.
- Data modeling and migration policy drive gameloop determinism, incident recovery, and release safety.
- Read-side projection/caching choices affect frontend performance and API query design.
- Error semantics and rate-limiting influence support tooling, telemetry, and user trust.
- Scaling model is coupled to deterministic turn execution boundaries and queue/locking strategy.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
25+ areas where AI agents could make incompatible choices if patterns are not explicit.

**Rule Precedence (When Rules Conflict):**
1. Security and deterministic-turn correctness rules override all others.
2. Existing package-local conventions override generic conventions for touched files.
3. This architecture document overrides implicit personal coding preferences.
4. If still ambiguous, create/update an ADR note before implementation divergence.

### Naming Patterns

**Database Naming Conventions:**
- Tables: `camelCase` plural nouns (`users`, `turnReports`, `starSystems`).
- Columns: `camelCase` (`userId`, `createdAt`, `resolvedTurnNumber`).
- Primary keys: `id` unless composite key is explicitly required by domain invariants.
- Foreign keys: `<entity>Id` (`gameId`, `ownerUserId`).
- Indexes: `idx<PascalTable><PascalColumnList>` (`idxTurnReportsGameIdTurnNumber`).
- Constraints: `ck<PascalTable><Rule>`, `uq<PascalTable><PascalColumnList>`, `fk<From><To>`.

**API Naming Conventions (GraphQL-first):**
- Types: `PascalCase` singular (`Game`, `TurnReport`, `DilemmaChoice`).
- Input types: `<Action><Entity>Input` (`SubmitTurnInput`).
- Query fields: camelCase descriptive (`gameById`, `activeGames`, `turnReportsForGame`).
- Mutation fields: imperative camelCase (`submitTurn`, `resolveDilemma`, `createGame`).
- Arguments: `camelCase` (`gameId`, `turnNumber`).
- Enums: `SCREAMING_SNAKE_CASE`.
- Error codes: `SCREAMING_SNAKE_CASE` stable identifiers (`FORBIDDEN_VISIBILITY_SCOPE`).

**Code Naming Conventions:**
- TS variables/functions: `camelCase`.
- Types/interfaces/classes/components: `PascalCase`.
- True constants only: `SCREAMING_SNAKE_CASE`.
- Files:
  - React components: `PascalCase.tsx`.
  - Non-component TS modules: follow existing package-local convention; do not mass-rename.
  - Tests: `*.spec.ts` / `*.spec.tsx` by package convention.
- Paths/URL segments: kebab-case where URL-visible.

### Structure Patterns

**Project Organization:**
- Preserve package ownership boundaries:
  - `packages/frontend` UI and client behavior
  - `packages/backend` GraphQL schema/resolvers
  - `packages/data` DB schema/migrations
  - `packages/gameloop` deterministic simulation
  - `packages/integration` Playwright E2E
- Forbidden: deep cross-package relative imports bypassing workspace public entry points.
- Frontend: feature-first under `packages/frontend/src/features/*`.
- Backend: domain-first under `packages/backend/src/schema/*`.

**Test Placement Rules:**
- Backend/gameloop: `src/**/__tests__/*.spec.ts`.
- Integration/E2E: `packages/integration/tests/*.spec.ts`.
- Generated directories must not contain authored tests.

**File Structure Patterns:**
- Generated artifacts are immutable by hand (`packages/frontend/src/gql/*`, `*.generated.ts`, `*.gen.ts`).
- Config should live with owning package unless orchestration requires root.
- Docs live in `docs/` or workflow artifacts, not ad hoc feature folders.

### Format Patterns

**API Response Formats (GraphQL):**
- Success: typed GraphQL schema fields only.
- Errors: GraphQL error envelope with stable `extensions.code`.
- Required entities: explicit GraphQL error; no silent nullable success fallback.
- IDs: boundary-safe string IDs; internal mapping handled in service/domain layer.

**Error Structure:**
- Required fields: `message`, `extensions.code`.
- Optional safe metadata only (no secrets, tokens, raw internals).
- Client-visible errors must be deterministic in code, not free-form per resolver.

**Data Exchange Formats:**
- API layer: `camelCase`.
- DB layer: `camelCase`.
- Datetime: ISO-8601 UTC at API boundary.
- Booleans/nulls: native booleans and explicit nullability from schema.

### Communication Patterns

**Event System Patterns:**
- Naming: past-tense dot format `<domain>.<entity>.<eventPastTense>`.
  - `game.turn.submitted`
  - `combat.resolution.completed`
- Required envelope:
  - `eventId`, `eventVersion`, `occurredAt`, `correlationId`, `source`, `payload`
  - Optional: `actorId`, `gameId`, `traceId`
- Versioning:
  - Additive payload changes: same `eventVersion`.
  - Breaking payload changes: increment `eventVersion` and support transition handling.

**State Management Patterns (Frontend):**
- Server truth: `urql` cache + explicit invalidation/requery policy.
- UI-local state: feature-local hooks/components.
- No duplicate authoritative server entities in ad hoc global stores.
- Async states: `idle | loading | success | error`.

### Process Patterns

**Error Handling Patterns:**
- Backend pipeline: validate -> authorize -> execute -> map domain failures to typed GraphQL errors.
- Frontend: user-safe error copy + explicit recovery action (`retry`, `re-open`, `back to overview`).
- Deterministic paths fail closed on invariant violations and create auditable records.

**Loading State Patterns:**
- Distinguish:
  - Initial load (skeleton)
  - Background refresh (non-blocking indicator)
  - Action pending (scoped control-level state)
- Preserve last-known-good strategic context during refresh.
- Avoid full-screen blocking loaders for local actions.

**Retry and Idempotency Patterns:**
- Mutation retries must be idempotency-safe (idempotency key or equivalent guard).
- UI retry must not create duplicate turn submissions.
- Network retry backoff must be bounded and observable.

### Enforcement Guidelines

**All AI Agents MUST:**
- Respect package boundaries and import constraints.
- Keep frontend GraphQL operations inline with `graphql(...)`.
- Regenerate generated artifacts instead of manual edits.
- Preserve deterministic turn correctness and explicit error semantics.
- Apply naming/format conventions per layer without mixing styles.

**Pattern Enforcement:**
- CI checks:
  - `yarn lint`
  - `yarn typecheck`
  - relevant package tests and integration tests
- Review checklist (required):
  - Naming convention compliance
  - Boundary/import compliance
  - Generated-file immutability
  - Error code stability
  - Auth/visibility checks
  - Deterministic flow safety
- Violations:
  - Mark as `pattern violation` in review and block merge until corrected.
- Pattern evolution:
  - Propose via ADR note and update this architecture document before broad rollout.

### Pattern Examples

**Good Examples:**
- DB: `resolvedTurnNumber`
- GraphQL mutation: `submitTurn(input: SubmitTurnInput!): SubmitTurnPayload!`
- Inline operation:
  - `const TurnReportQuery = graphql(\`query TurnReport($gameId: ID!) { ... }\`)`
- Error code:
  - `extensions.code = "FORBIDDEN_VISIBILITY_SCOPE"`

**Anti-Patterns (Reject in Review):**
- Mixed naming styles within same layer (`user_id` and `userId` in same API object).
- Returning success with null for required entity lookups.
- Cross-package deep relative import into another package internals.
- Hand-editing `src/gql/*` or generated schema/type files.
- Caching or replaying authoritative turn outcomes outside deterministic source-of-truth flow.
- Non-idempotent retry behavior that can duplicate player-impacting actions.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
space/
├── README.md
├── package.json
├── tsconfig.json
├── biome.json
├── .github/
│   ├── copilot-instructions.md
│   ├── prompts/
│   └── workflows/
├── docs/
│   ├── index.md
│   ├── project-overview.md
│   ├── source-tree-analysis.md
│   ├── integration-architecture.md
│   ├── api-contracts-backend.md
│   ├── data-models-data.md
│   ├── deployment-guide.md
│   ├── architecture-frontend.md
│   ├── architecture-backend.md
│   ├── architecture-data.md
│   ├── architecture-gameloop.md
│   ├── architecture-ai.md
│   ├── architecture-integration.md
│   ├── architecture-infra.md
│   ├── component-inventory-frontend.md
│   ├── development-guide-frontend.md
│   ├── development-guide-backend.md
│   ├── development-guide-data.md
│   └── development-guide-integration.md
├── helm/
│   ├── Chart.yaml
│   ├── values.yaml
│   ├── charts/
│   └── templates/
│       ├── _helpers.tpl
│       ├── deployment-backend.yaml
│       ├── deployment-frontend.yaml
│       ├── deployment-database.yaml
│       ├── migrations.yaml
│       ├── ingress.yaml
│       ├── service.yaml
│       ├── secrets.yaml
│       └── persistentvolumeclaim.yaml
├── packages/
│   ├── frontend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   ├── postcss.config.cjs
│   │   ├── codegen.ts
│   │   ├── public/
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── routes/
│   │       ├── features/
│   │       ├── components/
│   │       ├── gql/                # generated, read-only
│   │       ├── theme/
│   │       └── utils/
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── codegen.ts
│   │   └── src/
│   │       ├── main.ts
│   │       ├── schema/
│   │       │   ├── base/
│   │       │   ├── user/
│   │       │   ├── game/
│   │       │   ├── starSystem/
│   │       │   ├── taskForce/
│   │       │   ├── resource/
│   │       │   ├── dilemma/
│   │       │   ├── shipComponent/
│   │       │   └── shipDesign/
│   │       ├── observables/
│   │       ├── workers/
│   │       ├── context/
│   │       └── __tests__/
│   ├── data/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts
│   │   ├── drizzle.config.test.ts
│   │   ├── drizzle/
│   │   │   ├── *.sql
│   │   │   └── meta/
│   │   └── src/
│   │       ├── schema.ts
│   │       ├── db.ts
│   │       ├── repositories/
│   │       └── schema/
│   ├── gameloop/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── main.ts
│   │       ├── setup/
│   │       ├── tick/
│   │       ├── react/
│   │       └── __tests__/
│   ├── ai/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── createChat.ts
│   │       ├── createCompletion.ts
│   │       ├── prompts/
│   │       └── chats/
│   └── integration/
│       ├── package.json
│       ├── playwright.config.ts
│       ├── global-setup.ts
│       ├── global-teardown.ts
│       └── tests/
│           └── *.spec.ts
├── _bmad/
└── _bmad-output/
  ├── project-context.md
  ├── planning-artifacts/
  │   ├── prd.md
  │   ├── ux-design-specification.md
  │   └── architecture.md
  └── implementation-artifacts/
```

### Architectural Boundaries

**API Boundaries:**
- External boundary: GraphQL endpoint (`/graphql`) exposed by `packages/backend/src/main.ts`.
- Schema boundary: domain modules under `packages/backend/src/schema/*`.
- Auth boundary: context + resolver claim checks isolate authenticated capabilities.
- Data boundary: backend accesses storage only through `@space/data` package exports.
- Simulation boundary: backend invokes deterministic gameplay logic via `@space/gameloop`.

**Component Boundaries:**
- Frontend route boundaries in `packages/frontend/src/routes/*`.
- Feature boundaries in `packages/frontend/src/features/*` with local UI state and inline GraphQL operations.
- Shared presentational components in `packages/frontend/src/components/*`.
- No frontend direct DB/simulation access; all through GraphQL contract.

**Service Boundaries:**
- Backend orchestrates domain interactions and owns API contract.
- Data package owns schema/migrations/repository abstractions.
- Gameloop package owns deterministic turn-resolution logic.
- AI package is auxiliary and non-authoritative for gameplay correctness.
- Integration package owns cross-service behavior verification.

**Data Boundaries:**
- PostgreSQL is authoritative persistence.
- Migration ownership: `packages/data/drizzle/*`.
- DB naming conventions (by architecture rule): camelCase.
- Read projections/caching are non-authoritative and must not override deterministic outcomes.

### Requirements to Structure Mapping

**Feature/FR Mapping:**
- Identity & access (FR1-FR5): `packages/backend/src/schema/user/*`, `packages/frontend/src/features/auth/*`.
- Campaign lifecycle (FR6-FR11): `packages/backend/src/schema/game/*`, `packages/frontend/src/features/game/*`.
- Empire progression (FR12-FR16): `packages/gameloop/src/tick/*`, `packages/backend/src/schema/resource/*`, `packages/frontend/src/features/empire/*`.
- Fleet/combat (FR17-FR21): `packages/gameloop/src/tick/*`, `packages/backend/src/schema/taskForce/*`, `packages/frontend/src/features/fleet/*`.
- Dilemmas (FR22-FR26): `packages/backend/src/schema/dilemma/*`, `packages/gameloop/src/react/*`, `packages/frontend/src/features/dilemmas/*`.
- Re-entry/continuity (FR27-FR31): `packages/frontend/src/features/turnReports/*`, `packages/backend/src/schema/game/*`.
- Ops/support (FR32-FR37): backend observability paths + integration tests + docs playbooks.
- Product intelligence (FR38-FR42): analytics/event streams from backend and data models.
- Internal APIs (FR43-FR46): GraphQL contract governance in backend schema/codegen.

**Cross-Cutting Concerns:**
- Determinism: `packages/gameloop`, backend orchestration guards, integration tests.
- Auth/visibility: backend context/resolvers + frontend guarded routes.
- Error consistency: backend GraphQL error mapping, frontend error boundaries.
- Accessibility/performance: frontend route/features and component-level implementation patterns.
- Deployment safety: `.github/workflows/*` + `helm/templates/*`.

### Integration Points

**Internal Communication:**
- Frontend -> Backend: GraphQL over `/graphql`.
- Backend -> Data: workspace package imports.
- Backend -> Gameloop: workspace package imports.
- Backend internal async/eventing: observables/workers patterns.

**External Integrations:**
- PostgreSQL (primary datastore).
- Container registry and deployment infra via GitHub Actions + Helm/Kubernetes.
- Optional future analytics sink through structured events (non-blocking path).

**Data Flow:**
1. Client triggers query/mutation.
2. Backend validates/authenticates/authorizes.
3. Backend reads/writes through data package.
4. Backend runs deterministic simulation via gameloop for turn-impacting actions.
5. Backend returns typed response or typed GraphQL error.
6. Frontend updates server-state/UI-state according to standardized patterns.

### File Organization Patterns

**Configuration Files:**
- Root-level orchestration (`package.json`, `tsconfig.json`, `biome.json`).
- Package-local config for runtime/build/test/codegen.
- Deployment config under `helm/`, workflow config under `.github/workflows/`.

**Source Organization:**
- Feature/domain-first organization in frontend/backend.
- Repository/schema-first in data package.
- Deterministic engine modules in gameloop package.

**Test Organization:**
- Unit/spec tests co-located by package conventions.
- End-to-end tests centralized in `packages/integration/tests/`.
- Generated code excluded from authored test placement.

**Asset Organization:**
- Static frontend assets in `packages/frontend/public/`.
- Generated artifacts remain under owned generated folders and are regenerated, not edited.

### Development Workflow Integration

**Development Server Structure:**
- Run frontend and backend independently via workspace scripts.
- Integration package can orchestrate both for E2E flows.

**Build Process Structure:**
- Package-level build/typecheck and root orchestration pipelines.
- Codegen steps for backend/frontend GraphQL artifacts integrated into workflow.

**Deployment Structure:**
- CI gates -> image build/push -> Helm release.
- Backend/frontend/migrations deployed as separate workloads with shared config contract.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All major architectural decisions are compatible:
- GraphQL Yoga + domain schema organization aligns with backend package boundaries.
- PostgreSQL/Drizzle decisions align with migration strategy and deterministic simulation constraints.
- Frontend stack (React/Vite/TanStack Router/urql/Mantine) aligns with UX density and responsiveness goals.
- Infra decisions (Helm + GitHub Actions + image split) align with deployment and scaling model.
- Security decisions (JWT + claim enforcement + visibility boundaries) align with trust and fairness requirements.

No contradictory core decisions were identified.

**Pattern Consistency:**
Implementation patterns are coherent with architecture:
- Naming, boundary, and generated-file rules support consistency across agents.
- Error and loading patterns are aligned with GraphQL-first behavior and UX expectations.
- Event/state patterns align with observability and async game-loop requirements.
- Rule precedence is explicit, reducing ambiguous implementation outcomes.

**Structure Alignment:**
Project structure supports architecture:
- Package ownership boundaries match decision domains.
- API/data/gameloop integration boundaries are explicit.
- Test placement supports both package-level determinism checks and end-to-end flow validation.
- Integration/deployment structure aligns with CI/CD and runtime topology.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
No formal epics were used as the primary driver; coverage was performed against FR categories and mapped to concrete package locations.

**Functional Requirements Coverage:**
All FR categories (identity, campaign lifecycle, progression, fleet/combat, dilemmas, re-entry, ops/support, analytics, integrations) are architecturally supported and mapped to package/module boundaries.

**Non-Functional Requirements Coverage:**
All NFR classes are covered:
- Performance: query shaping, projection strategy, bundle/routing optimization.
- Security: auth/authz boundaries, least-privilege visibility, error hardening.
- Scalability: stateless scale strategy + deterministic single-writer execution domains.
- Reliability: migration safety, deterministic pipelines, recovery/observability.
- Accessibility: UX constraints and implementation patterns explicitly include accessibility expectations.
- Integration stability: GraphQL contract governance and generated artifact discipline.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical decisions are documented with current version baselines and rationale. Deferred items are explicitly separated from blocking scope.

**Structure Completeness:**
A concrete, non-generic project tree and boundary map exists, with integration points and requirement mappings.

**Pattern Completeness:**
High-risk conflict points are covered:
- Naming and boundary rules
- Error/format/state conventions
- Process rules for retry/idempotency and deterministic safety
- Enforcement rules through CI and review checklist

### Gap Analysis Results

**Critical Gaps:** None identified.

**Important Gaps (Non-blocking):**
- DB `camelCase` convention differs from many SQL-default conventions; requires strict enforcement and migration/review discipline to prevent drift.
- Ops/support implementation playbooks are referenced but could later be expanded into dedicated runbooks.

**Nice-to-Have Gaps:**
- Additional ADR templates/examples for future architectural changes.
- Example snippets for common resolver error code mappings and event versioning transitions.

### Validation Issues Addressed

- Potential naming conflict risk reduced by explicit DB naming convention decision (`camelCase`) and corresponding data-format alignment.
- Potential cross-package drift addressed via enforced package ownership and import boundary rules.
- Potential generated-file conflict addressed with explicit “regenerate, never edit” policy.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Strong deterministic-simulation and trust-oriented architecture baseline
- Clear package boundaries and implementation consistency rules for multi-agent work
- Explicit requirement-to-structure mapping across all major FR/NFR classes
- Deployment and observability considerations integrated early

**Areas for Future Enhancement:**
- Expand ops/support runbooks with incident decision trees
- Add ADR templates for faster future architecture updates
- Add reference examples for event version migrations

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and boundaries.
- Refer to this document for all architectural questions.

**First Implementation Priority:**
Enforce authentication/authorization and visibility boundaries in backend context/resolvers while preserving deterministic turn pipeline guarantees.
