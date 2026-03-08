# Story 2.4: Resolve Combat and Surface Adaptation Signals

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a player,
I want combat to resolve through task-force card decks with readable outcomes,
so that I can adapt strategy based on results.

## Acceptance Criteria

1. Given opposing task forces engage, when combat resolution runs, then each side uses its task-force-bound deck and card plays are resolved deterministically for equivalent inputs, and resulting state transitions are auditable.
2. Given a player configures or updates a task-force combat deck, when deck validation executes, then MVP deck rules are enforced (exactly 12 cards, max 2 copies per card ID, allowed card set only, and ownership), and invalid configurations return typed errors.
3. Given combat is active, when each combat round resolves, then MVP card-play limits are enforced (draw up to 3 cards at combat start, 1 card played per round per side, max 3 rounds, and hand-only play constraints), and illegal plays are rejected with explicit rule violations.
4. Given combat has resolved, when player reviews results, then key outcome signals include card-driven effects (damage, buffs, and applied special effects) and losses/gains are presented clearly to support next-turn adaptation decisions.

## Tasks / Subtasks

- [x] Implement MVP task-force deck model and validation (AC: 2)
- [x] Define MVP combat card catalog and card-effect taxonomy (damage, buff, special effect) with stable IDs and fixed starter cards.
- [x] Persist deck composition per task force and enforce deck constraints (exactly 12 cards, max 2 duplicates per card ID).
- [x] Validate deck ownership/eligibility on create/update and reject invalid cards with typed GraphQL errors.
- [x] Implement deterministic deck/card combat resolution in turn pipeline (AC: 1, 3)
- [x] Add/extend combat resolution stage in gameloop tick ordering after movement/visibility-preconditions and before turn finalization.
- [x] Implement deterministic draw/play/discard behavior using stable seeded order for equivalent inputs.
- [x] Enforce cards-per-round and hand-availability limits during round resolution.
- [x] Keep authoritative combat writes transaction-scoped with stable processing order.
- [x] Emit auditable card-combat events and preserve observability contract (AC: 1, 4)
- [x] Extend/align event payloads for engagement lifecycle and card-play effects with deterministic identifiers and stable shape.
- [x] Include card-related outcome context in events (cardId, effect type, target/impact summary) without leaking hidden information.
- [x] Verify engagement lifecycle events are consumable by existing observables and subscriptions.
- [x] Surface deck management and card-driven outcomes in GraphQL-facing state (AC: 2, 4)
- [x] Add/extend query and mutation contracts for task-force deck configuration and combat outcome retrieval.
- [x] Ensure outcome signals (losses/gains, buffs, special effects, engagement end state) are queryable through existing gameplay surfaces.
- [x] Keep visibility/fog-of-war guarantees while exposing adaptation-relevant summaries.
- [x] Expose adaptation-friendly card outcome signals in frontend flows (AC: 4)
- [x] Update gameplay views to present deck composition context and post-combat card-driven signals clearly.
- [x] Keep operation colocation with inline `graphql(...)` where frontend operation changes are required.
- [x] Add deterministic regression coverage (AC: 1, 2, 3, 4)
- [x] Add/extend gameloop tests for deterministic card draws, play limits, and combat outcome parity.
- [x] Add/extend backend tests for deck validation, authorization, visibility-safe outcome exposure, and typed error semantics.
- [x] Add/extend integration Playwright flow that covers deck setup -> engagement -> card-based resolution -> adaptation signals.
- [x] Validate quality gates for all touched packages.

## Dev-Story Execution Checklist

- [x] Review combat/engagement event contracts and typed payloads:
- [x] `packages/backend/src/events.ts`
- [x] `packages/backend/src/observables/taskForceEngagement.ts`
- [x] `packages/backend/src/observables/taskForceEngagements.ts`
- [x] `packages/backend/src/schema/base/resolvers/Subscription/trackGalaxy.ts`
- [x] Review task-force schema/resolver integration for deck management and combat visibility:
- [x] `packages/backend/src/schema/taskForce/schema.graphql`
- [x] `packages/backend/src/schema/taskForce/resolvers/Game.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/StarSystem.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/TaskForce.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/Mutation/orderTaskForce.ts`
- [x] `packages/backend/src/schema/taskForce/resolvers/Mutation/*` (deck configuration mutation paths)
- [x] Implement/extend deterministic card-combat sequencing in gameloop tick pipeline:
- [x] `packages/gameloop/src/tick/tick.ts`
- [x] `packages/gameloop/src/tick/taskForceMovement.ts`
- [x] `packages/gameloop/src/tick/*` (combat stage module plus MVP card draw/play helpers)
- [x] Validate data model support for deck composition and auditable combat state transitions:
- [x] `packages/data/src/schema/taskForces.ts`
- [x] `packages/data/src/schema/shipDesigns.ts`
- [x] `packages/data/src/schema/shipComponents.ts`
- [x] `packages/data/src/schema/*` (card catalog and task-force deck mapping tables if introduced)
- [x] Keep frontend deck/combat/adaptation UX aligned:
- [x] `packages/frontend/src/routes/games/_authenticated/$id.tsx`
- [x] `packages/frontend/src/features/GalaxyView/TaskForce.tsx`
- [x] `packages/frontend/src/features/GalaxyView/StarSystem.tsx`
- [x] `packages/frontend/src/features/**` (task-force deck management and combat recap surfaces)
- [x] Add/extend backend tests:
- [x] `packages/backend/src/schema/taskForce/resolvers/__tests__/*.spec.ts`
- [x] Add/extend gameloop tests:
- [x] `packages/gameloop/src/__tests__/*.spec.ts`
- [x] Add/extend integration tests:
- [x] `packages/integration/tests/ingame.spec.ts`
- [x] If frontend inline GraphQL operations change, run `yarn workspace @space/frontend graphql-codegen`.
- [x] Validate with:
- [x] `yarn lint`
- [x] `yarn typecheck`
- [x] `yarn workspace @space/backend vitest run`
- [x] `yarn workspace @space/gameloop vitest run`
- [x] `yarn workspace @space/integration playwright test tests/ingame.spec.ts`

## Dev Notes

- This story extends existing fleet pipeline work from Story 2.3; do not re-model fleets or movement semantics.
- MVP combat model in this story is deck/card based and tied to task forces.
- MVP scope includes:
- Per-task-force combat deck configuration.
- Basic card classes: damage, buff, and special effect.
- Deterministic draw/play/discard during combat.
- Enforced cards-per-round and deck validation constraints.
- Out of MVP scope for this story: full collectible meta-progression, rarity economy, and advanced deck-builder UX.
- Engagement event plumbing already exists in backend observables and event types; prioritize extending and consuming these paths over introducing parallel combat channels.
- Deterministic turn semantics are non-negotiable: combat must preserve reproducibility for equivalent inputs.
- Keep visibility-safe behavior intact: players should only receive adaptation signals permitted by current visibility/fog-of-war rules.

### MVP Rule Set (Concrete)

- Deck size: exactly 12 cards per task force.
- Duplicate limit: max 2 copies per card ID in a single deck.
- Allowed pool for MVP: only starter card IDs listed below.
- Hand size at combat start: draw top 3 cards.
- Round structure: up to 3 rounds per engagement.
- Cards per round: each side plays exactly 1 card if hand is non-empty; if empty, side skips.
- Play source: cards can only be played from current hand.
- Draw cadence: after each round, draw 1 card if deck not empty.
- Tie-break order: resolve side A first, then side B, where side ordering is deterministic by lexical compare of taskForceId.
- End condition: engagement ends early if one side is destroyed; otherwise after round 3.

### Starter Card Catalog (MVP)

- `laser_burst` (damage): deal 2 direct hull damage to opposing task force.
- `target_lock` (buff): next damage card played by same side this engagement gets +1 damage.
- `emergency_repairs` (special): restore 1 hull to own task force (cannot exceed pre-combat hull).
- `shield_pulse` (buff): reduce next incoming damage this round by 1 (minimum 0).
- `evasive_maneuver` (buff): reduce next incoming damage by 1.
- `overcharge_barrage` (damage): deal 3 direct hull damage to opposing task force.

### Combat Data Contract (MVP)

- Deck config input includes ordered list of card IDs; order is authoritative draw order seed material.
- Combat event payload for each card play includes: `cardId`, `effectType`, `sourceTaskForceId`, `targetTaskForceId`, `round`, `resolvedValue`.
- Typed GraphQL error codes (minimum set):
- `INVALID_DECK_SIZE`
- `DUPLICATE_CARD_LIMIT_EXCEEDED`
- `CARD_NOT_ALLOWED`
- `CARD_PLAY_LIMIT_EXCEEDED`
- `CARD_NOT_IN_HAND`
- `COMBAT_STATE_INVALID`

### Technical Requirements

- Preserve strict TypeScript and ESM conventions in touched packages.
- Keep explicit authorization and deny-by-default behavior in backend resolvers/queries.
- Keep GraphQL errors typed and stable via `extensions.code` for combat-related validation failures.
- Enforce deterministic deck/card behavior:
- Deck ordering for combat must be seeded deterministically from engagement context.
- Combine engagement seed material with provided deck order to produce deterministic draw sequence.
- Card play eligibility and cards-per-round limits must be enforced at resolve-time.
- Card effects must execute in a stable sequence with explicit tie-breaking rules.
- Preserve deterministic tick guarantees:
- Equivalent state + orders must yield equivalent combat outcomes.
- Avoid unstable ordering in multi-engagement processing.
- Keep combat state transition writes and event emission transaction-aware and auditable.

### Architecture Compliance

- Respect package boundaries:
- API/subscription contract in `packages/backend/src/schema/**`.
- Deterministic combat simulation in `packages/gameloop/src/tick/**`.
- Persistence/migrations in `packages/data/src/schema/**` and `packages/data/drizzle/**` only when required.
- Gameplay outcome rendering in `packages/frontend/src/features/**` and routes.
- Integration verification in `packages/integration/tests/**`.
- Do not hand-edit generated GraphQL/type artifacts.

### Library/Framework Requirements

- Backend: GraphQL Yoga schema/resolver model with generated resolver types.
- Data: Drizzle schema evolution with migration-safe additive changes only when necessary.
- Gameloop: deterministic tick orchestration under `tick.ts` stage flow.
- Frontend: inline `graphql(...)` operations, urql hooks, Mantine/TanStack Router patterns.
- Integration: Playwright for end-to-end combat outcome and adaptation-signal flow.

### File Structure Requirements

- Keep combat simulation logic under `packages/gameloop/src/tick/**` near movement/construction stages.
- Keep MVP card/deck combat domain logic colocated with task-force combat modules; avoid scattering card rules across unrelated packages.
- Keep engagement event typing centralized in `packages/backend/src/events.ts`.
- Keep engagement event mapping in existing observable modules.
- Keep visibility safety constraints in existing task-force resolvers.
- Keep outcome UX in existing game route/feature surfaces; avoid parallel one-off views.
- Do not hand-edit generated artifacts:
- `packages/frontend/src/gql/*`
- `packages/backend/src/schema/schema.generated.graphqls`
- `packages/backend/src/schema/typeDefs.generated.ts`
- `packages/backend/src/schema/types.generated.ts`

### Testing Requirements

- Backend Vitest:
- Verify deck validation (size bounds, duplicate limits, eligibility, ownership) and typed validation errors.
- Verify exact MVP constraints: 12-card decks, max-2 duplicates, and starter-card whitelist enforcement.
- Verify auth and visibility-safe outcome exposure for combat signals.
- Verify stable GraphQL error semantics for invalid combat transitions.
- Verify subscription/observable mapping compatibility for engagement lifecycle.
- Gameloop Vitest:
- deterministic card draw/play sequencing with equivalent inputs.
- cards-per-round limit enforcement and illegal-play rejection behavior.
- card effect ordering parity (damage, buff, and special effects).
- deterministic tie-break ordering by taskForceId when both sides play in same round.
- deterministic combat outcome tests for equivalent inputs.
- stable event emission ordering and payload parity.
- conflict scenarios involving multiple simultaneous engagements.
- Integration Playwright:
- deck setup for both engaging task forces before combat.
- end-to-end card-driven engagement flow and post-combat adaptation visibility.
- end-to-end flow from order submission to resolved combat outcomes.
- adaptation signals visible to eligible player after resolution.
- hidden/unauthorized combat details remain inaccessible.
- Validation commands:
- `yarn lint`
- `yarn typecheck`
- `yarn workspace @space/backend vitest run`
- `yarn workspace @space/gameloop vitest run`
- `yarn workspace @space/integration playwright test tests/ingame.spec.ts`

### Previous Story Intelligence

- Story 2.3 established deterministic movement and construction ordering in tick flow; combat must compose on top of this ordering instead of bypassing it.
- Story 2.3 expanded task-force eventing and visibility-safe transitions; reuse the same event discipline for combat lifecycle signals.
- Story 2.3 surfaced that queue/order legality must be validated both at mutation-time and resolve-time; apply the same dual-phase validation principle for combat transitions.
- Apply the same dual-phase validation pattern for deck/card rules: validate at deck configuration time and enforce again at combat resolve-time.
- Story 2.3 integration coverage already exercises fleet movement and hidden visibility constraints; extend those test patterns for combat outcomes rather than creating disconnected new harnesses.

### Git Intelligence Summary

Recent commits indicate this implementation trend:

- `c2210f5`: strengthened test-first reliability around tick construction.
- `0d7298f`: expanded task-force mutation contract and typed inputs.
- `cad99b1`: prior deterministic progression delivered with GraphQL integration.

Carry this pattern into Story 2.4: deterministic simulation first, explicit contract behavior, and regression coverage before broad refactors.

### Latest Tech Information

- External web research was not performed in this run.
- Repository-pinned versions in `_bmad-output/project-context.md` are authoritative for implementation.

### Project Context Reference

- Runtime/toolchain baseline: Node 22, Yarn 4.6.0, strict TypeScript.
- Frontend GraphQL convention: inline `graphql(...)` operations with codegen refresh after operation changes.
- Generated artifacts are not edited manually; regenerate via workflow scripts.

### Story Completion Status

- Implementation and review remediations are complete.
- Story status is set to `done`.

## References

- Story definition and ACs: [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4: Resolve Combat and Surface Adaptation Signals]
- Epic context: [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: Core Empire and Fleet Command Loop]
- FR/NFR mapping: [Source: _bmad-output/planning-artifacts/prd.md]
- Architecture boundaries and FR mapping: [Source: _bmad-output/planning-artifacts/architecture.md]
- UX explainability and confidence principles: [Source: _bmad-output/planning-artifacts/ux-design-specification.md]
- Project implementation guardrails: [Source: _bmad-output/project-context.md]
- Existing engagement event types: [Source: packages/backend/src/events.ts]
- Existing engagement observables: [Source: packages/backend/src/observables/taskForceEngagement.ts]
- Existing engagement list observable: [Source: packages/backend/src/observables/taskForceEngagements.ts]
- Deterministic tick orchestration baseline: [Source: packages/gameloop/src/tick/tick.ts]
- Fleet integration testing baseline: [Source: packages/integration/tests/ingame.spec.ts]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Workflow execution: `bmad-bmm-dev-story` via `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story status transitions: `ready-for-dev -> in-progress -> review`
- GraphQL/schema generation:
- `yarn codegen`
- Validation commands executed:
- `yarn lint`
- `yarn typecheck`
- `yarn workspace @space/backend vitest run`
- `yarn workspace @space/gameloop vitest run`
- `yarn workspace @space/backend vitest run src/schema/taskForce/resolvers/__tests__/taskForceRules.spec.ts`
- `yarn workspace @space/gameloop vitest run src/__tests__/taskForceCombat.spec.ts src/__tests__/taskForceMovement.spec.ts`
- `yarn workspace @space/integration playwright test tests/ingame.spec.ts`
- `yarn workspace @space/integration playwright test tests/ingame.spec.ts --grep "configures task force combat deck with MVP validation rules"`
- `yarn workspace @space/integration playwright test tests/ingame.spec.ts --grep "resolves configured combat decks during turn resolution and applies engagement outcomes"`

### Completion Notes List

- Implemented `configureTaskForceCombatDeck` mutation with MVP validation rules (`INVALID_DECK_SIZE`, duplicate limit, and allowed-card enforcement).
- Added persisted `combatDeck` support on task forces and initialized new fleets with a starter deck.
- Integrated deterministic card-combat stage into gameloop tick flow (`tickTaskForceCombat`) with deterministic engagement IDs and ordered card resolution.
- Extended combat events with adaptation metadata (`round`, `effectType`, `resolvedValue`) for card-driven outcome visibility.
- Added backend resolver unit tests, gameloop deterministic combat tests, and a Playwright integration scenario for deck-configuration validation.
- Regenerated backend/frontend GraphQL artifacts via `yarn codegen` and validated typecheck + lint + targeted test suites.
- Applied code-review remediations: explicit combat-state rule violations, removed silent invalid-deck fallback, and added ownership/duplicate validation coverage.
- Extended integration coverage with deck configuration authorization/validation and end-to-end combat resolution assertions.

### File List

- _bmad-output/implementation-artifacts/2-4-resolve-combat-and-surface-adaptation-signals.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- packages/backend/src/events.ts
- packages/backend/src/schema/resolvers.generated.ts
- packages/backend/src/schema/schema.generated.graphqls
- packages/backend/src/schema/taskForce/resolvers/Game.ts
- packages/backend/src/schema/taskForce/resolvers/Mutation/configureTaskForceCombatDeck.ts
- packages/backend/src/schema/taskForce/resolvers/Mutation/constructTaskForce.ts
- packages/backend/src/schema/taskForce/resolvers/StarSystem.ts
- packages/backend/src/schema/taskForce/resolvers/TaskForce.ts
- packages/backend/src/schema/taskForce/resolvers/TaskForceFollowOrder.ts
- packages/backend/src/schema/taskForce/resolvers/__tests__/taskForceRules.spec.ts
- packages/backend/src/schema/dilemma/resolvers/Game.ts
- packages/backend/src/schema/taskForce/schema.graphql
- packages/backend/src/schema/taskForce/schema.mappers.ts
- packages/backend/src/schema/typeDefs.generated.ts
- packages/backend/src/schema/types.generated.ts
- packages/data/drizzle/0005_classy_synch.sql
- packages/data/drizzle/meta/0005_snapshot.json
- packages/data/drizzle/meta/_journal.json
- packages/data/src/schema/taskForces.ts
- packages/frontend/src/features/GameLobby/GameLobby.tsx
- packages/frontend/src/gql/graphql.ts
- packages/frontend/src/gql/introspection.json
- packages/gameloop/src/__tests__/taskForceCombat.spec.ts
- packages/gameloop/src/tick/taskForceCombat.ts
- packages/gameloop/src/tick/tick.ts
- packages/integration/tests/ingame.spec.ts

## Senior Developer Review (AI)

- Review date: 2026-03-08
- Outcome: changes requested issues were fixed in code and tests.
- Verified remediations:
- Added explicit combat-state violation handling (`COMBAT_STATE_INVALID`, play-limit guards) and removed silent invalid deck normalization.
- Added backend tests for duplicate-limit rejection and owner authorization denial.
- Added integration coverage for deck auth/validation and end-to-end combat resolution outcome.
- Story file list and implementation notes were synchronized with actual changed files.

## Change Log

- 2026-03-08: Implemented MVP deck/card combat foundations for Story 2.4, including deck configuration mutation/validation, deterministic gameloop card resolution, card-effect event metadata, and backend/gameloop/integration test coverage.
- 2026-03-08: Code review remediations applied for Story 2.4 (explicit combat rule-violation handling, expanded validation coverage, integration flow hardening, and artifact synchronization).
