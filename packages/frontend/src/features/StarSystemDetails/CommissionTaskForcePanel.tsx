import { Button, Group, Select, Stack, Text, TextInput } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useSubscription } from "urql";
import { formatInteger } from "../../format/formatNumber";
import { graphql } from "../../gql";

export function CommissionTaskForcePanel({
	id,
	gameId,
}: {
	id: string;
	gameId: string;
}) {
	const [{ data: commissionContext }] = useQuery({
		query: graphql(`query CommissionFleetContextPanel($gameId: ID!) {
			game(id: $gameId) {
				id
				me {
					id
					shipDesigns {
						id
						name
						components {
							component {
								constructionCost
							}
						}
					}
				}
			}
		}`),
		variables: { gameId },
	});

	const [{ data }] = useQuery({
		query: graphql(`query CommissionTaskForceStarSystem($id: ID!) {
			starSystem(id: $id) {
				id
				industry
				owner {
					id
				}
			}
		}`),
		variables: { id },
	});

	const [{ data: subscriptionData }] = useSubscription({
		query: graphql(`subscription TrackCommissionTaskForceStarSystem($id: ID!) {
			trackStarSystem(starSystemId: $id) {
				... on StarSystemUpdateEvent {
					subject {
						id
						industry
						owner {
							id
						}
					}
				}
			}
		}`),
		variables: { id },
	});

	const [constructTaskForceState, constructTaskForce] = useMutation(
		graphql(`mutation ConstructTaskForce($input: ConstructTaskForceInput!) {
			constructTaskForce(input: $input) {
				id
				name
			}
		}`),
	);

	const [fleetName, setFleetName] = useState("");
	const [shipDesignId, setShipDesignId] = useState<string | null>(null);

	const starSystem =
		subscriptionData?.trackStarSystem.__typename === "StarSystemUpdateEvent"
			? subscriptionData.trackStarSystem.subject
			: data?.starSystem;

	const currentPlayerId = commissionContext?.game.me?.id ?? null;
	const isOwnedByMe =
		!!starSystem?.owner?.id &&
		!!currentPlayerId &&
		starSystem.owner.id === currentPlayerId;

	const shipDesignOptions = useMemo(
		() =>
			(commissionContext?.game.me?.shipDesigns ?? []).map((design) => ({
				value: design.id,
				label: design.name,
			})),
		[commissionContext?.game.me?.shipDesigns],
	);

	useEffect(() => {
		if (!shipDesignOptions.length) {
			setShipDesignId(null);
			return;
		}

		setShipDesignId((current) =>
			current && shipDesignOptions.some((option) => option.value === current)
				? current
				: (shipDesignOptions[0]?.value ?? null),
		);
	}, [shipDesignOptions]);

	const commissionError = (() => {
		const gqlError = constructTaskForceState.error?.graphQLErrors[0];
		const code = gqlError?.extensions?.code;
		const violation = gqlError?.extensions?.violation;

		if (code === "DUPLICATE_TASK_FORCE_NAME") {
			return "Task force name already exists. Choose another name.";
		}

		if (code === "INVALID_CONSTRUCTION_ORDER") {
			if (violation === "ORIGIN_NOT_OWNED") {
				return "You can only commission task forces in systems you own.";
			}

			if (violation === "SHIP_DESIGN_UNAVAILABLE") {
				return "Selected ship design is unavailable for this empire.";
			}
		}

		if (code === "INSUFFICIENT_INDUSTRY") {
			return "This star system has no industrial capacity.";
		}

		if (code === "INSUFFICIENT_RESOURCES") {
			const resourceId =
				typeof gqlError?.extensions?.resourceId === "string"
					? gqlError.extensions.resourceId
					: null;
			const required =
				typeof gqlError?.extensions?.required === "number"
					? gqlError.extensions.required
					: null;
			const available =
				typeof gqlError?.extensions?.available === "number"
					? gqlError.extensions.available
					: null;

			if (resourceId && required !== null && available !== null) {
				return `Insufficient resource ${resourceId}: required ${required}, available ${available}.`;
			}

			return "Insufficient special resources for construction.";
		}

		return gqlError?.message ?? constructTaskForceState.error?.message;
	})();

	return (
		<Stack mt="xs">
			<TextInput
				label="Fleet name"
				placeholder="Expeditionary Wing"
				value={fleetName}
				onChange={(event) => setFleetName(event.currentTarget.value)}
				disabled={!isOwnedByMe}
			/>
			<Select
				label="Ship design"
				placeholder="Select a design"
				data={shipDesignOptions}
				value={shipDesignId}
				onChange={setShipDesignId}
				disabled={!isOwnedByMe || shipDesignOptions.length === 0}
			/>
			{(() => {
				if (!shipDesignId) return null;
				const selectedDesign = commissionContext?.game.me?.shipDesigns?.find(
					(d) => d.id === shipDesignId,
				);
				if (!selectedDesign) return null;

				const cost = selectedDesign.components.reduce(
					(sum, comp) => sum + comp.component.constructionCost,
					0,
				);
				const industry = starSystem?.industry ?? 1;
				const turns = industry > 0 ? Math.ceil(cost / industry) : "Infinity";

				return (
					<Text size="sm" c="dimmed">
						Construction cost: {formatInteger(cost)}. Time to build: {turns}{" "}
						turns.
					</Text>
				);
			})()}
			<Group justify="space-between">
				<Button
					loading={constructTaskForceState.fetching}
					disabled={
						!isOwnedByMe ||
						!fleetName.trim() ||
						!shipDesignId ||
						!starSystem?.industry
					}
					onClick={async () => {
						if (!shipDesignId || !fleetName.trim()) {
							return;
						}

						const result = await constructTaskForce({
							input: {
								starSystemId: id,
								shipDesignId,
								name: fleetName.trim(),
							},
						});

						if (!result.error) {
							setFleetName("");
						}
					}}
				>
					Commission
				</Button>
			</Group>
			{!isOwnedByMe && (
				<Text c="dimmed" size="sm">
					You can commission fleets only in star systems you own.
				</Text>
			)}
			{isOwnedByMe && shipDesignOptions.length === 0 && (
				<Text c="dimmed" size="sm">
					No ship designs available yet for this empire.
				</Text>
			)}
			{commissionError && (
				<Text c="red" size="sm">
					{commissionError}
				</Text>
			)}
		</Stack>
	);
}
