# [MVP-010] Colonization Governance Controls (Focus and Forbid)

DONE

## Objective
Give players strategic control over passive colonization by allowing preferred targets and forbidden systems.

## Why
Passive colonization needs player agency levers to avoid feeling random or uncontrollable.

## Scope
- Per-player colonization focus list (priority systems).
- Per-system forbid toggle to block automatic settlement.
- Resolution logic honoring focus/forbid rules.
- UI controls in star system and empire-level panels.

## Out of Scope
- Deep policy automation scripting.
- Diplomacy-based migration treaties.

## Acceptance Criteria
1. Player can mark systems as focus targets and forbid targets.
2. Passive colonization selection logic prioritizes focus targets when eligible.
3. Forbidden systems are never selected by passive colonization.
4. Controls are auditable and editable mid-campaign with deterministic next-turn effect.

## Dependencies
- Requires [MVP-009].

## Suggested Order
- Directly after [MVP-009].
