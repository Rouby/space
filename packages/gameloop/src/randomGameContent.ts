type ResourceKind = "metal" | "crystal" | "gas" | "liquid" | "biological";

type DilemmaPromptName =
	| "startingDilemmaFollowUp1"
	| "startingDilemmaFollowUp2"
	| undefined;

interface DilemmaChoiceTemplate {
	title: string;
	description: string;
	effectScript: string;
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
				effectScript:
					"+10% population growth in core colonies. -8% individual productivity from strict social obligations.",
			},
			{
				title: "Reciprocal Houses",
				description: "Mutual aid remained voluntary, enforced by honor.",
				effectScript:
					"+8% influence generation from civic trust. -6% crisis response speed due to negotiation delays.",
			},
			{
				title: "Iron Rationing",
				description: "Scarcity planning became a permanent institution.",
				effectScript:
					"+12% stability during shortages. -5% research output from conservative planning.",
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
				effectScript:
					"+10% administrative efficiency. -7% cultural output from restrained expression.",
			},
			{
				title: "Spark of Defiance",
				description: "Citizens were taught to resist emotional conformity.",
				effectScript:
					"+9% research creativity. -6% public order in newly settled systems.",
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
				effectScript:
					"+12% population cohesion. -5% response speed when rapid decisions are required.",
			},
			{
				title: "Hidden Choruses",
				description: "Real policy moved behind closed councils.",
				effectScript:
					"+10% strategic flexibility. -8% public trust after major setbacks.",
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
				effectScript:
					"Home system starts with fortified infrastructure. -10% diplomatic goodwill from authoritarian reputation.",
			},
			{
				title: "Civilian Restoration",
				description: "Powers were returned quickly to public institutions.",
				effectScript:
					"Home system starts with higher civilian prosperity. -8% military readiness in early conflicts.",
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
				effectScript:
					"Starts with robust research backups and +1 early technology option. -5% industry output due to heavy compliance overhead.",
			},
			{
				title: "Trusted Custodians",
				description: "A small technocratic order controlled validation.",
				effectScript:
					"Starts with advanced scientific governance. -10% faction harmony from elite gatekeeping.",
			},
			{
				title: "Open Reconstruction",
				description: "Rebuilding was crowd-sourced across the population.",
				effectScript:
					"Starts with rapid civic development momentum. -7% research reliability during high-pressure crises.",
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
				effectScript:
					"Start with extra defensive fleet tonnage and protected supply lines. -10% exploration speed in the opening phase.",
			},
			{
				title: "Spearhead Leap",
				description: "Speed and territorial reach were prioritized.",
				effectScript:
					"Start with additional scout and strike craft. -8% fleet durability for the first campaigns.",
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
				effectScript:
					"Start with prototype drive advantages and bonus rare resource stock. -12% political stability from coalition rivalries.",
			},
			{
				title: "Stand Alone",
				description: "You preserved unified command at the cost of speed.",
				effectScript:
					"Start with stronger command integrity and morale bonuses. -1 initial expansion opportunity from delayed launch windows.",
			},
			{
				title: "Controlled Exchange",
				description: "You accepted limited cooperation under strict review.",
				effectScript:
					"Start with balanced fleet upgrades and moderate diplomatic leverage. Slightly higher maintenance complexity for mixed doctrine assets.",
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
		},
		{
			name: "Kestral Alloy",
			description:
				"Dense metallic veins rich in conductive trace elements, prized for reactor housings.",
			baseWeight: 44,
		},
		{
			name: "Aurum Shale",
			description:
				"Brittle sediment containing recoverable noble metals for high-precision electronics.",
			baseWeight: 53,
		},
		{
			name: "Obdurite",
			description:
				"A dark superhard metal used in armor plates and industrial boring heads.",
			baseWeight: 35,
		},
	],
	crystal: [
		{
			name: "Lumen Quartz",
			description:
				"Photoreactive crystal clusters that amplify optical signaling and sensor arrays.",
			baseWeight: 56,
		},
		{
			name: "Phase Glass",
			description:
				"Metastable crystal sheets that bend radio waves and improve stealth composites.",
			baseWeight: 30,
		},
		{
			name: "Verdant Prism",
			description:
				"Green multifaceted crystals with unusually high energy retention under charge cycles.",
			baseWeight: 47,
		},
		{
			name: "Iridescent Spire",
			description:
				"Needle-like crystal formations used in precision resonance instruments.",
			baseWeight: 40,
		},
	],
	gas: [
		{
			name: "Heliox Vapor",
			description:
				"A light noble gas blend ideal for coolant channels and plasma ignition control.",
			baseWeight: 61,
		},
		{
			name: "Noctilume Mist",
			description:
				"A faintly luminescent atmospheric gas used in advanced spectrometry.",
			baseWeight: 36,
		},
		{
			name: "Sable Methane",
			description:
				"Heavy hydrocarbon gas pockets suitable for synthetic fuel refining.",
			baseWeight: 58,
		},
		{
			name: "Argent Fume",
			description:
				"An ion-rich noble gas haze with strong applications in arc propulsion tuning.",
			baseWeight: 33,
		},
	],
	liquid: [
		{
			name: "Cryowater",
			description:
				"Supercooled mineral water reservoirs used in life support and cryogenic industry.",
			baseWeight: 64,
		},
		{
			name: "Mercuric Brine",
			description:
				"Salty metallic fluid extracted for catalysts and specialized electrochemistry.",
			baseWeight: 39,
		},
		{
			name: "Velvet Oil",
			description:
				"Dense organic fluid refined into polymers for seals, coatings, and insulation.",
			baseWeight: 54,
		},
		{
			name: "Azure Solvent",
			description:
				"Reactive liquid medium used to dissolve and separate rare industrial compounds.",
			baseWeight: 46,
		},
	],
	biological: [
		{
			name: "Mycofiber",
			description:
				"Engineered fungal strands cultivated into lightweight structural composites.",
			baseWeight: 50,
		},
		{
			name: "Bloom Resin",
			description:
				"Plant-derived polymer resin with remarkable adhesive and self-sealing behavior.",
			baseWeight: 55,
		},
		{
			name: "Coral Enzyme",
			description:
				"Bioactive enzyme complexes harvested for medical and terraforming support processes.",
			baseWeight: 34,
		},
		{
			name: "Spore Silk",
			description:
				"Protein-rich filament secreted by colony organisms, woven into adaptive textiles.",
			baseWeight: 43,
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

function resolveDilemmaPool(promptName: DilemmaPromptName) {
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
				effectScript: choice.effectScript,
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
			}));
		})
		.sort(() => Math.random() - 0.5);

	return { resources };
}
