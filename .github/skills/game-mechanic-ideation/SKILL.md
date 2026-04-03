---
name: game-mechanic-ideation
description: "Design and validate new game mechanics before implementation. Use when brainstorming, balancing, or proposing ship modules, combat cards, economy systems, or global mechanics for Space."
argument-hint: "Describe the mechanic idea, design goals, and constraints"
user-invocable: true
---

# Game Mechanic Ideation

## What This Skill Produces
A structured mechanic proposal and review loop that:
- Anchors design in existing game docs and schema reality
- Defines exact rules and balance math using A-C-E (Architecture, Context, Expected End State)
- Surfaces cross-system interactions and edge cases
- Requires user feedback and approval before implementation

## When To Use
Use this skill when a request asks to:
- Brainstorm, design, analyze, or propose a new game mechanic
- Create or revise ship modules, combat cards, turn systems, or economy rules
- Evaluate balance and side effects before writing code

Do not use this skill for direct implementation-only requests unless design has already been approved.

## Inputs
- Mechanic concept and intended player experience
- Design constraints (scope, complexity, power budget, timeline)
- Target systems (combat, economy, movement, growth, diplomacy)

## Procedure
1. Gather domain context.
- Read `docs/gdd/index.md` to map relevant canon.
- Read focused `docs/gdd/` files for impacted systems.
- Read matching schema sources in `packages/data/src/schema/` and relevant backend/frontend integration points.

2. Draft a proposal artifact using A-C-E.
- Create a markdown artifact such as `mechanic_proposal_<name>.md`.
- Architecture (Where): list exact packages, files, schemas, resolvers, UI surfaces, and tests that would change.
- Context (What): define exact mechanic rules, formulas, pseudo-code, turn timing, and balancing parameters.
- Expected End State (Done): define completion checks (tests, docs updates, migrations/codegen where applicable, UI/API parity).

3. Analyze ecosystem integration.
- Explain interactions with existing systems (core loop timing, economy, movement, combat resolution, progression).
- Enumerate dependencies, edge cases, exploits, and likely regressions.
- Include mitigation ideas and monitoring signals.

4. Review with the user before code.
- Present the proposal clearly.
- Ask for explicit feedback on balance, complexity, and thematic fit.
- Ask for explicit approval before implementation.

5. Refine and document.
- Iterate the proposal until approved.
- Update official GDD docs with the finalized design before code work begins.

6. Handoff to implementation.
- Ask if implementation should begin now.
- If yes, implement according to approved Architecture scope and keep behavior aligned with the approved Context rules.

## Quality Bar
- Proposal is testable: rules are precise enough to encode without guessing.
- Proposal is integrated: system interactions and side effects are explicit.
- Proposal is actionable: file-level architecture and done criteria are concrete.
- Proposal is gated: no implementation starts without explicit user approval.

## Completion Checklist
- Proposal artifact created and shared
- A-C-E sections complete
- Integration analysis complete
- User feedback requested and incorporated
- Explicit approval decision recorded
- Official docs update plan included (or completed if approved)
