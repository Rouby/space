import type { ChoiceEffect, DilemmaPromptName } from "@space/data/schema";

type ResourceKind = "metal" | "crystal" | "gas" | "liquid" | "biological";

type StartingDilemmaPromptName = DilemmaPromptName | undefined;

interface DilemmaChoiceTemplate {
	title: string;
	description: string;
	effects: ChoiceEffect[];
}

interface DilemmaTemplate {
	title: string;
	description: string;
	question: string;
	choices: DilemmaChoiceTemplate[];
}

interface ResourceTemplate {
	name: string;
	description: string;
	baseWeight: number;
	statBonuses: { stat: string; modifier: number }[];
}

const ORIGIN_DILEMMAS: DilemmaTemplate[] = [
	{
		title: "The First Covenant",
		description:
			"Before metal ever sang under a hammer, your ancestors faced a starving era where no settlement could survive alone. The strongest enclaves proposed a covenant: all surplus would be tithed to a central reserve and redistributed by appointed stewards.\n\nThe policy ended famines, but it taught every citizen that survival came with obligation.",
		question: "How did your people remember that first covenant?",
		choices: [
			{
				title: "Duty Above Self",
				description: "Collective obligation became sacred law.",
				effects: [
					{ type: "modifyHomePopulation", params: { delta: "400000000" } },
					{
						type: "modifyHomeSystem",
						params: { populationGrowthBonusDelta: "0.05" },
					},
				],
			},
			{
				title: "Reciprocal Houses",
				description: "Mutual aid remained voluntary, enforced by honor.",
				effects: [
					{ type: "modifyHomePopulation", params: { delta: "250000000" } },
					{
						type: "modifyHomeSystem",
						params: { constructionCostModifierDelta: "-0.04" },
					},
				],
			},
			{
				title: "Iron Rationing",
				description: "Scarcity planning became a permanent institution.",
				effects: [
					{ type: "modifyHomeSystem", params: { industryDelta: 1 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "industry", delta: "2" },
					},
				],
			},
		],
	},
	{
		title: "The Silent Gene",
		description:
			"A dormant hereditary trait surfaced in your prehistory: periods of intense emotional stillness that made large groups eerily calm. Philosophers split over whether this was a gift of discipline or a theft of spontaneity.\n\nGenerations later, your civilization still carries that unresolved inheritance.",
		question: "What meaning did your people assign to the Silent Gene?",
		choices: [
			{
				title: "Gift of Discipline",
				description: "The trait was cultivated as a virtue.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "industry", delta: "2" },
					},
					{
						type: "modifyHomeSystem",
						params: { constructionCostModifierDelta: "-0.03" },
					},
				],
			},
			{
				title: "Spark of Defiance",
				description: "Citizens were taught to resist emotional conformity.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "discovery", delta: "3" },
					},
					{
						type: "modifyResearchMomentum",
						params: { category: "military", delta: "1" },
					},
				],
			},
		],
	},
	{
		title: "Songs in the Stone",
		description:
			"Your earliest cities were carved into resonant canyon walls. Priests discovered that spoken law echoed for minutes, allowing entire districts to hear judgments at once. Over centuries, law and performance fused into one civic tradition.\n\nEven now, politics feels like ritual theater.",
		question: "What endured from the canyon tradition?",
		choices: [
			{
				title: "Public Liturgies",
				description: "State decisions remained ceremonial and transparent.",
				effects: [
					{ type: "modifyHomePopulation", params: { delta: "500000000" } },
					{
						type: "modifyHomeSystem",
						params: { populationGrowthBonusDelta: "0.04" },
					},
				],
			},
			{
				title: "Hidden Choruses",
				description: "Real policy moved behind closed councils.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "military", delta: "2" },
					},
					{ type: "modifyHomeSystem", params: { discoverySlotsDelta: 1 } },
				],
			},
		],
	},
	{
		title: "Embers of Consensus",
		description:
			"Your earliest federations only survived by forcing rival city-states into shared councils that could not disband during crisis. Debate slowed decisions, but it prevented blood-feud collapse.\n\nModern governance still inherits that patient, grinding machinery.",
		question: "What survived from that era of forced consensus?",
		choices: [
			{
				title: "Deliberative Patience",
				description: "You trust process, even when speed is costly.",
				effects: [
					{ type: "modifyHomeSystem", params: { industryDelta: 1 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "industry", delta: "1" },
					},
				],
			},
			{
				title: "Emergency Mandates",
				description: "Councils learned to hand power to crisis cadres.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "military", delta: "3" },
					},
					{
						type: "modifyHomeSystem",
						params: { populationGrowthBonusDelta: "-0.02" },
					},
				],
			},
		],
	},
];

const CRUCIBLE_DILEMMAS: DilemmaTemplate[] = [
	{
		title: "Ashfall Reforms",
		description:
			"A century before your first orbital launch, chained volcanoes blanketed your industrial belt in ash. Emergency councils seized factories, rationed power, and rewired logistics under martial oversight.\n\nThe catastrophe ended, but the emergency institutions did not.",
		question: "How did your civilization handle the post-ash order?",
		choices: [
			{
				title: "Permanent Command",
				description: "Emergency command structures became normal governance.",
				effects: [
					{ type: "modifyHomeSystem", params: { industryDelta: 2 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "military", delta: "2" },
					},
				],
			},
			{
				title: "Civilian Restoration",
				description: "Powers were returned quickly to public institutions.",
				effects: [
					{ type: "modifyHomePopulation", params: { delta: "700000000" } },
					{ type: "modifyHomeSystem", params: { discoverySlotsDelta: 1 } },
				],
			},
		],
	},
	{
		title: "The Archive War",
		description:
			"A data plague erased generations of scientific records and forged identities. Factions fought not for territory, but for surviving archives and trusted methods of verification.\n\nYour people emerged with a deep fear of forgotten knowledge.",
		question: "Which lesson from the Archive War defined your ascent?",
		choices: [
			{
				title: "Redundant Truth",
				description: "Knowledge was duplicated endlessly across institutions.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "discovery", delta: "4" },
					},
					{
						type: "modifyResearchMomentum",
						params: { category: "industry", delta: "1" },
					},
				],
			},
			{
				title: "Trusted Custodians",
				description: "A small technocratic order controlled validation.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "discovery", delta: "3" },
					},
					{
						type: "modifyResearchMomentum",
						params: { category: "military", delta: "2" },
					},
				],
			},
			{
				title: "Open Reconstruction",
				description: "Rebuilding was crowd-sourced across the population.",
				effects: [
					{ type: "modifyHomePopulation", params: { delta: "500000000" } },
					{
						type: "modifyResearchMomentum",
						params: { category: "expansion", delta: "2" },
					},
				],
			},
		],
	},
	{
		title: "The Carbon Schism",
		description:
			"Your atmosphere projects split the world between megacity preservation and biosphere restoration. Neither side could fully win, so your civilization became expert at governing compromise under existential deadlines.\n\nThat political memory still shapes public appetite for risk.",
		question: "Which legacy defined your transition into the space age?",
		choices: [
			{
				title: "Urban Continuity",
				description: "Industry remained sacred even during ecological stress.",
				effects: [
					{ type: "modifyHomeSystem", params: { industryDelta: 2 } },
					{
						type: "modifyHomeSystem",
						params: { populationGrowthBonusDelta: "-0.02" },
					},
				],
			},
			{
				title: "Living Recovery",
				description: "Planetary healing became the center of state doctrine.",
				effects: [
					{ type: "modifyHomePopulation", params: { delta: "900000000" } },
					{ type: "modifyHomeSystem", params: { discoverySlotsDelta: 1 } },
				],
			},
		],
	},
];

const LAUNCH_DILEMMAS: DilemmaTemplate[] = [
	{
		title: "Project Lantern Spine",
		description:
			"The first FTL corridor prototype could be built two ways: a slow, over-shielded caravan architecture, or a razor-fast spearhead network prone to catastrophic collapse. Budget and pride made compromise impossible.\n\nYour launch doctrine still carries that decision.",
		question: "What doctrine launched your species into interstellar space?",
		choices: [
			{
				title: "Bulwark Convoys",
				description: "Safe lanes and armored logistics were prioritized.",
				effects: [
					{ type: "modifyHomeSystem", params: { industryDelta: 1 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "military", delta: "2" },
					},
				],
			},
			{
				title: "Spearhead Leap",
				description: "Speed and territorial reach were prioritized.",
				effects: [
					{ type: "modifyHomeSystem", params: { discoverySlotsDelta: 2 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "expansion", delta: "3" },
					},
				],
			},
		],
	},
	{
		title: "The Outsider Pact",
		description:
			"Moments before launch, a fringe polity offered a cache of unstable jump equations in exchange for permanent political representation on your expedition command. Refusing them meant delay; accepting them meant shared authority in the stars.\n\nThe fleet departed before the debate ended.",
		question: "What price did your civilization pay to leave its home sky?",
		choices: [
			{
				title: "Sign the Pact",
				description:
					"You traded cohesion for immediate technological acceleration.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "discovery", delta: "3" },
					},
					{
						type: "modifyHomeSystem",
						params: { constructionCostModifierDelta: "0.03" },
					},
				],
			},
			{
				title: "Stand Alone",
				description: "You preserved unified command at the cost of speed.",
				effects: [
					{ type: "modifyHomeSystem", params: { industryDelta: 1 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "military", delta: "2" },
					},
				],
			},
			{
				title: "Controlled Exchange",
				description: "You accepted limited cooperation under strict review.",
				effects: [
					{ type: "modifyHomeSystem", params: { discoverySlotsDelta: 1 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "industry", delta: "1" },
					},
				],
			},
		],
	},
	{
		title: "Last Orbital Window",
		description:
			"A narrowing debris corridor gave your species one final launch window before orbital industry would be delayed by decades. Command circles split between building a hardened convoy and risking a lean, high-speed exodus.\n\nWhat you chose defined the rhythm of your expansion doctrine.",
		question: "How did your first interstellar expedition leave home?",
		choices: [
			{
				title: "Shielded Exodus",
				description: "Reliability first, even if it slows expansion tempo.",
				effects: [
					{ type: "modifyHomeSystem", params: { industryDelta: 2 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "expansion", delta: "1" },
					},
				],
			},
			{
				title: "Needle Window",
				description: "Speed and audacity over long-term redundancy.",
				effects: [
					{ type: "modifyHomeSystem", params: { discoverySlotsDelta: 2 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "expansion", delta: "3" },
					},
				],
			},
		],
	},
];

const MIDGAME_FRONTIER_DILEMMAS: DilemmaTemplate[] = [
	{
		title: "The Empty Corridor",
		description:
			"Long-range scouts map a chain of systems with no immediate rivals but fragile logistics. Expansion planners want a rapid leap, while administrators warn of overextension.\n\nYour court demands a doctrine before the window closes.",
		question: "How should your empire answer the frontier opening?",
		choices: [
			{
				title: "Leap the Gap",
				description: "Push fast expansion before competitors react.",
				effects: [
					{ type: "modifyHomeSystem", params: { discoverySlotsDelta: 1 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "expansion", delta: "2" },
					},
				],
			},
			{
				title: "Secure the Spine",
				description: "Consolidate and harden the core first.",
				effects: [
					{ type: "modifyHomeSystem", params: { industryDelta: 1 } },
					{ type: "modifyHomePopulation", params: { delta: "300000000" } },
				],
			},
		],
	},
	{
		title: "Cartographer's Petition",
		description:
			"Exploration guilds petition for direct state backing of deep-range mapping expeditions. The treasury can support only one strategic emphasis this cycle.\n\nYour decision will steer what your captains prioritize in unknown space.",
		question: "What mandate do your cartographers receive?",
		choices: [
			{
				title: "Resource Survey First",
				description: "Map extractive value before territorial claims.",
				effects: [
					{ type: "modifyHomeSystem", params: { discoverySlotsDelta: 1 } },
					{
						type: "modifyResearchMomentum",
						params: { category: "discovery", delta: "2" },
					},
				],
			},
			{
				title: "Defensive Charts",
				description: "Prioritize chokepoints and fleet lanes.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "military", delta: "2" },
					},
					{ type: "modifyHomeSystem", params: { industryDelta: 1 } },
				],
			},
		],
	},
];

const MIDGAME_CRISIS_DILEMMAS: DilemmaTemplate[] = [
	{
		title: "War Exhaustion Hearings",
		description:
			"Recent conflict losses trigger public hearings on command failures and supply doctrine. Reformers demand restraint while admirals demand full retaliation planning.\n\nYour ruling circle must set the post-crisis line.",
		question: "How does your empire respond to wartime strain?",
		choices: [
			{
				title: "Rebuild Quietly",
				description: "Stabilize population and industry before new offensives.",
				effects: [
					{ type: "modifyHomePopulation", params: { delta: "450000000" } },
					{ type: "modifyHomeSystem", params: { industryDelta: 1 } },
				],
			},
			{
				title: "Retaliatory Doctrine",
				description: "Double down on military adaptation and pressure.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "military", delta: "3" },
					},
					{
						type: "modifyHomeSystem",
						params: { populationGrowthBonusDelta: "-0.01" },
					},
				],
			},
		],
	},
];

const MIDGAME_DOCTRINE_DILEMMAS: DilemmaTemplate[] = [
	{
		title: "Bureau of Futures",
		description:
			"A coalition of planners proposes a permanent strategic bureau to align research, industry, and expansion goals across ministries. Opponents call it overcentralization.\n\nYou must decide whether to formalize doctrine at empire scale.",
		question: "Do you centralize long-range planning?",
		choices: [
			{
				title: "Formalize the Bureau",
				description: "Gain coordinated momentum at the cost of flexibility.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "industry", delta: "2" },
					},
					{
						type: "modifyResearchMomentum",
						params: { category: "discovery", delta: "1" },
					},
				],
			},
			{
				title: "Keep Distributed Command",
				description: "Retain adaptive local doctrine and frontier autonomy.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "expansion", delta: "2" },
					},
					{ type: "modifyHomeSystem", params: { discoverySlotsDelta: 1 } },
				],
			},
		],
	},
];

const MIDGAME_ANOMALY_DILEMMAS: DilemmaTemplate[] = [
	{
		title: "Signal Beneath the Noise",
		description:
			"Deep-array listeners isolate a repeating pattern buried in cosmic background interference. Decoding it requires diverting analysts from current programs.\n\nScholars insist the signal might rewrite your strategic assumptions.",
		question: "How do you handle the anomalous signal?",
		choices: [
			{
				title: "Full Decode Effort",
				description: "Commit heavily to discovery and speculative analysis.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "discovery", delta: "4" },
					},
					{
						type: "modifyResearchMomentum",
						params: { category: "industry", delta: "-1" },
					},
				],
			},
			{
				title: "Controlled Study",
				description:
					"Investigate cautiously while protecting current priorities.",
				effects: [
					{
						type: "modifyResearchMomentum",
						params: { category: "discovery", delta: "2" },
					},
					{ type: "modifyHomeSystem", params: { industryDelta: 1 } },
				],
			},
		],
	},
];

const RESOURCE_POOLS: Record<ResourceKind, ResourceTemplate[]> = {
	metal: [
		{
			name: "Ferrion Weave",
			description:
				"A layered iron-nickel lattice that resists microfractures under repeated thermal shocks.",
			baseWeight: 62,
			statBonuses: [{ stat: "armorThickness", modifier: 0.03 }],
		},
		{
			name: "Kestral Alloy",
			description:
				"Dense metallic veins rich in conductive trace elements, prized for reactor housings.",
			baseWeight: 44,
			statBonuses: [
				{ stat: "structuralIntegrity", modifier: 0.06 },
				{ stat: "armorThickness", modifier: 0.04 },
			],
		},
		{
			name: "Aurum Shale",
			description:
				"Brittle sediment containing recoverable noble metals for high-precision electronics.",
			baseWeight: 53,
			statBonuses: [{ stat: "structuralIntegrity", modifier: 0.04 }],
		},
		{
			name: "Obdurite",
			description:
				"A dark superhard metal used in armor plates and industrial boring heads.",
			baseWeight: 35,
			statBonuses: [
				{ stat: "armorThickness", modifier: 0.1 },
				{ stat: "structuralIntegrity", modifier: 0.08 },
			],
		},
	],
	crystal: [
		{
			name: "Lumen Quartz",
			description:
				"Photoreactive crystal clusters that amplify optical signaling and sensor arrays.",
			baseWeight: 56,
			statBonuses: [{ stat: "sensorPrecision", modifier: 0.04 }],
		},
		{
			name: "Phase Glass",
			description:
				"Metastable crystal sheets that bend radio waves and improve stealth composites.",
			baseWeight: 30,
			statBonuses: [
				{ stat: "weaponAccuracy", modifier: 0.1 },
				{ stat: "sensorPrecision", modifier: 0.08 },
			],
		},
		{
			name: "Verdant Prism",
			description:
				"Green multifaceted crystals with unusually high energy retention under charge cycles.",
			baseWeight: 47,
			statBonuses: [{ stat: "weaponDamage", modifier: 0.05 }],
		},
		{
			name: "Iridescent Spire",
			description:
				"Needle-like crystal formations used in precision resonance instruments.",
			baseWeight: 40,
			statBonuses: [
				{ stat: "weaponDamage", modifier: 0.07 },
				{ stat: "weaponAccuracy", modifier: 0.05 },
			],
		},
	],
	gas: [
		{
			name: "Heliox Vapor",
			description:
				"A light noble gas blend ideal for coolant channels and plasma ignition control.",
			baseWeight: 61,
			statBonuses: [{ stat: "powerGeneration", modifier: 0.03 }],
		},
		{
			name: "Noctilume Mist",
			description:
				"A faintly luminescent atmospheric gas used in advanced spectrometry.",
			baseWeight: 36,
			statBonuses: [
				{ stat: "ftlSpeed", modifier: 0.09 },
				{ stat: "thruster", modifier: 0.07 },
			],
		},
		{
			name: "Sable Methane",
			description:
				"Heavy hydrocarbon gas pockets suitable for synthetic fuel refining.",
			baseWeight: 58,
			statBonuses: [{ stat: "thruster", modifier: 0.04 }],
		},
		{
			name: "Argent Fume",
			description:
				"An ion-rich noble gas haze with strong applications in arc propulsion tuning.",
			baseWeight: 33,
			statBonuses: [
				{ stat: "ftlSpeed", modifier: 0.08 },
				{ stat: "powerGeneration", modifier: 0.06 },
			],
		},
	],
	liquid: [
		{
			name: "Cryowater",
			description:
				"Supercooled mineral water reservoirs used in life support and cryogenic industry.",
			baseWeight: 64,
			statBonuses: [{ stat: "supplyCapacity", modifier: 0.03 }],
		},
		{
			name: "Mercuric Brine",
			description:
				"Salty metallic fluid extracted for catalysts and specialized electrochemistry.",
			baseWeight: 39,
			statBonuses: [
				{ stat: "shieldStrength", modifier: 0.08 },
				{ stat: "supplyCapacity", modifier: 0.06 },
			],
		},
		{
			name: "Velvet Oil",
			description:
				"Dense organic fluid refined into polymers for seals, coatings, and insulation.",
			baseWeight: 54,
			statBonuses: [{ stat: "shieldStrength", modifier: 0.04 }],
		},
		{
			name: "Azure Solvent",
			description:
				"Reactive liquid medium used to dissolve and separate rare industrial compounds.",
			baseWeight: 46,
			statBonuses: [
				{ stat: "shieldStrength", modifier: 0.06 },
				{ stat: "supplyCapacity", modifier: 0.05 },
			],
		},
	],
	biological: [
		{
			name: "Mycofiber",
			description:
				"Engineered fungal strands cultivated into lightweight structural composites.",
			baseWeight: 50,
			statBonuses: [{ stat: "crewCapacity", modifier: 0.04 }],
		},
		{
			name: "Bloom Resin",
			description:
				"Plant-derived polymer resin with remarkable adhesive and self-sealing behavior.",
			baseWeight: 55,
			statBonuses: [{ stat: "crewCapacity", modifier: 0.03 }],
		},
		{
			name: "Coral Enzyme",
			description:
				"Bioactive enzyme complexes harvested for medical and terraforming support processes.",
			baseWeight: 34,
			statBonuses: [{ stat: "crewCapacity", modifier: 0.1 }],
		},
		{
			name: "Spore Silk",
			description:
				"Protein-rich filament secreted by colony organisms, woven into adaptive textiles.",
			baseWeight: 43,
			statBonuses: [{ stat: "crewCapacity", modifier: 0.07 }],
		},
	],
};

interface ComponentTemplate {
	name: string;
	description: string;
	layout: string;
	stats: {
		supplyNeedPassive: string;
		supplyNeedMovement: string;
		supplyNeedCombat: string;
		powerNeed: string;
		crewNeed: string;
		constructionCost: string;
		supplyCapacity?: string | null;
		powerGeneration?: string | null;
		crewCapacity?: string | null;
		ftlSpeed?: string | null;
		zoneOfControl?: string | null;
		sensorRange?: string | null;
		structuralIntegrity?: string | null;
		thruster?: string | null;
		sensorPrecision?: string | null;
		armorThickness?: string | null;
		armorEffectivenessAgainst?: {
			projectile: number | null;
			beam: number | null;
			missile: number | null;
			instant: number | null;
		} | null;
		shieldStrength?: string | null;
		shieldEffectivenessAgainst?: {
			projectile: number | null;
			beam: number | null;
			missile: number | null;
			instant: number | null;
		} | null;
		weaponDamage?: string | null;
		weaponCooldown?: string | null;
		weaponRange?: string | null;
		weaponArmorPenetration?: string | null;
		weaponShieldPenetration?: string | null;
		weaponAccuracy?: string | null;
		weaponDeliveryType?: "missile" | "projectile" | "beam" | "instant" | null;
	};
}

const DEFAULT_COMPONENTS: ComponentTemplate[] = [
	{
		name: "Light Frame",
		description:
			"A minimal structural frame providing basic hull integrity at low cost. Ideal for small craft and expendable designs.",
		layout: "hull",
		stats: {
			supplyNeedPassive: "0",
			supplyNeedMovement: "0",
			supplyNeedCombat: "0",
			powerNeed: "0",
			crewNeed: "0",
			constructionCost: "5",
			structuralIntegrity: "8",
		},
	},
	{
		name: "Reinforced Bulkhead",
		description:
			"Heavy-duty structural plating that significantly increases hull integrity. Requires crew to maintain and power for active stress monitoring.",
		layout: "hull",
		stats: {
			supplyNeedPassive: "0",
			supplyNeedMovement: "0",
			supplyNeedCombat: "0",
			powerNeed: "1",
			crewNeed: "1",
			constructionCost: "12",
			structuralIntegrity: "15",
		},
	},
	{
		name: "Ion Drive",
		description:
			"A reliable ion propulsion system providing both FTL capability and tactical thrust. Consumes supply during movement.",
		layout: "engine",
		stats: {
			supplyNeedPassive: "0",
			supplyNeedMovement: "1",
			supplyNeedCombat: "0",
			powerNeed: "2",
			crewNeed: "1",
			constructionCost: "8",
			ftlSpeed: "3",
			thruster: "2",
		},
	},
	{
		name: "Fusion Core",
		description:
			"A compact fusion reactor that generates substantial power and includes integrated supply storage. The backbone of any ship's energy grid.",
		layout: "reactor",
		stats: {
			supplyNeedPassive: "1",
			supplyNeedMovement: "0",
			supplyNeedCombat: "0",
			powerNeed: "0",
			crewNeed: "1",
			constructionCost: "15",
			powerGeneration: "10",
			supplyCapacity: "20",
		},
	},
	{
		name: "Railgun",
		description:
			"An electromagnetic mass driver that hurls metal slugs at extreme velocity. Devastating against armor but less accurate at range.",
		layout: "weapon",
		stats: {
			supplyNeedPassive: "0",
			supplyNeedMovement: "0",
			supplyNeedCombat: "1",
			powerNeed: "2",
			crewNeed: "1",
			constructionCost: "10",
			weaponDamage: "3",
			weaponDeliveryType: "projectile",
			weaponAccuracy: "0.7",
			weaponCooldown: "2",
		},
	},
	{
		name: "Pulse Laser",
		description:
			"A rapid-fire directed energy weapon. Highly accurate with fast cycling, though individual shots deal less damage than kinetic alternatives.",
		layout: "weapon",
		stats: {
			supplyNeedPassive: "0",
			supplyNeedMovement: "0",
			supplyNeedCombat: "1",
			powerNeed: "3",
			crewNeed: "1",
			constructionCost: "12",
			weaponDamage: "2",
			weaponDeliveryType: "beam",
			weaponAccuracy: "0.9",
			weaponCooldown: "1",
		},
	},
	{
		name: "Composite Plating",
		description:
			"Layered armor panels effective against kinetic impacts. Less useful against directed energy and warheads.",
		layout: "armor",
		stats: {
			supplyNeedPassive: "0",
			supplyNeedMovement: "0",
			supplyNeedCombat: "0",
			powerNeed: "0",
			crewNeed: "0",
			constructionCost: "8",
			armorThickness: "4",
			armorEffectivenessAgainst: {
				projectile: 0.8,
				beam: 0.4,
				missile: 0.6,
				instant: 0.2,
			},
		},
	},
	{
		name: "Deflector Array",
		description:
			"An energy shield system that excels at dissipating beam weapons. Requires continuous power but provides regenerating protection.",
		layout: "shield",
		stats: {
			supplyNeedPassive: "0",
			supplyNeedMovement: "0",
			supplyNeedCombat: "0",
			powerNeed: "3",
			crewNeed: "1",
			constructionCost: "14",
			shieldStrength: "5",
			shieldEffectivenessAgainst: {
				projectile: 0.4,
				beam: 0.8,
				missile: 0.5,
				instant: 0.3,
			},
		},
	},
	{
		name: "Scanner Array",
		description:
			"A multi-spectrum sensor suite providing long-range detection and tactical targeting data. Essential for fleet awareness.",
		layout: "sensor",
		stats: {
			supplyNeedPassive: "0",
			supplyNeedMovement: "0",
			supplyNeedCombat: "0",
			powerNeed: "1",
			crewNeed: "1",
			constructionCost: "6",
			sensorRange: "50",
			sensorPrecision: "3",
			zoneOfControl: "30",
		},
	},
	{
		name: "Crew Quarters",
		description:
			"Standard living spaces for ship personnel. Provides crew capacity with minimal resource requirements.",
		layout: "quarters",
		stats: {
			supplyNeedPassive: "0",
			supplyNeedMovement: "0",
			supplyNeedCombat: "0",
			powerNeed: "0",
			crewNeed: "0",
			constructionCost: "4",
			crewCapacity: "5",
		},
	},
];

export function getDefaultComponents(): ComponentTemplate[] {
	return DEFAULT_COMPONENTS;
}

function randomIndex(max: number) {
	return Math.floor(Math.random() * max);
}

function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(items: readonly T[]) {
	return items[randomIndex(items.length)];
}

function shuffle<T>(items: T[]) {
	for (let i = items.length - 1; i > 0; i -= 1) {
		const j = randomIndex(i + 1);
		const tmp = items[i];
		items[i] = items[j];
		items[j] = tmp;
	}
	return items;
}

function pickSeveral<T>(items: readonly T[], count: number) {
	const copy = [...items];
	shuffle(copy);
	return copy.slice(0, Math.min(count, copy.length));
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");
}

function resolveDilemmaPool(promptName: StartingDilemmaPromptName) {
	switch (promptName) {
		case "startingDilemmaFollowUp1":
			return CRUCIBLE_DILEMMAS;
		case "startingDilemmaFollowUp2":
			return LAUNCH_DILEMMAS;
		default:
			return ORIGIN_DILEMMAS;
	}
}

export function generateRandomDilemma(promptName?: DilemmaPromptName) {
	const template = pickRandom(resolveDilemmaPool(promptName));

	return {
		dilemma: {
			title: template.title,
			description: template.description,
			question: template.question,
			choices: template.choices.map((choice, index) => ({
				id: `${slugify(choice.title)}_${index + 1}_${randomInt(100, 999)}`,
				title: choice.title,
				description: choice.description,
				effects: choice.effects,
			})),
		},
	};
}

function resolveMidGamePool(
	kind: "frontier" | "crisis" | "doctrine" | "anomaly",
) {
	switch (kind) {
		case "frontier":
			return MIDGAME_FRONTIER_DILEMMAS;
		case "crisis":
			return MIDGAME_CRISIS_DILEMMAS;
		case "doctrine":
			return MIDGAME_DOCTRINE_DILEMMAS;
		case "anomaly":
			return MIDGAME_ANOMALY_DILEMMAS;
	}
}

export function generateRandomMidGameDilemma(
	kind: "frontier" | "crisis" | "doctrine" | "anomaly",
) {
	const template = pickRandom(resolveMidGamePool(kind));

	return {
		dilemma: {
			title: template.title,
			description: template.description,
			question: template.question,
			choices: template.choices.map((choice, index) => ({
				id: `${slugify(choice.title)}_${index + 1}_${randomInt(100, 999)}`,
				title: choice.title,
				description: choice.description,
				effects: choice.effects,
			})),
		},
	};
}

export function generateRandomResources() {
	const resources = (Object.keys(RESOURCE_POOLS) as ResourceKind[])
		.flatMap((kind) => {
			const picks = pickSeveral(RESOURCE_POOLS[kind], 3);
			return picks.map((resource) => ({
				name: resource.name,
				kind,
				description: resource.description,
				discoveryWeight: Math.max(
					1,
					Math.min(100, resource.baseWeight + randomInt(-8, 8)),
				),
				statBonuses: resource.statBonuses,
			}));
		})
		.sort(() => Math.random() - 0.5);

	return { resources };
}
