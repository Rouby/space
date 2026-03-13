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

## Ship Designs (`packages/data/src/schema/shipDesigns.ts`)
When a player creates a ship, they place components on a grid (tracked via `column` and `row` in `shipDesignComponents`).

### The `shipDesignsWithStats` View
To evaluate a ship's actual power without doing a massive JOIN in code, the game relies on the Postgres View `shipDesignsWithStats`. 
- **Rule:** If you add a new stat to a Ship Component, you **must** update the `shipDesignsWithStats` view logic in Drizzle to aggregate that stat correctly (usually via `sql` sum or max).
