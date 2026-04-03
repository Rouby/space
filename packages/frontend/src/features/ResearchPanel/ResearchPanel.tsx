import {
	Alert,
	Badge,
	Button,
	Card,
	Chip,
	Group,
	List,
	Progress,
	Rating,
	SegmentedControl,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
	Tooltip,
	UnstyledButton,
} from "@mantine/core";
import {
	IconAtom2,
	IconCheck,
	IconCompass,
	IconHammer,
	IconInfoCircle,
	IconShieldHalfFilled,
	IconSparkles,
	IconStars,
} from "@tabler/icons-react";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import { DetailsModal } from "../../components/DetailsModal/DetailsModal";
import { graphql } from "../../gql";
import { ResearchCategory, ResearchMethodology } from "../../gql/graphql";

const researchCategoryOptions = [
	{ value: ResearchCategory.Industry, label: "Industry" },
	{ value: ResearchCategory.Discovery, label: "Discovery" },
	{ value: ResearchCategory.Military, label: "Military" },
	{ value: ResearchCategory.Expansion, label: "Expansion" },
];

const researchMethodologyOptions = [
	{ value: ResearchMethodology.Opportunistic, label: "Opportunistic" },
	{ value: ResearchMethodology.Stable, label: "Stable" },
	{ value: ResearchMethodology.Bold, label: "Bold" },
];

const categoryMeta: Record<
	ResearchCategory,
	{ label: string; color: string; icon: React.ComponentType<{ size?: number }> }
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

const phaseMeta = {
	hypothesis: { label: "Hypothesis", color: "gray", progress: 28 },
	fieldwork: { label: "Fieldwork", color: "blue", progress: 62 },
	synthesis: { label: "Synthesis", color: "violet", progress: 100 },
} as const;

const metricHelp = {
	momentumFlow:
		"Momentum flow shows how strongly this category is compounding progress versus your other categories.",
	evidenceSignal:
		"Evidence signal reflects how much recent proof your empire generated for this category this turn window.",
	breakthroughMaturity:
		"Breakthrough maturity tracks how established this discipline is based on completed breakthroughs.",
} as const;

function toPercent(value: number, maxValue: number) {
	return Math.min(
		100,
		Math.round((Math.max(value, 0) / Math.max(maxValue, 1)) * 100),
	);
}

function breakthroughLabel(breakthroughCount: number) {
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

function titleCaseKey(key: string) {
	return key
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function signedPercent(value: number) {
	const percent = Math.round(value * 1000) / 10;
	const sign = percent > 0 ? "+" : "";
	return `${sign}${percent}%`;
}

function evidenceSignalBand(percent: number) {
	if (percent >= 75) {
		return { label: "Strong signal", color: "teal" as const };
	}

	if (percent >= 45) {
		return { label: "Developing signal", color: "blue" as const };
	}

	return { label: "Weak signal", color: "yellow" as const };
}

function buildEvidenceInfluences({
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

export function ResearchPanel() {
	const { id: gameId } = useParams({ from: "/games/_authenticated/$id" });
	const [primaryCategory, setPrimaryCategory] = useState<ResearchCategory>(
		ResearchCategory.Industry,
	);
	const [secondaryCategory, setSecondaryCategory] = useState<ResearchCategory>(
		ResearchCategory.Discovery,
	);
	const [methodology, setMethodology] = useState<ResearchMethodology>(
		ResearchMethodology.Opportunistic,
	);
	const [hasUserEditedFocus, setHasUserEditedFocus] = useState(false);
	const [selectedEvidenceCategory, setSelectedEvidenceCategory] =
		useState<ResearchCategory | null>(null);

	const [{ data, fetching }, reexecuteResearchQuery] = useQuery({
		query: graphql(`
			query ResearchFocusPanel($gameId: ID!) {
				game(id: $gameId) {
					id
					turnNumber
					me {
						id
						currentResearchDirective {
							turnNumber
							primaryCategory
							secondaryCategory
							methodology
						}
						researchStates {
							category
							phase
							cumulativeMomentum
							recentEvidence
							breakthroughCount
							pendingOutcomeChoices {
								outcomeKey
								displayName
								outcomeMode
								stat
								modifier
							}
						}
						researchOutcomes(limit: 20) {
							id
							category
							turnNumber
							outcomeKey
							outcomeMode
							stat
							modifier
						}
					}
				}
			}
		`),
		variables: { gameId },
	});

	const [setFocusResult, setResearchFocus] = useMutation(
		graphql(`
			mutation SetResearchFocus(
				$gameId: ID!
				$primaryCategory: ResearchCategory!
				$secondaryCategory: ResearchCategory!
				$methodology: ResearchMethodology!
			) {
				setResearchFocus(
					gameId: $gameId
					primaryCategory: $primaryCategory
					secondaryCategory: $secondaryCategory
					methodology: $methodology
				) {
					id
					currentResearchDirective {
						turnNumber
						primaryCategory
						secondaryCategory
						methodology
					}
				}
			}
		`),
	);

	const [chooseOutcomeResult, chooseResearchOutcome] = useMutation(
		graphql(`
			mutation ChooseResearchOutcome(
				$gameId: ID!
				$category: ResearchCategory!
				$outcomeKey: String!
				$outcomeMode: String!
			) {
				chooseResearchOutcome(
					gameId: $gameId
					category: $category
					outcomeKey: $outcomeKey
					outcomeMode: $outcomeMode
				) {
					id
					researchStates {
						category
						phase
						synthesisProgress
						breakthroughCount
					}
					researchOutcomes(limit: 20) {
						id
						category
						turnNumber
						outcomeKey
						outcomeMode
						stat
						modifier
					}
				}
			}
		`),
	);

	useEffect(() => {
		const directive = data?.game.me?.currentResearchDirective;
		if (!directive) {
			return;
		}

		setPrimaryCategory(directive.primaryCategory);
		setSecondaryCategory(directive.secondaryCategory);
		setMethodology(directive.methodology);
	}, [data?.game.me?.currentResearchDirective]);

	const hasInvalidSelection = primaryCategory === secondaryCategory;

	useEffect(() => {
		if (!hasUserEditedFocus || hasInvalidSelection) {
			return;
		}

		const directive = data?.game.me?.currentResearchDirective;
		const hasSameValuesAsServer =
			directive != null &&
			directive.primaryCategory === primaryCategory &&
			directive.secondaryCategory === secondaryCategory &&
			directive.methodology === methodology;

		if (hasSameValuesAsServer) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			void setResearchFocus({
				gameId,
				primaryCategory,
				secondaryCategory,
				methodology,
			});
		}, 250);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [
		data?.game.me?.currentResearchDirective,
		gameId,
		hasInvalidSelection,
		hasUserEditedFocus,
		methodology,
		primaryCategory,
		secondaryCategory,
		setResearchFocus,
	]);

	const researchStates = data?.game.me?.researchStates ?? [];
	const researchOutcomes = data?.game.me?.researchOutcomes ?? [];
	const selectedEvidenceState = researchStates.find(
		(state) => state.category === selectedEvidenceCategory,
	);
	const maxMomentum = Math.max(
		1,
		...researchStates.map((state) => Number(state.cumulativeMomentum)),
	);
	const maxEvidence = Math.max(
		1,
		...researchStates.map((state) => Number(state.recentEvidence)),
	);

	return (
		<>
			<Stack gap="md">
				<div>
					<Title order={3}>Research</Title>
					<Text size="sm" c="dimmed">
						Set your strategic direction and monitor category health at a
						glance.
					</Text>
				</div>

				<Card withBorder>
					<Stack gap="md">
						<Stack gap="xs">
							<Text size="sm" fw={600}>
								Primary Category
							</Text>
							<Chip.Group
								value={primaryCategory}
								onChange={(value) => {
									setHasUserEditedFocus(true);
									setPrimaryCategory(
										(value as ResearchCategory) ?? ResearchCategory.Industry,
									);
								}}
							>
								<Group gap="xs">
									{researchCategoryOptions.map((option) => {
										const meta = categoryMeta[option.value];
										const Icon = meta.icon;
										return (
											<Chip
												key={`primary-${option.value}`}
												value={option.value}
												disabled={option.value === secondaryCategory}
												color={meta.color}
											>
												<Group gap={6} wrap="nowrap">
													<Icon size={14} />
													<span>{option.label}</span>
												</Group>
											</Chip>
										);
									})}
								</Group>
							</Chip.Group>
						</Stack>

						<Stack gap="xs">
							<Text size="sm" fw={600}>
								Secondary Category
							</Text>
							<Chip.Group
								value={secondaryCategory}
								onChange={(value) => {
									setHasUserEditedFocus(true);
									setSecondaryCategory(
										(value as ResearchCategory) ?? ResearchCategory.Discovery,
									);
								}}
							>
								<Group gap="xs">
									{researchCategoryOptions.map((option) => {
										const meta = categoryMeta[option.value];
										const Icon = meta.icon;
										return (
											<Chip
												key={`secondary-${option.value}`}
												value={option.value}
												disabled={option.value === primaryCategory}
												color={meta.color}
											>
												<Group gap={6} wrap="nowrap">
													<Icon size={14} />
													<span>{option.label}</span>
												</Group>
											</Chip>
										);
									})}
								</Group>
							</Chip.Group>
						</Stack>

						<Stack gap="xs">
							<Text size="sm" fw={600}>
								Methodology
							</Text>
							<SegmentedControl
								fullWidth
								value={methodology}
								onChange={(value) => {
									setHasUserEditedFocus(true);
									setMethodology(
										(value as ResearchMethodology) ??
											ResearchMethodology.Opportunistic,
									);
								}}
								data={researchMethodologyOptions.map((option) => ({
									value: option.value,
									label: option.label,
								}))}
							/>
						</Stack>

						{hasInvalidSelection ? (
							<Alert color="yellow" title="Focus conflict">
								Primary and secondary categories must be different.
							</Alert>
						) : null}

						{setFocusResult.error ? (
							<Alert color="red" title="Could not save research focus">
								{setFocusResult.error.message}
							</Alert>
						) : null}

						{!hasInvalidSelection && hasUserEditedFocus ? (
							<Group gap="xs">
								{setFocusResult.fetching ? (
									<Text size="sm" c="dimmed">
										Saving focus...
									</Text>
								) : (
									<>
										<ThemeIcon size="sm" variant="light" color="teal">
											<IconCheck size={12} />
										</ThemeIcon>
										<Text size="sm" c="dimmed">
											Focus saves automatically
										</Text>
									</>
								)}
							</Group>
						) : null}
					</Stack>
				</Card>

				<Card withBorder>
					<Stack gap="sm">
						<Group justify="space-between">
							<Text fw={600}>Current Category States</Text>
							<Text size="sm" c="dimmed">
								Turn {data?.game.turnNumber ?? "-"}
							</Text>
						</Group>

						{fetching ? (
							<Text size="sm" c="dimmed">
								Loading research state...
							</Text>
						) : null}

						{researchStates.length ? (
							<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
								{researchStates.map((state) => {
									const meta = categoryMeta[state.category];
									const Icon = meta.icon;
									const phase = phaseMeta[state.phase];
									const momentumPercent = toPercent(
										Number(state.cumulativeMomentum),
										maxMomentum,
									);
									const evidencePercent = toPercent(
										Number(state.recentEvidence),
										maxEvidence,
									);
									const breakthroughs = Math.min(
										5,
										Math.max(0, state.breakthroughCount),
									);
									const evidenceBand = evidenceSignalBand(evidencePercent);
									const pendingChoices = state.pendingOutcomeChoices ?? [];

									return (
										<Card key={state.category} withBorder radius="md" p="md">
											<Stack gap="sm">
												<Group justify="space-between" align="flex-start">
													<Group gap="xs">
														<ThemeIcon
															color={meta.color}
															variant="light"
															size="lg"
														>
															<Icon size={16} />
														</ThemeIcon>
														<div>
															<Text fw={600}>{meta.label}</Text>
															<Group gap={6}>
																{state.category === primaryCategory ? (
																	<Badge size="xs" color="blue" variant="light">
																		Primary
																	</Badge>
																) : null}
																{state.category === secondaryCategory ? (
																	<Badge
																		size="xs"
																		color="grape"
																		variant="light"
																	>
																		Secondary
																	</Badge>
																) : null}
															</Group>
														</div>
													</Group>
													<Badge color={phase.color} variant="dot">
														{phase.label}
													</Badge>
												</Group>

												<Progress
													value={phase.progress}
													color={phase.color}
													radius="xl"
													size="sm"
												/>

												<Stack gap={8}>
													<div>
														<Group justify="space-between">
															<Text size="xs" c="dimmed">
																Momentum flow
															</Text>
															<Tooltip
																label={metricHelp.momentumFlow}
																multiline
																w={260}
															>
																<IconInfoCircle size={14} />
															</Tooltip>
														</Group>
														<Progress
															value={momentumPercent}
															color={meta.color}
															radius="xl"
															size="lg"
														/>
													</div>

													<UnstyledButton
														onClick={() =>
															setSelectedEvidenceCategory(state.category)
														}
														style={{
															display: "block",
															width: "100%",
															textAlign: "left",
															borderRadius: 8,
															padding: 6,
														}}
													>
														<Group justify="space-between" align="center">
															<Text size="xs" c="dimmed">
																Evidence signal
															</Text>
															<Group gap={6}>
																<Badge
																	size="xs"
																	color={evidenceBand.color}
																	variant="light"
																>
																	{evidenceBand.label}
																</Badge>
																<Tooltip
																	label={metricHelp.evidenceSignal}
																	multiline
																	w={260}
																>
																	<IconStars size={14} />
																</Tooltip>
															</Group>
														</Group>
														<Progress
															value={evidencePercent}
															color="teal"
															radius="xl"
															size="lg"
														/>
														<Text size="xs" c="dimmed" mt={4}>
															Tap for signal influences and improvement hints
														</Text>
													</UnstyledButton>
												</Stack>

												<div>
													<Group justify="space-between" mb={4}>
														<Text size="xs" c="dimmed">
															Breakthrough maturity
														</Text>
														<Tooltip
															label={metricHelp.breakthroughMaturity}
															multiline
															w={260}
														>
															<IconInfoCircle size={14} />
														</Tooltip>
													</Group>
													<Rating value={breakthroughs} count={5} readOnly />
													<Text size="xs" c="dimmed" mt={4}>
														{breakthroughLabel(state.breakthroughCount)}
													</Text>
												</div>
											</Stack>

											{pendingChoices.length > 0 ? (
												<Card withBorder p="sm" radius="md">
													<Stack gap="xs">
														<Group justify="space-between">
															<Text fw={600} size="sm">
																Synthesis complete: choose outcome
															</Text>
															<Badge color="violet" variant="light" size="xs">
																Action required
															</Badge>
														</Group>
														{pendingChoices.map((choice) => (
															<Button
																key={`${state.category}-${choice.outcomeKey}-${choice.outcomeMode}`}
																variant="light"
																size="xs"
																onClick={async () => {
																	await chooseResearchOutcome({
																		gameId,
																		category: state.category,
																		outcomeKey: choice.outcomeKey,
																		outcomeMode: choice.outcomeMode,
																	});
																	await reexecuteResearchQuery({
																		requestPolicy: "network-only",
																	});
																}}
																loading={chooseOutcomeResult.fetching}
															>
																{choice.displayName} •{" "}
																{titleCaseKey(choice.outcomeMode)} •{" "}
																{signedPercent(Number(choice.modifier))}
															</Button>
														))}
													</Stack>
												</Card>
											) : null}
										</Card>
									);
								})}
							</SimpleGrid>
						) : (
							<Alert icon={<IconInfoCircle size={16} />} color="blue">
								No research state yet for this empire.
							</Alert>
						)}
					</Stack>
				</Card>

				<Card withBorder>
					<Stack gap="sm">
						<Group justify="space-between" align="center">
							<Text fw={600}>Completed Research Outcomes</Text>
							<Badge variant="light">{researchOutcomes.length}</Badge>
						</Group>

						{chooseOutcomeResult.error ? (
							<Alert color="red" title="Could not choose research outcome">
								{chooseOutcomeResult.error.message}
							</Alert>
						) : null}

						{researchOutcomes.length > 0 ? (
							<Stack gap="xs">
								{researchOutcomes.map((outcome) => {
									const meta = categoryMeta[outcome.category];
									return (
										<Card key={outcome.id} withBorder radius="md" p="sm">
											<Stack gap={6}>
												<Group justify="space-between" align="center">
													<Group gap="xs">
														<Badge color={meta.color} variant="light" size="xs">
															{meta.label}
														</Badge>
														<Text fw={600}>
															{titleCaseKey(outcome.outcomeKey)}
														</Text>
													</Group>
													<Text size="xs" c="dimmed">
														Turn {outcome.turnNumber}
													</Text>
												</Group>

												<Text size="sm" c="dimmed">
													Mode {titleCaseKey(outcome.outcomeMode)} • Stat{" "}
													{titleCaseKey(outcome.stat)} • Modifier{" "}
													{signedPercent(Number(outcome.modifier))}
												</Text>
											</Stack>
										</Card>
									);
								})}
							</Stack>
						) : (
							<Text size="sm" c="dimmed">
								No breakthroughs completed yet. Keep categories in synthesis to
								start unlocking outcomes.
							</Text>
						)}
					</Stack>
				</Card>
			</Stack>

			{selectedEvidenceState ? (
				<DetailsModal
					onClose={() => setSelectedEvidenceCategory(null)}
					title={`${categoryMeta[selectedEvidenceState.category].label} evidence signal`}
					size="lg"
				>
					{(() => {
						const momentumPercent = toPercent(
							Number(selectedEvidenceState.cumulativeMomentum),
							maxMomentum,
						);
						const evidencePercent = toPercent(
							Number(selectedEvidenceState.recentEvidence),
							maxEvidence,
						);
						const evidenceBand = evidenceSignalBand(evidencePercent);
						const influences = buildEvidenceInfluences({
							category: selectedEvidenceState.category,
							primaryCategory,
							secondaryCategory,
							methodology,
							phase: selectedEvidenceState.phase,
							momentumPercent,
							breakthroughCount: selectedEvidenceState.breakthroughCount,
						});

						return (
							<Stack gap="md">
								<Group justify="space-between" align="center">
									<Badge color={evidenceBand.color} variant="light">
										{evidenceBand.label}
									</Badge>
									<Text size="sm" c="dimmed">
										Signal strength {evidencePercent}%
									</Text>
								</Group>

								<Progress
									value={evidencePercent}
									color="teal"
									radius="xl"
									size="xl"
								/>

								<Alert
									icon={<IconSparkles size={16} />}
									color="blue"
									variant="light"
								>
									Improve this signal by keeping focus stable for multiple turns
									and matching methodology to the current phase.
								</Alert>

								<List spacing="sm" size="sm">
									{influences.map((influence) => (
										<List.Item
											key={influence.title}
											icon={
												<Badge size="xs" variant="light">
													{influence.influence}
												</Badge>
											}
										>
											<Text fw={600}>{influence.title}</Text>
											<Text c="dimmed">{influence.hint}</Text>
										</List.Item>
									))}
								</List>
							</Stack>
						);
					})()}
				</DetailsModal>
			) : null}
		</>
	);
}
