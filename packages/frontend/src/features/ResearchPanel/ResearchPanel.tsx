import {
	Alert,
	Badge,
	Card,
	Chip,
	Group,
	Progress,
	Rating,
	SegmentedControl,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	IconAtom2,
	IconCheck,
	IconCompass,
	IconHammer,
	IconInfoCircle,
	IconShieldHalfFilled,
	IconStars,
	IconVectorSpline,
} from "@tabler/icons-react";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
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

	const [{ data, fetching }] = useQuery({
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
	const maxMomentum = Math.max(
		1,
		...researchStates.map((state) => Number(state.cumulativeMomentum)),
	);
	const maxEvidence = Math.max(
		1,
		...researchStates.map((state) => Number(state.recentEvidence)),
	);

	return (
		<Stack gap="md">
			<div>
				<Title order={3}>Research</Title>
				<Text size="sm" c="dimmed">
					Set your strategic direction and monitor category health at a glance.
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
																<Badge size="xs" color="grape" variant="light">
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
														<IconVectorSpline size={14} />
													</Group>
													<Progress
														value={momentumPercent}
														color={meta.color}
														radius="xl"
														size="lg"
													/>
												</div>

												<div>
													<Group justify="space-between">
														<Text size="xs" c="dimmed">
															Evidence signal
														</Text>
														<IconStars size={14} />
													</Group>
													<Progress
														value={evidencePercent}
														color="teal"
														radius="xl"
														size="lg"
													/>
												</div>
											</Stack>

											<div>
												<Group justify="space-between" mb={4}>
													<Text size="xs" c="dimmed">
														Breakthrough maturity
													</Text>
													<IconInfoCircle size={14} />
												</Group>
												<Rating value={breakthroughs} count={5} readOnly />
												<Text size="xs" c="dimmed" mt={4}>
													{breakthroughLabel(state.breakthroughCount)}
												</Text>
											</div>
										</Stack>
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
		</Stack>
	);
}
