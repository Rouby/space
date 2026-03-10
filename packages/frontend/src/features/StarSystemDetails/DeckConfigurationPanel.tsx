import { Button, NumberInput, SimpleGrid, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useSubscription } from "urql";
import { graphql } from "../../gql";

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

function buildDeckDraft(cardIds: string[] | null | undefined) {
	const next = Object.fromEntries(
		ALLOWED_CARD_IDS.map((cardId) => [cardId, 0]),
	) as Record<(typeof ALLOWED_CARD_IDS)[number], number>;

	for (const cardId of cardIds ?? []) {
		if (cardId in next) {
			next[cardId as (typeof ALLOWED_CARD_IDS)[number]] += 1;
		}
	}

	return next;
}

function expandDeckFromDraft(
	draft: Record<(typeof ALLOWED_CARD_IDS)[number], number>,
) {
	return ALLOWED_CARD_IDS.flatMap((cardId) =>
		Array.from({ length: draft[cardId] ?? 0 }, () => cardId),
	);
}

export function DeckConfigurationPanel({
	id, // starSystemId
	taskForceId,
}: {
	id: string;
	taskForceId: string;
}) {
	const [{ data }] = useQuery({
		query: graphql(`query DeckConfigurationStarSystem($id: ID!) {
			starSystem(id: $id) {
				id
				taskForces {
					id
					name
					combatDeck
				}
			}
		}`),
		variables: { id },
	});

	const [{ data: subscriptionData }] = useSubscription({
		query: graphql(`subscription TrackDeckConfigurationStarSystem($id: ID!) {
			trackStarSystem(starSystemId: $id) {
				... on StarSystemUpdateEvent {
					subject {
						id
						taskForces {
							id
							name
							combatDeck
						}
					}
				}
			}
		}`),
		variables: { id },
	});

	const [configureDeckState, configureTaskForceCombatDeck] = useMutation(
		graphql(`mutation ConfigureTaskForceCombatDeckPanel($input: ConfigureTaskForceCombatDeckInput!) {
			configureTaskForceCombatDeck(input: $input) {
				id
				combatDeck
			}
		}`),
	);

	const starSystem =
		subscriptionData?.trackStarSystem.__typename === "StarSystemUpdateEvent"
			? subscriptionData.trackStarSystem.subject
			: data?.starSystem;

	const taskForce = starSystem?.taskForces?.find((tf) => tf.id === taskForceId);

	const [deckDraft, setDeckDraft] = useState<Record<
		(typeof ALLOWED_CARD_IDS)[number],
		number
	> | null>(null);
	const [deckError, setDeckError] = useState<string | null>(null);

	useEffect(() => {
		if (taskForce?.combatDeck && !deckDraft) {
			setDeckDraft(buildDeckDraft(taskForce.combatDeck));
		}
	}, [taskForce?.combatDeck, deckDraft]);

	if (!taskForce) {
		return <Text>Loading task force...</Text>;
	}

	const draft = deckDraft ?? buildDeckDraft(taskForce.combatDeck);
	const cardCount = ALLOWED_CARD_IDS.reduce(
		(acc, cardId) => acc + (draft[cardId] ?? 0),
		0,
	);
	const canSave = cardCount === DECK_SIZE;

	return (
		<Stack gap="xs" mt="xs">
			<Text size="sm" fw={600}>
				Configure deck for {taskForce.name}
			</Text>
			<SimpleGrid cols={2} spacing="xs">
				{ALLOWED_CARD_IDS.map((cardId) => (
					<NumberInput
						key={`${taskForce.id}:${cardId}`}
						label={CARD_LABELS[cardId]}
						min={0}
						max={2}
						allowDecimal={false}
						value={draft[cardId] ?? 0}
						onChange={(value) => {
							const numericValue =
								typeof value === "number" && Number.isFinite(value) ? value : 0;

							setDeckDraft((current) => ({
								...(current ?? buildDeckDraft(taskForce.combatDeck)),
								[cardId]: Math.max(0, Math.min(2, Math.floor(numericValue))),
							}));
							setDeckError(null);
						}}
					/>
				))}
			</SimpleGrid>
			<Text size="xs" c={canSave ? "teal" : "yellow"}>
				Deck size: {cardCount} / {DECK_SIZE}
			</Text>
			<Button
				size="xs"
				loading={configureDeckState.fetching}
				disabled={!canSave || configureDeckState.fetching}
				onClick={async () => {
					setDeckError(null);
					const result = await configureTaskForceCombatDeck({
						input: {
							taskForceId: taskForce.id,
							cardIds: expandDeckFromDraft(draft),
						},
					});

					if (!result.error) {
						return;
					}

					const gqlError = result.error.graphQLErrors[0];
					const code = gqlError?.extensions?.code;

					if (code === "INVALID_DECK_SIZE") {
						setDeckError("Deck must contain exactly 12 cards.");
						return;
					}

					if (code === "DUPLICATE_CARD_LIMIT_EXCEEDED") {
						setDeckError("Each card can appear at most 2 times.");
						return;
					}

					if (code === "CARD_NOT_ALLOWED") {
						setDeckError("Selected card is not allowed in the MVP pool.");
						return;
					}

					if (code === "NOT_AUTHORIZED") {
						setDeckError("You are not allowed to edit this task force deck.");
						return;
					}

					setDeckError(gqlError?.message ?? result.error?.message);
				}}
			>
				Save deck
			</Button>
			{deckError && (
				<Text c="red" size="xs">
					{deckError}
				</Text>
			)}
		</Stack>
	);
}
