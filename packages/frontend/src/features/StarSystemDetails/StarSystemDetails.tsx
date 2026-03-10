import {
	Button,
	Card,
	Group,
	Image,
	Progress,
	SimpleGrid,
	Stack,
	Text,
	Title,
	Tooltip,
	SegmentedControl,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useStyles } from "tss-react";
import { useMutation, useQuery, useSubscription } from "urql";
import {
	formatInteger,
	formatRoundsToRelativeRounds,
	formatUnit,
	formatUnitPerRound,
} from "../../format/formatNumber";
import { graphql } from "../../gql";
import { DevelopmentStance } from "../../gql/graphql";
import { coordinateToGrid } from "../GalaxyView/coordinateToGrid";
import placeholderDiscoveryArt from "./example-discovery.png";
import placeholderDiscoveryUnknownArt from "./example-discovery-unknown.png";
import placeholderStarsystemArt from "./example-starsystem-overview.png";
import { useNavigate } from "@tanstack/react-router";

export function StarSystemDetails({
	id,
	gameId,
}: {
	id: string;
	gameId: string;
}) {
	const navigate = useNavigate();
	const [{ data }] = useQuery({
		query: graphql(`query StarSystemDetails($id: ID!) {
			starSystem(id: $id) {
				id
				name
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
		}`),
		variables: { id },
	});

	const [{ data: meContext }] = useQuery({
		query: graphql(`query StarSystemDetailsContext($gameId: ID!) {
			game(id: $gameId) {
				id
				me {
					id
				}
			}
		}`),
		variables: { gameId },
	});

	const [{ data: subscriptionData }] = useSubscription({
		query: graphql(`subscription TrackStarSystemDetails($id: ID!) {
			trackStarSystem(starSystemId: $id) {
				... on StarSystemUpdateEvent {
					subject {
						id
						name
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

	const [developmentStance, setDevelopmentStanceValue] = useState<
		string | null
	>(null);

	const starSystem =
		subscriptionData?.trackStarSystem.__typename === "StarSystemUpdateEvent"
			? subscriptionData.trackStarSystem.subject
			: data?.starSystem;

	const currentPlayerId = meContext?.game.me?.id ?? null;
	const isOwnedByMe =
		!!starSystem?.owner?.id &&
		!!currentPlayerId &&
		starSystem.owner.id === currentPlayerId;

	const developmentStanceError =
		setDevelopmentStanceError?.graphQLErrors[0]?.message ??
		setDevelopmentStanceError?.message;

	useEffect(() => {
		if (!starSystem?.currentDevelopmentStance) {
			setDevelopmentStanceValue("Balance");
			return;
		}

		setDevelopmentStanceValue(starSystem.currentDevelopmentStance);
	}, [starSystem?.currentDevelopmentStance]);

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
						<Text variant="gradient">Industry</Text>
						<Text>
							{starSystem?.industry === null
								? "Our scanners could not pick up information about industrial capabilities."
								: `${formatInteger(starSystem?.industry ?? 0)} / turn`}
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

			<Card mb="md">
				<Stack gap="md">
					<Text variant="gradient">Management</Text>
					
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

					{isOwnedByMe && (
						<>
							<Stack gap="sm">
								<Text fw={500} size="sm">Development Stance</Text>
								<Group align="center">
									<SegmentedControl
										value={developmentStance ?? "Balance"}
										onChange={async (nextValue) => {
											setDevelopmentStanceValue(nextValue);
											if (!nextValue || !isOwnedByMe) return;

											const stance = Object.values(DevelopmentStance).find(s => s === nextValue);
											if (!stance) return;

											await setDevelopmentStance({ starSystemId: id, stance });
										}}
										disabled={!isOwnedByMe || setDevelopmentStanceFetching}
										data={[
											{ value: DevelopmentStance.Industrialize, label: "Industrialize" },
											{ value: DevelopmentStance.Balance, label: "Balance" },
											{ value: DevelopmentStance.GrowPopulation, label: "Grow Population" },
										]}
									/>
									{starSystem?.nextTurnStanceProjection && (
										<Text size="sm" c="dimmed">
											{starSystem.nextTurnStanceProjection.industryDelta >= 0 ? "+" : ""}
											{starSystem.nextTurnStanceProjection.industryDelta} Industry / +
											{formatInteger(starSystem.nextTurnStanceProjection.populationDelta)} Pop
										</Text>
									)}
								</Group>
								{developmentStanceError && (
									<Text c="red" size="sm">{developmentStanceError}</Text>
								)}
							</Stack>

							<Group grow>
								<Button
									onClick={() =>
										navigate({
											to: "/games/$id/star-system/$starSystemId/industrial-projects",
											params: { id: gameId, starSystemId: id },
										})
									}
									variant="light"
								>
									Industrial Projects
								</Button>
								<Button
									onClick={() =>
										navigate({
											to: "/games/$id/star-system/$starSystemId/commission-task-force",
											params: { id: gameId, starSystemId: id },
										})
									}
									variant="light"
								>
									Commission Task Force
								</Button>
							</Group>
						</>
					)}

					<Button
						onClick={() =>
							navigate({
								to: "/games/$id/star-system/$starSystemId/task-forces",
								params: { id: gameId, starSystemId: id },
							})
						}
						variant="light"
					>
						Task Forces ({starSystem?.taskForces?.length ?? 0})
					</Button>
				</Stack>
			</Card>
		</>
	);
}
