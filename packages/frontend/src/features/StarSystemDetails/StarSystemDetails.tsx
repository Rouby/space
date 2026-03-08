import {
	Button,
	Card,
	Center,
	Group,
	Image,
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
import { useAuth } from "../../Auth";
import {
	formatInteger,
	formatRoundsToRelativeRounds,
	formatUnit,
	formatUnitPerRound,
} from "../../format/formatNumber";
import { graphql } from "../../gql";
import { coordinateToGrid } from "../GalaxyView/coordinateToGrid";
import placeholderDiscoveryArt from "./example-discovery.png";
import placeholderDiscoveryUnknownArt from "./example-discovery-unknown.png";
import placeholderStarsystemArt from "./example-starsystem-overview.png";

export function StarSystemDetails({
	id,
	gameId,
}: {
	id: string;
	gameId: string;
}) {
	const { me } = useAuth();

	const [{ data }] = useQuery({
		query: graphql(
			`query StarSystemDetails($id: ID!) {
		starSystem(id: $id) {
			id
			name
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
				owner {
					id
					name
				}
			}
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
						owner {
							id
							name
						}
					}
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

	const [fleetName, setFleetName] = useState("");
	const [shipDesignId, setShipDesignId] = useState<string | null>(null);

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

	const isOwnedByMe =
		!!starSystem?.owner?.id && !!me?.id && starSystem.owner.id === me.id;

	const commissionError =
		constructTaskForceState.error?.graphQLErrors[0]?.message ??
		constructTaskForceState.error?.message;

	const { css } = useStyles();

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
						<Stack key={tf.id} gap={0} align="center">
							<Center>{tf.name}</Center>
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
					<Group justify="space-between">
						<Button
							loading={constructTaskForceState.fetching}
							disabled={!isOwnedByMe || !fleetName.trim() || !shipDesignId}
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
