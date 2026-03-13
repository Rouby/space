# Ships & Components

## Overview
Ships are not single monolithic entities but are comprised of a layout of **Ship Components**. A configured layout of components is saved as a **Ship Design**.

## Ship Components (`packages/data/src/schema/shipComponents.ts`)
Components are the modular building blocks of fleets. Every component has varying stats that aggregate into the final Ship Design.

### Important Stats
- **Resource Needs:** `supplyNeedPassive`, `supplyNeedMovement`, `supplyNeedCombat`, `powerNeed`, `crewNeed`.
- **Strategic Stats:** `ftlSpeed` (determines task force map movement), `zoneOfControl`, `sensorRange`.
- **Tactical Stats (Combat):** `structuralIntegrity`, `armorThickness`, `shieldStrength`, and granular effectiveness multipliers against different delivery types.
- **Weapons:** Damage, Cooldown, Range, Penetration, Accuracy, and a `weaponDeliveryType` (`missile`, `projectile`, `beam`, `instant`).

## Default Components

Source of truth: `packages/gameloop/src/randomGameContent.ts`

### Design Philosophy

Starter components are identical across all games and have **no resource costs** (all resource cost fields are zero). They provide the minimum building blocks needed for ship design from game start. Future unlockable components will introduce resource costs, upgrades, and specialized tiers.

### Ownership Model

At game creation, every player receives their own independent copy of all default components. This per-player ownership supports future mechanics where players can modify, upgrade, or lose access to specific components without affecting other players.

### Categories

The `layout` field on each component serves as its category identifier, determining where it can be placed in the Ship Designer grid.

| Category | `layout` value | Role |
|---|---|---|
| Hull | `hull` | Structural integrity (HP pool) |
| Engine | `engine` | FTL speed and tactical thrust |
| Reactor | `reactor` | Power generation and supply storage |
| Weapon | `weapon` | Offensive damage output |
| Armor | `armor` | Passive damage reduction (favors kinetics) |
| Shield | `shield` | Regenerating protection (favors energy) |
| Sensor | `sensor` | Detection range, targeting, and zone of control |
| Quarters | `quarters` | Crew capacity |

### Component Catalog

#### Hull

| Name | Key Stats | Power | Crew | Cost | Design Role |
|---|---|---|---|---|---|
| Light Frame | structuralIntegrity 8 | 0 | 0 | 5 | Cheap HP filler for expendable designs |
| Reinforced Bulkhead | structuralIntegrity 15 | 1 | 1 | 12 | Heavy-duty HP for durable frontline ships |

#### Engine

| Name | Key Stats | Power | Crew | Cost | Design Role |
|---|---|---|---|---|---|
| Ion Drive | ftlSpeed 3, thruster 2 | 2 | 1 | 8 | Dual-purpose propulsion: strategic movement + tactical maneuverability. Consumes 1 supply during movement |

#### Reactor

| Name | Key Stats | Power | Crew | Cost | Design Role |
|---|---|---|---|---|---|
| Fusion Core | powerGeneration 10, supplyCapacity 20 | 0 | 1 | 15 | Primary power source and supply storage. Consumes 1 supply passively |

#### Weapon

| Name | Key Stats | Power | Crew | Cost | Design Role |
|---|---|---|---|---|---|
| Railgun | damage 3, accuracy 0.7, cooldown 2, delivery `projectile` | 2 | 1 | 10 | High damage per shot, slower cycle. Pairs with armor penetration against plated targets |
| Pulse Laser | damage 2, accuracy 0.9, cooldown 1, delivery `beam` | 3 | 1 | 12 | Fast, accurate fire. Lower damage offset by rapid cycling. Effective against shields |

#### Armor

| Name | Key Stats | Power | Crew | Cost | Design Role |
|---|---|---|---|---|---|
| Composite Plating | armorThickness 4, effectiveness: proj 0.8 / beam 0.4 / missile 0.6 / instant 0.2 | 0 | 0 | 8 | Zero-overhead kinetic defense. Strong vs projectiles, weak vs energy |

#### Shield

| Name | Key Stats | Power | Crew | Cost | Design Role |
|---|---|---|---|---|---|
| Deflector Array | shieldStrength 5, effectiveness: proj 0.4 / beam 0.8 / missile 0.5 / instant 0.3 | 3 | 1 | 14 | Regenerating energy defense. Strong vs beams, weak vs kinetics. Complements armor |

#### Sensor

| Name | Key Stats | Power | Crew | Cost | Design Role |
|---|---|---|---|---|---|
| Scanner Array | sensorRange 50, sensorPrecision 3, zoneOfControl 30 | 1 | 1 | 6 | Fleet awareness and targeting data. Enables sensor-dependent combat cards |

#### Quarters

| Name | Key Stats | Power | Crew | Cost | Design Role |
|---|---|---|---|---|---|
| Crew Quarters | crewCapacity 5 | 0 | 0 | 4 | Provides crew slots at minimal cost. Required to staff power-hungry components |

### Combat Stat Aggregation

The combat system (`packages/gameloop/src/tick/taskForceCombat.ts`) aggregates component stats into fleet-level values:

- `structuralIntegrity` → maxHp
- `shieldStrength` → shieldMaxHp
- `armorThickness` → armorRating
- `weaponDamage` → weaponRating
- `thruster` → thrusterRating
- `sensorPrecision` → sensorRating

Combat card eligibility (`packages/backend/src/schema/taskForce/resolvers/combatProfileLogic.ts`) checks for: hasWeapons, hasHeavyWeapons, hasShields, hasThrusters, hasSensors, hasCrew.

### Not Included (Future Work)

- **Resource costs** — reserved for unlockable components
- **Component tiers / upgrades** — progression system TBD
- **Component unlocking mechanics** — tech tree or research integration TBD

## Ship Designs (`packages/data/src/schema/shipDesigns.ts`)
When a player creates a ship, they place components on a grid (tracked via `column` and `row` in `shipDesignComponents`).

### The `shipDesignsWithStats` View
To evaluate a ship's actual power without doing a massive JOIN in code, the game relies on the Postgres View `shipDesignsWithStats`. 
- **Rule:** If you add a new stat to a Ship Component, you **must** update the `shipDesignsWithStats` view logic in Drizzle to aggregate that stat correctly (usually via `sql` sum or max).
