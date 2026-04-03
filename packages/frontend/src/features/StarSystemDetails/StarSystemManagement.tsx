import {
	Button,
	Card,
	Group,
	NumberInput,
	Progress,
	SegmentedControl,
	Stack,
	Text,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation } from "urql";
import { formatInteger } from "../../format/formatNumber";
import { graphql } from "../../gql";
import type { StarSystemDetailsQuery } from "../../gql/graphql";
import { ColonizationGovernance, DevelopmentStance } from "../../gql/graphql";

type StarSystem = NonNullable<StarSystemDetailsQuery["starSystem"]>;

export function StarSystemManagement({
	starSystem,
	currentPlayerId,
	gameId,
	id,
}: {
	starSystem: StarSystem | null | undefined;
	currentPlayerId: string | null;
	gameId: string;
	id: string;
}) {
	const navigate = useNavigate();

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

	const [
		{
			fetching: setColonizationGovernanceFetching,
			error: setColonizationGovernanceError,
		},
		setColonizationGovernance,
	] = useMutation(
		graphql(`mutation SetColonizationGovernance($starSystemId: ID!, $governance: ColonizationGovernance) {
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
		graphql(`mutation SetColonizationPressureAllocation($targetStarSystemId: ID!, $allocations: [ColonizationPressureAllocationInput!]!) {
			setColonizationPressureAllocation(targetStarSystemId: $targetStarSystemId, allocations: $allocations) {
				id
				colonizationPressureSources {
					sourceStarSystemId
					allocatedIndustry
				}
			}
		}`),
	);

	const [developmentStance, setDevelopmentStanceValue] = useState<
		string | null
	>(null);
	const [colonizationDirective, setColonizationDirective] = useState("none");
	const [pressureAllocations, setPressureAllocations] = useState<
		Record<string, number>
	>({});

	const isOwnedByMe =
		!!starSystem?.owner?.id &&
		!!currentPlayerId &&
		starSystem.owner.id === currentPlayerId;

	useEffect(() => {
		if (!starSystem?.currentDevelopmentStance) {
			setDevelopmentStanceValue("Balance");
			return;
		}
		setDevelopmentStanceValue(starSystem.currentDevelopmentStance);
	}, [starSystem?.currentDevelopmentStance]);

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

	const devStanceErrorMsg =
		setDevelopmentStanceError?.graphQLErrors[0]?.message ??
		setDevelopmentStanceError?.message;
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

	return (
		<Card mb="md">
			<Stack gap="md">
				<Text variant="gradient">Management</Text>

				{starSystem?.colonization ? (
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
							+{formatInteger(starSystem.colonization.pressurePerTurn)} per turn
							• ETA: {starSystem.colonization.etaTurns} turns
						</Text>
					</Stack>
				) : (
					starSystem &&
					!starSystem.owner && (
						<Text size="sm" c="dimmed">
							Uninhabited system. Generate colonization pressure from nearby
							inhabited systems to colonize.
						</Text>
					)
				)}

				{starSystem && !starSystem.owner && currentPlayerId && (
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
				)}

				{starSystem &&
					!starSystem.owner &&
					currentPlayerId &&
					(starSystem.colonizationPressureSources?.length ?? 0) > 0 && (
						<Stack gap="sm">
							<Text fw={500} size="sm">
								Directed Colonization Pressure
							</Text>
							<Text size="sm" c="dimmed">
								Assign industrial capacity from your systems to push settlement
								pressure into this distant target. Distance and source
								population efficiency are applied automatically.
							</Text>
							{starSystem.colonizationPressureSources.map((source) => (
								<Stack key={source.sourceStarSystemId} gap={2}>
									<Group justify="space-between" align="end">
										<Stack gap={0}>
											<Text size="sm" fw={500}>
												{source.sourceStarSystemName}
											</Text>
											<Text size="xs" c="dimmed">
												Distance {formatInteger(Math.round(source.distance))} •
												Pop factor {(source.populationFactor * 100).toFixed(0)}%
												• Available industry {source.availableIndustry}
											</Text>
										</Stack>
										<NumberInput
											w={120}
											min={0}
											max={source.availableIndustry}
											step={1}
											value={
												pressureAllocations[source.sourceStarSystemId] ??
												source.allocatedIndustry
											}
											onChange={(nextValue) => {
												const normalized = Number(nextValue ?? 0);
												setPressureAllocations((current) => ({
													...current,
													[source.sourceStarSystemId]: Number.isFinite(
														normalized,
													)
														? Math.max(
																0,
																Math.min(
																	source.availableIndustry,
																	Math.round(normalized),
																),
															)
														: 0,
												}));
											}}
											disabled={setColonizationPressureAllocationFetching}
										/>
									</Group>
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
					)}

				{isOwnedByMe && (
					<>
						<Stack gap="sm">
							<Text fw={500} size="sm">
								Development Stance
							</Text>
							<Group align="center">
								<SegmentedControl
									value={developmentStance ?? "Balance"}
									onChange={async (nextValue) => {
										setDevelopmentStanceValue(nextValue);
										if (!nextValue || !isOwnedByMe) return;

										const stance = Object.values(DevelopmentStance).find(
											(s) => s === nextValue,
										);
										if (!stance) return;

										await setDevelopmentStance({ starSystemId: id, stance });
									}}
									disabled={!isOwnedByMe || setDevelopmentStanceFetching}
									data={[
										{
											value: DevelopmentStance.Industrialize,
											label: "Industrialize",
										},
										{ value: DevelopmentStance.Balance, label: "Balance" },
										{
											value: DevelopmentStance.GrowPopulation,
											label: "Grow Population",
										},
									]}
								/>
								{starSystem?.nextTurnStanceProjection && (
									<Text size="sm" c="dimmed">
										{starSystem.nextTurnStanceProjection.industryDelta >= 0
											? "+"
											: ""}
										{starSystem.nextTurnStanceProjection.industryDelta} Industry
										/ +
										{formatInteger(
											starSystem.nextTurnStanceProjection.populationDelta,
										)}{" "}
										Pop
									</Text>
								)}
							</Group>
							{devStanceErrorMsg && (
								<Text c="red" size="sm">
									{devStanceErrorMsg}
								</Text>
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
	);
}
