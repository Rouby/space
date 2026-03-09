import {
	Color,
	type FederatedPointerEvent,
	type Graphics,
	type PointData,
} from "pixi.js";
import { OutlineFilter } from "pixi-filters";
import { useCallback } from "react";

export function TaskForce({
	position,
	isVisible,
	isSelected,
	ownerColor,
	onClick,
	onRightClick,
	sensorRange,
	movementVector,
}: {
	id: string;
	position: PointData;
	isVisible: boolean;
	isSelected?: boolean;
	ownerColor?: string | null;
	onClick: (event: FederatedPointerEvent) => void;
	onRightClick: (event: FederatedPointerEvent) => void;
	sensorRange?: number | null;
	movementVector?: PointData | null;
}) {
	const color = isVisible
		? (ownerColor ?? "white")
		: ownerColor
			? new Color(ownerColor).multiply(0x999999).toHex()
			: "gray";

	const drawShip = useCallback(
		(graphics: Graphics) => {
			graphics.clear();
			graphics.setFillStyle({ color });
			graphics.moveTo(12, 0);
			graphics.lineTo(-8, 10);
			graphics.lineTo(-4, 0);
			graphics.lineTo(-8, -10);
			graphics.lineTo(12, 0);
			graphics.fill();
		},
		[color],
	);

	const rotation =
		movementVector && (movementVector.x !== 0 || movementVector.y !== 0)
			? Math.atan2(movementVector.y, movementVector.x)
			: -Math.PI / 2;

	const drawSensorRange = useCallback(
		(graphics: Graphics) => {
			graphics.clear();
			graphics.setStrokeStyle({ color: 0x0000ff, width: 2 });
			graphics.circle(0, 0, sensorRange ?? 0);
			graphics.stroke();
		},
		[sensorRange],
	);

	return (
		<container position={position} rotation={rotation}>
			<graphics
				draw={drawShip}
				interactive
				cursor="pointer"
				onPointerTap={onClick}
				onRightClick={onRightClick}
				filters={
					isSelected
						? [
								new OutlineFilter({
									quality: 1,
									color: "blue",
									thickness: 3,
								}),
							]
						: []
				}
			/>
			{(sensorRange ?? 0) > 0 && isSelected && (
				<graphics draw={drawSensorRange} />
			)}
		</container>
	);
}
