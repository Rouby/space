import {
	Button,
	Card,
	Group,
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
import { DevelopmentStance } from "../../gql/graphql";

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

	const [developmentStance, setDevelopmentStanceValue] = useState<
		string | null
	>(null);

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

	const devStanceErrorMsg =
		setDevelopmentStanceError?.graphQLErrors[0]?.message ??
		setDevelopmentStanceError?.message;

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
					<Button
						onClick={() =>
							navigate({
								to: "/games/$id/star-system/$starSystemId/colonization",
								params: { id: gameId, starSystemId: id },
							})
						}
						variant="light"
					>
						Colonization Management
					</Button>
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
