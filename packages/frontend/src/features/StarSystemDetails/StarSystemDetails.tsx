import {
	Button,
	Card,
	Center,
	Group,
	Image,
	NumberInput,
	Progress,
	Select,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Title,
	Tooltip,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useStyles } from "tss-react";
import { useMutation, useQuery, useSubscription } from "urql";
import {
	formatInteger,
	formatNumber,
	formatRoundsToRelativeRounds,
	formatUnit,
	formatUnitPerRound,
} from "../../format/formatNumber";
import { graphql } from "../../gql";
import { DevelopmentStance, IndustrialProjectType } from "../../gql/graphql";
import { coordinateToGrid } from "../GalaxyView/coordinateToGrid";
import placeholderDiscoveryArt from "./example-discovery.png";
import placeholderDiscoveryUnknownArt from "./example-discovery-unknown.png";
import placeholderStarsystemArt from "./example-starsystem-overview.png";

const ALLOWED_CARD_IDS = [
	"laser_burst",
	"target_lock",
	"emergency_repairs",
	"shield_pulse",
	"evasive_maneuver",
	"overcharge_barrage",
] as const;

const CARD_LABELS: Record<(typeof ALLOWED_CARD_IDS)[number], string> = {
	laser_burst: "Laser Burst",
	target_lock: "Target Lock",
	emergency_repairs: "Emergency Repairs",
	shield_pulse: "Shield Pulse",
	evasive_maneuver: "Evasive Maneuver",
	overcharge_barrage: "Overcharge Barrage",
};

const DECK_SIZE = 12;

function buildDeckDraft(cardIds: string[] | null | undefined) {
	const next = Object.fromEntries(
		ALLOWED_CARD_IDS.map((cardId) => [cardId, 0]),
	) as Record<(typeof ALLOWED_CARD_IDS)[number], number>;

	for (const cardId of cardIds ?? []) {
		if (cardId in next) {
			next[cardId as (typeof ALLOWED_CARD_IDS)[number]] += 1;
		}
	}

	return next;
}

function expandDeckFromDraft(
	draft: Record<(typeof ALLOWED_CARD_IDS)[number], number>,
) {
	return ALLOWED_CARD_IDS.flatMap((cardId) =>
		Array.from({ length: draft[cardId] ?? 0 }, () => cardId),
	);
}

export function StarSystemDetails({
	id,
	gameId,
}: {
	id: string;
	gameId: string;
}) {
	const [{ data }] = useQuery({
		query: graphql(
			`query StarSystemDetails($id: ID!) {
		starSystem(id: $id) {
			id
			name
			industrialProjects {
				id
				projectType
				industryPerTurn
				workRequired
				workDone
				completionIndustryBonus
				queuePosition
				turnsRemaining
				etaTurns
			}
			completedIndustrialProjects {
				id
				projectType
				completionIndustryBonus
				completedAtTurn
			}
			currentDevelopmentStance
			nextTurnStanceProjection {
				industryDelta
				populationDelta
			}
			owner {
				id
				name
			}
			colonization {
				turnsRemaining
				player {
					id
					name
				}
			}
			position
			taskForces {
				id
				name
					combatDeck
				constructionDone
				constructionTotal
				constructionPerTick
				owner {
					id
					name
				}
			}
			industry
			discoveries {
				__typename
				... on ResourceDiscovery {
					id
					resource {
						id
						name
					}
					remainingDeposits
					miningRate
				}
				... on UnknownDiscovery {
					id
				}
			}
			discoveryProgress
			populations {
				id
				amount
			}
		}
	}`,
		),
		variables: { id },
	});

	const [{ data: commissionContext }] = useQuery({
		query: graphql(`query CommissionFleetContext($gameId: ID!) {
			game(id: $gameId) {
				id
				me {
					id
					shipDesigns {
						id
						name
						components {
							component {
								constructionCost
							}
						}
					}
				}
			}
		}`),
		variables: { gameId },
	});

	const [{ data: subscriptionData }] = useSubscription({
		query: graphql(`subscription TrackStarSystem($id: ID!) {
		trackStarSystem(starSystemId: $id) {
			... on StarSystemUpdateEvent {
				subject {
					id
					name
					industrialProjects {
						id
						projectType
						industryPerTurn
						workRequired
						workDone
						completionIndustryBonus
						queuePosition
						turnsRemaining
						etaTurns
					}
					completedIndustrialProjects {
						id
						projectType
						completionIndustryBonus
						completedAtTurn
					}
					currentDevelopmentStance
					nextTurnStanceProjection {
						industryDelta
						populationDelta
					}
					owner {
						id
						name
					}
					colonization {
						turnsRemaining
						player {
							id
							name
						}
					}
					position
					taskForces {
						id
						name
						combatDeck
						constructionDone
						constructionTotal
						constructionPerTick
						owner {
							id
							name
						}
					}
					industry
					discoveries {
						__typename
						... on ResourceDiscovery {
							id
							resource {
								id
								name
							}
							remainingDeposits
							miningRate
						}
						... on UnknownDiscovery {
							id
						}
					}
					discoveryProgress
					populations {
						id
						amount
					}
				}
			}
		}
	}`),
		variables: { id },
	});

	const [startColonizationState, startColonization] = useMutation(
		graphql(`mutation StartColonization($starSystemId: ID!) {
			startColonization(starSystemId: $starSystemId) {
				id
				colonization {
					turnsRemaining
					player {
						id
						name
					}
				}
			}
		}`),
	);

	const [constructTaskForceState, constructTaskForce] = useMutation(
		graphql(`mutation ConstructTaskForce($input: ConstructTaskForceInput!) {
			constructTaskForce(input: $input) {
				id
				name
			}
		}`),
	);

	const [configureDeckState, configureTaskForceCombatDeck] = useMutation(
		graphql(`mutation ConfigureTaskForceCombatDeck($input: ConfigureTaskForceCombatDeckInput!) {
			configureTaskForceCombatDeck(input: $input) {
				id
				combatDeck
			}
		}`),
	);

	const [queueIndustrialProjectState, queueIndustrialProject] = useMutation(
		graphql(`mutation QueueIndustrialProject($starSystemId: ID!, $projectType: IndustrialProjectType!) {
			queueIndustrialProject(starSystemId: $starSystemId, projectType: $projectType) {
				id
				industrialProjects {
					id
				}
			}
		}`),
	);

	const [
		{
			fetching: setDevelopmentStanceFetching,
			error: setDevelopmentStanceError,
		},
		setDevelopmentStance,
	] = useMutation(
		graphql(`mutation SetDevelopmentStance($starSystemId: ID!, $stance: DevelopmentStance!) {
			setDevelopmentStance(starSystemId: $starSystemId, stance: $stance) {
				id
				currentDevelopmentStance
				nextTurnStanceProjection {
					industryDelta
					populationDelta
				}
			}
		}`),
	);

	const [fleetName, setFleetName] = useState("");
	const [shipDesignId, setShipDesignId] = useState<string | null>(null);
	const [developmentStance, setDevelopmentStanceValue] = useState<
		string | null
	>(null);
	const [industrialProjectType, setIndustrialProjectType] =
		useState<IndustrialProjectType | null>(
			IndustrialProjectType.FactoryExpansion,
		);
	const [deckDrafts, setDeckDrafts] = useState<
		Record<string, Record<(typeof ALLOWED_CARD_IDS)[number], number>>
	>({});
	const [deckErrors, setDeckErrors] = useState<Record<string, string>>({});

	const shipDesignOptions = useMemo(
		() =>
			(commissionContext?.game.me?.shipDesigns ?? []).map((design) => ({
				value: design.id,
				label: design.name,
			})),
		[commissionContext?.game.me?.shipDesigns],
	);

	useEffect(() => {
		if (!shipDesignOptions.length) {
			setShipDesignId(null);
			return;
		}

		setShipDesignId((current) =>
			current && shipDesignOptions.some((option) => option.value === current)
				? current
				: (shipDesignOptions[0]?.value ?? null),
		);
	}, [shipDesignOptions]);

	const starSystem =
		subscriptionData?.trackStarSystem.__typename === "StarSystemUpdateEvent"
			? subscriptionData.trackStarSystem.subject
			: data?.starSystem;

	const currentPlayerId = commissionContext?.game.me?.id ?? null;
	const isOwnedByMe =
		!!starSystem?.owner?.id &&
		!!currentPlayerId &&
		starSystem.owner.id === currentPlayerId;

	const commissionError = (() => {
		const gqlError = constructTaskForceState.error?.graphQLErrors[0];
		const code = gqlError?.extensions?.code;
		const violation = gqlError?.extensions?.violation;

		if (code === "DUPLICATE_TASK_FORCE_NAME") {
			return "Task force name already exists. Choose another name.";
		}

		if (code === "INVALID_CONSTRUCTION_ORDER") {
			if (violation === "ORIGIN_NOT_OWNED") {
				return "You can only commission task forces in systems you own.";
			}

			if (violation === "SHIP_DESIGN_UNAVAILABLE") {
				return "Selected ship design is unavailable for this empire.";
			}
		}

		if (code === "INSUFFICIENT_INDUSTRY") {
			return "This star system has no industrial capacity.";
		}

		if (code === "INSUFFICIENT_RESOURCES") {
			const resourceId =
				typeof gqlError?.extensions?.resourceId === "string"
					? gqlError.extensions.resourceId
					: null;
			const required =
				typeof gqlError?.extensions?.required === "number"
					? gqlError.extensions.required
					: null;
			const available =
				typeof gqlError?.extensions?.available === "number"
					? gqlError.extensions.available
					: null;

			if (resourceId && required !== null && available !== null) {
				return `Insufficient resource ${resourceId}: required ${required}, available ${available}.`;
			}

			return "Insufficient special resources for construction.";
		}

		return gqlError?.message ?? constructTaskForceState.error?.message;
	})();

	const developmentStanceError =
		setDevelopmentStanceError?.graphQLErrors[0]?.message ??
		setDevelopmentStanceError?.message;

	const queueIndustrialProjectError =
		queueIndustrialProjectState.error?.graphQLErrors[0]?.message ??
		queueIndustrialProjectState.error?.message;

	const developmentStanceOptions: { value: string; label: string }[] = [
		{ value: DevelopmentStance.Industrialize, label: "Industrialize" },
		{ value: DevelopmentStance.Balance, label: "Balance" },
		{ value: DevelopmentStance.GrowPopulation, label: "Grow Population" },
	];

	const industrialProjectOptions: {
		value: IndustrialProjectType;
		label: string;
	}[] = [
		{
			value: IndustrialProjectType.FactoryExpansion,
			label: "Factory Expansion (+2 industry)",
		},
		{
			value: IndustrialProjectType.AutomationHub,
			label: "Automation Hub (+3 industry)",
		},
		{
			value: IndustrialProjectType.OrbitalFoundry,
			label: "Orbital Foundry (+5 industry)",
		},
	];

	const formatProjectType = (value: IndustrialProjectType) => {
		switch (value) {
			case IndustrialProjectType.FactoryExpansion:
				return "Factory Expansion";
			case IndustrialProjectType.AutomationHub:
				return "Automation Hub";
			case IndustrialProjectType.OrbitalFoundry:
				return "Orbital Foundry";
			default:
				return value;
		}
	};

	useEffect(() => {
		if (!starSystem?.currentDevelopmentStance) {
			setDevelopmentStanceValue("balance");
			return;
		}

		setDevelopmentStanceValue(starSystem.currentDevelopmentStance);
	}, [starSystem?.currentDevelopmentStance]);

	useEffect(() => {
		setDeckDrafts((current) => {
			const next: Record<
				string,
				Record<(typeof ALLOWED_CARD_IDS)[number], number>
			> = { ...current };

			for (const taskForce of starSystem?.taskForces ?? []) {
				if (!next[taskForce.id]) {
					next[taskForce.id] = buildDeckDraft(taskForce.combatDeck);
				}
			}

			return next;
		});
	}, [starSystem?.taskForces]);

	const { css } = useStyles();

	const formatReadiness = (
		constructionDone: number | null | undefined,
		constructionTotal: number | null | undefined,
		constructionPerTick: number | null | undefined,
	) => {
		const done = constructionDone ?? 0;
		const total = constructionTotal ?? 0;
		if (total <= 0 || done >= total) {
			return {
				label: "Ready",
				detail: "Operational",
				progress: 100,
			};
		}

		const perTick = constructionPerTick ?? 0;
		const remaining = Math.max(0, total - done);
		const etaTurns = perTick > 0 ? Math.ceil(remaining / perTick) : null;

		return {
			label: "Under construction",
			detail:
				etaTurns === null
					? `${formatNumber(done)} / ${formatNumber(total)} progress, awaiting industry`
					: `${formatNumber(done)} / ${formatNumber(total)} progress, ETA ${etaTurns} turn${etaTurns === 1 ? "" : "s"}`,
			progress: Math.min(100, (done / total) * 100),
		};
	};

	return (
		<>
			<Title order={2} mb="md">
				{starSystem?.name}
			</Title>
			<SimpleGrid type="container" cols={{ base: 1, "500px": 2 }} mb="md">
				<Stack>
					<Card>
						<Text variant="gradient">Location</Text>
						<Text>
							{starSystem && coordinateToGrid(starSystem.position, 2)}
						</Text>
					</Card>
					<Card>
						<Text variant="gradient">Population</Text>
						<Text>
							{!starSystem?.populations
								? "Our scanners could not pick up information about the population."
								: formatInteger(
										starSystem.populations.reduce(
											(acc, pop) => acc + pop.amount,
											0,
										),
									)}
						</Text>
					</Card>
					<Card>
						<Text variant="gradient">Industry</Text>
						<Text>
							{starSystem?.industry
								? `${formatInteger(starSystem.industry)} / turn`
								: "Our scanners could not pick up information about industrial capabilities."}
						</Text>
					</Card>
					<Card>
						<Text variant="gradient">Discoveries</Text>
						{starSystem?.discoveries === null ? (
							"Our scanners could not pick up information about possible discoveries."
						) : (
							<div
								className={css({
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, 100px)",
								})}
							>
								{starSystem?.discoveries?.map((discovery) => (
									<Fragment key={discovery.id}>
										{discovery.__typename === "ResourceDiscovery" ? (
											<Tooltip
												withArrow
												label={
													<>
														<div>
															Mining {formatUnitPerRound(discovery.miningRate)}
														</div>
														<div>
															Depletes in{" "}
															{formatRoundsToRelativeRounds(
																discovery.remainingDeposits /
																	discovery.miningRate,
															)}
														</div>
													</>
												}
												position="bottom"
											>
												<Stack gap={0} align="center">
													<span>{discovery.resource.name}</span>
													<Image
														src={placeholderDiscoveryArt}
														maw={64}
														mah={64}
														radius="lg"
													/>
													<span>{formatUnit(discovery.remainingDeposits)}</span>
												</Stack>
											</Tooltip>
										) : (
											<Stack gap={0} align="center">
												<span>???</span>
												<Image
													src={placeholderDiscoveryUnknownArt}
													maw={64}
													mah={64}
													radius="lg"
												/>
												<span>???</span>
											</Stack>
										)}
									</Fragment>
								))}
							</div>
						)}
						{(starSystem?.discoveryProgress ?? null) !== null && (
							<Progress.Root size={36} mt="xs">
								<Progress.Section
									value={(starSystem?.discoveryProgress ?? 0) * 100}
									color="cyan"
								>
									<Progress.Label>
										Discovery progress (
										{Math.floor((starSystem?.discoveryProgress ?? 0) * 100)}
										%)
									</Progress.Label>
								</Progress.Section>
							</Progress.Root>
						)}
					</Card>
				</Stack>
				<Image src={placeholderStarsystemArt} alt="star system" />
			</SimpleGrid>
			<Card>
				<Text variant="gradient">Task forces in this system</Text>
				<div
					className={css({
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, 200px)",
					})}
				>
					{starSystem?.taskForces?.map((tf) => (
						<Stack
							key={tf.id}
							gap="xs"
							align="stretch"
							className={css({
								padding: "8px",
								border: "1px solid var(--mantine-color-dark-4)",
								borderRadius: "8px",
							})}
						>
							<Center>{tf.name}</Center>
							<Text size="xs" c="dimmed" ta="center">
								Combat deck: {(tf.combatDeck ?? []).length} / {DECK_SIZE} cards
							</Text>
							<Text size="xs" c="dimmed">
								{(tf.combatDeck ?? []).length > 0
									? (tf.combatDeck ?? [])
											.map((cardId) =>
												cardId in CARD_LABELS
													? CARD_LABELS[
															cardId as (typeof ALLOWED_CARD_IDS)[number]
														]
													: cardId,
											)
											.join(", ")
									: "No deck configured"}
							</Text>
							{(() => {
								const readiness = formatReadiness(
									tf.constructionDone,
									tf.constructionTotal,
									tf.constructionPerTick,
								);

								return (
									<>
										<Text size="xs" c="dimmed" ta="center">
											{readiness.label}
										</Text>
										<Text size="xs" c="dimmed" ta="center">
											{readiness.detail}
										</Text>
										<Progress
											size="xs"
											value={readiness.progress}
											color={readiness.progress >= 100 ? "teal" : "yellow"}
										/>
									</>
								);
							})()}
							{tf.owner?.id === currentPlayerId && (
								<Stack gap="xs" mt="xs">
									<Text size="sm" fw={600}>
										Configure deck
									</Text>
									<SimpleGrid cols={2} spacing="xs">
										{ALLOWED_CARD_IDS.map((cardId) => (
											<NumberInput
												key={`${tf.id}:${cardId}`}
												label={CARD_LABELS[cardId]}
												min={0}
												max={2}
												allowDecimal={false}
												value={deckDrafts[tf.id]?.[cardId] ?? 0}
												onChange={(value) => {
													const numericValue =
														typeof value === "number" && Number.isFinite(value)
															? value
															: 0;

													setDeckDrafts((current) => ({
														...current,
														[tf.id]: {
															...buildDeckDraft(tf.combatDeck),
															...(current[tf.id] ?? {}),
															[cardId]: Math.max(
																0,
																Math.min(2, Math.floor(numericValue)),
															),
														},
													}));
												}}
											/>
										))}
									</SimpleGrid>
									{(() => {
										const draft =
											deckDrafts[tf.id] ?? buildDeckDraft(tf.combatDeck);
										const cardCount = ALLOWED_CARD_IDS.reduce(
											(acc, cardId) => acc + (draft[cardId] ?? 0),
											0,
										);
										const canSave = cardCount === DECK_SIZE;

										return (
											<>
												<Text size="xs" c={canSave ? "teal" : "yellow"}>
													Deck size: {cardCount} / {DECK_SIZE}
												</Text>
												<Button
													size="xs"
													loading={configureDeckState.fetching}
													disabled={!canSave || configureDeckState.fetching}
													onClick={async () => {
														const result = await configureTaskForceCombatDeck({
															input: {
																taskForceId: tf.id,
																cardIds: expandDeckFromDraft(draft),
															},
														});

														if (!result.error) {
															setDeckErrors((current) => {
																const next = { ...current };
																delete next[tf.id];
																return next;
															});
															return;
														}

														const gqlError = result.error.graphQLErrors[0];
														const code = gqlError?.extensions?.code;

														if (code === "INVALID_DECK_SIZE") {
															setDeckErrors((current) => ({
																...current,
																[tf.id]: "Deck must contain exactly 12 cards.",
															}));
															return;
														}

														if (code === "DUPLICATE_CARD_LIMIT_EXCEEDED") {
															setDeckErrors((current) => ({
																...current,
																[tf.id]:
																	"Each card can appear at most 2 times.",
															}));
															return;
														}

														if (code === "CARD_NOT_ALLOWED") {
															setDeckErrors((current) => ({
																...current,
																[tf.id]:
																	"Selected card is not allowed in the MVP pool.",
															}));
															return;
														}

														if (code === "NOT_AUTHORIZED") {
															setDeckErrors((current) => ({
																...current,
																[tf.id]:
																	"You are not allowed to edit this task force deck.",
															}));
															return;
														}

														setDeckErrors((current) => ({
															...current,
															[tf.id]:
																gqlError?.message ?? result.error?.message,
														}));
													}}
												>
													Save deck
												</Button>
												{deckErrors[tf.id] && (
													<Text c="red" size="xs">
														{deckErrors[tf.id]}
													</Text>
												)}
											</>
										);
									})()}
								</Stack>
							)}
						</Stack>
					))}
				</div>

				{starSystem && !starSystem.owner && !starSystem.colonization && (
					<Button
						loading={startColonizationState.fetching}
						onClick={() => {
							startColonization({ starSystemId: id });
						}}
					>
						Start colonization
					</Button>
				)}

				{starSystem?.colonization && (
					<Text mt="sm">
						Colonization in progress by {starSystem.colonization.player.name} ({" "}
						{starSystem.colonization.turnsRemaining} turns remaining)
					</Text>
				)}

				<Text mt="md" variant="gradient">
					Commission task force
				</Text>
				<Text mt="md" variant="gradient">
					Development stance
				</Text>
				<Text mt="md" variant="gradient">
					Industrial projects
				</Text>
				<Stack mt="xs" gap="xs">
					<Select
						label="Project type"
						data={industrialProjectOptions}
						value={industrialProjectType}
						onChange={(nextValue) =>
							setIndustrialProjectType(
								nextValue as IndustrialProjectType | null,
							)
						}
						disabled={!isOwnedByMe}
					/>
					<Button
						loading={queueIndustrialProjectState.fetching}
						disabled={!isOwnedByMe || !industrialProjectType}
						onClick={async () => {
							if (!industrialProjectType) {
								return;
							}

							await queueIndustrialProject({
								starSystemId: id,
								projectType: industrialProjectType,
							});
						}}
					>
						Queue project
					</Button>
					{!isOwnedByMe && (
						<Text c="dimmed" size="sm">
							You can queue industrial projects only in star systems you own.
						</Text>
					)}
					{queueIndustrialProjectError && (
						<Text c="red" size="sm">
							{queueIndustrialProjectError}
						</Text>
					)}
					{starSystem?.industrialProjects?.length ? (
						<Stack gap={2}>
							<Text size="sm" fw={700}>
								Queue
							</Text>
							{starSystem.industrialProjects
								.slice()
								.sort((a, b) => a.queuePosition - b.queuePosition)
								.map((project) => (
									<Text key={project.id} size="sm" c="dimmed">
										{formatProjectType(project.projectType)}:{" "}
										{project.turnsRemaining} turns remaining (ETA{" "}
										{project.etaTurns}), +{project.completionIndustryBonus}{" "}
										industry.
									</Text>
								))}
						</Stack>
					) : (
						<Text c="dimmed" size="sm">
							No queued industrial projects.
						</Text>
					)}
					{starSystem?.completedIndustrialProjects?.length ? (
						<Stack gap={2}>
							<Text size="sm" fw={700}>
								Recently completed
							</Text>
							{starSystem.completedIndustrialProjects.map((project) => (
								<Text key={project.id} size="sm" c="dimmed">
									{formatProjectType(project.projectType)} completed at turn{" "}
									{project.completedAtTurn} (+
									{project.completionIndustryBonus} industry).
								</Text>
							))}
						</Stack>
					) : (
						<Text c="dimmed" size="sm">
							No completed industrial projects yet.
						</Text>
					)}
				</Stack>
				<Stack mt="xs" gap="xs">
					<Select
						label="Stance"
						data={developmentStanceOptions}
						value={developmentStance}
						onChange={async (nextValue) => {
							setDevelopmentStanceValue(nextValue);
							if (!nextValue || !isOwnedByMe) {
								return;
							}

							const stance = developmentStanceOptions.find(
								(option) => option.value === nextValue,
							)?.value as DevelopmentStance | undefined;

							if (!stance) {
								return;
							}

							await setDevelopmentStance({
								starSystemId: id,
								stance,
							});
						}}
						disabled={!isOwnedByMe}
						rightSection={setDevelopmentStanceFetching ? "Saving..." : null}
					/>
					{starSystem?.nextTurnStanceProjection && (
						<Text size="sm" c="dimmed">
							Projected next turn: industry{" "}
							{starSystem.nextTurnStanceProjection.industryDelta >= 0
								? "+"
								: ""}
							{starSystem.nextTurnStanceProjection.industryDelta}, population +
							{formatInteger(
								starSystem.nextTurnStanceProjection.populationDelta,
							)}
							.
						</Text>
					)}
					{!isOwnedByMe && (
						<Text c="dimmed" size="sm">
							You can set development stance only in star systems you own.
						</Text>
					)}
					{developmentStanceError && (
						<Text c="red" size="sm">
							{developmentStanceError}
						</Text>
					)}
				</Stack>
				<Stack mt="xs">
					<TextInput
						label="Fleet name"
						placeholder="Expeditionary Wing"
						value={fleetName}
						onChange={(event) => setFleetName(event.currentTarget.value)}
						disabled={!isOwnedByMe}
					/>
					<Select
						label="Ship design"
						placeholder="Select a design"
						data={shipDesignOptions}
						value={shipDesignId}
						onChange={setShipDesignId}
						disabled={!isOwnedByMe || shipDesignOptions.length === 0}
					/>
					{(() => {
						if (!shipDesignId) return null;
						const selectedDesign =
							commissionContext?.game.me?.shipDesigns?.find(
								(d) => d.id === shipDesignId,
							);
						if (!selectedDesign) return null;

						const cost = selectedDesign.components.reduce(
							(sum, comp) => sum + comp.component.constructionCost,
							0,
						);
						const industry = starSystem?.industry ?? 1;
						const turns =
							industry > 0 ? Math.ceil(cost / industry) : "Infinity";

						return (
							<Text size="sm" c="dimmed">
								Construction cost: {formatInteger(cost)}. Time to build: {turns}{" "}
								turns.
							</Text>
						);
					})()}
					<Group justify="space-between">
						<Button
							loading={constructTaskForceState.fetching}
							disabled={
								!isOwnedByMe ||
								!fleetName.trim() ||
								!shipDesignId ||
								!starSystem?.industry
							}
							onClick={async () => {
								if (!shipDesignId || !fleetName.trim()) {
									return;
								}

								const result = await constructTaskForce({
									input: {
										starSystemId: id,
										shipDesignId,
										name: fleetName.trim(),
									},
								});

								if (!result.error) {
									setFleetName("");
								}
							}}
						>
							Commission
						</Button>
					</Group>
					{!isOwnedByMe && (
						<Text c="dimmed" size="sm">
							You can commission fleets only in star systems you own.
						</Text>
					)}
					{isOwnedByMe && shipDesignOptions.length === 0 && (
						<Text c="dimmed" size="sm">
							No ship designs available yet for this empire.
						</Text>
					)}
					{commissionError && (
						<Text c="red" size="sm">
							{commissionError}
						</Text>
					)}
				</Stack>
			</Card>
		</>
	);
}
