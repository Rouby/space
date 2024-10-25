import {
	Color,
	type FederatedPointerEvent,
	type Graphics,
	type PointData,
} from "pixi.js";
import { useCallback } from "react";

export function StarSystem({
	id,
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

	const drawCircle = useCallback(
		(graphics: Graphics) => {
			graphics.clear();
			graphics.setFillStyle({ color });
			graphics.circle(0, 0, 20);
			graphics.fill();
		},
		[color],
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
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<graphics
				draw={drawCircle}
				interactive
				cursor="pointer"
				onClick={onClick}
				onRightClick={onRightClick}
			/>
			{(sensorRange ?? 0) > 0 && isSelected && (
				<graphics draw={drawSensorRange} />
			)}
		</container>
	);
}
