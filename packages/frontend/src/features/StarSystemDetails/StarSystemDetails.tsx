import { Card, Image, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useQuery, useSubscription } from "urql";
import { formatInteger } from "../../format/formatNumber";
import { graphql } from "../../gql";
import { coordinateToGrid } from "../GalaxyView/coordinateToGrid";
import placeholderStarsystemArt from "./example-starsystem-overview.png";
import placeholderStarsystemUnknownArt from "./example-starsystem-unknown.png";
import { StarSystemDiscoveries } from "./StarSystemDiscoveries";
import { StarSystemManagement } from "./StarSystemManagement";

export function StarSystemDetails({
	id,
	gameId,
}: {
	id: string;
	gameId: string;
}) {
	const [{ data }] = useQuery({
		query: graphql(`query StarSystemDetails($id: ID!) {
			starSystem(id: $id) {
				id
				name
				colonizationPressureSources {
					sourceStarSystemId
					sourceStarSystemName
					distance
					population
					availableIndustry
					allocatedIndustry
					populationFactor
					distanceFactor
					projectedPressurePerTurn
				}
				industryBreakdown {
					rawIndustry
					populationCap
					cappedIndustry
					maintenance
					colonizationAllocated
					netIndustry
				}
				colonizationGovernance
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
					accumulated
					threshold
					pressurePerTurn
					etaTurns
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
							kind
							description
							statBonuses {
								stat
								modifier
							}
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
						colonizationPressureSources {
							sourceStarSystemId
							sourceStarSystemName
							distance
							population
							availableIndustry
							allocatedIndustry
							populationFactor
							distanceFactor
							projectedPressurePerTurn
						}
						industryBreakdown {
							rawIndustry
							populationCap
							cappedIndustry
							maintenance
							colonizationAllocated
							netIndustry
						}
						colonizationGovernance
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
							player {
								id
								name
							}
							accumulated
							threshold
							pressurePerTurn
							etaTurns
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
									kind
									description
									statBonuses {
										stat
										modifier
									}
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

	const starSystem =
		subscriptionData?.trackStarSystem.__typename === "StarSystemUpdateEvent"
			? subscriptionData.trackStarSystem.subject
			: data?.starSystem;

	const currentPlayerId = meContext?.game.me?.id ?? null;
	const industryBreakdown = starSystem?.industryBreakdown;

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
						{industryBreakdown === null || industryBreakdown === undefined ? (
							<Text>
								{starSystem?.industry === null
									? "Our scanners could not pick up information about industrial capabilities."
									: `${formatInteger(starSystem?.industry ?? 0)} / turn`}
							</Text>
						) : (
							<Stack gap={2}>
								<Text>
									{formatInteger(industryBreakdown.netIndustry)} / turn net
								</Text>
								<Text size="sm" c="dimmed">
									Infrastructure: {formatInteger(industryBreakdown.rawIndustry)}
								</Text>
								<Text size="sm" c="dimmed">
									Population cap:{" "}
									{formatInteger(industryBreakdown.populationCap)}
								</Text>
								<Text size="sm" c="dimmed">
									Usable before upkeep:{" "}
									{formatInteger(industryBreakdown.cappedIndustry)}
								</Text>
								<Text size="sm" c="dimmed">
									Maintenance: -{formatInteger(industryBreakdown.maintenance)}
								</Text>
								<Text size="sm" c="dimmed">
									Colonization allocations: -
									{formatInteger(industryBreakdown.colonizationAllocated)}
								</Text>
							</Stack>
						)}
					</Card>
					<Card>
						<Text variant="gradient">Discoveries</Text>
						<StarSystemDiscoveries
							discoveries={starSystem?.discoveries}
							discoveryProgress={starSystem?.discoveryProgress}
						/>
					</Card>
				</Stack>
				<Image
					src={
						starSystem?.discoveries === null
							? placeholderStarsystemUnknownArt
							: placeholderStarsystemArt
					}
					alt="star system"
					radius="md"
				/>
			</SimpleGrid>

			<StarSystemManagement
				starSystem={starSystem}
				currentPlayerId={currentPlayerId}
				gameId={gameId}
				id={id}
			/>
		</>
	);
}
