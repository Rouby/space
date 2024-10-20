import {
	ActionIcon,
	AspectRatio,
	Button,
	Group,
	NumberInput,
	type NumberInputHandlers,
	type NumberInputProps,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useStyles } from "tss-react";
import { useMutation } from "urql";
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
	const [predicted, setPredicted] = useState({
		costs: 0,
		supplyNeed: 0,
	});

	const formRef = useRef<HTMLFormElement>(null);

	const [{ fetching }, createShipDesign] = useMutation(
		graphql(`mutation CreateShipDesign($gameId: ID!, $design: ShipDesignInput!) {
    createShipDesign(gameId: $gameId, design: $design) {
      id
      name
    }
  }`),
	);

	const auth = useAuth();

	const { css } = useStyles();

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
						hullRating: +(formData.get("hullRating") as string),
						speedRating: +(formData.get("speedRating") as string),
						armorRating: +(formData.get("armorRating") as string),
						shieldRating: +(formData.get("shieldRating") as string),
						weaponRating: +(formData.get("weaponRating") as string),
						zoneOfControlRating: +(formData.get(
							"zoneOfControlRating",
						) as string),
						sensorRating: +(formData.get("sensorRating") as string),
						supplyCapacity: +(formData.get("supplyCapacity") as string),
					};

					await createShipDesign({
						gameId,
						userId: auth.me?.id,
						design,
					} as CreateShipDesignMutationVariables);

					onCreate();
				}}
			>
				<Stack>
					<TextInput name="name" required label="Name" />
					<TextInput name="description" required label="Description" />
					<SimpleGrid
						type="container"
						cols={{ base: 1, "800px": 2 }}
						spacing={0}
					>
						<AspectRatio ratio={768 / 512}>
							<div
								className={css({
									backgroundImage: `url(${placeholderBlueprintBackground})`,
									backgroundSize: "cover",
									backgroundRepeat: "no-repeat",
									padding: vars.spacing.xl,
									display: "grid",
									gridTemplateColumns: "repeat(2, 1fr)",
									alignItems: "baseline",
								})}
							>
								<NumberStepper
									onChange={refreshValues}
									required
									name="hullRating"
									label="Hull"
									min={1}
								/>
								<NumberStepper
									onChange={refreshValues}
									required
									name="speedRating"
									label="Speed"
									min={0}
								/>
								<NumberStepper
									onChange={refreshValues}
									required
									name="armorRating"
									label="Armor"
									min={0}
								/>
								<NumberStepper
									onChange={refreshValues}
									required
									name="shieldRating"
									label="Shield"
									min={0}
								/>
								<NumberStepper
									onChange={refreshValues}
									required
									name="weaponRating"
									label="Weapon"
									min={0}
								/>
								<NumberStepper
									onChange={refreshValues}
									required
									name="zoneOfControlRating"
									label="Zone of control"
									min={0}
								/>
								<NumberStepper
									onChange={refreshValues}
									required
									name="sensorRating"
									label="Sensor"
									min={0}
								/>
								<NumberStepper
									onChange={refreshValues}
									required
									name="supplyCapacity"
									label="Supply capacity"
									min={1}
								/>
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
								<Group justify="space-between">
									<span>Speed:</span>
									<span>10</span>
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
								<Group justify="space-between">
									<span>Damage:</span>
									<span>10</span>
								</Group>
							</Stack>
							<Stack gap={0}>
								<Text fw="bold">Costs</Text>
								<Text>
									{new Intl.NumberFormat(undefined, {
										style: "decimal",
										notation: "compact",
									}).format(predicted.costs)}{" "}
									Titanium
								</Text>
							</Stack>
						</SimpleGrid>
					</SimpleGrid>
					<Button type="submit" loading={fetching}>
						Create
					</Button>
				</Stack>
			</form>
		</>
	);

	function refreshValues() {
		const formData = new FormData(formRef.current as HTMLFormElement);

		const design = {
			hullRating: +(formData.get("hullRating") as string),
			speedRating: +(formData.get("speedRating") as string),
			armorRating: +(formData.get("armorRating") as string),
			shieldRating: +(formData.get("shieldRating") as string),
			weaponRating: +(formData.get("weaponRating") as string),
			zoneOfControlRating: +(formData.get("zoneOfControlRating") as string),
			sensorRating: +(formData.get("sensorRating") as string),
			supplyCapacity: +(formData.get("supplyCapacity") as string),
		};

		const supplyNeed =
			design.hullRating +
			design.shieldRating +
			design.armorRating +
			design.weaponRating +
			design.speedRating +
			design.zoneOfControlRating +
			design.sensorRating;

		const resourceCosts =
			100 * design.hullRating +
			10 * design.shieldRating +
			10 * design.armorRating +
			10 * design.weaponRating +
			10 * design.speedRating +
			50 * design.zoneOfControlRating +
			20 * design.sensorRating +
			25 * design.supplyCapacity;

		setPredicted({
			costs: resourceCosts,
			supplyNeed,
		});
	}
}

function NumberStepper({ label, ...props }: NumberInputProps) {
	const handlersRef = useRef<NumberInputHandlers>(null);
	return (
		<Group gap={0}>
			<NumberInput {...props} hideControls w={40} handlersRef={handlersRef} />
			<Stack gap={0}>
				<ActionIcon
					size="xs"
					color="dark"
					onClick={() => handlersRef.current?.increment()}
				>
					<IconArrowUp />
				</ActionIcon>
				<ActionIcon
					size="xs"
					color="dark"
					onClick={() => handlersRef.current?.decrement()}
				>
					<IconArrowDown />
				</ActionIcon>
			</Stack>
			{label && <Text>{label}</Text>}
		</Group>
	);
}
