import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Divider,
	Grid,
	Group,
	ScrollArea,
	Stack,
	Text,
	TextInput,
	Title,
	Tooltip,
} from "@mantine/core";
import { IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";
import type {
	CreateShipDesignMutationVariables,
	ShipDesignInput,
} from "../../gql/graphql";

export function ShipDesigner({
	gameId,
	onCreate,
}: {
	gameId: string;
	onCreate: () => void;
}) {
	const [{ data }] = useQuery({
		query: graphql(`query ShipComponents($gameId: ID!) {
			game(id: $gameId) {
				id
				me {
					id
					shipComponents {
						id
						name
						description
						costs { resource { id name } quantity }
						supplyNeedPassive
						supplyNeedMovement
						supplyNeedCombat
						powerNeed
						crewNeed
						constructionCost
						supplyCapacity
						powerGeneration
						crewCapacity
						ftlSpeed
						zoneOfControl
						sensorRange
						structuralIntegrity
						thruster
						sensorPrecision
						armorThickness
						armorEffectivenessAgainst { projectile missile beam instant }
						shieldStrength
						shieldEffectivenessAgainst { projectile missile beam instant }
						weaponDamage
						weaponCooldown
						weaponRange
						weaponArmorPenetration
						weaponShieldPenetration
						weaponAccuracy
						weaponDeliveryType
					}
				}
			}
		}`),
		variables: { gameId },
	});

	// Flat list of selected components
	const [selectedComponents, setSelectedComponents] = useState<
		{ id: string; componentId: string }[]
	>([]);

	const formRef = useRef<HTMLFormElement>(null);

	const [{ fetching }, createShipDesign] = useMutation(
		graphql(`mutation CreateShipDesign($gameId: ID!, $design: ShipDesignInput!) {
    createShipDesign(gameId: $gameId, design: $design) {
      id
      name
			costs {
				resource {
					id
					name
				}	
				quantity
			}
    }
  }`),
	);

	const auth = useAuth();

	const generateInstanceId = () => {
		return `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	};

	const addComponent = (componentId: string) => {
		setSelectedComponents((prev) => [
			...prev,
			{ id: generateInstanceId(), componentId },
		]);
	};

	const removeComponent = (instanceId: string) => {
		setSelectedComponents((prev) => prev.filter((c) => c.id !== instanceId));
	};

	const { costs, stats } = selectedComponents
		.map((pos) => pos.componentId)
		.reduce(
			(acc, id) => {
				const component = data?.game.me?.shipComponents.find(
					(c) => c.id === id,
				);
				if (!component) return acc;

				for (const { resource, quantity } of component.costs) {
					const existingResourceCost = acc.costs.find(
						(c) => c.resourceId === resource.id,
					);
					if (existingResourceCost) {
						existingResourceCost.quantity += quantity;
					} else {
						acc.costs.push({
							resourceId: resource.id,
							resourceName: resource.name,
							quantity,
						});
					}
				}

				acc.stats.constructionCost += component.constructionCost;
				acc.stats.supplyNeedPassive += component.supplyNeedPassive;
				acc.stats.supplyNeedMovement += component.supplyNeedMovement;
				acc.stats.supplyNeedCombat += component.supplyNeedCombat;
				acc.stats.powerNeed += component.powerNeed;
				acc.stats.crewNeed += component.crewNeed;

				if (component.supplyCapacity)
					acc.stats.supplyCapacity += component.supplyCapacity;
				if (component.powerGeneration)
					acc.stats.powerGeneration += component.powerGeneration;
				if (component.crewCapacity)
					acc.stats.crewCapacity += component.crewCapacity;

				if (component.ftlSpeed)
					acc.stats.ftlSpeed = Math.min(acc.stats.ftlSpeed, component.ftlSpeed);
				if (component.zoneOfControl)
					acc.stats.zoneOfControl = Math.max(
						acc.stats.zoneOfControl,
						component.zoneOfControl,
					);
				if (component.sensorRange)
					acc.stats.sensorRange = Math.max(
						acc.stats.sensorRange,
						component.sensorRange,
					);

				if (component.structuralIntegrity)
					acc.stats.structuralIntegrity += component.structuralIntegrity;
				if (component.thruster)
					acc.stats.thruster = Math.min(acc.stats.thruster, component.thruster);
				if (component.sensorPrecision)
					acc.stats.sensorPrecision = Math.max(
						acc.stats.sensorPrecision,
						component.sensorPrecision,
					);

				if (component.armorThickness) {
					acc.stats.armorThickness.min = Math.min(
						acc.stats.armorThickness.min,
						component.armorThickness,
					);
					acc.stats.armorThickness.max = Math.max(
						acc.stats.armorThickness.max,
						component.armorThickness,
					);
				}
				if (component.shieldStrength) {
					acc.stats.shieldStrength.min = Math.min(
						acc.stats.shieldStrength.min,
						component.shieldStrength,
					);
					acc.stats.shieldStrength.max = Math.max(
						acc.stats.shieldStrength.max,
						component.shieldStrength,
					);
				}
				if (component.weaponDamage) {
					acc.stats.weaponDamage.min = Math.min(
						acc.stats.weaponDamage.min,
						component.weaponDamage,
					);
					acc.stats.weaponDamage.max = Math.max(
						acc.stats.weaponDamage.max,
						component.weaponDamage,
					);
				}
				if (component.weaponDeliveryType) {
					acc.stats.weaponDeliveryTypes.push(component.weaponDeliveryType);
				}

				return acc;
			},
			{
				costs: [] as {
					resourceId: string;
					resourceName: string;
					quantity: number;
				}[],
				stats: {
					constructionCost: 0,
					supplyNeedPassive: 0,
					supplyNeedMovement: 0,
					supplyNeedCombat: 0,
					powerNeed: 0,
					crewNeed: 0,
					supplyCapacity: 0,
					powerGeneration: 0,
					crewCapacity: 0,
					ftlSpeed: Number.POSITIVE_INFINITY,
					zoneOfControl: 0,
					sensorRange: 0,
					structuralIntegrity: 0,
					thruster: Number.POSITIVE_INFINITY,
					sensorPrecision: 0,
					armorThickness: { min: Number.POSITIVE_INFINITY, max: 0 },
					shieldStrength: { min: Number.POSITIVE_INFINITY, max: 0 },
					weaponDamage: { min: Number.POSITIVE_INFINITY, max: 0 },
					weaponDeliveryTypes: [] as string[],
				},
			},
		);

	const availableComponents = data?.game.me?.shipComponents ?? [];

	const hasPower =
		stats.powerGeneration > 0 && stats.powerGeneration >= stats.powerNeed;
	const hasCrew =
		stats.crewCapacity > 0 && stats.crewCapacity >= stats.crewNeed;
	const hasDrive =
		stats.ftlSpeed !== Number.POSITIVE_INFINITY ||
		stats.thruster !== Number.POSITIVE_INFINITY;
	const isValid =
		selectedComponents.length > 0 && hasPower && hasCrew && hasDrive;

	let validationMessage = "";
	if (selectedComponents.length === 0) {
		validationMessage = "Add components to design your ship.";
	} else if (!hasPower) {
		validationMessage = "Ship needs sufficient power generation.";
	} else if (!hasCrew) {
		validationMessage = "Ship needs sufficient crew quarters.";
	} else if (!hasDrive) {
		validationMessage = "Ship needs a drive component.";
	}

	return (
		<form
			ref={formRef}
			onSubmit={async (evt) => {
				evt.preventDefault();
				const formData = new FormData(evt.currentTarget);

				const design: ShipDesignInput = {
					name: formData.get("name") as string,
					description: formData.get("description") as string,
					components: selectedComponents.map(({ componentId }) => ({
						componentId,
					})),
				};

				await createShipDesign({
					gameId,
					design,
					userId: auth.me?.id,
				} as CreateShipDesignMutationVariables);

				onCreate();
			}}
		>
			<Stack gap="xl">
				{/* Top Header Controls */}
				<Group grow align="flex-start">
					<TextInput
						name="name"
						required
						label="Design Name"
						placeholder="Ex: Defender Class Drone"
					/>
					<TextInput
						name="description"
						required
						label="Design Description"
						placeholder="Ex: Lightweight escort with heavy shields"
					/>
					<Tooltip label={validationMessage} disabled={isValid}>
						<div style={{ display: "inline-block", marginTop: 24 }}>
							<Button
								type="submit"
								loading={fetching}
								disabled={!isValid}
								leftSection={<IconDeviceFloppy size={16} />}
								style={{ pointerEvents: !isValid ? "none" : "auto" }}
							>
								Save Ship Design
							</Button>
						</div>
					</Tooltip>
				</Group>

				{/* Two columns: Components Selection & Stats Preview */}
				<Grid gap="xl">
					{/* Left Column: Component Selection */}
					<Grid.Col span={8}>
						<Grid gap="md">
							{/* Available Pool */}
							<Grid.Col span={6}>
								<Card shadow="sm" radius="md" withBorder>
									<Card.Section withBorder inheritPadding py="xs">
										<Title order={5}>Component Catalog</Title>
									</Card.Section>
									<ScrollArea h={500} offsetScrollbars mt="sm">
										<Stack gap="xs" pr="sm">
											{availableComponents.map((c) => (
												<Card
													key={c.id}
													padding="sm"
													radius="md"
													withBorder
													bg="dark.7"
												>
													<Group justify="space-between" wrap="nowrap">
														<Stack gap={0} style={{ flex: 1 }}>
															<Text fw={500} size="sm" lineClamp={1}>
																{c.name}
															</Text>

															<Group gap="xs" mt={4}>
																<Badge size="xs" variant="light" color="blue">
																	Cost: {c.constructionCost}
																</Badge>
															</Group>
														</Stack>
														<ActionIcon
															variant="light"
															color="indigo"
															onClick={() => addComponent(c.id)}
														>
															<IconPlus size={16} />
														</ActionIcon>
													</Group>
												</Card>
											))}
										</Stack>
									</ScrollArea>
								</Card>
							</Grid.Col>

							{/* Installed Pool */}
							<Grid.Col span={6}>
								<Card shadow="sm" radius="md" withBorder>
									<Card.Section withBorder inheritPadding py="xs">
										<Group justify="space-between">
											<Title order={5}>Installed Modules</Title>
											<Badge color="grape" variant="light">
												{selectedComponents.length} slots used
											</Badge>
										</Group>
									</Card.Section>
									<ScrollArea h={500} offsetScrollbars mt="sm">
										<Stack gap="xs" pr="sm">
											{selectedComponents.map((item) => {
												const c = availableComponents.find(
													(ac) => ac.id === item.componentId,
												);
												if (!c) return null;
												return (
													<Card
														key={item.id}
														padding="sm"
														radius="md"
														withBorder
														bg="dark.6"
													>
														<Group justify="space-between" wrap="nowrap">
															<Stack gap={0} style={{ flex: 1 }}>
																<Text fw={500} size="sm" lineClamp={1}>
																	{c.name}
																</Text>
																<Group gap={4} mt={4}>
																	{(c.powerGeneration ?? 0) > 0 && (
																		<Badge size="xs" color="yellow">
																			+{c.powerGeneration} Pwr
																		</Badge>
																	)}
																	{(c.powerNeed ?? 0) > 0 && (
																		<Badge size="xs" color="orange">
																			-{c.powerNeed} Pwr
																		</Badge>
																	)}
																</Group>
															</Stack>
															<ActionIcon
																variant="subtle"
																color="red"
																onClick={() => removeComponent(item.id)}
															>
																<IconTrash size={16} />
															</ActionIcon>
														</Group>
													</Card>
												);
											})}
											{selectedComponents.length === 0 && (
												<Text c="dimmed" size="sm" ta="center" mt="xl">
													Assemble your ship by adding components from the
													catalog.
												</Text>
											)}
										</Stack>
									</ScrollArea>
								</Card>
							</Grid.Col>
						</Grid>
					</Grid.Col>

					{/* Right Column: Base Stats & Combat Stats */}
					<Grid.Col span={4}>
						<Stack gap="md">
							<Card shadow="sm" radius="md" withBorder bg="blue.9">
								<Title order={5} mb="sm" c="white">
									Construction Requirements
								</Title>
								<Group justify="space-between">
									<Text size="sm" c="gray.3">
										Base Industry Cost
									</Text>
									<Text size="sm" fw={700} c="white">
										{stats.constructionCost}
									</Text>
								</Group>
								{costs.map((cost) => (
									<Group key={cost.resourceId} justify="space-between" mt={4}>
										<Text size="sm" c="gray.3">
											{cost.resourceName}
										</Text>
										<Text size="sm" fw={700} c="white">
											{cost.quantity}
										</Text>
									</Group>
								))}
							</Card>

							<Card shadow="sm" radius="md" withBorder>
								<Title order={5} mb="sm">
									Power & Supply Matrix
								</Title>

								<Group justify="space-between" mt={4}>
									<Text size="sm" c="dimmed">
										Power Status
									</Text>
									<Badge
										color={
											stats.powerGeneration >= stats.powerNeed ? "green" : "red"
										}
									>
										{stats.powerNeed} / {stats.powerGeneration}
									</Badge>
								</Group>

								<Group justify="space-between" mt={4}>
									<Text size="sm" c="dimmed">
										Crew Status
									</Text>
									<Badge
										color={
											stats.crewCapacity >= stats.crewNeed ? "green" : "red"
										}
									>
										{stats.crewNeed} / {stats.crewCapacity}
									</Badge>
								</Group>

								<Divider my="sm" />

								<Group justify="space-between" mt={4}>
									<Text size="sm" c="dimmed">
										Supply Storage
									</Text>
									<Text size="sm" fw={500}>
										{stats.supplyCapacity}
									</Text>
								</Group>
								<Group justify="space-between" mt={4}>
									<Text size="sm" c="dimmed">
										Passive Burn
									</Text>
									<Text size="sm" fw={500}>
										{stats.supplyNeedPassive}
									</Text>
								</Group>
							</Card>

							<Card shadow="sm" radius="md" withBorder>
								<Title order={5} mb="sm">
									Strategic Capabilities
								</Title>
								<Group justify="space-between" mt={4}>
									<Text size="sm" c="dimmed">
										Structural Integrity
									</Text>
									<Text size="sm" fw={500}>
										{stats.structuralIntegrity}
									</Text>
								</Group>
								<Group justify="space-between" mt={4}>
									<Text size="sm" c="dimmed">
										Max FTL Speed
									</Text>
									<Text size="sm" fw={500}>
										{stats.ftlSpeed === Number.POSITIVE_INFINITY
											? 0
											: stats.ftlSpeed}
									</Text>
								</Group>
								<Group justify="space-between" mt={4}>
									<Text size="sm" c="dimmed">
										Sensor Range
									</Text>
									<Text size="sm" fw={500}>
										{stats.sensorRange}
									</Text>
								</Group>
							</Card>
						</Stack>
					</Grid.Col>
				</Grid>
			</Stack>
		</form>
	);
}
