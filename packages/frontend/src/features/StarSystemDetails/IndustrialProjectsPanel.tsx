import {
	Badge,
	Card,
	Group,
	Progress,
	SimpleGrid,
	Stack,
	Tabs,
	Text,
	Tooltip,
	UnstyledButton,
} from "@mantine/core";
import { useState } from "react";
import { useMutation, useQuery, useSubscription } from "urql";
import { graphql } from "../../gql";
import { IndustrialProjectType } from "../../gql/graphql";

const categoryConfig: Record<
	string,
	{ label: string; icon: string; color: string }
> = {
	industry: { label: "Industry", icon: "🏭", color: "orange" },
	discovery: { label: "Discovery", icon: "🔬", color: "cyan" },
	population: { label: "Population", icon: "👥", color: "green" },
	logistics: { label: "Logistics", icon: "🚀", color: "violet" },
};

type ProjectOption = {
	value: IndustrialProjectType;
	label: string;
	category: string;
	description: string;
	workRequired: number;
	industryPerTurn: number;
	maintenanceCost: number;
	effectSummary: string;
};

const projectOptions: ProjectOption[] = [
	{
		value: IndustrialProjectType.FactoryExpansion,
		label: "Factory Expansion",
		category: "industry",
		description: "Expand surface-level manufacturing lines.",
		workRequired: 12,
		industryPerTurn: 3,
		maintenanceCost: 0,
		effectSummary: "+2 industry",
	},
	{
		value: IndustrialProjectType.AutomationHub,
		label: "Automation Hub",
		category: "industry",
		description: "Deploy automated production drones.",
		workRequired: 18,
		industryPerTurn: 4,
		maintenanceCost: 0,
		effectSummary: "+3 industry",
	},
	{
		value: IndustrialProjectType.OrbitalFoundry,
		label: "Orbital Foundry",
		category: "industry",
		description: "Zero-gravity mega-forge in orbit.",
		workRequired: 30,
		industryPerTurn: 6,
		maintenanceCost: 0,
		effectSummary: "+5 industry",
	},
	{
		value: IndustrialProjectType.DeepCoreScanner,
		label: "Deep Core Scanner",
		category: "discovery",
		description: "Bore deep-spectrum probes into the core.",
		workRequired: 15,
		industryPerTurn: 3,
		maintenanceCost: 1,
		effectSummary: "+25% discovery progress",
	},
	{
		value: IndustrialProjectType.XenoarchaeologyLab,
		label: "Xenoarchaeology Lab",
		category: "discovery",
		description: "Dedicated research for new discoveries.",
		workRequired: 25,
		industryPerTurn: 4,
		maintenanceCost: 2,
		effectSummary: "+1 discovery slot",
	},
	{
		value: IndustrialProjectType.HabitationDome,
		label: "Habitation Dome",
		category: "population",
		description: "Pressurized quarters for colonists.",
		workRequired: 14,
		industryPerTurn: 3,
		maintenanceCost: 1,
		effectSummary: "+500K population",
	},
	{
		value: IndustrialProjectType.GravityWellSpire,
		label: "Gravity Well Spire",
		category: "population",
		description: "Arcology that accelerates growth.",
		workRequired: 28,
		industryPerTurn: 5,
		maintenanceCost: 2,
		effectSummary: "+20% pop growth",
	},
	{
		value: IndustrialProjectType.FleetDrydock,
		label: "Fleet Drydock",
		category: "logistics",
		description: "Orbital shipyard reduces build costs.",
		workRequired: 22,
		industryPerTurn: 4,
		maintenanceCost: 2,
		effectSummary: "−20% construction cost",
	},
];

export function IndustrialProjectsPanel({
	id,
	gameId,
}: {
	id: string;
	gameId: string;
}) {
	const [{ data: commissionContext }] = useQuery({
		query: graphql(`query IndustrialProjectsContext($gameId: ID!) {
			game(id: $gameId) {
				id
				me {
					id
				}
			}
		}`),
		variables: { gameId },
	});

	const [{ data }] = useQuery({
		query: graphql(`query IndustrialProjectsStarSystem($id: ID!) {
			starSystem(id: $id) {
				id
				owner {
					id
				}
				industrialProjects {
					id
					projectType
					category
					description
					industryPerTurn
					workRequired
					workDone
					completionIndustryBonus
					maintenanceCost
					queuePosition
					turnsRemaining
					etaTurns
				}
				completedIndustrialProjects {
					id
					projectType
					category
					completionIndustryBonus
					maintenanceCost
					completedAtTurn
				}
			}
		}`),
		variables: { id },
	});

	const [{ data: subscriptionData }] = useSubscription({
		query: graphql(`subscription TrackIndustrialProjectsStarSystem($id: ID!) {
			trackStarSystem(starSystemId: $id) {
				... on StarSystemUpdateEvent {
					subject {
						id
						owner {
							id
						}
						industrialProjects {
							id
							projectType
							category
							description
							industryPerTurn
							workRequired
							workDone
							completionIndustryBonus
							maintenanceCost
							queuePosition
							turnsRemaining
							etaTurns
						}
						completedIndustrialProjects {
							id
							projectType
							category
							completionIndustryBonus
							maintenanceCost
							completedAtTurn
						}
					}
				}
			}
		}`),
		variables: { id },
	});

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

	const [activeTab, setActiveTab] = useState<string | null>("industry");

	const starSystem =
		subscriptionData?.trackStarSystem.__typename === "StarSystemUpdateEvent"
			? subscriptionData.trackStarSystem.subject
			: data?.starSystem;

	const currentPlayerId = commissionContext?.game.me?.id ?? null;
	const isOwnedByMe =
		!!starSystem?.owner?.id &&
		!!currentPlayerId &&
		starSystem.owner.id === currentPlayerId;

	const queueIndustrialProjectError =
		queueIndustrialProjectState.error?.graphQLErrors[0]?.message ??
		queueIndustrialProjectState.error?.message;

	const totalMaintenanceCost =
		starSystem?.completedIndustrialProjects?.reduce(
			(acc, p) => acc + p.maintenanceCost,
			0,
		) ?? 0;

	const projectsByCategory = Object.keys(categoryConfig).map((cat) => ({
		category: cat,
		...categoryConfig[cat],
		projects: projectOptions.filter((p) => p.category === cat),
	}));

	return (
		<Stack mt="xs" gap="md">
			{/* Maintenance Drain Banner */}
			{totalMaintenanceCost > 0 && (
				<Card
					padding="xs"
					radius="sm"
					style={{
						background:
							"linear-gradient(135deg, rgba(255, 107, 107, 0.08), rgba(255, 107, 107, 0.02))",
						border: "1px solid rgba(255, 107, 107, 0.2)",
					}}
				>
					<Group justify="space-between">
						<Group gap="xs">
							<Text size="sm" c="dimmed">
								⚡ Active Maintenance Drain
							</Text>
						</Group>
						<Badge color="red" variant="light" size="lg">
							−{totalMaintenanceCost} industry/turn
						</Badge>
					</Group>
				</Card>
			)}

			{/* Queue Section */}
			{starSystem?.industrialProjects?.length ? (
				<Card padding="sm" radius="sm" withBorder>
					<Text size="sm" fw={700} mb="xs">
						Build Queue
					</Text>
					<Stack gap="xs">
						{starSystem.industrialProjects
							.slice()
							.sort((a, b) => a.queuePosition - b.queuePosition)
							.map((project) => {
								const catConfig =
									categoryConfig[project.category] ?? categoryConfig.industry;
								const progress =
									project.workRequired > 0
										? (project.workDone / project.workRequired) * 100
										: 0;

								return (
									<Card key={project.id} padding="xs" radius="sm" withBorder>
										<Group justify="space-between" mb={4}>
											<Group gap="xs">
												<Text size="xs">{catConfig.icon}</Text>
												<Text size="sm" fw={600}>
													{project.description ||
														formatProjectType(project.projectType)}
												</Text>
											</Group>
											<Group gap="xs">
												{project.maintenanceCost > 0 && (
													<Tooltip label="Ongoing maintenance cost after completion">
														<Badge size="xs" variant="light" color="red">
															−{project.maintenanceCost}/turn
														</Badge>
													</Tooltip>
												)}
												<Badge
													size="xs"
													variant="light"
													color={catConfig.color}
												>
													{catConfig.label}
												</Badge>
											</Group>
										</Group>
										<Progress
											value={progress}
											color={catConfig.color}
											size="sm"
											radius="xl"
										/>
										<Group justify="space-between" mt={4}>
											<Text size="xs" c="dimmed">
												{project.workDone} / {project.workRequired} work
											</Text>
											<Text size="xs" c="dimmed">
												{project.turnsRemaining > 0
													? `${project.turnsRemaining} turns remaining`
													: "Waiting…"}
											</Text>
										</Group>
									</Card>
								);
							})}
					</Stack>
				</Card>
			) : (
				<Text c="dimmed" size="sm">
					No queued projects. Select a project below to begin construction.
				</Text>
			)}

			{!isOwnedByMe && (
				<Text c="dimmed" size="sm">
					You can queue projects only in star systems you own.
				</Text>
			)}

			{queueIndustrialProjectError && (
				<Text c="red" size="sm">
					{queueIndustrialProjectError}
				</Text>
			)}

			{/* Project Picker */}
			{isOwnedByMe && (
				<Card padding="sm" radius="sm" withBorder>
					<Text size="sm" fw={700} mb="xs">
						New Project
					</Text>
					<Tabs value={activeTab} onChange={setActiveTab}>
						<Tabs.List grow>
							{projectsByCategory.map((cat) => (
								<Tabs.Tab
									key={cat.category}
									value={cat.category}
									leftSection={<Text size="sm">{cat.icon}</Text>}
								>
									{cat.label}
								</Tabs.Tab>
							))}
						</Tabs.List>

						{projectsByCategory.map((cat) => (
							<Tabs.Panel key={cat.category} value={cat.category} pt="sm">
								<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
									{cat.projects.map((project) => (
										<UnstyledButton
											key={project.value}
											onClick={async () => {
												await queueIndustrialProject({
													starSystemId: id,
													projectType: project.value,
												});
											}}
											disabled={queueIndustrialProjectState.fetching}
										>
											<Card
												padding="sm"
												radius="sm"
												withBorder
												style={{
													cursor: "pointer",
													transition: "all 0.15s ease",
												}}
												className="project-card"
											>
												<Group justify="space-between" mb={4}>
													<Text size="sm" fw={600}>
														{project.label}
													</Text>
													{project.maintenanceCost > 0 && (
														<Tooltip label="Ongoing maintenance cost">
															<Badge size="xs" variant="light" color="red">
																−{project.maintenanceCost}/turn
															</Badge>
														</Tooltip>
													)}
												</Group>
												<Text size="xs" c="dimmed" mb="xs">
													{project.description}
												</Text>
												<Group gap="xs" wrap="wrap">
													<Badge size="xs" variant="dot" color={cat.color}>
														{project.effectSummary}
													</Badge>
													<Badge size="xs" variant="outline" color="gray">
														{project.workRequired} work ·{" "}
														{project.industryPerTurn}/turn
													</Badge>
													<Badge size="xs" variant="outline" color="gray">
														~
														{Math.ceil(
															project.workRequired / project.industryPerTurn,
														)}{" "}
														turns
													</Badge>
												</Group>
											</Card>
										</UnstyledButton>
									))}
								</SimpleGrid>
							</Tabs.Panel>
						))}
					</Tabs>
				</Card>
			)}

			{/* Completed Projects */}
			{starSystem?.completedIndustrialProjects?.length ? (
				<Card padding="sm" radius="sm" withBorder>
					<Text size="sm" fw={700} mb="xs">
						Completed Projects
					</Text>
					<Stack gap={4}>
						{starSystem.completedIndustrialProjects.map((project) => {
							const catConfig =
								categoryConfig[project.category] ?? categoryConfig.industry;
							return (
								<Group key={project.id} justify="space-between">
									<Group gap="xs">
										<Text size="xs">{catConfig.icon}</Text>
										<Text size="sm">
											{formatProjectType(project.projectType)}
										</Text>
									</Group>
									<Group gap="xs">
										{project.completionIndustryBonus > 0 && (
											<Badge size="xs" variant="light" color="orange">
												+{project.completionIndustryBonus} industry
											</Badge>
										)}
										{project.maintenanceCost > 0 && (
											<Badge size="xs" variant="light" color="red">
												−{project.maintenanceCost}/turn
											</Badge>
										)}
										<Text size="xs" c="dimmed">
											Turn {project.completedAtTurn}
										</Text>
									</Group>
								</Group>
							);
						})}
					</Stack>
				</Card>
			) : (
				<Text c="dimmed" size="sm">
					No completed projects yet.
				</Text>
			)}
		</Stack>
	);
}

function formatProjectType(value: string): string {
	return value
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
