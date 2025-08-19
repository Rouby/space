import {
	AspectRatio,
	Button,
	Group,
	NumberInput,
	Select,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import React, { useId, useRef, useState } from "react";
import { useStyles } from "tss-react";
import { useMutation, useQuery } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";
import type {
	CreateShipDesignMutationVariables,
	ShipDesignInput,
} from "../../gql/graphql";
import { theme } from "../../theme";
import { DraggableComponent } from "./DraggableComponent";
import placeholderBlueprintBackground from "./example-blueprint-paper.png";
import placeholderStatsBackground from "./example-stats-background.png";
import { GridCell } from "./GridCell";

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
					resources {
						id
						name
					}
				}
			}
		}`),
		variables: { gameId },
	});

	// Grid size configuration
	const [gridRows, setGridRows] = useState(5);
	const [gridCols, setGridCols] = useState(7);

	// Initialize grid with empty cells
	const [grid, setGrid] = useState(() =>
		Array(gridRows)
			.fill(null)
			.map(() =>
				Array(gridCols)
					.fill(null)
					.map(() => ({
						componentId: null as string | null,
						instanceId: null as string | null,
					})),
			),
	);

	// Track component positions
	const [componentPositions, setComponentPositions] = useState<
		{
			componentId: string;
			instanceId: string;
			row: number;
			col: number;
		}[]
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

	const { css } = useStyles();

	// Update grid when rows or columns change
	const updateGridSize = (newRows: number, newCols: number) => {
		setGridRows(newRows);
		setGridCols(newCols);

		// Create new grid with the new dimensions
		const newGrid = Array(newRows)
			.fill(null)
			.map(() =>
				Array(newCols)
					.fill(null)
					.map(() => ({
						componentId: null as string | null,
						instanceId: null as string | null,
					})),
			);

		// Copy over existing components where possible
		for (const { componentId, instanceId, row, col } of componentPositions) {
			if (row < newRows && col < newCols) {
				newGrid[row][col] = { componentId, instanceId };
			}
		}

		setGrid(newGrid);

		// Update component positions to remove any that are now out of bounds
		setComponentPositions((prev) =>
			prev.filter(({ row, col }) => row < newRows && col < newCols),
		);
	};

	// Generate a unique instance ID for a component
	const generateInstanceId = () => {
		return `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	};

	// Calculate costs and stats based on components in the grid
	const { costs, stats } = componentPositions
		.map((pos) => pos.componentId)
		.reduce(
			(acc, id) => {
				const component = data?.game.me?.shipComponents.find(
					(component) => component.id === id,
				);

				if (!component) return acc;

				for (const { resource, quantity } of component.costs) {
					const existingResourceCost = acc.costs.find(
						(cost) => cost.resourceId === resource.id,
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

				if (component.supplyCapacity) {
					acc.stats.supplyCapacity += component.supplyCapacity;
				}
				if (component.powerGeneration) {
					acc.stats.powerGeneration += component.powerGeneration;
				}
				if (component.crewCapacity) {
					acc.stats.crewCapacity += component.crewCapacity;
				}
				if (component.ftlSpeed) {
					acc.stats.ftlSpeed = Math.min(acc.stats.ftlSpeed, component.ftlSpeed);
				}
				if (component.zoneOfControl) {
					acc.stats.zoneOfControl = Math.max(
						acc.stats.zoneOfControl,
						component.zoneOfControl,
					);
				}
				if (component.sensorRange) {
					acc.stats.sensorRange = Math.max(
						acc.stats.sensorRange,
						component.sensorRange,
					);
				}
				if (component.structuralIntegrity) {
					acc.stats.structuralIntegrity += component.structuralIntegrity;
				}
				if (component.thruster) {
					acc.stats.thruster = Math.min(acc.stats.thruster, component.thruster);
				}
				if (component.sensorPrecision) {
					acc.stats.sensorPrecision = Math.max(
						acc.stats.sensorPrecision,
						component.sensorPrecision,
					);
				}
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
				if (component.weaponCooldown) {
					acc.stats.weaponCooldown.min = Math.min(
						acc.stats.weaponCooldown.min,
						component.weaponCooldown,
					);
					acc.stats.weaponCooldown.max = Math.max(
						acc.stats.weaponCooldown.max,
						component.weaponCooldown,
					);
				}
				if (component.weaponRange) {
					acc.stats.weaponRange.min = Math.min(
						acc.stats.weaponRange.min,
						component.weaponRange,
					);
					acc.stats.weaponRange.max = Math.max(
						acc.stats.weaponRange.max,
						component.weaponRange,
					);
				}
				if (component.weaponArmorPenetration) {
					acc.stats.weaponArmorPenetration.min = Math.min(
						acc.stats.weaponArmorPenetration.min,
						component.weaponArmorPenetration,
					);
					acc.stats.weaponArmorPenetration.max = Math.max(
						acc.stats.weaponArmorPenetration.max,
						component.weaponArmorPenetration,
					);
				}
				if (component.weaponShieldPenetration) {
					acc.stats.weaponShieldPenetration.min = Math.min(
						acc.stats.weaponShieldPenetration.min,
						component.weaponShieldPenetration,
					);
					acc.stats.weaponShieldPenetration.max = Math.max(
						acc.stats.weaponShieldPenetration.max,
						component.weaponShieldPenetration,
					);
				}
				if (component.weaponAccuracy) {
					acc.stats.weaponAccuracy.min = Math.min(
						acc.stats.weaponAccuracy.min,
						component.weaponAccuracy,
					);
					acc.stats.weaponAccuracy.max = Math.max(
						acc.stats.weaponAccuracy.max,
						component.weaponAccuracy,
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
					weaponCooldown: { min: Number.POSITIVE_INFINITY, max: 0 },
					weaponRange: { min: Number.POSITIVE_INFINITY, max: 0 },
					weaponArmorPenetration: { min: Number.POSITIVE_INFINITY, max: 0 },
					weaponShieldPenetration: { min: Number.POSITIVE_INFINITY, max: 0 },
					weaponAccuracy: { min: Number.POSITIVE_INFINITY, max: 0 },
					weaponDeliveryTypes: [] as string[],
				},
			},
		);

	const circuitPattern = useId();

	return (
		<form
			ref={formRef}
			onSubmit={async (evt) => {
				evt.preventDefault();

				const formData = new FormData(evt.currentTarget as HTMLFormElement);

				const design: ShipDesignInput = {
					name: formData.get("name") as string,
					description: formData.get("description") as string,
					components: componentPositions.map(({ componentId, row, col }) => ({
						componentId,
						gridPosition: { x: col, y: row },
					})),
				};

				await createShipDesign({
					gameId,
					design,
					// extras
					userId: auth.me?.id,
				} as CreateShipDesignMutationVariables);

				onCreate();
			}}
		>
			<Stack>
				<TextInput name="name" required label="Name" />
				<TextInput name="description" required label="Description" />
				<Select
					name="resourceId"
					required
					label="Resource"
					data={
						data?.game.me?.resources.map((resource) => ({
							label: resource.name,
							value: resource.id,
						})) ?? []
					}
				/>

				{/* Grid size configuration */}
				<Group grow>
					<NumberInput
						label="Grid Rows"
						value={gridRows}
						onChange={(value) => updateGridSize(Number(value) || 5, gridCols)}
						min={3}
						max={10}
					/>
					<NumberInput
						label="Grid Columns"
						value={gridCols}
						onChange={(value) => updateGridSize(gridRows, Number(value) || 7)}
						min={3}
						max={12}
					/>
				</Group>

				<Stack>
					<AspectRatio ratio={768 / 512}>
						<div
							className={css({
								backgroundImage: `url(${placeholderBlueprintBackground})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								padding: theme.spacing.md,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								position: "relative",
							})}
						>
							<div
								className={css({
									display: "grid",
									// Make cells square by setting a fixed size based on the smaller dimension
									gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
									gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
									gap: theme.spacing.xs,
									// Ensure the grid maintains its aspect ratio and is centered
									aspectRatio: `${gridCols} / ${gridRows}`,
									// Limit the maximum size to fit within the container while maintaining square cells
									maxWidth: `min(100%, calc(100vh * ${gridCols} / ${gridRows} * 0.6))`,
									maxHeight: `min(100%, calc(100vw * ${gridRows} / ${gridCols} * 0.6))`,
									width: "100%",
									height: "100%",
									position: "relative",
									background: "rgba(10, 25, 40, 0.7)",
									borderRadius: "4px",
									boxShadow:
										"0 0 20px rgba(0, 60, 120, 0.4), inset 0 0 30px rgba(0, 120, 255, 0.2)",
									border: `2px solid ${theme.colors.blue[7]}`,
									padding: theme.spacing.xs,
									backdropFilter: "blur(2px)",
								})}
							>
								{/* Grid coordinate markers */}
								<div
									className={css({
										position: "absolute",
										top: -28,
										left: 0,
										right: 0,
										display: "flex",
										justifyContent: "space-between",
										padding: `0 ${theme.spacing.md}`,
										color: theme.colors.blue[8],
										fontSize: theme.fontSizes.xs,
										fontWeight: 600,
										pointerEvents: "none",
										textShadow: "0 0 4px rgba(0, 30, 60, 0.5)",
									})}
								>
									{Array.from({ length: gridCols }).map((_, i) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: These are static grid markers
										<div key={`col-marker-${i}`}>{i + 1}</div>
									))}
								</div>
								<div
									className={css({
										position: "absolute",
										left: -28,
										top: 0,
										bottom: 0,
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
										padding: `${theme.spacing.md} 0`,
										color: theme.colors.blue[8],
										fontSize: theme.fontSizes.xs,
										fontWeight: 600,
										pointerEvents: "none",
										textShadow: "0 0 4px rgba(0, 30, 60, 0.5)",
									})}
								>
									{Array.from({ length: gridRows }).map((_, i) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: These are static grid markers
										<div key={`row-marker-${i}`}>{i + 1}</div>
									))}
								</div>

								{/* Ship Silhouette Outline */}
								{componentPositions.length > 0 && (
									<div
										className={css({
											position: "absolute",
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											pointerEvents: "none",
											zIndex: 2,
										})}
									>
										<svg
											width="100%"
											height="100%"
											viewBox={`0 0 ${gridCols} ${gridRows}`}
											preserveAspectRatio="none"
											style={{
												position: "absolute",
												top: 0,
												left: 0,
												right: 0,
												bottom: 0,
											}}
											aria-label="Ship Outline"
											role="img"
										>
											{/* Add a subtle fill for the ship area */}
											<path
												d={generateShipAreaPath(
													componentPositions,
													gridRows,
													gridCols,
												)}
												fill="rgba(0, 60, 120, 0.1)"
												stroke="none"
											/>
											{/* Add a subtle glow effect */}
											<path
												d={generateShipOutlinePath(
													componentPositions,
													gridRows,
													gridCols,
												)}
												fill="none"
												stroke={theme.colors.blue[5]}
												strokeWidth="0.08"
												strokeLinejoin="round"
												strokeLinecap="round"
												style={{
													filter: "blur(0.2px)",
													opacity: 0.6,
												}}
											/>
											{/* Main outline */}
											<path
												d={generateShipOutlinePath(
													componentPositions,
													gridRows,
													gridCols,
												)}
												fill="none"
												stroke={theme.colors.cyan[5]}
												strokeWidth="0.05"
												strokeLinejoin="round"
												strokeLinecap="round"
												style={{
													filter: "drop-shadow(0 0 1px rgba(0, 180, 255, 0.5))",
												}}
											/>
											{/* Add circuit-like details to the ship */}
											<path
												d={generateShipAreaPath(
													componentPositions,
													gridRows,
													gridCols,
												)}
												fill={`url(#${circuitPattern})`}
												stroke="none"
												style={{
													opacity: 0.1,
												}}
											/>

											{/* Define patterns */}
											<defs>
												<pattern
													id={circuitPattern}
													patternUnits="userSpaceOnUse"
													width="1"
													height="1"
													patternTransform="scale(0.2)"
												>
													<path
														d="M0,0 L10,0 M0,5 L10,5 M0,0 L0,10 M5,0 L5,10"
														stroke={theme.colors.cyan[5]}
														strokeWidth="0.2"
														fill="none"
													/>
													<circle
														cx="5"
														cy="5"
														r="0.5"
														fill={theme.colors.cyan[4]}
													/>
												</pattern>
											</defs>
										</svg>
									</div>
								)}

								{Array.from({ length: gridRows }).map((_, rowIndex) => (
									<React.Fragment
										key={`row-${
											// biome-ignore lint/suspicious/noArrayIndexKey: just index
											rowIndex
										}`}
									>
										{Array.from({ length: gridCols }).map((_, colIndex) => {
											const cellData = grid[rowIndex][colIndex];
											const component = data?.game.me?.shipComponents.find(
												(c) => c.id === cellData.componentId,
											);

											return (
												<GridCell
													key={`cell-${rowIndex}-${
														// biome-ignore lint/suspicious/noArrayIndexKey: just index
														colIndex
													}`}
													row={rowIndex}
													col={colIndex}
													component={component}
													onRemove={(row, col) => {
														const { componentId, instanceId } = grid[row][col];
														if (!componentId || !instanceId) return;

														// Update the grid
														const newGrid = [...grid];
														newGrid[row][col] = {
															componentId: null,
															instanceId: null,
														};
														setGrid(newGrid);

														// Update component positions
														setComponentPositions((prev) =>
															prev.filter(
																(pos) => pos.instanceId !== instanceId,
															),
														);
													}}
												/>
											);
										})}
									</React.Fragment>
								))}
							</div>
						</div>
					</AspectRatio>

					{/* Component palette - on the right side */}
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							height: "100%",
							background: "rgba(10, 25, 40, 0.7)",
							borderRadius: "4px",
							boxShadow: "0 0 15px rgba(0, 60, 120, 0.3)",
							border: `1px solid ${theme.colors.blue[7]}`,
							backdropFilter: "blur(2px)",
						})}
					>
						<Text
							fw="bold"
							size="lg"
							p="md"
							className={css({
								borderBottom: `1px solid ${theme.colors.blue[7]}`,
								color: theme.colors.blue[1],
								background: "rgba(0, 30, 60, 0.7)",
								borderTopLeftRadius: "4px",
								borderTopRightRadius: "4px",
							})}
						>
							Available Components
						</Text>
						<div
							className={css({
								//overflowY: "auto",
								padding: theme.spacing.sm,
								flexGrow: 1,
								display: "flex",
								flexDirection: "column",
								gap: theme.spacing.xs,
								maxHeight: "calc(100vh - 300px)",
								"&::-webkit-scrollbar": {
									width: "8px",
								},
								"&::-webkit-scrollbar-track": {
									background: "rgba(0, 30, 60, 0.3)",
									borderRadius: "4px",
								},
								"&::-webkit-scrollbar-thumb": {
									background: theme.colors.blue[7],
									borderRadius: "4px",
								},
							})}
						>
							{data?.game.me?.shipComponents.map((component) => (
								<DraggableComponent
									key={component.id}
									component={component}
									gridRows={gridRows}
									gridCols={gridCols}
									onDrop={(componentId, row, col) => {
										// Check if the cell is already occupied
										if (grid[row][col].componentId !== null) {
											return false;
										}

										// Generate a unique instance ID for this component placement
										const instanceId = generateInstanceId();

										// Update the grid
										const newGrid = [...grid];
										newGrid[row][col] = { componentId, instanceId };
										setGrid(newGrid);

										// Update component positions
										setComponentPositions((prev) => [
											...prev,
											{ componentId, instanceId, row, col },
										]);

										return true;
									}}
								/>
							))}
						</div>
					</div>

					{/* Stats display - now below both grid and palette */}
					<SimpleGrid
						cols={3}
						className={css({
							backgroundImage: `url(${placeholderStatsBackground})`,
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							display: "grid",
							color: theme.colors.black,
							borderRadius: "4px",
							boxShadow: "0 0 15px rgba(0, 60, 120, 0.3)",
						})}
						px="md"
						py="xs"
					>
						<Stack
							gap={0}
							className={css({
								borderRight: "1px solid black",
								paddingRight: theme.spacing.xs,
							})}
						>
							<Text fw="bold">Base stats</Text>
							<Group justify="space-between" wrap="nowrap">
								<span>Supply need (passive)</span>
								<span>{stats.supplyNeedPassive}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Supply need (movement)</span>
								<span>{stats.supplyNeedMovement}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Supply need (combat)</span>
								<span>{stats.supplyNeedCombat}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Power need</span>
								<span>{stats.powerNeed}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Crew need</span>
								<span>{stats.crewNeed}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Supply capacity</span>
								<span>{stats.supplyCapacity}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Power generation</span>
								<span>{stats.powerGeneration}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Crew capacity</span>
								<span>{stats.crewCapacity}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Maximum FTL speed</span>
								<span>{stats.ftlSpeed}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Zone of control</span>
								<span>{stats.zoneOfControl}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Sensor range</span>
								<span>{stats.sensorRange}</span>
							</Group>
						</Stack>
						<Stack
							gap={0}
							className={css({
								borderRight: "1px solid black",
								paddingRight: theme.spacing.xs,
							})}
						>
							<Text fw="bold">Combat stats</Text>
							<Group justify="space-between" wrap="nowrap">
								<span>Structural integrity</span>
								<span>{stats.structuralIntegrity}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Thruster</span>
								<span>{stats.thruster}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Sensor precision</span>
								<span>{stats.sensorPrecision}</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Armor thickness</span>
								<span>
									{stats.armorThickness.min} - {stats.armorThickness.max}
								</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Shield strength</span>
								<span>
									{stats.shieldStrength.min} - {stats.shieldStrength.max}
								</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Weapon damage</span>
								<span>
									{stats.weaponDamage.min} - {stats.weaponDamage.max}
								</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Weapon cooldown</span>
								<span>
									{stats.weaponCooldown.min} - {stats.weaponCooldown.max}
								</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Weapon range</span>
								<span>
									{stats.weaponRange.min} - {stats.weaponRange.max}
								</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Armor penetration</span>
								<span>
									{stats.weaponArmorPenetration.min} -{" "}
									{stats.weaponArmorPenetration.max}
								</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Shield penetration</span>
								<span>
									{stats.weaponShieldPenetration.min} -{" "}
									{stats.weaponShieldPenetration.max}
								</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Weapon accuracy</span>
								<span>
									{stats.weaponAccuracy.min} - {stats.weaponAccuracy.max}
								</span>
							</Group>
							<Group justify="space-between" wrap="nowrap">
								<span>Weapon delivery types</span>
								<span>
									{new Intl.ListFormat().format(stats.weaponDeliveryTypes)}
								</span>
							</Group>
						</Stack>
						<Stack gap={0}>
							<Text fw="bold">Costs</Text>
							<span>
								{new Intl.NumberFormat(undefined, {
									style: "decimal",
									notation: "compact",
								}).format(stats.constructionCost)}{" "}
								Construction
							</span>
							{costs.map((cost) => (
								<span key={cost.resourceId}>
									{new Intl.NumberFormat(undefined, {
										style: "decimal",
										notation: "compact",
									}).format(cost.quantity)}{" "}
									{cost.resourceName}
								</span>
							))}
						</Stack>
					</SimpleGrid>

					<Button type="submit" loading={fetching}>
						Create
					</Button>
				</Stack>
			</Stack>
		</form>
	);
}

// Generate SVG path for ship outline
function generateShipOutlinePath(
	positions: { row: number; col: number }[],
	rows: number,
	cols: number,
): string {
	if (positions.length === 0) return "";

	// Create a grid to track occupied cells
	const occupiedGrid = Array(rows)
		.fill(null)
		.map(() => Array(cols).fill(false));

	// Mark occupied cells
	for (const { row, col } of positions) {
		occupiedGrid[row][col] = true;
	}

	// Create a path that goes around the perimeter of the occupied cells
	const pathSegments: string[] = [];

	// Helper to check if a cell is occupied
	const isOccupied = (r: number, c: number) => {
		if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
		return occupiedGrid[r][c];
	};

	// For each occupied cell, add line segments for its unoccupied edges
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (isOccupied(r, c)) {
				// Check each edge of the cell
				// Top edge
				if (!isOccupied(r - 1, c)) {
					pathSegments.push(`M ${c} ${r} L ${c + 1} ${r}`);
				}

				// Right edge
				if (!isOccupied(r, c + 1)) {
					pathSegments.push(`M ${c + 1} ${r} L ${c + 1} ${r + 1}`);
				}

				// Bottom edge
				if (!isOccupied(r + 1, c)) {
					pathSegments.push(`M ${c + 1} ${r + 1} L ${c} ${r + 1}`);
				}

				// Left edge
				if (!isOccupied(r, c - 1)) {
					pathSegments.push(`M ${c} ${r + 1} L ${c} ${r}`);
				}
			}
		}
	}

	return pathSegments.join(" ");
}

// Generate a path for the filled ship area
function generateShipAreaPath(
	positions: { row: number; col: number }[],
	_rows: number,
	_cols: number,
): string {
	if (positions.length === 0) return "";

	// Create a path that outlines each occupied cell
	const pathSegments: string[] = [];

	for (const { row, col } of positions) {
		// Add a rectangle for each cell
		pathSegments.push(
			`M ${col} ${row} L ${col + 1} ${row} L ${col + 1} ${row + 1} L ${col} ${row + 1} Z`,
		);
	}

	return pathSegments.join(" ");
}
