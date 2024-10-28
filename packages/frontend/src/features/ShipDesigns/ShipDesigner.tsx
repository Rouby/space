import {
	AspectRatio,
	Button,
	Group,
	Select,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useRef, useState } from "react";
import { useStyles } from "tss-react";
import { useMutation, useQuery } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";
import type { CreateShipDesignMutationVariables } from "../../gql/graphql";
import { vars } from "../../theme";
import placeholderBlueprintBackground from "./example-blueprint-paper.png";
import placeholderStatsBackground from "./example-stats-background.png";

export function ShipDesigner({
	gameId,
	onCreate,
}: { gameId: string; onCreate: () => void }) {
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
						hullBoost
						thruster
						sensorPrecision
						armorThickness
						armorEffectivenessAgainst { deliveryType effectiveness }
						shieldStrength
						shieldEffectivenessAgainst { deliveryType effectiveness }
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

	const [componentIds, setComponentIds] = useState<string[]>([]);

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

	const { costs, stats } = componentIds.reduce(
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
			if (component.hullBoost) {
				acc.stats.hullBoost += component.hullBoost;
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

				hullBoost: 0,
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

	return (
		<>
			<form
				ref={formRef}
				onSubmit={async (evt) => {
					evt.preventDefault();

					const formData = new FormData(evt.currentTarget as HTMLFormElement);

					const design = {
						name: formData.get("name") as string,
						description: formData.get("description") as string,
						resourceId:
							(formData.get("resourceId") as string) ||
							"35bf4590-a56c-4d51-b9ae-8652587485e0",
						componentIds,
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
					<SimpleGrid type="container" cols={1} spacing={0}>
						<AspectRatio ratio={768 / 512}>
							<div
								className={css({
									backgroundImage: `url(${placeholderBlueprintBackground})`,
									backgroundSize: "cover",
									backgroundRepeat: "no-repeat",
									padding: vars.spacing.xl,
								})}
							>
								{componentIds.map((id, idx) => {
									const component = data?.game.me?.shipComponents.find(
										(component) => component.id === id,
									);

									if (!component) return null;

									return (
										<Button
											key={`${idx}-${id}`}
											variant="subtle"
											onClick={() =>
												setComponentIds((ids) =>
													ids.filter((_, i) => i !== idx),
												)
											}
										>
											{component.name}
										</Button>
									);
								})}
							</div>
						</AspectRatio>
						<SimpleGrid
							cols={3}
							className={css({
								backgroundImage: `url(${placeholderStatsBackground})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								display: "grid",
								color: vars.colors.black,
							})}
							px="md"
							py="xs"
						>
							<Stack
								gap={0}
								className={css({
									borderRight: "1px solid black",
									paddingRight: vars.spacing.xs,
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
									paddingRight: vars.spacing.xs,
								})}
							>
								<Text fw="bold">Combat stats</Text>
								<Group justify="space-between" wrap="nowrap">
									<span>Boost to hull</span>
									<span>{stats.hullBoost}</span>
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
					</SimpleGrid>
					{data?.game.me?.shipComponents.map((component) => (
						<Button
							key={component.id}
							variant="light"
							onClick={() => setComponentIds((ids) => [...ids, component.id])}
						>
							Add {component.name}
						</Button>
					))}
					<Button type="submit" loading={fetching}>
						Create
					</Button>
				</Stack>
			</form>
		</>
	);
}
