---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
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
date: 2026-03-08
author: Rouby
---

# Product Brief: space

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

`space` is a browser-based asynchronous 4X strategy game designed for small groups of friends who want long-running, intimate campaigns that unfold over weeks or months. The game delivers all four X pillars while keeping participation accessible and sustainable through short, meaningful turns rather than high-frequency sessions.

The core thesis is that current options often fail this audience in two ways: balance breaks over time and combat burden becomes too heavy. As empires scale, players either become overwhelmed by management complexity or disengage when late-game outcomes feel predetermined. `space` addresses this with a deep simulation backbone plus an evolving dilemma system that continuously introduces meaningful narrative and strategic pressure, keeping campaigns alive and uncertain even in mid and late phases.

---

## Core Vision

### Problem Statement

Players who want long-form asynchronous 4X games with friends lack an experience that is both deeply strategic and truly approachable over months-long campaigns. Existing games often demand too much operational overhead, especially in combat and large-empire management, reducing accessibility and social continuity.

### Problem Impact

When balance drifts and turn complexity balloons:
- mid-game momentum collapses as players face growing administrative burden
- late-game engagement drops when one empire's dominance appears inevitable
- social campaigns end early, not because players stop caring, but because the game stops creating meaningful uncertainty and agency

### Why Existing Solutions Fall Short

Current alternatives frequently optimize for either depth or accessibility, but not both for async friend-group play:
- combat systems become overbearing in cognitive load and time demands
- empire growth creates unwieldy decision surfaces that discourage continued play
- pacing and balance issues make outcomes feel "written on the wall"
- narrative systems rarely intervene in a systemic way to refresh stakes and strategic tension

### Proposed Solution

Build an async-first browser 4X with a compact but high-signal turn loop centered on:
- interesting dilemmas and consequential choices
- planet exploration and broader space exploration
- basic fleet combat decisions through a card/deck-based layer
- deep empire simulation that stays manageable through scoped turn actions and clear priorities

A dynamic dilemma engine acts as both narrative driver and strategic balancing mechanism, introducing new opportunities, risks, and constraints as campaigns evolve.

### Key Differentiators

- Deep simulation as the primary unfair advantage
- Dilemmas used not just for flavor, but as structural pacing and balance tools
- Asynchronous social design tuned for friend groups over weeks-to-months campaigns
- Balanced strategic depth with accessible browser-first interaction model
- Mid/late-game retention focus: preserve uncertainty, agency, and comeback potential

## Target Users

### Primary Users

`space` primarily serves experienced 4X strategy players who already have deep familiarity with genre leaders like Stellaris, Galactic Civilizations, and Civilization.

These players:
- enjoy complex simulation systems and long-term strategic planning
- want to roleplay an empire identity across eras, not just optimize a short tactical loop
- value meaningful customization and ownership over how their empire evolves
- expect fair strategic viability across different playstyles, including diplomacy, economic development, and military conquest

They are willing to invest serious time when engaged, with up to a couple of hours per turn per day if needed, especially in high-stakes campaign phases.

### Secondary Users

No distinct secondary user segment is currently in scope.
The product is focused on active participants in the campaign only, with no spectator or adjacent role types planned.

### User Journey

`space` is designed for multiplayer async campaigns with:
- minimum viable game size of 3+ players
- ideal social/strategic density at 5-6 players
- optional large-scale event formats up to around 16 players as an exception, not the default

Journey outline:
- Discovery: veteran 4X players find `space` through genre affinity and friend-group recommendations
- Onboarding: they start in a familiar strategic frame (empire setup, early expansion choices, initial dilemmas)
- Core Usage: players execute async turns with a mix of exploration, colonization, diplomacy/economy/combat positioning, and narrative dilemma resolution
- First Aha Moment: discovery and successful colonization of a second world, confirming expansion momentum and strategic identity
- Long-term Engagement: empire roleplay plus balanced multi-path viability sustains motivation through mid/late game rather than collapsing into predetermined outcomes

## Success Metrics

`space` succeeds when long-form async campaigns remain competitive, engaging, and finish at high rates rather than collapsing from runaway leaders or player drop-off.

User success is defined by:
- campaigns reaching natural completion with most original participants still active
- sustained player participation through at least the midpoint of a campaign
- perceived strategic fairness, where diplomatic, economic, and combat paths can all lead to victory through strong play

### Business Objectives

- Establish `space` as a go-to async 4X experience for veteran strategy players in friend-group settings.
- Maximize completed campaigns over abandoned campaigns.
- Build trust in balance quality so players start additional campaigns after finishing one.

### Key Performance Indicators

- Campaign completion rate: percentage of campaigns that reach defined end-state.
- Mid-campaign active participation rate: percentage of players still submitting turns by campaign midpoint.
- Late-campaign active participation rate: percentage of players still submitting turns in the final third.
- Strategy-path win distribution: win share across diplomacy/economy/combat paths over rolling windows.
- Post-campaign restart rate: percentage of groups starting another campaign within a set window after finishing.

## MVP Scope

### Core Features

The MVP of `space` focuses on a complete, playable async strategy loop built around:
- dilemmas and consequential player choices
- population mechanics
- resource gathering
- discovery of planet features
- fleet construction
- fleet movement and exploration
- fleet-vs-fleet combat

This scope supports the core 4X fantasy and the first key `aha` moment (discovering and colonizing additional worlds) while preserving strategic depth.

### Out of Scope for MVP

To prevent scope creep, the MVP explicitly excludes:
- complex diplomacy systems and advanced diplomatic setup mechanics

Diplomacy may exist only in minimal/basic form if needed for game continuity, but not as a deep strategic pillar in the first release.

### MVP Success Criteria

Current inferred criteria:
- players can complete full campaigns using the defined core loop
- core systems (dilemmas, exploration, economy, combat) remain engaging through at least mid-campaign
- no single strategy path becomes obviously dominant in early playtesting

### Future Vision

Post-MVP evolution includes:
- meaningful diplomacy choices beyond simple peace-state toggles
- custom research paths
- custom ship components
- custom ship designs

These additions deepen strategic expression and empire identity once the core async campaign loop is validated.
