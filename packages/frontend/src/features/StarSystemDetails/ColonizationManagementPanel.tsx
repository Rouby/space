import {
	Button,
	Group,
	Progress,
	SegmentedControl,
	Slider,
	Stack,
	Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useSubscription } from "urql";
import { formatInteger } from "../../format/formatNumber";
import { graphql } from "../../gql";
import { ColonizationGovernance } from "../../gql/graphql";

export function ColonizationManagementPanel({
	id,
	gameId,
}: {
	id: string;
	gameId: string;
}) {
	const [{ data: meContext }] = useQuery({
		query: graphql(`query ColonizationManagementContext($gameId: ID!) {
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
		query: graphql(`query ColonizationManagementStarSystem($id: ID!) {
      starSystem(id: $id) {
        id
        owner {
          id
        }
        colonizationGovernance
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
        colonizationPressureSources {
          sourceStarSystemId
          sourceStarSystemName
          distance
          availableIndustry
          allocatedIndustry
          populationFactor
          distanceFactor
        }
      }
    }`),
		variables: { id },
	});

	const [{ data: subscriptionData }] = useSubscription({
		query:
			graphql(`subscription TrackColonizationManagementStarSystem($id: ID!) {
      trackStarSystem(starSystemId: $id) {
        ... on StarSystemUpdateEvent {
          subject {
            id
            owner {
              id
            }
            colonizationGovernance
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
            colonizationPressureSources {
              sourceStarSystemId
              sourceStarSystemName
              distance
              availableIndustry
              allocatedIndustry
              populationFactor
              distanceFactor
            }
          }
        }
      }
    }`),
		variables: { id },
	});

	const [
		{
			fetching: setColonizationGovernanceFetching,
			error: setColonizationGovernanceError,
		},
		setColonizationGovernance,
	] = useMutation(
		graphql(`mutation SetColonizationGovernanceFromPanel($starSystemId: ID!, $governance: ColonizationGovernance) {
      setColonizationGovernance(starSystemId: $starSystemId, governance: $governance) {
        id
        colonizationGovernance
      }
    }`),
	);

	const [
		{
			fetching: setColonizationPressureAllocationFetching,
			error: setColonizationPressureAllocationError,
		},
		setColonizationPressureAllocation,
	] = useMutation(
		graphql(`mutation SetColonizationPressureAllocationFromPanel($targetStarSystemId: ID!, $allocations: [ColonizationPressureAllocationInput!]!) {
      setColonizationPressureAllocation(targetStarSystemId: $targetStarSystemId, allocations: $allocations) {
        id
        colonizationPressureSources {
          sourceStarSystemId
          allocatedIndustry
        }
      }
    }`),
	);

	const [colonizationDirective, setColonizationDirective] = useState("none");
	const [pressureAllocations, setPressureAllocations] = useState<
		Record<string, number>
	>({});

	const starSystem =
		subscriptionData?.trackStarSystem.__typename === "StarSystemUpdateEvent"
			? subscriptionData.trackStarSystem.subject
			: data?.starSystem;

	const currentPlayerId = meContext?.game.me?.id ?? null;

	useEffect(() => {
		setColonizationDirective(starSystem?.colonizationGovernance ?? "none");
	}, [starSystem?.colonizationGovernance]);

	useEffect(() => {
		if (!starSystem?.colonizationPressureSources) {
			setPressureAllocations({});
			return;
		}

		setPressureAllocations(
			Object.fromEntries(
				starSystem.colonizationPressureSources.map((source) => [
					source.sourceStarSystemId,
					source.allocatedIndustry,
				]),
			),
		);
	}, [starSystem?.colonizationPressureSources]);

	const colGovErrorMsg =
		setColonizationGovernanceError?.graphQLErrors[0]?.message ??
		setColonizationGovernanceError?.message;
	const colPressureErrorMsg =
		setColonizationPressureAllocationError?.graphQLErrors[0]?.message ??
		setColonizationPressureAllocationError?.message;

	const projectedPressurePerTurn = (
		starSystem?.colonizationPressureSources ?? []
	).reduce((sum, source) => {
		const allocated = Math.max(
			0,
			Math.min(
				source.availableIndustry,
				pressureAllocations[source.sourceStarSystemId] ??
					source.allocatedIndustry,
			),
		);

		return sum + allocated * source.populationFactor * source.distanceFactor;
	}, 0);

	if (!starSystem) {
		return (
			<Text size="sm" c="dimmed">
				Loading colonization data...
			</Text>
		);
	}

	if (!currentPlayerId) {
		return (
			<Text size="sm" c="dimmed">
				Sign in to manage colonization directives.
			</Text>
		);
	}

	if (starSystem.owner) {
		return (
			<Text size="sm" c="dimmed">
				This star system is already inhabited, so colonization directives are
				unavailable.
			</Text>
		);
	}

	return (
		<Stack mt="xs" gap="md">
			{starSystem.colonization && (
				<Stack gap="xs">
					<Text mt="sm">
						Colonization in progress by {starSystem.colonization.player.name}
					</Text>
					<Group justify="space-between">
						<Text size="sm">Progress</Text>
						<Text size="sm" c="dimmed">
							{formatInteger(starSystem.colonization.accumulated)} /{" "}
							{formatInteger(starSystem.colonization.threshold)}
						</Text>
					</Group>
					<Progress
						value={
							(starSystem.colonization.accumulated /
								starSystem.colonization.threshold) *
							100
						}
						color={
							starSystem.colonization.player.id === currentPlayerId
								? "blue"
								: "red"
						}
					/>
					<Text size="xs" c="dimmed">
						+{formatInteger(starSystem.colonization.pressurePerTurn)} per turn •
						ETA: {starSystem.colonization.etaTurns} turns
					</Text>
				</Stack>
			)}

			<Stack gap="sm">
				<Text fw={500} size="sm">
					Colonization Directive
				</Text>
				<Text size="sm" c="dimmed">
					Prioritize this system for passive settlement, or block it from
					automatic colonization.
				</Text>
				<SegmentedControl
					value={colonizationDirective}
					onChange={async (nextValue) => {
						setColonizationDirective(nextValue);

						const governance = Object.values(ColonizationGovernance).find(
							(value) => value === nextValue,
						);
						const result = await setColonizationGovernance({
							starSystemId: id,
							governance: governance ?? null,
						});

						if (result.error) {
							setColonizationDirective(
								starSystem.colonizationGovernance ?? "none",
							);
						}
					}}
					disabled={setColonizationGovernanceFetching}
					data={[
						{ value: "none", label: "None" },
						{ value: "focus", label: "Focus" },
						{ value: "forbid", label: "Forbid" },
					]}
				/>
				{colGovErrorMsg && (
					<Text c="red" size="sm">
						{colGovErrorMsg}
					</Text>
				)}
			</Stack>

			{(starSystem.colonizationPressureSources?.length ?? 0) > 0 ? (
				<Stack gap="sm">
					<Text fw={500} size="sm">
						Directed Colonization Pressure
					</Text>
					<Text size="sm" c="dimmed">
						Assign industrial capacity from your systems to push settlement
						pressure into this distant target. Distance and source population
						efficiency are applied automatically.
					</Text>
					{starSystem.colonizationPressureSources.map((source) => (
						<Stack key={source.sourceStarSystemId} gap={2}>
							<Group justify="space-between" align="center">
								<Stack gap={0}>
									<Text size="sm" fw={500}>
										{source.sourceStarSystemName}
									</Text>
									<Text size="xs" c="dimmed">
										Distance {formatInteger(Math.round(source.distance))} • Pop
										factor {(source.populationFactor * 100).toFixed(0)}% •
										Available industry {source.availableIndustry}
									</Text>
								</Stack>
								<Text size="sm" fw={500}>
									{formatInteger(
										pressureAllocations[source.sourceStarSystemId] ??
											source.allocatedIndustry,
									)}
								</Text>
							</Group>
							<Slider
								min={0}
								max={source.availableIndustry}
								step={1}
								value={
									pressureAllocations[source.sourceStarSystemId] ??
									source.allocatedIndustry
								}
								onChange={(nextValue) => {
									setPressureAllocations((current) => ({
										...current,
										[source.sourceStarSystemId]: Math.max(
											0,
											Math.min(source.availableIndustry, Math.round(nextValue)),
										),
									}));
								}}
								disabled={setColonizationPressureAllocationFetching}
								orientation="horizontal"
							/>
							<Text size="xs" c="dimmed">
								Projected pressure/turn: +
								{formatInteger(
									Math.round(
										source.distanceFactor *
											source.populationFactor *
											(pressureAllocations[source.sourceStarSystemId] ??
												source.allocatedIndustry) *
											1000,
									) / 1000,
								)}
							</Text>
						</Stack>
					))}
					<Group justify="space-between" align="center">
						<Text size="sm" c="dimmed">
							Total projected directed pressure: +
							{formatInteger(
								Math.round(projectedPressurePerTurn * 1000) / 1000,
							)}
						</Text>
						<Button
							onClick={async () => {
								await setColonizationPressureAllocation({
									targetStarSystemId: id,
									allocations: starSystem.colonizationPressureSources.map(
										(source) => ({
											sourceStarSystemId: source.sourceStarSystemId,
											industryCommitted:
												pressureAllocations[source.sourceStarSystemId] ??
												source.allocatedIndustry,
										}),
									),
								});
							}}
							loading={setColonizationPressureAllocationFetching}
						>
							Apply Pressure Plan
						</Button>
					</Group>
					{colPressureErrorMsg && (
						<Text c="red" size="sm">
							{colPressureErrorMsg}
						</Text>
					)}
				</Stack>
			) : (
				<Text size="sm" c="dimmed">
					No eligible source systems currently have available industry for
					directed colonization pressure.
				</Text>
			)}
		</Stack>
	);
}
