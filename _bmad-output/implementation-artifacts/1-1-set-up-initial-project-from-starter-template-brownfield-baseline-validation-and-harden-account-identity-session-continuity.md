# Story 1.1: Set Up Initial Project from Starter Template (Brownfield Baseline Validation) and Harden Account Identity/Session Continuity

Status: done

## Story

As a player,
I want the existing project baseline and account/session flows validated and hardened,
so that I can resume campaigns across sessions without losing identity context.

## Acceptance Criteria

1. Given existing account and session flows in the brownfield stack, when a player registers, authenticates, and returns with a valid session, then identity continuity is preserved across active campaigns, and regression tests confirm no breakage in current login/resume behavior.
2. Given invalid or expired credentials/session tokens, when a player attempts access, then access is denied with typed, non-leaky errors, and re-authentication paths are presented consistently.

## Tasks / Subtasks

- [x] Validate brownfield baseline and identify auth/session continuity touchpoints (AC: 1, 2)
- [x] Confirm current account creation and login/resume behavior in backend/frontend integration paths
- [x] Document current happy-path and failure-path behavior to establish regression guardrails
- [x] Harden backend auth/session handling with typed, explicit failure behavior (AC: 2)
- [x] Ensure resolver/context auth checks fail closed for missing/invalid claims
- [x] Ensure invalid/expired token/session paths return deterministic GraphQL errors with stable `extensions.code`
- [x] Ensure no sensitive token/cookie internals leak in user-visible error surfaces
- [x] Validate session continuity across active campaign access flows (AC: 1)
- [x] Verify restored session can access expected player-scoped context for active campaigns
- [x] Verify continuity behavior remains consistent after browser/session restart scenarios
- [x] Add/update tests for continuity and denial paths (AC: 1, 2)
- [x] Add backend Vitest coverage for valid continuity and invalid/expired session rejection
- [x] Add or update integration coverage for login/resume continuity and re-auth prompts
- [x] Run and pass repo quality gates for touched scope (AC: 1, 2)
- [x] Run lint/typecheck and relevant package tests before marking implementation complete

## Dev-Story Execution Checklist

- [ ] Confirm baseline auth/session behavior in current code before changes.
- [ ] Backend cookie/JWT entry points reviewed:
- [ ] `packages/backend/src/main.ts`
- [ ] `packages/backend/src/config.ts`
- [ ] `packages/backend/src/context.ts`
- [ ] User auth resolvers reviewed and hardened:
- [ ] `packages/backend/src/schema/user/resolvers/Mutation/registerWithPassword.ts`
- [ ] `packages/backend/src/schema/user/resolvers/Mutation/loginWithPassword.ts`
- [ ] `packages/backend/src/schema/user/resolvers/Mutation/loginWithRefreshToken.ts`
- [ ] `packages/backend/src/schema/user/resolvers/Query/me.ts`
- [ ] Frontend auth continuity flows reviewed and aligned with backend behavior:
- [ ] `packages/frontend/src/Auth.tsx`
- [ ] `packages/frontend/src/urql.ts`
- [ ] `packages/frontend/src/routes/_dashboard/signin.tsx`
- [ ] `packages/frontend/src/features/SignInForm/SignInForm.tsx`
- [ ] `packages/frontend/src/features/SignUpForm/SignUpForm.tsx`
- [ ] Add backend auth/session regression tests (new files under `packages/backend/src/**/__tests__`).
- [ ] Extend Playwright integration tests for invalid/expired session and refresh fallback behavior:
- [ ] `packages/integration/tests/smoke.spec.ts`
- [ ] `packages/integration/tests/ingame.spec.ts`
- [ ] If frontend GraphQL operations change, run `yarn workspace @space/frontend graphql-codegen`.
- [ ] Validate with `yarn lint`, `yarn typecheck`, and targeted test runs before completion.

## Dev Notes

- This is a brownfield hardening story, not a re-scaffold story. Preserve existing workspace/package structure and conventions.
- Keep implementation scoped to owned packages and existing auth/session architecture. Do not introduce cross-package shortcuts.
- Preserve deterministic, typed error behavior for auth failures; do not return silent nullable success for required auth-protected entities.

### Technical Requirements

- Runtime/tooling baseline: Node.js v22, Yarn 4.6.0, TypeScript strict mode.
- Backend auth model: JWT-based auth (`jose`) with GraphQL Yoga integration and cookie-based browser session transport.
- Authorization pattern: explicit resolver-level claims checks + deny-by-default behavior for missing/invalid claims.
- Error requirements: stable, typed GraphQL errors with deterministic `extensions.code`; no leaky error content.
- Security baseline: do not log secrets/tokens/cookie values; preserve secure auth handling across environments.

### Architecture Compliance

- Keep backend domain structure under `packages/backend/src/schema/**` and context/auth behavior under existing backend context boundaries.
- Access persistence through `@space/data` package boundaries; do not bypass package entry points.
- Preserve compatibility discipline for active campaigns: harden behavior without breaking baseline login/resume flows.

### Library/Framework Requirements

- Backend: GraphQL Yoga 5.x + GraphQL 16.x conventions already used in repository.
- Auth/session implementation should align with existing `jose`/JWT approach and cookie-session transport.
- Frontend GraphQL operations remain inline via `graphql(...)`; regenerate frontend types if operations are changed.

### File Structure Requirements

- Place backend logic/tests in existing backend package folders (`src/schema/**`, `src/**/__tests__/**`).
- Keep integration/browser behavior tests in `packages/integration/tests/*.spec.ts` when needed.
- Do not hand-edit generated files (`*.generated.ts`, `*.gen.ts`, `packages/frontend/src/gql/*`).

### Testing Requirements

- Add/update backend Vitest tests for:
- successful identity/session continuity through login/resume paths
- invalid or expired token/session denial with typed error assertions
- Add/update integration coverage for re-auth behavior and continuity UX where story scope touches frontend flow.
- Validate at least:
- `yarn lint`
- `yarn typecheck`
- targeted backend/integration tests relevant to touched behavior

### Baseline Risk Notes (Current State)

- Current integration tests validate guest redirect and seeded-cookie login, but do not yet assert invalid/expired access-token recovery and consistent re-auth UX.
- Current backend auth errors are not consistently mapped to explicit typed codes for all failure paths in user auth mutations.
- Access token cookie is currently set with `httpOnly: false` to support frontend token read in `Auth.tsx`; hardening must preserve continuity while reducing exposure risk within existing architecture constraints.
- Story 1.1 should improve reliability and error consistency without introducing breaking contract changes for active auth flows.

### Project Structure Notes

- Monorepo package boundaries are mandatory (`frontend`, `backend`, `data`, `gameloop`, `integration`).
- This story should not introduce architectural drift, new frameworks, or package ownership violations.
- Keep changes narrow and regression-safe to establish a stable foundation for Epic 1 follow-on stories.

### References

- Story definition and ACs: [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1: Set Up Initial Project from Starter Template (Brownfield Baseline Validation) and Harden Account Identity/Session Continuity]
- Epic objective context: [Source: _bmad-output/planning-artifacts/epics.md#Epic 1: Identity, Access, and Campaign Participation Foundation]
- Auth/security architecture: [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- Error handling and typed codes: [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- Error envelope and deterministic behavior: [Source: _bmad-output/planning-artifacts/architecture.md#Format Patterns]
- Backend boundary/package constraints: [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Boundaries]
- Project technical guardrails and do-not-miss rules: [Source: _bmad-output/project-context.md#Critical Don't-Miss Rules]
- UX confidence/re-auth continuity intent: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Core User Experience]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Workflow execution: create-story (BMAD) in YOLO-style automation mode for template outputs
- Dev-story run: set sprint status to in-progress, implemented auth hardening changes, added backend/integration regression tests.
- Test run: `yarn workspace @space/backend vitest run src/schema/user/resolvers/__tests__/authErrors.spec.ts` (pass).
- Test run: `yarn typecheck` (pass).
- Test run: `yarn lint` (pass with existing repository warnings unrelated to this story).
- Test run: `yarn workspace @space/integration playwright test tests/smoke.spec.ts` (blocked: PostgreSQL connection refused at `127.0.0.1:5432`).
- Test run: `yarn workspace @space/integration playwright test tests/smoke.spec.ts` (pass after PostgreSQL started).
- Test run: `yarn workspace @space/integration playwright test tests/ingame.spec.ts` (pass).
- Test run: `yarn test` (workspace test command executed successfully in current repo configuration).
- Senior review fix run: `yarn workspace @space/backend vitest run src/schema/user/resolvers/__tests__/authErrors.spec.ts` (pass).
- Senior review fix run: `yarn workspace @space/integration playwright test tests/smoke.spec.ts` (pass).

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story prepared as `ready-for-dev` with architecture, testing, and boundary guardrails.
- Hardened backend auth mutation error handling with typed GraphQL error codes (`INVALID_CREDENTIALS`, `MISSING_REFRESH_TOKEN`, `INVALID_REFRESH_TOKEN`, `EMAIL_ALREADY_IN_USE`).
- Hardened frontend token parsing to avoid crash on malformed `accessToken` cookie and preserve re-auth redirect flow.
- Hardened frontend auth continuity check to treat expired `accessToken` JWTs as unauthenticated and trigger re-auth flow.
- Hardened refresh-login resolver to clear invalid auth cookies and rotate refresh tokens on successful refresh.
- Added backend Vitest coverage for credential and refresh-token denial paths.
- Added backend Vitest coverage for successful refresh continuity and token rotation behavior.
- Added integration smoke coverage for malformed access-token redirect behavior.
- Added integration smoke coverage for expired access-token redirect behavior.
- End-to-end continuity validation completed once PostgreSQL runtime dependency was available.
- Story passed senior code review remediation with acceptance criteria covered by code and tests.

### File List

- _bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template-brownfield-baseline-validation-and-harden-account-identity-session-continuity.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- packages/backend/src/schema/user/resolvers/Mutation/loginWithPassword.ts
- packages/backend/src/schema/user/resolvers/Mutation/loginWithRefreshToken.ts
- packages/backend/src/schema/user/resolvers/Mutation/registerWithPassword.ts
- packages/backend/src/schema/user/resolvers/__tests__/authErrors.spec.ts
- packages/frontend/src/Auth.tsx
- packages/integration/tests/smoke.spec.ts

## Change Log

- 2026-03-08: Story moved to in-progress, auth/session error handling hardened, regression tests added, and validation run performed; completion blocked pending integration test runtime dependencies (PostgreSQL).
- 2026-03-08: PostgreSQL runtime dependency provided, integration suite rerun successfully, all story tasks completed, and story promoted to review.
- 2026-03-08: Senior code review findings remediated (expired-token handling, refresh-cookie hardening, continuity tests), targeted backend/integration tests passed, and story moved to done.

## Senior Developer Review (AI)

### Reviewer

Rouby (AI Senior Developer Review)

### Date

2026-03-08

### Outcome

Changes Requested (resolved in-story)

### Findings and Resolution Summary

- HIGH: Expired access tokens were not treated as invalid in frontend auth continuity flow. Resolved in `packages/frontend/src/Auth.tsx` by enforcing `exp` check before deriving authenticated identity.
- HIGH: Missing expired-token integration regression coverage. Resolved in `packages/integration/tests/smoke.spec.ts` with explicit expired-token redirect test.
- HIGH: Claimed continuity coverage was incomplete. Resolved in `packages/backend/src/schema/user/resolvers/__tests__/authErrors.spec.ts` by adding successful refresh continuity and token-rotation assertions.
- MEDIUM: Refresh resolver had unresolved hardening TODO. Resolved in `packages/backend/src/schema/user/resolvers/Mutation/loginWithRefreshToken.ts` by implementing refresh token rotation.
- MEDIUM: Invalid refresh-token flow did not clear stale auth cookies. Resolved in `packages/backend/src/schema/user/resolvers/Mutation/loginWithRefreshToken.ts` by expiring both auth cookies on invalid token/user.

### Validation Evidence

- `yarn workspace @space/backend vitest run src/schema/user/resolvers/__tests__/authErrors.spec.ts` passed.
- `yarn workspace @space/integration playwright test tests/smoke.spec.ts` passed.
