import {
	Button,
	Card,
	Center,
	Image,
	Progress,
	SimpleGrid,
	Stack,
	Text,
	Title,
	Tooltip,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { useStyles } from "tss-react";
import { useQuery, useSubscription } from "urql";
import {
	formatNumber,
	formatTicksToRelativeTime,
	formatUnit,
	formatUnitPerTick,
} from "../../format/formatNumber";
import { graphql } from "../../gql";
import { coordinateToGrid } from "../GalaxyView/coordinateToGrid";
import placeholderDiscoveryUnknownArt from "./example-discovery-unknown.png";
import placeholderDiscoveryArt from "./example-discovery.png";
import placeholderStarsystemArt from "./example-starsystem-overview.png";

export function StarSystemDetails({ id }: { id: string }) {
	const [{ data }] = useQuery({
		query: graphql(
			`query StarSystemDetails($id: ID!) {
		starSystem(id: $id) {
			id
			name
			position
			taskForces {
				id
				name
				owner {
					id
					name
				}
				commisions {
					id
					name
					shipDesign {
						id
						name
					}
					constructionDone
					constructionTotal
					resourceNeeds {
						resource {
							id
							name
						}
						alotted
						needed
					}
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
			resourceDepots {
				id
				resource {
					id
					name
				}	
				quantity
			}
			populations {
				id
				amount
			}
		}
	}`,
		),
		variables: { id },
	});

	useSubscription({
		query: graphql(`subscription TrackStarSystem($id: ID!) {
		trackStarSystem(starSystemId: $id) {
			... on StarSystemUpdateEvent {
				subject {
					id
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
					resourceDepots {
						id
						resource {
							id
							name
						}	
						quantity
					}
					populations {
						id
						amount
					}
				}
			}
			... on TaskForceCommisionUpdateEvent {
				subject {
					id
					constructionDone
					constructionTotal
					constructionPerTick
					resourceNeeds {
						resource {
							id
							name
						}
						alotted
						needed
					}
				}
				
			}
		}
	}`),
		variables: { id },
	});

	const { css } = useStyles();

	return (
		<>
			<Title order={2} mb="md">
				{data?.starSystem.name}
			</Title>
			<SimpleGrid type="container" cols={{ base: 1, "500px": 2 }} mb="md">
				<Stack>
					<Card>
						<Text variant="gradient">Location</Text>
						<Text>{data && coordinateToGrid(data.starSystem.position, 2)}</Text>
					</Card>
					<Card>
						<Text variant="gradient">Population</Text>
						<Text>
							{!data?.starSystem.populations ? (
								<>
									Our scanners could not pick up information about the
									population.
								</>
							) : (
								formatNumber(
									data.starSystem.populations.reduce(
										(acc, pop) => acc + pop.amount,
										0,
									),
								)
							)}
						</Text>
					</Card>
					<Card>
						<Text variant="gradient">Discoveries</Text>
						{data?.starSystem.discoveries === null ? (
							<>
								Our scanners could not pick up information about possible
								discoveries.
							</>
						) : (
							<div
								className={css({
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, 100px)",
								})}
							>
								{data?.starSystem.discoveries?.map((discovery) => (
									<Fragment key={discovery.id}>
										{discovery.__typename === "ResourceDiscovery" ? (
											<Tooltip
												withArrow
												label={
													<>
														<div>
															Mining {formatUnitPerTick(discovery.miningRate)}
														</div>
														<div>
															Depletes in{" "}
															{formatTicksToRelativeTime(
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
						{(data?.starSystem.discoveryProgress ?? null) !== null && (
							<Progress.Root size={36} mt="xs">
								<Progress.Section
									value={(data?.starSystem.discoveryProgress ?? 0) * 100}
									color="cyan"
								>
									<Progress.Label>
										Discovery progress (
										{Math.floor(
											(data?.starSystem.discoveryProgress ?? 0) * 100,
										)}
										%)
									</Progress.Label>
								</Progress.Section>
							</Progress.Root>
						)}
					</Card>
					<Card>
						<Text variant="gradient">Resource depots</Text>
						<div
							className={css({
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, 100px)",
							})}
						>
							{data?.starSystem.resourceDepots?.map((depot) => (
								<Stack key={depot.id} gap={0} align="center">
									<Center>{depot.resource.name}</Center>
									<Image
										src={placeholderDiscoveryArt}
										maw={64}
										mah={64}
										radius="lg"
									/>
									<Center>{formatUnit(depot.quantity)}</Center>
								</Stack>
							))}
						</div>
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
					{data?.starSystem.taskForces?.map((tf) => (
						<Stack key={tf.id} gap={0} align="center">
							<Center>{tf.name}</Center>
							{tf.commisions.length > 0 ? (
								<Center>Commision in progress</Center>
							) : null}
							{tf.commisions.map((commision) => (
								<Stack key={commision.id} gap={0}>
									<div>{commision.name}</div>
									<Progress.Root size={20}>
										{commision.resourceNeeds.map((need) => (
											<Progress.Section
												key={need.resource.id}
												value={(need.alotted / need.needed) * 100}
												color="cyan"
											>
												<Progress.Label>
													{need.resource.name} ({formatUnit(need.alotted)}/
													{formatUnit(need.needed)})
												</Progress.Label>
											</Progress.Section>
										))}
									</Progress.Root>
									<Progress
										size={20}
										value={
											(commision.constructionDone /
												commision.constructionTotal) *
											100
										}
									/>
								</Stack>
							))}
						</Stack>
					))}
				</div>

				<Button
					component={Link}
					from="/games/$id/star-system/$starSystemId"
					to="commision-task-force"
				>
					Commision a task force
				</Button>
			</Card>
		</>
	);
}
