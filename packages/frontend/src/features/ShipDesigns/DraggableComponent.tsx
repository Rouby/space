import { Paper, Text } from "@mantine/core";
import { motion, useDragControls } from "framer-motion";
import { useRef, useState } from "react";
import { vars } from "../../theme";

export function DraggableComponent({
	component,
	gridRows,
	gridCols,
	onDrop,
}: {
	component: { id: string; name: string };
	gridRows: number;
	gridCols: number;
	onDrop: (componentId: string, row: number, col: number) => boolean;
}) {
	const controls = useDragControls();
	const [isDragging, setIsDragging] = useState(false);
	const elementRef = useRef<HTMLDivElement>(null);

	return (
		<motion.div
			ref={elementRef}
			drag
			dragControls={controls}
			dragMomentum={false}
			onDragStart={() => {
				setIsDragging(true);
			}}
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
						const dropSuccessful = onDrop(component.id, row, col);

						// If drop was not successful (cell occupied), return to origin
						if (!dropSuccessful && elementRef.current) {
							// Return to origin animation handled by Framer Motion
						}
					} else {
						// Return to origin animation handled by Framer Motion
					}
				}
			}}
			whileDrag={{ scale: 1.1, zIndex: 10 }}
			style={{ cursor: isDragging ? "grabbing" : "grab" }}
			dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
			dragElastic={0.5} // Add some elasticity for better UX
		>
			<Paper
				p="xs"
				withBorder
				shadow="sm"
				style={{
					marginBottom: vars.spacing.xs,
					backgroundColor: vars.colors.gray[1],
				}}
			>
				<Text size="sm" fw="bold">
					{component.name}
				</Text>
			</Paper>
		</motion.div>
	);
}
