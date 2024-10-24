import {
	Button,
	Card,
	Center,
	Image,
	SimpleGrid,
	Stack,
	Text,
	Title,
	Tooltip,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { useStyles } from "tss-react";
import { useQuery } from "urql";
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

	const { css } = useStyles();

	return (
		<>
			<Title order={2} mb="md">
				{data?.starSystem.name}
			</Title>
			<SimpleGrid type="container" cols={{ base: 1, "500px": 2 }}>
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
			<Button
				component={Link}
				from="/games/$id/star-system/$starSystemId"
				to="commision-task-force"
			>
				Commision a task force
			</Button>
		</>
	);
}
