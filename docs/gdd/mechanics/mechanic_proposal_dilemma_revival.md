# Mechanic Proposal: Dilemma Revival (Starting Identity + Mid-Game Narrative Beats)

## Intent
Dilemmas should become a meaningful strategic system instead of a one-time narrative wrapper. This proposal makes dilemmas:
- Strong early identity shapers (dedicated opening playstyle)
- Richer in thematic writing and variation
- Recurring mid-game narrative decisions tied to important state changes or strategic stagnation

---

## A-C-E

## Architecture (Where)

### Existing files directly impacted
- packages/data/src/schema/dilemmas.ts
- packages/data/src/schema/turnReports.ts
- packages/data/src/schema/games.ts
- packages/gameloop/src/randomGameContent.ts
- packages/gameloop/src/setup/startingConditions.ts
- packages/gameloop/src/react/dilemmaChoice.ts
- packages/gameloop/src/tick/tick.ts
- packages/backend/src/schema/dilemma/schema.graphql
- packages/backend/src/schema/dilemma/resolvers/Mutation/makeDilemmaChoice.ts
- packages/backend/src/schema/game/resolvers/TurnReport.ts
- packages/frontend/src/features/DilemmaChoice/DilemmaChoice.tsx
- packages/frontend/src/features/DilemmasList/DilemmasList.tsx
- packages/frontend/src/features/TurnReportsDetails/TurnReportsDetails.tsx

### New backend/data structures proposed
1. Dilemma lifecycle metadata in dilemmas table
- phase: starting | midgame
- category: origin | crucible | launch | frontier | crisis | doctrine | anomaly
- triggerType: opening | colonization_completed | breakthrough | battle_won | battle_lost | inactivity
- introducedTurn: integer
- expiresAtTurn: integer nullable
- resolvedAtTurn: integer nullable
- priority: integer (higher shown first)
- effectPackage: jsonb, typed and executable by gameloop

2. Per-player dilemma cadence state
- New table gamePlayerDilemmaState:
  - gameId
  - playerId
  - lastDilemmaTurn
  - turnsSinceLastMeaningfulEvent
  - dilemmasSpawnedThisTurn

3. Turn report extension
- Add dilemmaEvents array to turn report summary:
  - dilemmaId
  - type: spawned | expired | resolved
  - triggerType
  - category

### Systems that emit or consume dilemma triggers
- tick pipeline in packages/gameloop/src/tick/tick.ts becomes the central cadence driver for mid-game dilemmas
- existing event signals can be reused as trigger inputs:
  - colonization completed
  - research breakthrough
  - task force engagement outcomes
- choice resolution remains in packages/gameloop/src/react/dilemmaChoice.ts but effect execution moves from TODO placeholders to typed effect handlers

### Frontend surfacing
- Dilemmas list gains category, urgency, and trigger badges
- Dilemma detail page adds:
  - thematic header and event context line
  - explicit effect preview blocks per choice
  - expiration/urgency copy where applicable
- Turn report UI includes a Dilemma timeline section so mid-game dilemmas are visible in history

---

## Context (What)

## Design goals
1. Starting dilemmas must commit the empire to a distinct opening style, with real opportunity costs.
2. Mid-game dilemmas should punctuate notable moments or long quiet periods.
3. Narrative flavor should be stronger, but mechanics must stay legible and testable.

## Part A: Stronger Starting Identity (3-step arc)

Keep the existing 3-step flow (Origin -> Crucible -> Launch) but make each step map to a distinct design layer:
- Origin: macro ethos modifier (economy/research/population philosophy)
- Crucible: institutional modifier (governance and homeland posture)
- Launch: operational doctrine (fleet posture and expansion tempo)

### Playstyle vector model
Each selected choice contributes points to four vectors:
- Bastion (defensive growth)
- Vanguard (aggressive tempo)
- Technocracy (research and precision)
- Covenant (population and civic cohesion)

Per choice contribution:
- Primary axis: +2
- Secondary axis: +1
- Opposed axis: -1

After three dilemmas, the player receives derived empire identity:
- Dominant vector = highest score
- Secondary vector = second highest score

If tie for dominant:
- Use latest dilemma category precedence: Launch > Crucible > Origin

### Starting mechanical package budget
Total opening budget after 3 choices is normalized:
- 1 major benefit (power value 3)
- 2 medium benefits (power value 2 each)
- 2 minor drawbacks (power value -1 each)
- Net budget target: +5

Budget safety:
- Any choice package outside net range [4, 6] is invalid
- No single stat can exceed opening cap contribution +20%

This keeps choices strong but bounded.

## Part B: More Variation + More Themed Text

### Content taxonomy
Introduce dilemma content pools by category and tone:
- Starting categories:
  - origin
  - crucible
  - launch
- Mid-game categories:
  - frontier (exploration, expansion pressure)
  - crisis (short-term danger or instability)
  - doctrine (institutional reform opportunities)
  - anomaly (rare high-risk/high-reward events)

### Variation target
- Minimum 12 templates per starting category (currently much lower)
- Minimum 16 templates across mid-game categories at launch
- Offer set size when drawing:
  - starting: 1 dilemma with 3 choices (unchanged flow)
  - mid-game: 1 dilemma with 2-3 choices, weighted by current empire vector and trigger source

### Thematic writing format standard
For each dilemma:
- title
- flavorLead (1 sentence hook)
- description (2 paragraphs max)
- strategicContext (single concise line explaining why this appears now)
- question
- choices:
  - title
  - description
  - effectSummary (human-readable)
  - effects (typed executable payload)

This avoids purely decorative text while improving narrative tone.

## Part C: Mid-Game Dilemma Triggers

Mid-game dilemmas come from two sources:
1. Special event trigger (reactive)
2. Quiet-space trigger (anti-monotony)

### Trigger rule set

Definitions per player p at turn t:
- lastDilemmaTurn(p)
- lastMeaningfulEventTurn(p)
- activePendingDilemmas(p)

Meaningful events:
- colonization completion
- research breakthrough
- engagement resolved (win or loss)
- star system ownership changed

Reactive trigger check:
- If meaningful event happened this turn and no dilemma spawned for p this turn
- Roll reactive probability:

P_reactive = baseReactive + intensityBonus + comebackBonus

Parameters:
- baseReactive = 0.18
- intensityBonus = +0.07 if event classified as major
- comebackBonus = +0.05 if player is behind median systems by 2+
- clamp to [0, 0.35]

Quiet-space trigger check:
- quietTurns = t - lastMeaningfulEventTurn(p)
- If quietTurns >= 4, roll:

P_quiet = min(0.12 + 0.05 * (quietTurns - 4), 0.45)

Cadence guardrails:
- minGapBetweenDilemmas = 3 turns
- maxPendingDilemmas = 2
- maxSpawnPerPlayerPerTurn = 1
- if pending dilemmas > 0 and oldest pending age >= 5 turns, suppress new spawns

### Trigger-to-category mapping
- colonization completed -> frontier (70%) or doctrine (30%)
- breakthrough -> doctrine (60%) or anomaly (40%)
- battle won/lost -> crisis (70%) or doctrine (30%)
- inactivity trigger -> frontier (50%) or anomaly (50%)

### Resolution policy
All dilemmas must be resolved before a player can end turn.

Implications:
- No expiration or default timeout outcomes are needed.
- Players cannot skip trade-offs by waiting.
- Mid-game spawn logic must avoid piling up pending dilemmas.

## Part D: Effect execution model

Current state includes TODO placeholders for effectScript execution. This proposal replaces free-text effects with typed, deterministic actions.

Effect union examples:
- modifyPopulationGrowthPercent { value, durationTurns? }
- modifyResearchMomentum { category, value, durationTurns? }
- grantResourceStock { resourceKind, amount }
- grantShipComponentTemplate { componentId }
- modifyDiplomaticPosture { goodwillDelta }
- applyTemporaryEmpireTag { tag, expiresAtTurn }

Execution timing:
- immediate effects at resolution
- temporary effects persisted with end turn metadata and decayed in tick

Validation rules:
- effect package schema validation at insertion time
- safety caps per stat and per turn

---

## Expected End State (Done)

## Functional checks
1. Starting sequence still delivers exactly 3 dilemmas in order and resolves correctly.
2. Starting choices produce measurable playstyle divergence by turn 10:
- resource profile variance
- fleet composition variance
- research category momentum variance

3. Mid-game dilemmas can spawn from:
- at least one meaningful event trigger
- inactivity trigger after quiet period

4. Cadence limits hold under simulation:
- no spawn spam
- no unresolved pileups beyond cap

5. End-turn is blocked while dilemmas are unresolved.

## Test coverage
- Data-level validation tests for dilemma effect packages
- Gameloop unit tests for trigger probability gates and cadence constraints
- Resolver tests for dilemma lifecycle fields and ownership checks
- Frontend integration tests for dilemma list/detail state (pending/resolved)

## Tooling and generated artifacts
- If GraphQL schema changes: run codegen for backend and frontend
- If data schema changes: generate and apply migration
- Update docs:
  - docs/gdd/mechanics/mechanic_proposal_dilemma_revival.md (this file)
  - docs/gdd/index.md (link addition when finalized)
  - optional mechanics doc for live dilemma system once approved

---

## Ecosystem Integration Analysis

## Interactions with existing systems
- Core loop cadence:
  - Trigger checks should run once per tick after systems that create meaningful signals (colonization, combat, research) and before turn report finalization.
- Economy and growth:
  - Dilemma effects touching growth/industry must obey existing global caps to avoid runaway snowball.
- Research:
  - Breakthrough-linked dilemmas should not double-count momentum in same tick without cap checks.
- Combat:
  - Crisis dilemmas after losses can reduce feel-bad but must not erase loss consequences entirely.
- Progression:
  - Starting identity plus mid-game pivots creates strategic narrative arcs without replacing core mechanics.

## Dependencies
- Typed effect execution framework in gameloop
- Additional schema fields and migration
- Turn report extension and frontend parsing
- New content authoring pipeline for larger dilemma pools

## Edge cases and exploit risks
1. Choice stalling exploit
- Risk: player delays a dilemma forever to avoid trade-off.
- Mitigation: end-turn submission is blocked while dilemmas are unresolved.

2. Trigger farming exploit
- Risk: player intentionally causes low-cost events to fish favorable dilemmas.
- Mitigation:
  - category weighting by event source
  - per-turn and per-gap spawn caps
  - duplicate suppression by recent category history.

3. Snowball amplification
- Risk: winning players get too many upside dilemmas.
- Mitigation:
  - comeback bonus only for trailing players
  - reduced reactive chance for top-position players once ahead by threshold.

4. Narrative fatigue
- Risk: too frequent dilemmas become UI noise.
- Mitigation:
  - min gap
  - pending cap
  - urgency sorting and concise display.

## Likely regressions
- Dilemma list sorting logic currently only resolved vs pending; will need category/urgency ordering.
- Turn reports currently omit dilemma events, causing observability gap.
- Existing starting effectScript strings will be incompatible with typed effects until migrated.

## Monitoring signals after release
- Average dilemmas per player per 10 turns target: 1.5-2.5
- Pending dilemma age percentile (p95) target: <= 4 turns
- Choice distribution entropy per category (detect dominant auto-pick options)
- Win-rate correlation with each starting vector (balance drift warning)

---

## Rollout Strategy
- Phase 1: typed effects + starting pool expansion (no mid-game triggers yet)
- Phase 2: event-driven mid-game triggers with strict caps
- Phase 3: inactivity triggers + turn report timeline

Each phase should be balance-tested before enabling next.

---

## Open Balance Knobs
- baseReactive
- baseQuiet trigger
- minGapBetweenDilemmas
- opening package power budget target

---

## Decision Gate (Required Before Implementation)
Please review and explicitly approve or request edits for:
1. Starting identity vector model (Bastion, Vanguard, Technocracy, Covenant)
2. Mid-game trigger formulas and cadence limits
3. Typed effect model replacing free-text effectScript

No implementation should start until approval is confirmed.
