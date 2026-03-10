import {
	Color,
	type FederatedPointerEvent,
	type Graphics,
	type PointData,
} from "pixi.js";
import { useCallback } from "react";

export function StarSystem({
	position,
	isVisible,
	isSelected,
	ownerColor,
	onClick,
	onRightClick,
	sensorRange,
}: {
	id: string;
	position: PointData;
	isVisible: boolean;
	isSelected?: boolean;
	ownerColor?: string | null;
	onClick: (event: FederatedPointerEvent) => void;
	onRightClick: (event: FederatedPointerEvent) => void;
	sensorRange?: number | null;
}) {
	const color = isVisible
		? (ownerColor ?? "white")
		: ownerColor
			? new Color(ownerColor).multiply(0.5).toHex()
			: "gray";

	const drawStar = useCallback(
		(graphics: Graphics) => {
			graphics.clear();
			const baseColor = new Color(color);

			// Outer glow layers
			for (let i = 4; i >= 1; i--) {
				graphics.setFillStyle({ color: baseColor.toHex(), alpha: 0.15 });
				graphics.circle(0, 0, 8 + i * 4);
				graphics.fill();
			}

			// Bright core
			graphics.setFillStyle({
				color: isVisible ? "#ffffff" : baseColor.toHex(),
			});
			graphics.circle(0, 0, 8);
			graphics.fill();
		},
		[color, isVisible],
	);

	const drawSensorRange = useCallback(
		(graphics: Graphics) => {
			graphics.clear();
			graphics.setStrokeStyle({ color: 0x0000ff, width: 3 });
			graphics.circle(0, 0, sensorRange ?? 0);
			graphics.stroke();
		},
		[sensorRange],
	);

	return (
		<container position={position}>
			<graphics
				draw={drawStar}
				interactive
				cursor="pointer"
				onPointerTap={onClick}
				onRightClick={onRightClick}
			/>
			{(sensorRange ?? 0) > 0 && isSelected && (
				<graphics draw={drawSensorRange} />
			)}
		</container>
	);
}
