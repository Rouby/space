import { Button, Select, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { useMutation, useQuery, useSubscription } from "urql";
import { graphql } from "../../gql";
import { IndustrialProjectType } from "../../gql/graphql";

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

	const [industrialProjectType, setIndustrialProjectType] =
		useState<IndustrialProjectType | null>(
			IndustrialProjectType.FactoryExpansion,
		);

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

	return (
		<Stack mt="xs" gap="xs">
			<Select
				label="Project type"
				data={industrialProjectOptions}
				value={industrialProjectType}
				onChange={(nextValue) =>
					setIndustrialProjectType(nextValue as IndustrialProjectType | null)
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
								{project.turnsRemaining} turns remaining (ETA {project.etaTurns}
								), +{project.completionIndustryBonus} industry.
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
							{project.completedAtTurn} (+{project.completionIndustryBonus}{" "}
							industry).
						</Text>
					))}
				</Stack>
			) : (
				<Text c="dimmed" size="sm">
					No completed industrial projects yet.
				</Text>
			)}
		</Stack>
	);
}
