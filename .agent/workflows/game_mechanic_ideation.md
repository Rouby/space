---
description: Propose and deeply design a new game mechanic before implementing code.
---

# Game Mechanic Ideation Workflow

Use this workflow when the user asks you to brainstorm, design, analyze, or propose a new game mechanic, ship module, combat card, or global system. The goal of this workflow is to carefully design the feature and get user approval before touching the codebase.

### 1. Context Gathering
- Read `docs/gdd/index.md` to identify the most relevant existing domain knowledge.
- Use the `view_file` tool to dive deep into the specific `docs/gdd/` files and relevant `packages/data/src/schema/` files related to the mechanic. 
*(e.g., If asked about a new ship weapon, read `docs/gdd/entities/ships.md`, `docs/gdd/mechanics/combat.md`, and `packages/data/src/schema/shipComponents.ts`).*

### 2. Draft the Proposal (A-C-E Framework)
Create a new markdown artifact (e.g., `mechanic_proposal_[name].md`) outlining the new mechanic. Use the Agent-friendly **A-C-E framework** to ensure it's structurally sound:
- **Architecture (Where):** Specifically list which files, database schemas, and packages will need to be modified.
- **Context (What):** Detail the exact rules, math, and balance of the mechanic. Use clear pseudo-code or formulas for resolution logic. Outline any edge cases with existing systems.
- **Expected End State (Done):** List the Definition of Done (e.g., unit tests added, `yarn db:generate` executed, `yarn codegen` run, frontend UI updated).

### 3. Ecosystem Integration Analysis
- Identify and document exactly how this new feature ties into already existing mechanics (e.g., economy, movement, logic in `core_loop.md`).
- Explicitly outline any edge cases, dependencies, or side effects this feature might have on other game elements.

### 4. Review and Dialogue
- Present the generated artifact to the user.
- **CRITICAL:** Explicitly ask the user for feedback, potential balance tweaks, and approval. Do not write implementation code yet.

### 5. Refine and Document
- Iterate on the proposal document until the user is satisfied.
- Once approved, update the official `docs/gdd/` documents with the new rules before starting on the code.

### 6. Implementation
- Ask the user if they are ready for you to begin the code implementation. Once they say yes, follow the Architecture plan you laid out.