# Research Focus and Emergent Outcomes

## Overview
Research is a directional, turn-based system where players steer outcomes by category focus instead of selecting exact technologies from a static tree.

Player input remains high-level, while progression emerges from empire behavior in economy, combat, expansion, and discovery.

## Per-Turn Directive
Each player submits one research directive per turn:
- `primaryCategory`: main research direction
- `secondaryCategory`: supporting direction (must differ from primary)
- `methodology`: `stable` | `bold` | `opportunistic`

## Per-Turn Active Mini-Game
Each player also receives one adaptive mini-game prompt each turn tied to a target category.

Mini-game types:
- `evidence_triangulation`: choose support, conflict, and control cards from the current prompt set.
- `breakthrough_incident`: resolve a 3-step chain with safe/risky choices per step.

Prompt selection:
- `breakthrough_incident` is prioritized when a category in synthesis reaches at least 80% of synthesis threshold.
- Otherwise `evidence_triangulation` is presented for the highest fieldwork evidence deficit.

Mini-game output:
- quality score `q` in `[-1, 1]`
- confidence score `r` in `[0, 1]`
- risk tag `safe | balanced | risky`
- momentum bonus `B` in `[-2, 4]`

Bonus formula:

$$
B = clamp(2.5q + 1.5r + M_{method} + P_{risk}, -2, 4)
$$

Where:
- $M_{method}=0.4$ for `bold`, $0.2$ for `opportunistic`, $0$ for `stable`
- $P_{risk}=+0.8$ for successful risky chain, $-0.8$ if risky choices fail, else $0$

Submission rules:
- At most one mini-game submission per player per turn.
- Re-submission in the same turn replaces the prior submission.
- If skipped, no penalty is applied (`B=0`).

### Categories
- `military`: combat and ship performance
- `industry`: economy, projects, and construction efficiency
- `expansion`: colonization, migration, and logistics range
- `discovery`: scanning, discoveries, and resource exploitation

### Methodology Effects
- `stable`: lower variance, stronger anti-regression profile
- `bold`: faster breakthroughs, stronger specialization pressure
- `opportunistic`: baseline speed, stronger adaptation to event evidence

## Turn Progression Model
For player $p$, category $c$, turn $t$:

Base knowledge:

$$
K_t = \left\lfloor \sqrt{P_b} + 0.5S + 0.75D + 0.25C \right\rfloor
$$

Definitions:
- $P_b$: total owned population in billions
- $S$: owned star systems
- $D$: discoveries completed this game
- $C$: combat rounds participated in this turn window

Focus weight:
- $w(\text{primary}) = 0.55$
- $w(\text{secondary}) = 0.30$
- Remaining $0.15$ is split evenly across other categories

Category momentum gain:

$$
M_{c,t} = K_t \cdot w_c \cdot m(\text{methodology}) + E_{c,t} - F_{c,t}
$$

With mini-game integration, the target category receives:

$$
M'_{c,t} = K_t \cdot w_c \cdot m(\text{methodology}) + E_{c,t} - F_{c,t} + B_{c,t}
$$

Catch-up modifier:
- If a player's total breakthroughs are behind the median by at least 2, add `+0.5` to that turn's mini-game-adjusted momentum.

Where:
- $m(\text{stable}) = 0.95$
- $m(\text{bold}) = 1.10$
- $m(\text{opportunistic}) = 1.00$
- $E_{c,t}$: turn evidence points for category $c$
- $F_{c,t}$: specialization fatigue penalty

Fatigue:
- `consecutivePrimary_c` counts consecutive turns with category $c$ as primary

$$
F_{c,t} = \min(4, \max(0, \text{consecutivePrimary}_c - 2))
$$

## Evidence Sources
- `military`: +2 per combat round, +3 per won engagement
- `industry`: +1 per 10 industry utilized, +2 per industrial project completion
- `expansion`: +1 per 500 colonization pressure added, +3 per colonization completed, +1 per migration event over 50k
- `discovery`: +2 per resource discovery completed, +1 when a new resource depot crosses 100 units

## Three-Phase Research Threads
Each category maintains an active thread with three sequential phases.

1. Hypothesis:
- Entered when cumulative momentum reaches:

$$
H_n = \text{round}(10 \cdot 1.2^{(n-1)})
$$

2. Fieldwork:
- Requires recent evidence (last 6 turns):

$$
\text{recentEvidence}_c \ge V_n, \quad V_n = 6 + 2n
$$

3. Synthesis:
- Requires post-validation progress:

$$
\text{synthesisProgress}_c \ge S_n, \quad S_n = 12 + 3n
$$

A breakthrough is granted only after all three phase requirements are met.

## Outcome Generation
On breakthrough completion for category $c$:
1. Build candidate pool from category $c$ plus one adjacent category derived from secondary focus.
2. Score each outcome $o$:

$$
\text{score}_o = \text{baseWeight}_o \cdot \text{contextMatch}_o \cdot \text{novelty}_o \cdot \text{antiDuplicate}_o
$$

3. Deterministic selection:
- Take top 2 candidates by score
- Pick one with seeded roll using `(gameId, turn, playerId)`

### Reveal-Time Agency
Player chooses one of two application modes for the same breakthrough outcome. This preserves strategic choice without full tech-tree micromanagement.

## Modifier Budget and Caps
- Max active passive modifiers per category: 4
- Global additive soft cap per stat: +40%
- Diminishing returns above +25% on same stat:

$$
effectiveBonus = 0.25 + (rawBonus - 0.25) \cdot 0.5
$$

## Tick Placement
Research phase occurs after economy/project resolution and before discoveries so it can ingest current-turn activity signals while keeping resource discovery as a distinct loop.

## Related Design Artifact
Detailed A-C-E proposal and integration analysis:
- `docs/gdd/mechanics/mechanic_proposal_research_focus.md`
