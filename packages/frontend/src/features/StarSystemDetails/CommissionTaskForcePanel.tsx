import {
	ActionIcon,
	Button,
	Card,
	Group,
	NativeSelect,
	NumberInput,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";
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
						costs {
							resource { id }
							quantity
						}
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
	const [mission, setMission] = useState<string>("manual");
	// State to track multiple assigned ship designs and their quantities
	const [manifest, setManifest] = useState<
		{ id: string; shipDesignId: string; quantity: number }[]
	>([]);

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

	const addShipClass = () => {
		if (shipDesignOptions.length === 0) return;
		setManifest((prev) => [
			...prev,
			{
				id: Math.random().toString(),
				shipDesignId: shipDesignOptions[0].value,
				quantity: 1,
			},
		]);
	};

	const removeShipClass = (id: string) => {
		setManifest((prev) => prev.filter((item) => item.id !== id));
	};

	const updateShipClass = (
		id: string,
		shipDesignId: string,
		quantity: number,
	) => {
		setManifest((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, shipDesignId, quantity } : item,
			),
		);
	};

	// Aggregate total costs and turns
	const { totalIndustryCost } = useMemo(() => {
		let industry = 0;
		const resNeeds = new Map<string, number>();

		for (const item of manifest) {
			const design = commissionContext?.game.me?.shipDesigns?.find(
				(d) => d.id === item.shipDesignId,
			);
			if (!design) continue;

			// Base capacity cost
			const cost = design.components.reduce(
				(sum, comp) => sum + comp.component.constructionCost,
				0,
			);
			industry += cost * item.quantity;

			// Special resources
			for (const req of design.costs) {
				resNeeds.set(
					req.resource.id,
					(resNeeds.get(req.resource.id) ?? 0) + req.quantity * item.quantity,
				);
			}
		}

		return {
			totalIndustryCost: industry,
			resourcesRequired: Array.from(resNeeds.entries()),
		};
	}, [manifest, commissionContext]);

	const systemIndustryRating = starSystem?.industry ?? 1;
	const expectedTurns =
		systemIndustryRating > 0 && totalIndustryCost > 0
			? Math.ceil(totalIndustryCost / systemIndustryRating)
			: 0;

	const commissionError = (() => {
		const gqlError = constructTaskForceState.error?.graphQLErrors[0];
		const code = gqlError?.extensions?.code;
		const violation = gqlError?.extensions?.violation;

		if (code === "DUPLICATE_TASK_FORCE_NAME")
			return "Task force name already exists. Choose another name.";
		if (code === "INVALID_CONSTRUCTION_ORDER") {
			if (violation === "ORIGIN_NOT_OWNED")
				return "You can only commission task forces in systems you own.";
			if (violation === "SHIP_DESIGN_UNAVAILABLE")
				return "Selected ship design is unavailable for this empire.";
			if (violation === "NO_SHIP_DESIGNS") return "Manifest cannot be empty.";
		}
		if (code === "INSUFFICIENT_INDUSTRY")
			return "This star system has no industrial capacity.";
		if (code === "INSUFFICIENT_RESOURCES")
			return "Insufficient special resources for construction.";

		return gqlError?.message ?? constructTaskForceState.error?.message;
	})();

	return (
		<Stack mt="xs">
			<TextInput
				label="Fleet Name"
				placeholder="Ex: 1st Expeditionary Wing"
				value={fleetName}
				onChange={(event) => setFleetName(event.currentTarget.value)}
				disabled={!isOwnedByMe}
			/>

			<Select
				label="Initial Mission"
				value={mission}
				onChange={(val) => setMission(val ?? "manual")}
				data={[
					{ value: "manual", label: "Manual (None)" },
					{ value: "patrol", label: "Patrol" },
					{ value: "scout", label: "Scout" },
					{ value: "siege", label: "Siege" },
					{ value: "intercept", label: "Intercept" },
				]}
				disabled={!isOwnedByMe}
			/>

			{/* Manifest Editor */}
			<Card padding="sm" radius="md" withBorder>
				<Group justify="space-between" mb="xs">
					<Text fw={500} size="sm">
						Fleet Manifest
					</Text>
					<Button
						size="xs"
						variant="light"
						leftSection={<IconPlus size={14} />}
						onClick={addShipClass}
						disabled={!isOwnedByMe || shipDesignOptions.length === 0}
					>
						Add Ship Class
					</Button>
				</Group>

				<Stack gap="xs">
					{manifest.length === 0 && (
						<Text c="dimmed" size="xs" ta="center" py="md">
							Your manifest is empty. Add a ship design to begin commissioning.
						</Text>
					)}
					{manifest.map((item) => (
						<Group key={item.id} wrap="nowrap" align="flex-end">
							<NativeSelect
								data={shipDesignOptions}
								value={item.shipDesignId}
								onChange={(e) =>
									updateShipClass(item.id, e.currentTarget.value, item.quantity)
								}
								style={{ flex: 1 }}
								disabled={!isOwnedByMe}
							/>
							<NumberInput
								value={item.quantity}
								onChange={(v) =>
									updateShipClass(item.id, item.shipDesignId, Number(v) || 1)
								}
								min={1}
								max={99}
								w={70}
								disabled={!isOwnedByMe}
							/>
							<ActionIcon
								color="red"
								variant="subtle"
								onClick={() => removeShipClass(item.id)}
								disabled={!isOwnedByMe}
							>
								<IconTrash size={18} />
							</ActionIcon>
						</Group>
					))}
				</Stack>
			</Card>

			{/* Cost Summary */}
			{manifest.length > 0 && (
				<Card bg="dark.7" padding="sm" radius="md" withBorder>
					<Stack gap="xs">
						<Group justify="space-between">
							<Text size="sm" c="dimmed">
								Industry Required:
							</Text>
							<Text size="sm" fw={700}>
								{formatInteger(totalIndustryCost)}
							</Text>
						</Group>
						<Group justify="space-between">
							<Text size="sm" c="dimmed">
								System Industry Rating:
							</Text>
							<Text size="sm" fw={500}>
								{systemIndustryRating} / turn
							</Text>
						</Group>
						<Group justify="space-between">
							<Text size="sm" c="dimmed">
								Construction Time:
							</Text>
							<Text
								size="sm"
								fw={700}
								c={expectedTurns > 5 ? "orange" : "green"}
							>
								{expectedTurns} Turn{expectedTurns !== 1 ? "s" : ""}
							</Text>
						</Group>
					</Stack>
				</Card>
			)}

			<Button
				loading={constructTaskForceState.fetching}
				disabled={
					!isOwnedByMe ||
					!fleetName.trim() ||
					manifest.length === 0 ||
					!starSystem?.industry
				}
				onClick={async () => {
					if (manifest.length === 0 || !fleetName.trim()) return;

					// Format input
					const result = await constructTaskForce({
						input: {
							starSystemId: id,
							name: fleetName.trim(),
							mission: mission as any,
							shipDesigns: manifest.map((m) => ({
								shipDesignId: m.shipDesignId,
								quantity: m.quantity,
							})),
						},
					});

					if (!result.error) {
						setFleetName("");
						setManifest([]);
					}
				}}
			>
				Commission Task Force
			</Button>

			{!isOwnedByMe && (
				<Text c="dimmed" size="xs">
					You can commission fleets only in star systems you own.
				</Text>
			)}
			{isOwnedByMe && shipDesignOptions.length === 0 && (
				<Text c="dimmed" size="xs">
					No ship designs available yet for this empire.
				</Text>
			)}
			{commissionError && (
				<Text c="red" size="xs" fw={500}>
					{commissionError}
				</Text>
			)}
		</Stack>
	);
}
