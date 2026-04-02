import {
	Badge,
	Box,
	Card,
	Group,
	Image,
	Progress,
	SimpleGrid,
	Stack,
	Text,
	Tooltip,
} from "@mantine/core";
import {
	formatRoundsToRelativeRounds,
	formatUnit,
	formatUnitPerRound,
} from "../../format/formatNumber";
import type { StarSystemDetailsQuery } from "../../gql/graphql";

import placeholderDiscoveryArt from "./example-discovery.png";
import placeholderDiscoveryUnknownArt from "./example-discovery-unknown.png";

import resourceBiologicalArt from "./resource-biological.png";
import resourceCrystalArt from "./resource-crystal.png";
import resourceGasArt from "./resource-gas.png";
import resourceLiquidArt from "./resource-liquid.png";
import resourceMetalArt from "./resource-metal.png";

const RESOURCE_IMAGES: Record<string, string> = {
	metal: resourceMetalArt,
	crystal: resourceCrystalArt,
	gas: resourceGasArt,
	liquid: resourceLiquidArt,
	biological: resourceBiologicalArt,
};

function getResourceImage(kind: string): string {
	return RESOURCE_IMAGES[kind] ?? placeholderDiscoveryArt;
}

const STAT_DISPLAY_NAMES: Record<string, string> = {
	armorThickness: "Armor",
	structuralIntegrity: "Hull",
	weaponDamage: "Dmg",
	weaponAccuracy: "Accuracy",
	sensorPrecision: "Sensors",
	ftlSpeed: "FTL",
	thruster: "Thrust",
	powerGeneration: "Power",
	shieldStrength: "Shields",
	supplyCapacity: "Supply",
	crewCapacity: "Crew",
};

function formatStatName(stat: string): string {
	return STAT_DISPLAY_NAMES[stat] ?? stat;
}

const KIND_COLORS: Record<string, string> = {
	metal: "orange",
	crystal: "grape",
	gas: "indigo",
	liquid: "cyan",
	biological: "green",
};

function kindColor(kind: string): string {
	return KIND_COLORS[kind] ?? "gray";
}

const KIND_ICONS: Record<string, string> = {
	metal: "⛏️",
	crystal: "💎",
	gas: "☁️",
	liquid: "💧",
	biological: "🧬",
};

function kindIcon(kind: string): string {
	return KIND_ICONS[kind] ?? "🔬";
}

type DiscoveriesProps = {
	discoveries: NonNullable<StarSystemDetailsQuery["starSystem"]>["discoveries"];
	discoveryProgress: NonNullable<
		StarSystemDetailsQuery["starSystem"]
	>["discoveryProgress"];
};

export function StarSystemDiscoveries({
	discoveries,
	discoveryProgress,
}: DiscoveriesProps) {
	if (discoveries === null) {
		return (
			<Text c="dimmed">
				Our scanners could not pick up information about possible discoveries.
			</Text>
		);
	}

	return (
		<Stack mt="sm">
			<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
				{discoveries?.map((discovery) => {
					if (discovery.__typename === "ResourceDiscovery") {
						return (
							<Card
								key={discovery.id}
								shadow="sm"
								padding="sm"
								radius="md"
								withBorder
								style={{
									display: "flex",
									flexDirection: "column",
									height: "100%",
								}}
							>
								<Card.Section>
									<Box pos="relative">
										<Image
											src={getResourceImage(discovery.resource.kind)}
											height={140}
											fit="cover"
											alt={discovery.resource.name}
										/>
										<Badge
											variant="filled"
											color={kindColor(discovery.resource.kind)}
											size="sm"
											pos="absolute"
											top={8}
											right={8}
											style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
										>
											{kindIcon(discovery.resource.kind)}{" "}
											{discovery.resource.kind}
										</Badge>
									</Box>
								</Card.Section>

								<Stack gap="xs" mt="md" style={{ flexGrow: 1 }}>
									<div>
										<Text fw={700} lineClamp={1}>
											{discovery.resource.name}
										</Text>
										<Text
											size="xs"
											c="dimmed"
											lineClamp={2}
											style={{ minHeight: "2.8em" }}
										>
											{discovery.resource.description}
										</Text>
									</div>

									<Group grow gap="xs">
										<Box>
											<Text size="xs" c="dimmed">
												Remaining
											</Text>
											<Text size="sm" fw={500}>
												{formatUnit(discovery.remainingDeposits)}
											</Text>
										</Box>
										<Box>
											<Text size="xs" c="dimmed">
												Mining
											</Text>
											<Text size="sm" fw={500}>
												{formatUnitPerRound(discovery.miningRate)}
											</Text>
										</Box>
									</Group>

									{discovery.resource.statBonuses &&
										discovery.resource.statBonuses.length > 0 && (
											<Group gap={4}>
												{discovery.resource.statBonuses.map((bonus) => (
													<Tooltip
														key={bonus.stat}
														label={`Provides +${Math.round(bonus.modifier * 100)}% to ${formatStatName(bonus.stat)}`}
														withArrow
													>
														<Badge size="sm" variant="light" color="teal">
															+{Math.round(bonus.modifier * 100)}%{" "}
															{formatStatName(bonus.stat)}
														</Badge>
													</Tooltip>
												))}
											</Group>
										)}
								</Stack>
							</Card>
						);
					}

					return (
						<Card
							key={discovery.id}
							shadow="sm"
							padding="sm"
							radius="md"
							withBorder
							style={{
								display: "flex",
								flexDirection: "column",
								height: "100%",
							}}
						>
							<Card.Section>
								<Image
									src={placeholderDiscoveryUnknownArt}
									height={140}
									fit="contain"
									p="md"
									alt="Unknown Discovery"
								/>
							</Card.Section>
							<Stack
								gap="xs"
								mt="md"
								align="center"
								justify="center"
								style={{ flexGrow: 1 }}
							>
								<Text fw={700} c="dimmed">
									Unknown Signature
								</Text>
								<Text size="xs" c="dimmed" ta="center">
									Requires further survey to identify.
								</Text>
							</Stack>
						</Card>
					);
				})}
			</SimpleGrid>

			{discoveryProgress !== null && discoveryProgress !== undefined && (
				<Box mt="sm">
					<Group justify="space-between" mb={4}>
						<Text size="sm" fw={500}>
							Survey Progress
						</Text>
						<Text size="sm" fw={500}>
							{Math.floor(discoveryProgress * 100)}%
						</Text>
					</Group>
					<Progress
						value={discoveryProgress * 100}
						color="cyan"
						size="xl"
						radius="xl"
						striped
						animated={discoveryProgress < 1}
					/>
				</Box>
			)}
		</Stack>
	);
}
