import {
	Alert,
	Badge,
	Button,
	Card,
	Group,
	Progress,
	Rating,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Tooltip,
	UnstyledButton,
} from "@mantine/core";
import { IconInfoCircle, IconStars } from "@tabler/icons-react";
import type { CombinedError } from "urql";
import type { ResearchCategory } from "../../gql/graphql";
import {
	breakthroughLabel,
	categoryMeta,
	evidenceSignalBand,
	metricHelp,
	phaseMeta,
	type ResearchStateData,
	signedPercent,
	titleCaseKey,
	toPercent,
} from "./ResearchPanel.shared";

type ResearchStatesCardProps = {
	turnNumber?: number;
	fetching: boolean;
	researchStates: ResearchStateData[];
	primaryCategory: ResearchCategory;
	secondaryCategory: ResearchCategory;
	maxMomentum: number;
	maxEvidence: number;
	chooseOutcomeError?: CombinedError;
	isChoosingOutcome: boolean;
	onChooseOutcome: (args: {
		category: ResearchCategory;
		outcomeKey: string;
		outcomeMode: string;
	}) => Promise<void>;
	onSelectEvidenceCategory: (category: ResearchCategory) => void;
};

export function ResearchStatesCard({
	turnNumber,
	fetching,
	researchStates,
	primaryCategory,
	secondaryCategory,
	maxMomentum,
	maxEvidence,
	chooseOutcomeError,
	isChoosingOutcome,
	onChooseOutcome,
	onSelectEvidenceCategory,
}: ResearchStatesCardProps) {
	return (
		<Card withBorder>
			<Stack gap="sm">
				<Group justify="space-between">
					<Text fw={600}>Current Category States</Text>
					<Text size="sm" c="dimmed">
						Turn {turnNumber ?? "-"}
					</Text>
				</Group>

				{fetching ? (
					<Text size="sm" c="dimmed">
						Loading research state...
					</Text>
				) : null}

				{chooseOutcomeError ? (
					<Alert color="red" title="Could not choose research outcome">
						{chooseOutcomeError.message}
					</Alert>
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
												<ThemeIcon color={meta.color} variant="light" size="lg">
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
												onClick={() => onSelectEvidenceCategory(state.category)}
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
														onClick={() =>
															onChooseOutcome({
																category: state.category,
																outcomeKey: choice.outcomeKey,
																outcomeMode: choice.outcomeMode,
															})
														}
														loading={isChoosingOutcome}
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
	);
}
