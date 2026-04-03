import {
	IconAtom2,
	IconCompass,
	IconHammer,
	IconShieldHalfFilled,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import type { ResearchFocusPanelQuery } from "../../gql/graphql";
import { ResearchCategory, ResearchMethodology } from "../../gql/graphql";

export const researchCategoryOptions = [
	{ value: ResearchCategory.Industry, label: "Industry" },
	{ value: ResearchCategory.Discovery, label: "Discovery" },
	{ value: ResearchCategory.Military, label: "Military" },
	{ value: ResearchCategory.Expansion, label: "Expansion" },
];

export const researchMethodologyOptions = [
	{ value: ResearchMethodology.Opportunistic, label: "Opportunistic" },
	{ value: ResearchMethodology.Stable, label: "Stable" },
	{ value: ResearchMethodology.Bold, label: "Bold" },
];

export const categoryMeta: Record<
	ResearchCategory,
	{ label: string; color: string; icon: ComponentType<{ size?: number }> }
> = {
	[ResearchCategory.Industry]: {
		label: "Industry",
		color: "orange",
		icon: IconHammer,
	},
	[ResearchCategory.Discovery]: {
		label: "Discovery",
		color: "cyan",
		icon: IconAtom2,
	},
	[ResearchCategory.Military]: {
		label: "Military",
		color: "red",
		icon: IconShieldHalfFilled,
	},
	[ResearchCategory.Expansion]: {
		label: "Expansion",
		color: "lime",
		icon: IconCompass,
	},
};

export const phaseMeta = {
	hypothesis: { label: "Hypothesis", color: "gray", progress: 28 },
	fieldwork: { label: "Fieldwork", color: "blue", progress: 62 },
	synthesis: { label: "Synthesis", color: "violet", progress: 100 },
} as const;

export const metricHelp = {
	momentumFlow:
		"Momentum flow shows how strongly this category is compounding progress versus your other categories.",
	evidenceSignal:
		"Evidence signal reflects how much recent proof your empire generated for this category this turn window.",
	breakthroughMaturity:
		"Breakthrough maturity tracks how established this discipline is based on completed breakthroughs.",
} as const;

export type ResearchPanelPlayer = NonNullable<
	ResearchFocusPanelQuery["game"]["me"]
>;
export type ResearchMiniGamePromptData = NonNullable<
	ResearchPanelPlayer["researchMiniGamePrompt"]
>;
export type ResearchStateData = ResearchPanelPlayer["researchStates"][number];
export type ResearchOutcomeData =
	ResearchPanelPlayer["researchOutcomes"][number];

export function toPercent(value: number, maxValue: number) {
	return Math.min(
		100,
		Math.round((Math.max(value, 0) / Math.max(maxValue, 1)) * 100),
	);
}

export function breakthroughLabel(breakthroughCount: number) {
	if (breakthroughCount <= 0) {
		return "No breakthroughs yet";
	}

	if (breakthroughCount < 3) {
		return "Early momentum";
	}

	if (breakthroughCount < 6) {
		return "Established discipline";
	}

	return "Leading edge";
}

export function titleCaseKey(key: string) {
	return key
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

export function signedPercent(value: number) {
	const percent = Math.round(value * 1000) / 10;
	const sign = percent > 0 ? "+" : "";
	return `${sign}${percent}%`;
}

export function evidenceSignalBand(percent: number) {
	if (percent >= 75) {
		return { label: "Strong signal", color: "teal" as const };
	}

	if (percent >= 45) {
		return { label: "Developing signal", color: "blue" as const };
	}

	return { label: "Weak signal", color: "yellow" as const };
}

export function buildEvidenceInfluences({
	category,
	primaryCategory,
	secondaryCategory,
	methodology,
	phase,
	momentumPercent,
	breakthroughCount,
}: {
	category: ResearchCategory;
	primaryCategory: ResearchCategory;
	secondaryCategory: ResearchCategory;
	methodology: ResearchMethodology;
	phase: keyof typeof phaseMeta;
	momentumPercent: number;
	breakthroughCount: number;
}) {
	const focusWeight =
		category === primaryCategory
			? "High"
			: category === secondaryCategory
				? "Medium"
				: "Low";

	const methodologyFit =
		methodology === ResearchMethodology.Bold
			? phase === "fieldwork" || phase === "synthesis"
				? "High"
				: "Medium"
			: methodology === ResearchMethodology.Stable
				? "Medium"
				: phase === "hypothesis"
					? "High"
					: "Medium";

	const phaseSignal =
		phase === "synthesis" ? "High" : phase === "fieldwork" ? "Medium" : "Low";

	const momentumCarry =
		momentumPercent >= 70 ? "High" : momentumPercent >= 40 ? "Medium" : "Low";

	const breakthroughFlywheel =
		breakthroughCount >= 4 ? "High" : breakthroughCount >= 2 ? "Medium" : "Low";

	return [
		{
			title: "Focus allocation",
			influence: focusWeight,
			hint:
				focusWeight === "High"
					? "Keep this category as primary to sustain evidence gains."
					: focusWeight === "Medium"
						? "Promote this category to primary when a breakthrough is close."
						: "Set this category as primary or secondary for at least a few turns.",
		},
		{
			title: "Methodology fit",
			influence: methodologyFit,
			hint:
				methodology === ResearchMethodology.Bold
					? "Use Bold during fieldwork and synthesis to spike stronger evidence."
					: methodology === ResearchMethodology.Stable
						? "Stable smooths outcomes; swap to Bold to push faster signals."
						: "Opportunistic shines early; switch once the category reaches fieldwork.",
		},
		{
			title: "Current phase",
			influence: phaseSignal,
			hint:
				phase === "hypothesis"
					? "Advance to fieldwork to unlock more reliable evidence gains."
					: phase === "fieldwork"
						? "Sustain support until synthesis for the strongest signal."
						: "Stay in synthesis and avoid switching focus before a payoff turn.",
		},
		{
			title: "Momentum carryover",
			influence: momentumCarry,
			hint:
				momentumCarry === "High"
					? "Momentum is already compounding. Avoid abrupt category swaps."
					: momentumCarry === "Medium"
						? "A few uninterrupted turns will push this into high momentum."
						: "Prioritize this category as primary to build baseline momentum.",
		},
		{
			title: "Breakthrough flywheel",
			influence: breakthroughFlywheel,
			hint:
				breakthroughFlywheel === "High"
					? "Breakthrough chain is active. Keep pressure for compounding benefits."
					: breakthroughFlywheel === "Medium"
						? "One more breakthrough will noticeably improve signal reliability."
						: "Build toward early breakthroughs by sustaining category focus.",
		},
	];
}
