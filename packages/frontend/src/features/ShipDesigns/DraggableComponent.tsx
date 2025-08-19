import { Group, Stack, Text } from "@mantine/core";
import { type HTMLMotionProps, motion, useDragControls } from "motion/react";
import { useState } from "react";
import { useStyles } from "tss-react";
import { theme } from "../../theme";

// Define the ShipComponentFragment type based on the component props
type ShipComponentFragment = {
	id: string;
	name: string;
	description: string;
	costs: Array<{
		resource: {
			id: string;
			name: string;
		};
		quantity: number;
	}>;
	supplyNeedPassive: number;
	supplyNeedMovement: number;
	supplyNeedCombat: number;
	powerNeed: number;
	crewNeed: number;
	constructionCost: number;
	supplyCapacity?: number | null;
	powerGeneration?: number | null;
	crewCapacity?: number | null;
	ftlSpeed?: number | null;
	zoneOfControl?: number | null;
	sensorRange?: number | null;
	structuralIntegrity?: number | null;
	thruster?: number | null;
	sensorPrecision?: number | null;
	armorThickness?: number | null;
	shieldStrength?: number | null;
	weaponDamage?: number | null;
	weaponCooldown?: number | null;
	weaponRange?: number | null;
	weaponArmorPenetration?: number | null;
	weaponShieldPenetration?: number | null;
	weaponAccuracy?: number | null;
	weaponDeliveryType?: string | null;
};

export function DraggableComponent({
	component,
	gridRows,
	gridCols,
	onDrop,
}: {
	component: ShipComponentFragment;
	gridRows: number;
	gridCols: number;
	onDrop: (componentId: string, row: number, col: number) => boolean;
}) {
	const controls = useDragControls();
	const [_isDragging, setIsDragging] = useState(false);

	return (
		<>
			<ComponentInfo
				component={component}
				onPointerDown={(event) => {
					event.preventDefault();
					controls.start(event, { snapToCursor: true });
				}}
			/>
			<ComponentInfo
				component={component}
				drag
				dragListener={false}
				dragControls={controls}
				dragMomentum={false}
				style={{ position: "absolute", visibility: "hidden" }}
				whileDrag={{
					visibility: "visible",
					scale: 1.05,
					zIndex: 10,
					cursor: "grabbing",
					position: "absolute",
					width: 64,
					height: 64,
				}}
				short
				onDragEnd={(_, info) => {
					setIsDragging(false);
					// Calculate which grid cell the component was dropped on
					const gridElement = document.getElementById("design-grid");
					if (gridElement) {
						const rect = gridElement.getBoundingClientRect();
						const x = info.point.x - rect.left;
						const y = info.point.y - rect.top;

						const cellWidth = rect.width / gridCols;
						const cellHeight = rect.height / gridRows;

						const col = Math.floor(x / cellWidth);
						const row = Math.floor(y / cellHeight);

						// Check if the drop is within the grid bounds
						if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
							onDrop(component.id, row, col);
						}
					}
				}}
			/>
		</>
	);
}

function ComponentInfo({
	component,
	short,
	...props
}: {
	component: ShipComponentFragment;
	short?: boolean;
} & HTMLMotionProps<"div">) {
	const { css } = useStyles();

	return (
		<motion.div
			className={css({
				padding: "4px 6px",
				borderRadius: "4px",
				background: "rgba(0, 60, 120, 0.8)",
				border: `1px solid ${theme.colors.blue[6]}`,
				boxShadow: "0 0 10px rgba(0, 120, 255, 0.4)",
				position: "relative",
				overflow: "hidden",
				cursor: "grab",
				display: "flex",
				alignItems: short ? "center" : "flex-start",
				justifyContent: short ? "center" : "flex-start",
				"&:hover": {
					transform: "translateY(-2px)",
					boxShadow: "0 4px 12px rgba(0, 120, 255, 0.5)",
				},
				"&:active": {
					transform: "translateY(0)",
				},
				// Add a gradient line at the top
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "2px",
					background: `linear-gradient(to right, ${theme.colors.cyan[5]}, ${theme.colors.blue[7]})`,
				},
				// Add a radial gradient background
				"&::after": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: -1,
					background:
						"radial-gradient(circle at center, rgba(0, 180, 255, 0.4) 0%, rgba(0, 120, 255, 0.1) 70%)",
					opacity: 0.5,
				},
				// Add tech grid lines background
				backgroundImage: `
      linear-gradient(rgba(0, 120, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 120, 255, 0.1) 1px, transparent 1px)
    `,
				backgroundSize: "8px 8px",
				...(short && {
					width: "64px",
					height: "64px",
				}),
			})}
			{...props}
		>
			<Stack gap={2}>
				<Text size="xs" fw={600} c="rgba(255, 255, 255, 0.95)">
					{component.name}
				</Text>
				{!short && (
					<>
						<Group gap="xs" wrap="nowrap">
							{component.costs.length > 0 && (
								<Text size="xs" c="rgba(255, 255, 255, 0.8)">
									Cost:{" "}
									{component.costs
										.map((cost) => `${cost.quantity} ${cost.resource.name}`)
										.join(", ")}
								</Text>
							)}
						</Group>
						<Group gap="xs" wrap="nowrap">
							{component.powerGeneration && component.powerGeneration > 0 && (
								<Text size="xs" c="yellow">
									Power: +{component.powerGeneration}
								</Text>
							)}
							{component.powerNeed > 0 && (
								<Text size="xs" c="yellow">
									Power: -{component.powerNeed}
								</Text>
							)}
							{component.crewCapacity && component.crewCapacity > 0 && (
								<Text size="xs" c="green">
									Crew: +{component.crewCapacity}
								</Text>
							)}
							{component.crewNeed > 0 && (
								<Text size="xs" c="green">
									Crew: -{component.crewNeed}
								</Text>
							)}
						</Group>
					</>
				)}
			</Stack>
		</motion.div>
	);
}
