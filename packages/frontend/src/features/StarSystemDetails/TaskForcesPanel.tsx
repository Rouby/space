import { Button, Center, Progress, Stack, Text, } from "@mantine/core";
import { useQuery, useSubscription } from "urql";
import { formatNumber } from "../../format/formatNumber";
import { graphql } from "../../gql";
import { useNavigate } from "@tanstack/react-router";
import { useStyles } from "tss-react";

const DECK_SIZE = 12;

const ALLOWED_CARD_IDS = [
	"laser_burst",
	"target_lock",
	"emergency_repairs",
	"shield_pulse",
	"evasive_maneuver",
	"overcharge_barrage",
] as const;

const CARD_LABELS: Record<(typeof ALLOWED_CARD_IDS)[number], string> = {
	laser_burst: "Laser Burst",
	target_lock: "Target Lock",
	emergency_repairs: "Emergency Repairs",
	shield_pulse: "Shield Pulse",
	evasive_maneuver: "Evasive Maneuver",
	overcharge_barrage: "Overcharge Barrage",
};

export function TaskForcesPanel({
	id,
	gameId,
}: {
	id: string;
	gameId: string;
}) {
	const { css } = useStyles();
	const navigate = useNavigate();

	const [{ data: commissionContext }] = useQuery({
		query: graphql(`query TaskForcesContextPanel($gameId: ID!) {
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
		query: graphql(`query TaskForcesStarSystem($id: ID!) {
			starSystem(id: $id) {
				id
				taskForces {
					id
					name
					combatDeck
					constructionDone
					constructionTotal
					constructionPerTick
					owner {
						id
						name
					}
				}
			}
		}`),
		variables: { id },
	});

	const [{ data: subscriptionData }] = useSubscription({
		query: graphql(`subscription TrackTaskForcesStarSystem($id: ID!) {
			trackStarSystem(starSystemId: $id) {
				... on StarSystemUpdateEvent {
					subject {
						id
						taskForces {
							id
							name
							combatDeck
							constructionDone
							constructionTotal
							constructionPerTick
							owner {
								id
								name
							}
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

	const currentPlayerId = commissionContext?.game.me?.id ?? null;

	const formatReadiness = (
		constructionDone: number | null | undefined,
		constructionTotal: number | null | undefined,
		constructionPerTick: number | null | undefined,
	) => {
		const done = constructionDone ?? 0;
		const total = constructionTotal ?? 0;
		if (total <= 0 || done >= total) {
			return {
				label: "Ready",
				detail: "Operational",
				progress: 100,
			};
		}

		const perTick = constructionPerTick ?? 0;
		const remaining = Math.max(0, total - done);
		const etaTurns = perTick > 0 ? Math.ceil(remaining / perTick) : null;

		return {
			label: "Under construction",
			detail:
				etaTurns === null
					? `${formatNumber(done)} / ${formatNumber(total)} progress, awaiting industry`
					: `${formatNumber(done)} / ${formatNumber(total)} progress, ETA ${etaTurns} turn${etaTurns === 1 ? "" : "s"}`,
			progress: Math.min(100, (done / total) * 100),
		};
	};

	return (
		<Stack mt="xs">
			<div
				className={css({
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gap: "16px",
				})}
			>
				{starSystem?.taskForces?.map((tf) => (
					<Stack
						key={tf.id}
						gap="xs"
						align="stretch"
						className={css({
							padding: "8px",
							border: "1px solid var(--mantine-color-dark-4)",
							borderRadius: "8px",
						})}
					>
						<Center>{tf.name}</Center>
						<Text size="xs" c="dimmed" ta="center">
							Combat deck: {(tf.combatDeck ?? []).length} / {DECK_SIZE} cards
						</Text>
						<Text size="xs" c="dimmed">
							{(tf.combatDeck ?? []).length > 0
								? (tf.combatDeck ?? [])
										.map((cardId: string) =>
											cardId in CARD_LABELS
												? CARD_LABELS[cardId as keyof typeof CARD_LABELS]
												: cardId,
										)
										.join(", ")
								: "No deck configured"}
						</Text>
						{(() => {
							const readiness = formatReadiness(
								tf.constructionDone,
								tf.constructionTotal,
								tf.constructionPerTick,
							);

							return (
								<>
									<Text size="xs" c="dimmed" ta="center">
										{readiness.label}
									</Text>
									<Text size="xs" c="dimmed" ta="center">
										{readiness.detail}
									</Text>
									<Progress
										size="xs"
										value={readiness.progress}
										color={readiness.progress >= 100 ? "teal" : "yellow"}
									/>
								</>
							);
						})()}
						{tf.owner?.id === currentPlayerId && (
							<Button
								onClick={() =>
									navigate({
										to: "/games/$id/star-system/$starSystemId/task-forces/$taskForceId",
										params: { id: gameId, starSystemId: id, taskForceId: tf.id },
									})
								}
								size="xs"
								mt="xs"
								variant="light"
							>
								Configure deck
							</Button>
						)}
					</Stack>
				))}
			</div>
			{(!starSystem?.taskForces || starSystem.taskForces.length === 0) && (
				<Text c="dimmed" size="sm">
					No task forces in this system.
				</Text>
			)}
		</Stack>
	);
}
