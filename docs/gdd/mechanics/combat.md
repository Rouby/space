# Combat Resolution

## Overview
When two opposing Task Forces intercept each other (either by crossing paths or moving to the exact same position), a `taskForceEngagement` is created. Movement is halted, and combat begins.

## Combat Subsystems
A fleet’s stats are derived by summing the components of all ships in the Task Force.
- **HP (`maxHp`):** Derived from `structuralIntegrity`. Starting baseline is 7 if no structure is present.
- **Shield HP (`shieldMaxHp`):** Absorbs damage before structure.
- **Armor Rating (`armorRating`):** Mitigates incoming hull damage (e.g., reduces raw damage numbers).
- **Weapon Rating (`weaponRating`):** Scales the damage dealt by offensive cards.
- **Thruster Rating (`thrusterRating`):** Affects evasion and speed (used by cards).
- **Sensor Rating (`sensorRating`):** Affects targeting accuracy (used by cards).

## The Deck-Building Card System
Unlike standard auto-battlers, combat is resolved round-by-round via a card game mechanism.

Each task force must have a valid `combatDeck`.
- **Deck Size:** Exactly 12 cards.
- **Duplicates:** Maximum of 2 of the same card.
- **Starting Hand:** 3 cards.

### Card Pool
- `laser_burst`
- `target_lock`
- `emergency_repairs`
- `shield_pulse`
- `evasive_maneuver`
- `overcharge_barrage`

## The Round Structure
Each tick evaluates exactly one round of combat.
1. Players submit a card from their `hand` to the `taskForceEngagement`.
2. The phase moves from `awaiting_submissions` to `resolving`.
3. Cards calculate values based off the fleet's subsystem ratings.
4. Damage is tracked against `shieldDamage`, `armorAbsorbed`, and `hullDamage`.
5. If a Task Force reaches 0 HP, it is destroyed, and the engagement resolves.
6. If the engagement continues, both fleets draw a card from their `deck` (or reshuffle `discard`).

## Engine & API Files
- Gameloop resolution: `packages/gameloop/src/tick/taskForceCombat.ts`
- Schema structure: `packages/data/src/schema/taskForceEngagements.ts`
