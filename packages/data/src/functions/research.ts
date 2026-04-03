import {
	type ResearchCategory,
	type ResearchMethodology,
	researchCategories,
	researchMethodologies,
} from "../schema/research.ts";

export type {
	ResearchCategory,
	ResearchMethodology,
} from "../schema/research.ts";
export {
	researchCategories,
	researchMethodologies,
} from "../schema/research.ts";

export const defaultResearchPrimaryCategory: ResearchCategory = "industry";
export const defaultResearchSecondaryCategory: ResearchCategory = "discovery";
export const defaultResearchMethodology: ResearchMethodology = "opportunistic";

export type ResearchWeights = Record<ResearchCategory, number>;
export type ResearchOutcomeMode = {
	mode: string;
	stat: string;
	modifier: number;
};

export type ResearchOutcome = {
	key: string;
	displayName: string;
	baseWeight: number;
	modes: ResearchOutcomeMode[];
};

const methodologyMultipliers: Record<ResearchMethodology, number> = {
	stable: 0.95,
	bold: 1.1,
	opportunistic: 1,
};

function outcome(
	key: string,
	displayName: string,
	baseWeight: number,
	...modes: [ResearchOutcomeMode, ResearchOutcomeMode, ...ResearchOutcomeMode[]]
): ResearchOutcome {
	return {
		key,
		displayName,
		baseWeight,
		modes,
	};
}

export const researchOutcomesCatalog: Record<
	ResearchCategory,
	ResearchOutcome[]
> = {
	military: [
		outcome(
			"adaptive_armor_doctrine",
			"Adaptive Armor Doctrine",
			1,
			{ mode: "defensive", stat: "armorThickness", modifier: 0.08 },
			{
				mode: "manufacturing",
				stat: "constructionCostModifier",
				modifier: -0.05,
			},
		),
		outcome(
			"fire_control_refit",
			"Fire Control Refit",
			0.96,
			{ mode: "accuracy", stat: "weaponAccuracy", modifier: 0.06 },
			{ mode: "cooldown", stat: "weaponCooldown", modifier: -0.05 },
		),
		outcome(
			"point_defense_lattices",
			"Point-Defense Lattices",
			0.92,
			{ mode: "screening", stat: "pointDefense", modifier: 0.08 },
			{ mode: "escort", stat: "fleetScreening", modifier: 0.07 },
		),
		outcome(
			"strike_pattern_algorithms",
			"Strike Pattern Algorithms",
			0.9,
			{ mode: "evasion", stat: "evasion", modifier: 0.07 },
			{ mode: "salvos", stat: "weaponDamage", modifier: 0.06 },
		),
		outcome(
			"plasma_containment_cycles",
			"Plasma Containment Cycles",
			0.82,
			{ mode: "lances", stat: "energyWeaponDamage", modifier: 0.09 },
			{ mode: "reactors", stat: "shipMaintenanceCost", modifier: -0.05 },
		),
		outcome(
			"torpedo_penetration_models",
			"Torpedo Penetration Models",
			0.86,
			{ mode: "breaching", stat: "armorPenetration", modifier: 0.08 },
			{ mode: "payloads", stat: "alphaStrikeDamage", modifier: 0.07 },
		),
		outcome(
			"damage_control_mesh",
			"Damage Control Mesh",
			0.88,
			{ mode: "repair", stat: "combatRepairRate", modifier: 0.08 },
			{ mode: "survivability", stat: "hullIntegrity", modifier: 0.06 },
		),
		outcome(
			"tactical_jamming_suite",
			"Tactical Jamming Suite",
			0.8,
			{ mode: "masking", stat: "enemyWeaponAccuracy", modifier: -0.06 },
			{ mode: "spoofing", stat: "ambushInitiative", modifier: 0.08 },
		),
		outcome(
			"picket_command_uplinks",
			"Picket Command Uplinks",
			0.84,
			{ mode: "formation", stat: "commandCap", modifier: 0.06 },
			{ mode: "interception", stat: "interceptChance", modifier: 0.08 },
		),
		outcome(
			"boarding_interdiction",
			"Boarding Interdiction",
			0.72,
			{ mode: "security", stat: "boardingResistance", modifier: 0.1 },
			{ mode: "marines", stat: "boardingAttack", modifier: 0.08 },
		),
		outcome(
			"siege_targeting_solutions",
			"Siege Targeting Solutions",
			0.78,
			{ mode: "orbital", stat: "orbitalBombardment", modifier: 0.09 },
			{ mode: "precision", stat: "collateralDamage", modifier: -0.05 },
		),
		outcome(
			"heat_sink_weaving",
			"Heat-Sink Weaving",
			0.74,
			{ mode: "sustained_fire", stat: "weaponCooldown", modifier: -0.06 },
			{ mode: "durability", stat: "overheatResistance", modifier: 0.08 },
		),
		outcome(
			"autonomous_magazines",
			"Autonomous Magazines",
			0.77,
			{ mode: "reloads", stat: "ammoEfficiency", modifier: 0.08 },
			{ mode: "sorties", stat: "carrierCapacity", modifier: 0.06 },
		),
		outcome(
			"shield_phase_tuning",
			"Shield Phase Tuning",
			0.9,
			{ mode: "capacity", stat: "shieldCapacity", modifier: 0.07 },
			{ mode: "hardening", stat: "shieldHardening", modifier: 0.06 },
		),
		outcome(
			"hunter_killer_protocols",
			"Hunter-Killer Protocols",
			0.8,
			{ mode: "pursuit", stat: "pursuitSpeed", modifier: 0.08 },
			{ mode: "first_strike", stat: "firstStrikeChance", modifier: 0.07 },
		),
		outcome(
			"battlegroup_signal_fusion",
			"Battlegroup Signal Fusion",
			0.76,
			{ mode: "coordination", stat: "fleetCoordination", modifier: 0.08 },
			{ mode: "resilience", stat: "retreatDiscipline", modifier: 0.06 },
		),
		outcome(
			"kinetic_shatter_theory",
			"Kinetic Shatter Theory",
			0.81,
			{ mode: "slugs", stat: "kineticWeaponDamage", modifier: 0.09 },
			{ mode: "breaker", stat: "structureDamage", modifier: 0.07 },
		),
		outcome(
			"void_breach_seals",
			"Void Breach Seals",
			0.68,
			{ mode: "containment", stat: "crewLossReduction", modifier: 0.1 },
			{ mode: "repair_crews", stat: "emergencyRepair", modifier: 0.07 },
		),
		outcome(
			"dreadnought_keels",
			"Dreadnought Keels",
			0.64,
			{ mode: "tonnage", stat: "capitalShipCapacity", modifier: 0.08 },
			{ mode: "bulkheads", stat: "armorThickness", modifier: 0.06 },
		),
		outcome(
			"strategic_wargames",
			"Strategic Wargames",
			0.7,
			{ mode: "readiness", stat: "battleReadiness", modifier: 0.08 },
			{ mode: "adaptation", stat: "combatExperienceGain", modifier: 0.08 },
		),
		outcome(
			"warforge_fabricators",
			"Warforge Fabricators",
			0.66,
			{ mode: "shipyards", stat: "shipConstructionSpeed", modifier: 0.09 },
			{ mode: "economy", stat: "constructionCostModifier", modifier: -0.05 },
		),
		outcome(
			"subspace_ambush_doctrine",
			"Subspace Ambush Doctrine",
			0.58,
			{ mode: "infiltration", stat: "stealthApproach", modifier: 0.1 },
			{ mode: "raid", stat: "withdrawalSpeed", modifier: 0.08 },
		),
		outcome(
			"stellar_lance_arrays",
			"Stellar Lance Arrays",
			0.36,
			{ mode: "annihilation", stat: "energyWeaponDamage", modifier: 0.14 },
			{ mode: "beheading", stat: "flagshipAura", modifier: 0.12 },
		),
		outcome(
			"doomsday_logistics",
			"Doomsday Logistics",
			0.32,
			{ mode: "mobilization", stat: "shipConstructionSpeed", modifier: 0.13 },
			{ mode: "attritionless", stat: "shipMaintenanceCost", modifier: -0.08 },
		),
		outcome(
			"hegemon_battle_net",
			"Hegemon Battle Net",
			0.28,
			{ mode: "supremacy", stat: "fleetCoordination", modifier: 0.14 },
			{ mode: "dominion", stat: "commandCap", modifier: 0.12 },
		),
	],
	industry: [
		outcome(
			"process_orchestration",
			"Process Orchestration",
			1,
			{ mode: "throughput", stat: "industry", modifier: 0.06 },
			{ mode: "efficiency", stat: "maintenanceCost", modifier: -0.05 },
		),
		outcome(
			"deep_assembly_protocols",
			"Deep Assembly Protocols",
			0.95,
			{
				mode: "shipyards",
				stat: "constructionCostModifier",
				modifier: -0.06,
			},
			{ mode: "projects", stat: "industrialProjectWork", modifier: 0.08 },
		),
		outcome(
			"orbital_fabrication_yards",
			"Orbital Fabrication Yards",
			0.9,
			{ mode: "hulls", stat: "shipConstructionSpeed", modifier: 0.08 },
			{ mode: "modules", stat: "buildQueueCapacity", modifier: 0.07 },
		),
		outcome(
			"predictive_maintenance_grids",
			"Predictive Maintenance Grids",
			0.88,
			{ mode: "uptime", stat: "industry", modifier: 0.07 },
			{ mode: "service", stat: "maintenanceCost", modifier: -0.06 },
		),
		outcome(
			"vacuum_foundry_standards",
			"Vacuum Foundry Standards",
			0.82,
			{ mode: "alloys", stat: "alloyEfficiency", modifier: 0.08 },
			{ mode: "purity", stat: "productionVariance", modifier: -0.06 },
		),
		outcome(
			"fusion_smelt_columns",
			"Fusion Smelt Columns",
			0.76,
			{ mode: "ore", stat: "miningRate", modifier: 0.08 },
			{ mode: "industry", stat: "industrialProjectWork", modifier: 0.07 },
		),
		outcome(
			"autonomous_freight_hubs",
			"Autonomous Freight Hubs",
			0.8,
			{ mode: "routing", stat: "logisticsThroughput", modifier: 0.08 },
			{ mode: "savings", stat: "maintenanceCost", modifier: -0.05 },
		),
		outcome(
			"industrial_twinning",
			"Industrial Twinning",
			0.72,
			{ mode: "simulation", stat: "industrialProjectWork", modifier: 0.09 },
			{ mode: "planning", stat: "constructionCostModifier", modifier: -0.04 },
		),
		outcome(
			"nanolathe_foundries",
			"Nanolathe Foundries",
			0.79,
			{ mode: "precision", stat: "shipConstructionSpeed", modifier: 0.08 },
			{ mode: "miniaturization", stat: "componentEfficiency", modifier: 0.07 },
		),
		outcome(
			"cryogenic_stockpiles",
			"Cryogenic Stockpiles",
			0.66,
			{ mode: "buffers", stat: "storageCapacity", modifier: 0.1 },
			{ mode: "reserves", stat: "crisisResilience", modifier: 0.07 },
		),
		outcome(
			"modular_shipyards",
			"Modular Shipyards",
			0.78,
			{ mode: "frigates", stat: "lightShipConstructionSpeed", modifier: 0.1 },
			{ mode: "retrofits", stat: "refitCostModifier", modifier: -0.06 },
		),
		outcome(
			"labor_synchrony",
			"Labor Synchrony",
			0.7,
			{ mode: "output", stat: "industry", modifier: 0.08 },
			{ mode: "stability", stat: "unrestFromIndustry", modifier: -0.05 },
		),
		outcome(
			"refinery_cascade_reactors",
			"Refinery Cascade Reactors",
			0.74,
			{ mode: "yield", stat: "resourceYield", modifier: 0.08 },
			{ mode: "recycling", stat: "salvageRecovery", modifier: 0.08 },
		),
		outcome(
			"megaforge_cranes",
			"Megaforge Cranes",
			0.62,
			{
				mode: "superheavy",
				stat: "capitalShipConstructionSpeed",
				modifier: 0.1,
			},
			{ mode: "macroassembly", stat: "buildQueueCapacity", modifier: 0.06 },
		),
		outcome(
			"closed_loop_salvage",
			"Closed-Loop Salvage",
			0.73,
			{ mode: "reclamation", stat: "salvageRecovery", modifier: 0.1 },
			{
				mode: "scrap_forge",
				stat: "constructionCostModifier",
				modifier: -0.05,
			},
		),
		outcome(
			"alloy_purity_control",
			"Alloy Purity Control",
			0.69,
			{ mode: "integrity", stat: "structureDurability", modifier: 0.08 },
			{ mode: "waste_reduction", stat: "alloyEfficiency", modifier: 0.07 },
		),
		outcome(
			"rapid_prototyping_bays",
			"Rapid Prototyping Bays",
			0.68,
			{ mode: "experiments", stat: "industrialProjectWork", modifier: 0.09 },
			{ mode: "spinups", stat: "buildQueueCapacity", modifier: 0.06 },
		),
		outcome(
			"orbital_drydock_guilds",
			"Orbital Drydock Guilds",
			0.71,
			{ mode: "maintenance", stat: "shipMaintenanceCost", modifier: -0.06 },
			{ mode: "retrofits", stat: "shipRefitSpeed", modifier: 0.08 },
		),
		outcome(
			"mineral_pressure_casting",
			"Mineral Pressure Casting",
			0.67,
			{ mode: "mines", stat: "miningRate", modifier: 0.09 },
			{ mode: "components", stat: "constructionCostModifier", modifier: -0.04 },
		),
		outcome(
			"habitat_infrastructure_rigs",
			"Habitat Infrastructure Rigs",
			0.64,
			{ mode: "utilities", stat: "habitatMaintenance", modifier: -0.06 },
			{ mode: "density", stat: "industry", modifier: 0.07 },
		),
		outcome(
			"interstellar_accounts",
			"Interstellar Accounts",
			0.58,
			{ mode: "audits", stat: "maintenanceCost", modifier: -0.07 },
			{ mode: "forecasting", stat: "projectOverflowRetention", modifier: 0.08 },
		),
		outcome(
			"zero_loss_supply_chains",
			"Zero-Loss Supply Chains",
			0.56,
			{ mode: "throughput", stat: "logisticsThroughput", modifier: 0.1 },
			{ mode: "waste", stat: "constructionCostModifier", modifier: -0.05 },
		),
		outcome(
			"matter_compilers",
			"Matter Compilers",
			0.38,
			{ mode: "abundance", stat: "industry", modifier: 0.13 },
			{
				mode: "scarcity_breaker",
				stat: "constructionCostModifier",
				modifier: -0.08,
			},
		),
		outcome(
			"dyson_forge_routing",
			"Dyson Forge Routing",
			0.32,
			{ mode: "megascale", stat: "industrialProjectWork", modifier: 0.14 },
			{ mode: "foundry_tide", stat: "alloyEfficiency", modifier: 0.12 },
		),
		outcome(
			"post_scarcity_fabrication",
			"Post-Scarcity Fabrication",
			0.28,
			{ mode: "civilian", stat: "maintenanceCost", modifier: -0.1 },
			{ mode: "military", stat: "shipConstructionSpeed", modifier: 0.12 },
		),
	],
	expansion: [
		outcome(
			"frontier_logistics",
			"Frontier Logistics",
			1,
			{ mode: "reach", stat: "zoneOfControl", modifier: 0.07 },
			{ mode: "colonization", stat: "colonizationPressure", modifier: 0.08 },
		),
		outcome(
			"migration_harmonics",
			"Migration Harmonics",
			0.94,
			{ mode: "growth", stat: "populationGrowthBonus", modifier: 0.06 },
			{ mode: "transfer", stat: "migrationFlow", modifier: 0.08 },
		),
		outcome(
			"colony_seed_vaults",
			"Colony Seed Vaults",
			0.88,
			{ mode: "founding", stat: "colonyStartupTime", modifier: -0.07 },
			{ mode: "resilience", stat: "newColonyStability", modifier: 0.08 },
		),
		outcome(
			"gravitic_tug_corridors",
			"Gravitic Tug Corridors",
			0.84,
			{ mode: "convoys", stat: "transitSpeed", modifier: 0.09 },
			{ mode: "supply", stat: "supplyRange", modifier: 0.08 },
		),
		outcome(
			"biosphere_bootstrapping",
			"Biosphere Bootstrapping",
			0.82,
			{ mode: "habitability", stat: "habitability", modifier: 0.08 },
			{ mode: "growth", stat: "populationGrowthBonus", modifier: 0.07 },
		),
		outcome(
			"relay_waystations",
			"Relay Waystations",
			0.8,
			{ mode: "range", stat: "fleetRange", modifier: 0.09 },
			{ mode: "order", stat: "zoneOfControl", modifier: 0.06 },
		),
		outcome(
			"adaptive_habitation",
			"Adaptive Habitation",
			0.78,
			{ mode: "climates", stat: "habitability", modifier: 0.09 },
			{ mode: "maintenance", stat: "colonyMaintenance", modifier: -0.05 },
		),
		outcome(
			"sovereignty_beacons",
			"Sovereignty Beacons",
			0.74,
			{ mode: "claims", stat: "borderStability", modifier: 0.1 },
			{ mode: "reach", stat: "zoneOfControl", modifier: 0.07 },
		),
		outcome(
			"outpost_prefabrication",
			"Outpost Prefabrication",
			0.77,
			{ mode: "cheap", stat: "outpostCostModifier", modifier: -0.08 },
			{ mode: "fast", stat: "colonyStartupTime", modifier: -0.05 },
		),
		outcome(
			"long_range_convoys",
			"Long-Range Convoys",
			0.72,
			{ mode: "capacity", stat: "convoyCapacity", modifier: 0.1 },
			{ mode: "endurance", stat: "supplyRange", modifier: 0.07 },
		),
		outcome(
			"colonial_charter_engineering",
			"Colonial Charter Engineering",
			0.69,
			{ mode: "governance", stat: "governanceEfficiency", modifier: 0.08 },
			{ mode: "ambition", stat: "colonizationPressure", modifier: 0.07 },
		),
		outcome(
			"pressure_dome_ecologies",
			"Pressure-Dome Ecologies",
			0.73,
			{ mode: "adaptation", stat: "climateAdaptation", modifier: 0.09 },
			{ mode: "recovery", stat: "recoveryRate", modifier: 0.07 },
		),
		outcome(
			"cultural_integrator_protocols",
			"Cultural Integrator Protocols",
			0.66,
			{ mode: "assimilation", stat: "assimilationRate", modifier: 0.09 },
			{ mode: "stability", stat: "unrestResistance", modifier: 0.07 },
		),
		outcome(
			"jump_lane_scouting",
			"Jump-Lane Scouting",
			0.7,
			{ mode: "survey", stat: "surveyRange", modifier: 0.08 },
			{ mode: "routes", stat: "fleetRange", modifier: 0.07 },
		),
		outcome(
			"transit_ring_networks",
			"Transit Ring Networks",
			0.64,
			{ mode: "intra_empire", stat: "migrationFlow", modifier: 0.1 },
			{ mode: "commerce", stat: "transitSpeed", modifier: 0.08 },
		),
		outcome(
			"expeditionary_governance",
			"Expeditionary Governance",
			0.62,
			{ mode: "delegation", stat: "governanceEfficiency", modifier: 0.09 },
			{ mode: "claims", stat: "claimCostModifier", modifier: -0.06 },
		),
		outcome(
			"frontier_medical_caches",
			"Frontier Medical Caches",
			0.61,
			{ mode: "survival", stat: "newColonyStability", modifier: 0.08 },
			{ mode: "growth", stat: "populationGrowthBonus", modifier: 0.06 },
		),
		outcome(
			"resettlement_exchange",
			"Resettlement Exchange",
			0.65,
			{ mode: "mobility", stat: "migrationFlow", modifier: 0.1 },
			{
				mode: "affordability",
				stat: "resettlementCostModifier",
				modifier: -0.07,
			},
		),
		outcome(
			"starbridge_tenders",
			"Starbridge Tenders",
			0.57,
			{ mode: "reach", stat: "fleetRange", modifier: 0.09 },
			{ mode: "escort", stat: "convoyCapacity", modifier: 0.08 },
		),
		outcome(
			"exodus_archives",
			"Exodus Archives",
			0.54,
			{ mode: "memory", stat: "newColonyStability", modifier: 0.09 },
			{ mode: "planning", stat: "colonyStartupTime", modifier: -0.05 },
		),
		outcome(
			"deep_range_harvesters",
			"Deep-Range Harvesters",
			0.56,
			{ mode: "frontier", stat: "frontierYield", modifier: 0.1 },
			{ mode: "reach", stat: "supplyRange", modifier: 0.07 },
		),
		outcome(
			"claimstaking_audits",
			"Claimstaking Audits",
			0.52,
			{ mode: "efficiency", stat: "claimCostModifier", modifier: -0.08 },
			{ mode: "legitimacy", stat: "borderStability", modifier: 0.07 },
		),
		outcome(
			"wormhole_settler_doctrine",
			"Wormhole Settler Doctrine",
			0.38,
			{ mode: "bridges", stat: "wormholeStability", modifier: 0.14 },
			{ mode: "diaspora", stat: "migrationFlow", modifier: 0.12 },
		),
		outcome(
			"transgalactic_caravans",
			"Transgalactic Caravans",
			0.32,
			{ mode: "reach", stat: "fleetRange", modifier: 0.14 },
			{ mode: "supply", stat: "supplyRange", modifier: 0.12 },
		),
		outcome(
			"imperial_coreworld_reforms",
			"Imperial Coreworld Reforms",
			0.28,
			{ mode: "unity", stat: "governanceEfficiency", modifier: 0.13 },
			{ mode: "destiny", stat: "colonizationPressure", modifier: 0.12 },
		),
	],
	discovery: [
		outcome(
			"signal_cartography",
			"Signal Cartography",
			1,
			{ mode: "scan_speed", stat: "discoveryProgress", modifier: 0.08 },
			{ mode: "yield", stat: "resourceYield", modifier: 0.06 },
		),
		outcome(
			"xeno_mineralogy",
			"Xeno Mineralogy",
			0.95,
			{ mode: "deposits", stat: "remainingDeposits", modifier: 0.06 },
			{ mode: "mining", stat: "miningRate", modifier: 0.06 },
		),
		outcome(
			"neutrino_telescopy",
			"Neutrino Telescopy",
			0.9,
			{ mode: "deep_scan", stat: "sensorRange", modifier: 0.09 },
			{ mode: "clarity", stat: "scanResolution", modifier: 0.07 },
		),
		outcome(
			"anomaly_patterning",
			"Anomaly Patterning",
			0.88,
			{ mode: "detection", stat: "anomalyDetection", modifier: 0.1 },
			{ mode: "analysis", stat: "discoveryProgress", modifier: 0.07 },
		),
		outcome(
			"dark_matter_prospecting",
			"Dark Matter Prospecting",
			0.82,
			{ mode: "veins", stat: "rareResourceChance", modifier: 0.09 },
			{ mode: "energy", stat: "resourceYield", modifier: 0.07 },
		),
		outcome(
			"quantum_survey_drones",
			"Quantum Survey Drones",
			0.84,
			{ mode: "speed", stat: "surveySpeed", modifier: 0.1 },
			{ mode: "depth", stat: "scanResolution", modifier: 0.07 },
		),
		outcome(
			"precursor_linguistics",
			"Precursor Linguistics",
			0.78,
			{ mode: "archives", stat: "precursorInsight", modifier: 0.1 },
			{ mode: "salvage", stat: "archaeologyYield", modifier: 0.07 },
		),
		outcome(
			"hyperspectral_imaging",
			"Hyperspectral Imaging",
			0.77,
			{ mode: "mapping", stat: "depositPrediction", modifier: 0.1 },
			{ mode: "survey", stat: "surveySpeed", modifier: 0.07 },
		),
		outcome(
			"gravitic_resonance_maps",
			"Gravitic Resonance Maps",
			0.79,
			{ mode: "routes", stat: "starChartAccuracy", modifier: 0.09 },
			{ mode: "phenomena", stat: "anomalyDetection", modifier: 0.08 },
		),
		outcome(
			"xenobiology_gene_keys",
			"Xenobiology Gene Keys",
			0.72,
			{ mode: "biospheres", stat: "xenobiologySuccess", modifier: 0.1 },
			{ mode: "colonies", stat: "habitability", modifier: 0.06 },
		),
		outcome(
			"ice_core_chronology",
			"Ice-Core Chronology",
			0.64,
			{ mode: "forecasts", stat: "climatePrediction", modifier: 0.09 },
			{ mode: "relics", stat: "archaeologyYield", modifier: 0.06 },
		),
		outcome(
			"exoplanetary_climatology",
			"Exoplanetary Climatology",
			0.7,
			{ mode: "terraforming", stat: "climateAdaptation", modifier: 0.08 },
			{ mode: "settling", stat: "habitability", modifier: 0.07 },
		),
		outcome(
			"relic_site_excavation",
			"Relic Site Excavation",
			0.74,
			{ mode: "speed", stat: "digSiteSpeed", modifier: 0.1 },
			{ mode: "care", stat: "relicPreservation", modifier: 0.07 },
		),
		outcome(
			"tachyon_ping_arrays",
			"Tachyon Ping Arrays",
			0.76,
			{ mode: "reach", stat: "sensorRange", modifier: 0.1 },
			{ mode: "precision", stat: "scanResolution", modifier: 0.07 },
		),
		outcome(
			"mineral_vein_simulation",
			"Mineral Vein Simulation",
			0.68,
			{ mode: "forecast", stat: "depositPrediction", modifier: 0.1 },
			{ mode: "extraction", stat: "miningRate", modifier: 0.07 },
		),
		outcome(
			"void_ecology",
			"Void Ecology",
			0.63,
			{ mode: "survival", stat: "voidSurvival", modifier: 0.1 },
			{ mode: "bioscience", stat: "xenobiologySuccess", modifier: 0.07 },
		),
		outcome(
			"deep_space_listening",
			"Deep Space Listening",
			0.66,
			{ mode: "clarity", stat: "signalClarity", modifier: 0.1 },
			{ mode: "contacts", stat: "anomalyDetection", modifier: 0.07 },
		),
		outcome(
			"stellar_furnace_models",
			"Stellar Furnace Models",
			0.62,
			{ mode: "yield", stat: "resourceYield", modifier: 0.08 },
			{ mode: "prediction", stat: "starChartAccuracy", modifier: 0.07 },
		),
		outcome(
			"xenoarchaeology_sandboxes",
			"Xenoarchaeology Sandboxes",
			0.58,
			{ mode: "experiments", stat: "precursorInsight", modifier: 0.09 },
			{ mode: "speed", stat: "digSiteSpeed", modifier: 0.08 },
		),
		outcome(
			"resource_genome_indexing",
			"Resource Genome Indexing",
			0.56,
			{ mode: "catalogues", stat: "rareResourceChance", modifier: 0.09 },
			{ mode: "yields", stat: "remainingDeposits", modifier: 0.08 },
		),
		outcome(
			"singularity_boundary_math",
			"Singularity Boundary Math",
			0.52,
			{ mode: "safety", stat: "experimentSafety", modifier: 0.1 },
			{ mode: "insight", stat: "discoveryProgress", modifier: 0.08 },
		),
		outcome(
			"autonomous_probe_swarms",
			"Autonomous Probe Swarms",
			0.6,
			{ mode: "coverage", stat: "probeCapacity", modifier: 0.1 },
			{ mode: "speed", stat: "surveySpeed", modifier: 0.08 },
		),
		outcome(
			"precursor_gate_theory",
			"Precursor Gate Theory",
			0.38,
			{ mode: "reactivation", stat: "gateActivation", modifier: 0.14 },
			{ mode: "mapping", stat: "starChartAccuracy", modifier: 0.12 },
		),
		outcome(
			"chronometric_observatories",
			"Chronometric Observatories",
			0.32,
			{ mode: "foresight", stat: "timeDilationInsight", modifier: 0.14 },
			{ mode: "analysis", stat: "discoveryProgress", modifier: 0.12 },
		),
		outcome(
			"akashic_mapping",
			"Akashic Mapping",
			0.28,
			{ mode: "omniscience", stat: "mapIntel", modifier: 0.14 },
			{ mode: "harvest", stat: "rareResourceChance", modifier: 0.12 },
		),
	],
};

const adjacentCategory: Record<ResearchCategory, ResearchCategory[]> = {
	military: ["industry", "expansion"],
	industry: ["military", "discovery"],
	expansion: ["military", "discovery"],
	discovery: ["industry", "expansion"],
};

export function parseResearchCategory(value: string): ResearchCategory | null {
	if (researchCategories.includes(value as ResearchCategory)) {
		return value as ResearchCategory;
	}

	return null;
}

export function parseResearchMethodology(
	value: string,
): ResearchMethodology | null {
	if (researchMethodologies.includes(value as ResearchMethodology)) {
		return value as ResearchMethodology;
	}

	return null;
}

export function getMethodologyMultiplier(
	methodology: ResearchMethodology,
): number {
	return methodologyMultipliers[methodology];
}

export function buildResearchWeights(
	primary: ResearchCategory,
	secondary: ResearchCategory,
): ResearchWeights {
	const otherCategories = researchCategories.filter(
		(category) => category !== primary && category !== secondary,
	);
	const otherWeight = 0.15 / otherCategories.length;

	return {
		military:
			primary === "military"
				? 0.55
				: secondary === "military"
					? 0.3
					: otherWeight,
		industry:
			primary === "industry"
				? 0.55
				: secondary === "industry"
					? 0.3
					: otherWeight,
		expansion:
			primary === "expansion"
				? 0.55
				: secondary === "expansion"
					? 0.3
					: otherWeight,
		discovery:
			primary === "discovery"
				? 0.55
				: secondary === "discovery"
					? 0.3
					: otherWeight,
	};
}

export function computeBaseKnowledge({
	populationBillions,
	starSystems,
	discoveries,
	combatRounds,
}: {
	populationBillions: number;
	starSystems: number;
	discoveries: number;
	combatRounds: number;
}): number {
	return Math.floor(
		Math.sqrt(Math.max(populationBillions, 0)) +
			0.5 * Math.max(starSystems, 0) +
			0.75 * Math.max(discoveries, 0) +
			0.25 * Math.max(combatRounds, 0),
	);
}

export function computeFatiguePenalty(consecutivePrimary: number): number {
	return Math.min(4, Math.max(0, consecutivePrimary - 2));
}

export function computeMomentumGain({
	baseKnowledge,
	weight,
	methodology,
	evidence,
	fatigue,
}: {
	baseKnowledge: number;
	weight: number;
	methodology: ResearchMethodology;
	evidence: number;
	fatigue: number;
}) {
	return (
		baseKnowledge * weight * getMethodologyMultiplier(methodology) +
		evidence -
		fatigue
	);
}

export function hypothesisThreshold(breakthroughCount: number): number {
	const n = breakthroughCount + 1;
	return Math.round(10 * 1.2 ** (n - 1));
}

export function fieldworkThreshold(breakthroughCount: number): number {
	const n = breakthroughCount + 1;
	return 6 + 2 * n;
}

export function synthesisThreshold(breakthroughCount: number): number {
	const n = breakthroughCount + 1;
	return 12 + 3 * n;
}

export function effectiveBonus(rawBonus: number): number {
	if (rawBonus <= 0.25) {
		return rawBonus;
	}

	return 0.25 + (rawBonus - 0.25) * 0.5;
}

export function resolveOutcomeCandidates(
	category: ResearchCategory,
	secondaryCategory: ResearchCategory,
) {
	const primaryPool = researchOutcomesCatalog[category] ?? [];
	const adjacent = adjacentCategory[category];
	const secondaryContribution = adjacent.includes(secondaryCategory)
		? (researchOutcomesCatalog[secondaryCategory] ?? [])
		: [];

	return [...primaryPool, ...secondaryContribution];
}
