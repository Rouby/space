import {
	fieldworkThreshold,
	type ResearchCategory,
	type ResearchMethodology,
	synthesisThreshold,
} from "./research.ts";

export type ResearchMiniGameType =
	| "evidence_triangulation"
	| "breakthrough_incident";

export type ResearchMiniGameRiskTag = "safe" | "balanced" | "risky";

export type ResearchMiniGameCard = {
	id: string;
	label: string;
	relevance: number;
	tag: "support" | "conflict" | "control" | "neutral";
};

export type ResearchMiniGameIncidentStep = {
	step: number;
	title: string;
	safeSuccessChance: number;
	riskySuccessChance: number;
};

export type ResearchMiniGamePrompt = {
	miniGameType: ResearchMiniGameType;
	targetCategory: ResearchCategory;
	promptSeed: number;
	promptTitle: string;
	promptDescription: string;
	triangulationCards: ResearchMiniGameCard[];
	incidentSteps: ResearchMiniGameIncidentStep[];
};

export type ResearchMiniGameResearchState = {
	category: ResearchCategory;
	phase: "hypothesis" | "fieldwork" | "synthesis";
	recentEvidence: number;
	synthesisProgress: number;
	breakthroughCount: number;
	consecutivePrimary: number;
};

export type EvaluateTriangulationInput = {
	prompt: ResearchMiniGamePrompt;
	supportCardId: string;
	conflictCardId: string;
	controlCardId: string;
	methodology: ResearchMethodology;
};

export type EvaluateIncidentInput = {
	prompt: ResearchMiniGamePrompt;
	stepOneRisky: boolean;
	stepTwoRisky: boolean;
	stepThreeRisky: boolean;
	methodology: ResearchMethodology;
};

export type ResearchMiniGameEvaluation = {
	qualityScore: number;
	confidenceScore: number;
	riskTag: ResearchMiniGameRiskTag;
	bonus: number;
	actionSummary: Record<string, unknown>;
};

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function hashSeed(input: string) {
	let hash = 2166136261;
	for (let i = 0; i < input.length; i += 1) {
		hash ^= input.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return Math.abs(hash) % 2147483647;
}

function createRng(seed: number) {
	let current = seed || 1;
	return () => {
		current = (current * 48271) % 2147483647;
		return current / 2147483647;
	};
}

function methodologyBonus(methodology: ResearchMethodology) {
	switch (methodology) {
		case "bold":
			return 0.4;
		case "opportunistic":
			return 0.2;
		default:
			return 0;
	}
}

function toMappedScore(unitScore: number) {
	return clamp(unitScore * 2 - 1, -1, 1);
}

function buildTriangulationCards(
	targetCategory: ResearchCategory,
	seed: number,
): ResearchMiniGameCard[] {
	const rng = createRng(seed);
	const basePool: Record<ResearchCategory, ResearchMiniGameCard[]> = {
		military: [
			{
				id: "engagement_win_rate",
				label: "Engagement win-rate spike",
				relevance: 0.95,
				tag: "support",
			},
			{
				id: "hull_loss_anomaly",
				label: "Unexpected hull loss anomaly",
				relevance: 0.72,
				tag: "conflict",
			},
			{
				id: "training_sim_baseline",
				label: "Training simulation baseline",
				relevance: 0.66,
				tag: "control",
			},
			{
				id: "fleet_signal_noise",
				label: "Fleet telemetry signal noise",
				relevance: 0.52,
				tag: "neutral",
			},
		],
		industry: [
			{
				id: "project_completion_peak",
				label: "Industrial completion peak",
				relevance: 0.95,
				tag: "support",
			},
			{
				id: "throughput_variance",
				label: "Throughput variance warning",
				relevance: 0.72,
				tag: "conflict",
			},
			{
				id: "baseline_foundry_control",
				label: "Foundry baseline control sample",
				relevance: 0.66,
				tag: "control",
			},
			{
				id: "shipping_delay_noise",
				label: "Interstellar shipping noise",
				relevance: 0.52,
				tag: "neutral",
			},
		],
		expansion: [
			{
				id: "colonization_pressure_surge",
				label: "Colonization pressure surge",
				relevance: 0.95,
				tag: "support",
			},
			{
				id: "migration_reversal",
				label: "Migration reversal signal",
				relevance: 0.72,
				tag: "conflict",
			},
			{
				id: "route_stability_control",
				label: "Route stability control route",
				relevance: 0.66,
				tag: "control",
			},
			{
				id: "weather_drift_noise",
				label: "Deep-space weather drift",
				relevance: 0.52,
				tag: "neutral",
			},
		],
		discovery: [
			{
				id: "resource_discovery_chain",
				label: "Resource discovery chain",
				relevance: 0.95,
				tag: "support",
			},
			{
				id: "false_positive_cluster",
				label: "False positive scan cluster",
				relevance: 0.72,
				tag: "conflict",
			},
			{
				id: "sensor_calibration_control",
				label: "Sensor calibration control",
				relevance: 0.66,
				tag: "control",
			},
			{
				id: "nebula_static_noise",
				label: "Nebula static interference",
				relevance: 0.52,
				tag: "neutral",
			},
		],
	};

	const sharedPool: ResearchMiniGameCard[] = [
		{
			id: "cross_discipline_lab_notes",
			label: "Cross-discipline lab notes",
			relevance: 0.61,
			tag: "neutral",
		},
		{
			id: "control_group_outlier",
			label: "Control group outlier",
			relevance: 0.58,
			tag: "conflict",
		},
		{
			id: "replication_suite",
			label: "Replication suite",
			relevance: 0.7,
			tag: "control",
		},
		{
			id: "archival_benchmark",
			label: "Archival benchmark",
			relevance: 0.64,
			tag: "support",
		},
	];

	const pool = [...(basePool[targetCategory] ?? []), ...sharedPool];
	const shuffled = [...pool].sort(() => rng() - 0.5);
	return shuffled.slice(0, 5);
}

function buildIncidentSteps(seed: number): ResearchMiniGameIncidentStep[] {
	const rng = createRng(seed + 97);
	const titles = [
		"Contain unstable prototype",
		"Re-route calibration under pressure",
		"Finalize publication before cascade",
	];

	return titles.map((title, index) => ({
		step: index + 1,
		title,
		safeSuccessChance: 0.86,
		riskySuccessChance: clamp(0.52 + rng() * 0.18, 0.5, 0.7),
	}));
}

export function buildResearchMiniGamePrompt({
	turnNumber,
	playerId,
	primaryCategory,
	methodology,
	researchStates,
}: {
	turnNumber: number;
	playerId: string;
	primaryCategory: ResearchCategory;
	methodology: ResearchMethodology;
	researchStates: ResearchMiniGameResearchState[];
}): ResearchMiniGamePrompt | null {
	const evidenceCandidates = researchStates
		.filter((state) => state.phase === "fieldwork")
		.map((state) => {
			const deficit = Math.max(
				0,
				fieldworkThreshold(state.breakthroughCount) - state.recentEvidence,
			);
			return { state, deficit };
		})
		.sort((a, b) => b.deficit - a.deficit);

	const incidentCandidate = researchStates.find((state) => {
		const threshold = synthesisThreshold(state.breakthroughCount);
		const ratio = threshold > 0 ? state.synthesisProgress / threshold : 0;
		return ratio >= 0.8;
	});

	const hasIncidentPrompt = Boolean(incidentCandidate);
	const hasEvidencePrompt = evidenceCandidates.length > 0;

	// Keep mini-games impactful by not showing them every turn.
	const allowEvidenceThisTurn = turnNumber % 2 === 0;
	if (!hasIncidentPrompt && (!hasEvidencePrompt || !allowEvidenceThisTurn)) {
		return null;
	}

	const chosenState = incidentCandidate ?? evidenceCandidates[0]?.state;
	const targetCategory = chosenState?.category ?? primaryCategory;
	const miniGameType: ResearchMiniGameType = incidentCandidate
		? "breakthrough_incident"
		: "evidence_triangulation";

	const promptSeed = hashSeed(
		`${playerId}:${turnNumber}:${targetCategory}:${miniGameType}:${methodology}`,
	);

	return {
		miniGameType,
		targetCategory,
		promptSeed,
		promptTitle:
			miniGameType === "breakthrough_incident"
				? "Breakthrough Incident"
				: "Evidence Triangulation",
		promptDescription:
			miniGameType === "breakthrough_incident"
				? "Resolve a three-step incident chain. Riskier options can spike gains but may backfire."
				: "Select support, conflict, and control evidence to strengthen this turn's research confidence.",
		triangulationCards: buildTriangulationCards(targetCategory, promptSeed),
		incidentSteps: buildIncidentSteps(promptSeed),
	};
}

function computeBonus({
	qualityScore,
	confidenceScore,
	methodology,
	riskySucceeded,
	riskyFailed,
}: {
	qualityScore: number;
	confidenceScore: number;
	methodology: ResearchMethodology;
	riskySucceeded: boolean;
	riskyFailed: boolean;
}) {
	const riskPressure = riskyFailed ? -0.8 : riskySucceeded ? 0.8 : 0;
	const raw =
		2.5 * qualityScore +
		1.5 * confidenceScore +
		methodologyBonus(methodology) +
		riskPressure;
	return clamp(raw, -2, 4);
}

export function evaluateEvidenceTriangulation({
	prompt,
	supportCardId,
	conflictCardId,
	controlCardId,
	methodology,
}: EvaluateTriangulationInput): ResearchMiniGameEvaluation {
	const supportCard = prompt.triangulationCards.find(
		(card) => card.id === supportCardId,
	);
	const conflictCard = prompt.triangulationCards.find(
		(card) => card.id === conflictCardId,
	);
	const controlCard = prompt.triangulationCards.find(
		(card) => card.id === controlCardId,
	);

	if (!supportCard || !conflictCard || !controlCard) {
		throw new Error("Invalid triangulation card selection");
	}

	if (
		supportCard.id === conflictCard.id ||
		supportCard.id === controlCard.id ||
		conflictCard.id === controlCard.id
	) {
		throw new Error("Triangulation cards must be unique");
	}

	const relevance = clamp(
		(supportCard.relevance + conflictCard.relevance + controlCard.relevance) /
			3,
		0,
		1,
	);
	const consistencyHits =
		(supportCard.tag === "support" ? 1 : 0) +
		(conflictCard.tag === "conflict" ? 1 : 0) +
		(controlCard.tag === "control" ? 1 : 0);
	const consistency = clamp(consistencyHits / 3, 0, 1);
	const contradictionHits =
		(supportCard.tag === "conflict" ? 1 : 0) +
		(conflictCard.tag === "support" ? 1 : 0) +
		(controlCard.tag === "conflict" ? 1 : 0);
	const contradiction = clamp(contradictionHits / 3, 0, 1);

	const unitQuality = clamp(
		0.55 * relevance + 0.3 * consistency - 0.25 * contradiction,
		0,
		1,
	);
	const qualityScore = toMappedScore(unitQuality);
	const confidenceScore = clamp(0.4 + 0.6 * consistency, 0, 1);
	const riskTag: ResearchMiniGameRiskTag = "balanced";
	const bonus = computeBonus({
		qualityScore,
		confidenceScore,
		methodology,
		riskySucceeded: false,
		riskyFailed: false,
	});

	return {
		qualityScore,
		confidenceScore,
		riskTag,
		bonus,
		actionSummary: {
			type: "evidence_triangulation",
			supportCardId,
			conflictCardId,
			controlCardId,
			relevance,
			consistency,
			contradiction,
		},
	};
}

export function evaluateBreakthroughIncident({
	prompt,
	stepOneRisky,
	stepTwoRisky,
	stepThreeRisky,
	methodology,
}: EvaluateIncidentInput): ResearchMiniGameEvaluation {
	const selections = [stepOneRisky, stepTwoRisky, stepThreeRisky];
	const rng = createRng(prompt.promptSeed + 313);

	let successSteps = 0;
	let failedSteps = 0;
	let safeSteps = 0;
	let riskySuccessSteps = 0;
	let riskyFailureSteps = 0;

	const stepResults = prompt.incidentSteps.map((step, index) => {
		const risky = selections[index] ?? false;
		const chance = risky ? step.riskySuccessChance : step.safeSuccessChance;
		const success = rng() <= chance;
		if (success) {
			successSteps += 1;
		} else {
			failedSteps += 1;
		}

		if (risky) {
			if (success) {
				riskySuccessSteps += 1;
			} else {
				riskyFailureSteps += 1;
			}
		} else {
			safeSteps += 1;
		}

		return {
			step: step.step,
			title: step.title,
			risky,
			chance,
			success,
		};
	});

	const qualityScore = clamp((successSteps - failedSteps) / 3, -1, 1);
	const confidenceScore = clamp(
		(safeSteps + 0.5 * riskySuccessSteps) / 3,
		0,
		1,
	);
	const riskTag: ResearchMiniGameRiskTag =
		selections.filter(Boolean).length >= 2
			? "risky"
			: selections.some(Boolean)
				? "balanced"
				: "safe";
	const bonus = computeBonus({
		qualityScore,
		confidenceScore,
		methodology,
		riskySucceeded: riskySuccessSteps > 0 && riskyFailureSteps === 0,
		riskyFailed: riskyFailureSteps > 0,
	});

	return {
		qualityScore,
		confidenceScore,
		riskTag,
		bonus,
		actionSummary: {
			type: "breakthrough_incident",
			stepResults,
			successSteps,
			failedSteps,
			safeSteps,
			riskySuccessSteps,
			riskyFailureSteps,
		},
	};
}
