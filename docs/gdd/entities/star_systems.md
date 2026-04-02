# Star Systems & Economy

## Star Systems (`packages/data/src/schema/starSystems.ts`)
A Star System is a discrete node on the XY plane. Players compete to control Star Systems to extract resources and generate Industry.

### Key Attributes
- **Industry (`industry`):** The base production output per tick. Used to progress `industrialProjects` and ship construction.
- **Population:** Population produces `industry`, but its growth is constrained by `populationCapacity`. 
- **Discovery Slots (`discoverySlots`):** The number of concurrent resource discoveries a system can support.
- **Discovery Progress (`discoveryProgress`):** Increments each tick until a new resource discovery is made. Speed inversely scales with discoveries already made in the system.

### Development Stances
Players can instruct a Star System's administration utilizing `starSystemDevelopmentStances`.
The valid stances are:
- `industrialize`: Focus on Industry points.
- `balance`: Balanced growth.
- `grow_population`: Focus purely on population growth multipliers.

### Industrial Projects & Construction
Players queue modifications to systems (`packages/data/src/functions/industrialProjects.ts`).
Projects are divided into four categories: `industry`, `discovery`, `population`, and `logistics`.
- **Work Mechanics:** Each project has a `workRequired` and `workDone`. When `workDone >= workRequired`, it completes.
- **Completion Effects:** Projects can increase industry, unlock discovery slots, provide a one-time discovery progress boost, seed/accelerate population, or reduce construction costs.
- **Maintenance Cost:** Strategic projects carry a continuous `maintenanceCost` once completed.

### Resources & Discoveries
When `discoveryProgress` hits 1, a hidden resource is discovered.
- **Diminishing Returns:** The base progress rate is `0.05 / (1 + discoveriesMade)`. The first discovery happens quickly (~20 turns), and subsequent ones take progressively longer.
- **Stat Bonuses:** Generated resources come with intrinsic `statBonuses` (e.g., +12% armorThickness) dependent on their `kind` (metal, crystal, gas, liquid, biological). These bonuses act as percentage multipliers when the resource is eventually consumed during ship manufacturing.

## Database Schema References
- Table: `starSystems`
- Table: `starSystemIndustrialProjects`
- Table: `starSystemDevelopmentStances`
- Table: `starSystemResourceDiscoveries`
- Table: `starSystemResourceDepots`
