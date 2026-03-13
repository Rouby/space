# Star Systems & Economy

## Star Systems (`packages/data/src/schema/starSystems.ts`)
A Star System is a discrete node on the XY plane. Players compete to control Star Systems to extract resources and generate Industry.

### Key Attributes
- **Industry (`industry`):** The base production output per tick. Used to progress `industrialProjects` and ship construction.
- **Discovery Slots (`discoverySlots`):** The number of hidden resources that can still be found in the system.
- **Discovery Progress (`discoveryProgress`):** Increments each tick until a new resource discovery is made.

### Development Stances
Players can instruct a Star System's administration utilizing `starSystemDevelopmentStances`.
The valid stances are:
- `industrialize`: Focus on Industry points.
- `balance`: Balanced growth.
- `grow_population`: Focus purely on population growth multipliers.

### Industrial Projects
Players queue long-term modifications to systems (e.g., `factory_expansion`, `automation_hub`, `orbital_foundry`).
- Each project has a `workRequired` and `workDone`.
- When `workDone >= workRequired`, the system gains a `completionIndustryBonus`.

## Database Schema References
- Table: `starSystems`
- Table: `starSystemIndustrialProjects`
- Table: `starSystemDevelopmentStances`
- Table: `starSystemResourceDiscoveries`
- Table: `starSystemResourceDepots`
